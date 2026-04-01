const API_BASE = 'http://localhost:5000'

export async function getProducts() {
  const res = await fetch(`${API_BASE}/api/products`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function getProduct(id) {
  return fetch(`${API_BASE}/api/products/${id}`)
}
