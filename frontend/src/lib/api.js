const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};

// Products
export const getProducts = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return fetch(`${API_URL}/products?${qs}`).then(handleResponse);
};
export const getFeaturedProducts = () =>
  fetch(`${API_URL}/products/featured`).then(handleResponse);
export const getProduct = (slug) =>
  fetch(`${API_URL}/products/${slug}`).then(handleResponse);

// Categories
export const getCategories = () =>
  fetch(`${API_URL}/categories`).then(handleResponse);

// Cart
export const getCart = (token) =>
  fetch(`${API_URL}/cart`, { headers: getHeaders(token) }).then(handleResponse);
export const addToCart = (token, body) =>
  fetch(`${API_URL}/cart`, { method: 'POST', headers: getHeaders(token), body: JSON.stringify(body) }).then(handleResponse);
export const updateCartItem = (token, id, quantity) =>
  fetch(`${API_URL}/cart/${id}`, { method: 'PATCH', headers: getHeaders(token), body: JSON.stringify({ quantity }) }).then(handleResponse);
export const removeCartItem = (token, id) =>
  fetch(`${API_URL}/cart/${id}`, { method: 'DELETE', headers: getHeaders(token) }).then(handleResponse);
export const clearCart = (token) =>
  fetch(`${API_URL}/cart`, { method: 'DELETE', headers: getHeaders(token) }).then(handleResponse);

// Orders
export const getOrders = (token) =>
  fetch(`${API_URL}/orders`, { headers: getHeaders(token) }).then(handleResponse);
export const getOrder = (token, id) =>
  fetch(`${API_URL}/orders/${id}`, { headers: getHeaders(token) }).then(handleResponse);
export const createOrder = (token, body) =>
  fetch(`${API_URL}/orders`, { method: 'POST', headers: getHeaders(token), body: JSON.stringify(body) }).then(handleResponse);

// Wishlist
export const getWishlist = (token) =>
  fetch(`${API_URL}/wishlist`, { headers: getHeaders(token) }).then(handleResponse);
export const toggleWishlist = (token, product_id) =>
  fetch(`${API_URL}/wishlist`, { method: 'POST', headers: getHeaders(token), body: JSON.stringify({ product_id }) }).then(handleResponse);

// Reviews
export const getReviews = (product_id) =>
  fetch(`${API_URL}/reviews/${product_id}`).then(handleResponse);
export const createReview = (token, body) =>
  fetch(`${API_URL}/reviews`, { method: 'POST', headers: getHeaders(token), body: JSON.stringify(body) }).then(handleResponse);

// Admin
export const adminGetProducts = (token, params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return fetch(`${API_URL}/admin/products?${qs}`, { headers: getHeaders(token) }).then(handleResponse);
};
export const adminCreateProduct = (token, body) =>
  fetch(`${API_URL}/admin/products`, { method: 'POST', headers: getHeaders(token), body: JSON.stringify(body) }).then(handleResponse);
export const adminUpdateProduct = (token, id, body) =>
  fetch(`${API_URL}/admin/products/${id}`, { method: 'PATCH', headers: getHeaders(token), body: JSON.stringify(body) }).then(handleResponse);
export const adminDeleteProduct = (token, id) =>
  fetch(`${API_URL}/admin/products/${id}`, { method: 'DELETE', headers: getHeaders(token) }).then(handleResponse);
export const adminGetOrders = (token, params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return fetch(`${API_URL}/admin/orders?${qs}`, { headers: getHeaders(token) }).then(handleResponse);
};
export const adminUpdateOrderStatus = (token, id, status) =>
  fetch(`${API_URL}/admin/orders/${id}/status`, { method: 'PATCH', headers: getHeaders(token), body: JSON.stringify({ status }) }).then(handleResponse);
export const adminGetStats = (token) =>
  fetch(`${API_URL}/admin/stats`, { headers: getHeaders(token) }).then(handleResponse);
