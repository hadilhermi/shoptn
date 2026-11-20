import products from "../data/products";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getProducts() {
  await delay(800);
  return products;
}

export async function getProductById(id) {
  await delay(500);
  const product = products.find((p) => p.id === Number(id));
  if (!product) throw new Error("Produit introuvable");
  return product;
}