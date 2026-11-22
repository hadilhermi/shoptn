const STOP = new Set([
  "le", "la", "les", "de", "du", "des", "un", "une", "et", "en", "pour",
  "avec", "sans", "sur", "au", "aux", "vos", "votre", "tous", "jours", "heures",
]);

// Nحوّlou el nass l mots propres (bla accents, bla mots inutiles)
function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

// TF-IDF: kol produit yweli vecteur (map mot -> poids)
function buildVectors(products) {
  const docs = products.map((p) =>
    tokenize(`${p.name} ${p.name} ${p.category} ${p.description}`)
  );

  const df = new Map();
  docs.forEach((tokens) => {
    new Set(tokens).forEach((t) => df.set(t, (df.get(t) || 0) + 1));
  });

  const N = docs.length;
  return docs.map((tokens) => {
    const tf = new Map();
    tokens.forEach((t) => tf.set(t, (tf.get(t) || 0) + 1));

    const vec = new Map();
    tf.forEach((count, t) => {
      const idf = Math.log((N + 1) / (df.get(t) + 1)) + 1;
      vec.set(t, count * idf);
    });
    return vec;
  });
}

// Similarité cosinus bin zouz vecteurs (0 = mokhtalfin, 1 = kifkif)
function cosine(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  a.forEach((v, t) => {
    na += v * v;
    if (b.has(t)) dot += v * b.get(t);
  });
  b.forEach((v) => {
    nb += v * v;
  });
  return na && nb ? dot / Math.sqrt(na * nb) : 0;
}

function similarProducts(target, products, limit = 4) {
  const vectors = buildVectors(products);
  const targetIndex = products.findIndex(
    (p) => String(p._id) === String(target._id)
  );
  if (targetIndex === -1) return [];

  return products
    .map((p, i) => {
      if (i === targetIndex) return null;

      const textSim = cosine(vectors[targetIndex], vectors[i]);
      const sameCategory = p.category === target.category ? 1 : 0;
      const maxPrice = Math.max(p.price, target.price) || 1;
      const priceSim = 1 - Math.abs(p.price - target.price) / maxPrice;

      const score = 0.7 * textSim + 0.2 * sameCategory + 0.1 * priceSim;
      return { ...p, similarity: Math.round(score * 100) };
    })
    .filter(Boolean)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

module.exports = { similarProducts };