import API_BASE_URL from "../services/api";

const API_URL = `${API_BASE_URL}/api/customers`;

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

  // Send the authentication token to the protected backend.
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // Read the server response.
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

// Fetch all customers.
export function fetchCustomers() {
  return request(API_URL);
}

// Create a customer.
export function createCustomer(customer) {
  return request(API_URL, {
    method: "POST",
    body: JSON.stringify(customer),
  });
}

// Update an existing customer.
export function updateCustomerApi(id, customer) {
  return request(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(customer),
  });
}

// Delete a customer.
export function deleteCustomerApi(id) {
  return request(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}
