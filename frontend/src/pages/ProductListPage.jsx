import { useState, useEffect } from 'react'
import buckeyeLogo from '../assets/Ohio_State_Buckeyes_logo.svg'
import blockOLogo from '../assets/ohio-stadium-block-o-university.png'
import ProductCard from '../components/ProductCard.jsx'

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
  if (products.length === 0) return <p style={styles.status}>No products available at this time.</p>

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <img src={blockOLogo} alt="Block O" style={styles.logo} />
        <h1 style={styles.heading}>Buckeye Marketplace</h1>
        <img src={buckeyeLogo} alt="Ohio State Buckeyes logo" style={styles.logo} />
      </div>
      <div style={styles.grid}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
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
  status: { textAlign: 'center', fontSize: 18, marginTop: 48 },
}
