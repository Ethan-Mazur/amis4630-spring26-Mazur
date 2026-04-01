import { useState, useEffect } from 'react'
import { getProduct } from '../services/productApi.js'

export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    setError(null)
    getProduct(id)
      .then(res => {
        if (res.status === 404) {
          setNotFound(true)
          setLoading(false)
          return null
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        if (data) {
          setProduct(data)
          setLoading(false)
        }
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  return { product, loading, notFound, error }
}
