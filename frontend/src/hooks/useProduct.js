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
      .then(data => {
        setProduct(data)
        setLoading(false)
      })
      .catch(err => {
        if (err.response?.status === 404) setNotFound(true)
        else setError(err.message)
        setLoading(false)
      })
  }, [id])

  return { product, loading, notFound, error }
}

