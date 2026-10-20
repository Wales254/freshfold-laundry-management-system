
import API_BASE_URL from "../services/api";

const API_URL = `${API_BASE_URL}/api/orders`;

async function request(url, options = {}) {
  // Read the saved authentication session.
  let token = null;

  try {
    const savedAuth = localStorage.getItem("auth");
    const auth = savedAuth ? JSON.parse(savedAuth) : null;
    token = auth?.token || null;
  } catch (error) {
    console.error("Failed to read authentication session.");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

export async function fetchOrders() {
  return request(API_URL);
}

export async function createOrder(order) {
  return request(API_URL, {
    method: "POST",
    body: JSON.stringify(order),
  });
}

export async function updateOrderApi(id, order) {
  return request(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(order),
  });
}

export async function deleteOrderApi(id) {
  return request(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}
