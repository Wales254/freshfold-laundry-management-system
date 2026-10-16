
const API_URL = "http://localhost:5000/api/orders";

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
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
