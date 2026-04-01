import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useProduct } from '../hooks/useProduct.js'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { addToCart, cart } = useCart()
  const { product, loading, notFound, error } = useProduct(id)
  const [added, setAdded] = useState(false)
  const [addError, setAddError] = useState(false)
  const [qty, setQty] = useState(1)

  const cartQty = product ? (cart.find(ci => ci.productId === product.id)?.quantity ?? 0) : 0
  const maxAddable = product ? Math.max(0, product.stock - cartQty) : 0
  const isMaxed = product && product.stock > 0 && maxAddable === 0

  async function handleAddToCart() {
    const success = await addToCart(product, qty)
    if (success) {
      setQty(1)
      setAdded(true)
      setTimeout(() => setAdded(false), 1500)
    } else {
      setAddError(true)
      setTimeout(() => setAddError(false), 2500)
    }
  }

  function handleQtyChange(delta) {
    setQty(prev => Math.min(maxAddable, Math.max(1, prev + delta)))
  }

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
          {product.stock === 0 && <p style={styles.outOfStock}>⚠ Out of Stock — This item is no longer available.</p>}
          {product.stock > 0 && product.stock <= 5 && <p style={styles.lowStock}>⚡ Only {product.stock} left — grab it before it's gone!</p>}
          {product.stock > 0 && !isMaxed && (
            <div style={styles.qtyRow}>
              <span style={styles.qtyLabel}>Quantity:</span>
              <button style={styles.qtyBtn} onClick={() => handleQtyChange(-1)} disabled={qty <= 1}>−</button>
              <span style={styles.qtyDisplay}>{qty}</span>
              <button style={styles.qtyBtn} onClick={() => handleQtyChange(1)} disabled={qty >= maxAddable}>+</button>
            </div>
          )}
          {isMaxed && <p style={styles.maxed}>You have the maximum available quantity in your cart.</p>}
          <button
            style={{ ...styles.addBtn, background: addError ? '#888' : added ? '#4CAF50' : product.stock === 0 || isMaxed ? '#aaa' : '#BB0000' }}
            onClick={handleAddToCart}
            disabled={added || addError || product.stock === 0 || isMaxed}
          >
            {product.stock === 0 ? 'Out of Stock' : isMaxed ? 'Max in Cart' : addError ? '⚠ Could not add to cart' : added ? '✓ Added to Cart!' : 'Add to Cart'}
          </button>
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
  outOfStock: { fontSize: 15, fontWeight: 700, color: '#888', margin: '16px 0 8px', textTransform: 'uppercase' },
  lowStock: { fontSize: 15, fontWeight: 700, color: '#e65100', margin: '16px 0 8px' },
  qtyRow: { display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0 8px' },
  qtyLabel: { fontSize: 15, fontWeight: 600, color: '#333' },
  qtyBtn: {
    width: 34, height: 34, background: '#f0f0f0', border: '1px solid #ccc',
    borderRadius: 4, fontWeight: 700, fontSize: 18, cursor: 'pointer', lineHeight: 1,
  },
  qtyDisplay: { minWidth: 32, textAlign: 'center', fontWeight: 700, fontSize: 17 },
  maxed: { fontSize: 14, color: '#888', margin: '16px 0 8px', fontStyle: 'italic' },
  addBtn: {
    marginTop: 24, padding: '12px 32px', background: '#BB0000', color: '#fff',
    border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 16, cursor: 'pointer',
  },
}
