
import API_BASE_URL from "../services/api";

const API_URL = `${API_BASE_URL}/api/customers`;

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

export function fetchCustomers() {
  return request(API_URL);
}

export function createCustomer(customer) {
  return request(API_URL, {
    method: "POST",
    body: JSON.stringify(customer),
  });
}

export function updateCustomerApi(id, customer) {
  return request(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(customer),
  });
}

export function deleteCustomerApi(id) {
  return request(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}
