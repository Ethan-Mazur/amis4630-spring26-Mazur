import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import buckeyeLogo from '../assets/Ohio_State_Buckeyes_logo.svg'
import blockOLogo from '../assets/ohio-stadium-block-o-university.png'

const API_BASE = 'http://localhost:5000'

export default function ProductListPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <p style={styles.status}>Loading products...</p>
  if (error) return <p style={styles.status}>Error loading products: {error}</p>

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <img src={blockOLogo} alt="Block O" style={styles.logo} />
        <h1 style={styles.heading}>Buckeye Marketplace</h1>
        <img src={buckeyeLogo} alt="Ohio State Buckeyes logo" style={styles.logo} />
      </div>
      <div style={styles.grid}>
        {products.map(product => (
          <Link key={product.id} to={`/products/${product.id}`} style={styles.cardLink}>
            <div style={styles.card}>
              <img src={product.imageUrl} alt={product.title} style={styles.image} />
              <div style={styles.cardBody}>
                <h2 style={styles.productName}>{product.title}</h2>
                <p style={styles.price}>${product.price.toFixed(2)}</p>
                <p style={styles.meta}>Category: {product.category}</p>
                <p style={styles.meta}>Seller: {product.sellerName}</p>
                <p style={styles.meta}>Posted: {product.postedDate}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

const styles = {
  page: { fontFamily: 'Arial, sans-serif', maxWidth: 1100, margin: '0 auto', padding: '24px 16px', minHeight: '100vh', background: '#e8e8e8', borderRadius: 16 },
  headerRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 32 },
  heading: { color: '#BB0000', margin: 0 },
  logo: { height: 56, width: 'auto' },
  leaf: { height: 56, width: 'auto' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 },
  cardLink: { textDecoration: 'none', color: 'inherit' },
  card: {
    border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden', background: '#fff',
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)', cursor: 'pointer',
  },
  image: { width: '100%', display: 'block', height: 160, objectFit: 'cover' },
  cardBody: { padding: '12px 16px' },
  productName: { fontSize: 16, fontWeight: 700, margin: '0 0 6px' },
  price: { fontSize: 18, fontWeight: 700, color: '#BB0000', margin: '0 0 6px' },
  meta: { fontSize: 13, color: '#555', margin: '2px 0' },
  status: { textAlign: 'center', fontSize: 18, marginTop: 48 },
}
