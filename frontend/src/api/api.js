const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Nبدّlou shape mte3 MongoDB l shape eli el frontend ya3rafha
function normalize(p) {
  return {
    id: p._id,
    name: p.name,
    price: p.price,
    category: p.category,
    emoji: p.image,
    description: p.description,
  };
}

// El 3aks: men shape el frontend l shape mte3 el backend
function toApi(p) {
  return {
    name: p.name.trim(),
    price: Number(p.price),
    category: p.category,
    image: p.emoji,
    description: p.description,
  };
}

// Fonction wa7da lkol el requests (GET, POST...), t9bal token ikhtiyari
export async function request(path, { method = "GET", body, token } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Impossible de contacter le serveur");
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // réponse non JSON
  }

  if (!res.ok) {
    throw new Error((data && data.message) || "Erreur serveur");
  }
  return data;
}

export async function getProducts() {
  const data = await request("/api/products");
  return data.map(normalize);
}

export async function getProductById(id) {
  const data = await request(`/api/products/${id}`);
  return normalize(data);
}

// ===== Admin =====
export async function createProduct(token, product) {
  const data = await request("/api/products", {
    method: "POST",
    token,
    body: toApi(product),
  });
  return normalize(data);
}

export async function updateProduct(token, id, product) {
  const data = await request(`/api/products/${id}`, {
    method: "PUT",
    token,
    body: toApi(product),
  });
  return normalize(data);
}

export async function deleteProduct(token, id) {
  return request(`/api/products/${id}`, { method: "DELETE", token });
}