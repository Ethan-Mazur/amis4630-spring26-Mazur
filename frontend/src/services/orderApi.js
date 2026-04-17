import api from './api.js'

export async function placeOrder(shippingAddress) {
  const res = await api.post('/api/orders', { shippingAddress })
  return res.data
}

export async function getMyOrders() {
  const res = await api.get('/api/orders/mine')
  return res.data
}

export async function getAllOrders() {
  const res = await api.get('/api/orders')
  return res.data
}

export async function updateOrderStatus(orderId, status) {
  const res = await api.put(`/api/orders/${orderId}/status`, { status })
  return res.data
}
