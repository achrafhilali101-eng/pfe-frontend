// Client API minimal basé sur fetch natif (pas de dépendance axios, pour limiter
// les risques d'installation). Centralise l'URL de base, l'ajout du token JWT,
// et la gestion d'erreurs.

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function getToken() {
  return localStorage.getItem("access_token");
}

export function setToken(token) {
  localStorage.setItem("access_token", token);
}

export function clearToken() {
  localStorage.removeItem("access_token");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (!response.ok) {
    let detail = `Erreur ${response.status}`;
    try {
      const body = await response.json();
      detail = body.detail ? JSON.stringify(body.detail) : detail;
    } catch {
      // réponse non-JSON, on garde le message par défaut
    }
    const error = new Error(detail);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  // ---- Auth ----
  register: (payload) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request("/auth/me"),

  // ---- Catalogue ----
  listCategories: () => request("/categories"),
  listProducts: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
    ).toString();
    return request(`/products${query ? `?${query}` : ""}`);
  },
  getProduct: (id) => request(`/products/${id}`),

  // ---- Stocks ----
  getStock: (productId) => request(`/stocks/${productId}`),

  // ---- Recommandations ----
  recommendAnonymous: (topK = 10) => request(`/recommendations?top_k=${topK}`),
  recommendForUser: (userId, topK = 10) =>
    request(`/recommendations/${userId}?top_k=${topK}`),
  similarProducts: (productId, topK = 10) =>
    request(`/recommendations/similar/${productId}?top_k=${topK}`),

  // ---- Commandes ----
  createCheckoutSession: (items, shippingAddress, shippingPhone) =>
    request("/orders/checkout-session", {
      method: "POST",
      body: JSON.stringify({
        items,
        shipping_address: shippingAddress,
        shipping_phone: shippingPhone,
      }),
    }),
  confirmPayment: (orderId, sessionId) =>
    request(`/orders/${orderId}/confirm-payment?session_id=${encodeURIComponent(sessionId)}`),
  listMyOrders: () => request("/orders"),

  // ---- Dashboard vendeur ----
  getDashboardSummary: () => request("/dashboard/summary"),
  listMyProducts: () => request("/dashboard/products"),
  listSellerOrders: () => request("/dashboard/orders"),
  createProduct: (payload) =>
    request("/products", { method: "POST", body: JSON.stringify(payload) }),
  updateProduct: (productId, payload) =>
    request(`/products/${productId}`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteProduct: (productId) =>
    request(`/products/${productId}`, { method: "DELETE" }),
  adjustStock: (productId, quantityDelta, reason) =>
    request(`/stocks/${productId}/adjust`, {
      method: "POST",
      body: JSON.stringify({ quantity_delta: quantityDelta, reason }),
    }),
};
