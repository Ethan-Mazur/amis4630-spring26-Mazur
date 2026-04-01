const API_BASE = 'http://localhost:5000'

export async function getCart() {
  const res = await fetch(`${API_BASE}/api/cart`)
  if (!res.ok) throw new Error(`Failed to load cart (HTTP ${res.status})`)
  return res.json()
}

export async function addCartItem(productId, quantity) {
  return fetch(`${API_BASE}/api/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity }),
  })
}

export async function updateCartItem(id, quantity) {
  return fetch(`${API_BASE}/api/cart/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  })
}

export async function removeCartItem(id) {
  return fetch(`${API_BASE}/api/cart/${id}`, { method: 'DELETE' })
}

export async function clearCartItems() {
  return fetch(`${API_BASE}/api/cart/clear`, { method: 'DELETE' })
}
