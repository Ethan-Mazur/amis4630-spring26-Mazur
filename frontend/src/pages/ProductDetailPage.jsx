import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const API_BASE = 'http://localhost:5000'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/products/${id}`)
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

  if (loading) return <p style={styles.status}>Loading product...</p>

  if (notFound) return (
    <div style={styles.page}>
      <p style={styles.notFound}>404 — Product not found.</p>
      <Link to="/products" style={styles.back}>← Back to Products</Link>
    </div>
  )

  if (error) return <p style={styles.status}>Error loading product: {error}</p>

  return (
    <div style={styles.page}>
      <Link to="/products" style={styles.back}>← Back to Products</Link>
      <div style={styles.card}>
        <img src={product.imageUrl} alt={product.title} style={styles.image} />
        <div style={styles.detail}>
          <h1 style={styles.name}>{product.title}</h1>
          <p style={styles.price}>${product.price.toFixed(2)}</p>
          <p style={styles.description}>{product.description}</p>
          <table style={styles.table}>
            <tbody>
              <tr>
                <td style={styles.label}>Category</td>
                <td>{product.category}</td>
              </tr>
              <tr>
                <td style={styles.label}>Seller</td>
                <td>{product.sellerName}</td>
              </tr>
              <tr>
                <td style={styles.label}>Posted</td>
                <td>{product.postedDate}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { fontFamily: 'Arial, sans-serif', maxWidth: 900, margin: '0 auto', padding: '24px 16px' },
  back: { display: 'inline-block', color: '#BB0000', textDecoration: 'none', marginBottom: 24, fontWeight: 600 },
  card: {
    display: 'flex', gap: 32, background: '#fff', border: '1px solid #ddd',
    borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', flexWrap: 'wrap',
  },
  image: { width: 320, height: 260, objectFit: 'cover', flexShrink: 0 },
  detail: { padding: '24px 24px 24px 0', flex: 1 },
  name: { fontSize: 26, fontWeight: 700, margin: '0 0 8px', color: '#1a1a1a' },
  price: { fontSize: 28, fontWeight: 700, color: '#BB0000', margin: '0 0 16px' },
  description: { fontSize: 15, color: '#444', lineHeight: 1.6, margin: '0 0 24px' },
  table: { borderCollapse: 'collapse', width: '100%' },
  label: { fontWeight: 600, color: '#555', paddingRight: 16, paddingTop: 6, paddingBottom: 6, width: 110 },
  status: { textAlign: 'center', fontSize: 18, marginTop: 48 },
  notFound: { fontSize: 22, textAlign: 'center', marginTop: 48, color: '#555' },
}
