import api from './api.js'

export async function registerUser(email, password, displayName) {
  const res = await api.post('/api/auth/register', { email, password, displayName })
  return res.data
}

export async function loginUser(email, password) {
  const res = await api.post('/api/auth/login', { email, password })
  return res.data
}
