import api from './api.js'

export async function getCart() {
  const res = await api.get('/api/cart')
  return res.data
}

export async function addCartItem(productId, quantity) {
  // Return raw axios response-like object for backward compat with CartContext
  try {
    const res = await api.post('/api/cart', { productId, quantity })
    return { ok: true, data: res.data }
  } catch {
    return { ok: false }
  }
}

export async function updateCartItem(id, quantity) {
  try {
    const res = await api.put(`/api/cart/${id}`, { quantity })
    return { ok: true, data: res.data }
  } catch {
    return { ok: false }
  }
}

export async function removeCartItem(id) {
  try {
    await api.delete(`/api/cart/${id}`)
    return { ok: true }
  } catch {
    return { ok: false }
  }
}

export async function clearCartItems() {
  try {
    await api.delete('/api/cart/clear')
    return { ok: true }
  } catch {
    return { ok: false }
  }
}
