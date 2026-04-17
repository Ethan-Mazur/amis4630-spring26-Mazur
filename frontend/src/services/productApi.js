import api from './api.js'

export async function getProducts() {
  const res = await api.get('/api/products')
  return res.data
}

export async function getProduct(id) {
  const res = await api.get(`/api/products/${id}`)
  return res.data
}

export async function createProduct(product) {
  const res = await api.post('/api/products', product)
  return res.data
}

export async function updateProduct(id, product) {
  const res = await api.put(`/api/products/${id}`, product)
  return res.data
}

export async function deleteProduct(id) {
  await api.delete(`/api/products/${id}`)
}
