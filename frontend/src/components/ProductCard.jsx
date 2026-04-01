import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function ProductCard({ product }) {
  const { addToCart, cart } = useCart()
  const [added, setAdded] = useState(false)
  const [addError, setAddError] = useState(false)
  const [qty, setQty] = useState(1)

  const cartQty = cart.find(ci => ci.productId === product.id)?.quantity ?? 0
  const maxAddable = Math.max(0, product.stock - cartQty)
  const isMaxed = product.stock > 0 && maxAddable === 0

  async function handleAddToCart(e) {
    e.preventDefault()
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

  function handleQtyChange(delta, e) {
    e.preventDefault()
    setQty(prev => Math.min(maxAddable, Math.max(1, prev + delta)))
  }

  return (
    <Link to={`/products/${product.id}`} style={styles.cardLink}>
      <div style={styles.card}>
        <img src={product.imageUrl} alt={product.title} style={styles.image} />
        <div style={styles.cardBody}>
          <h2 style={styles.productName}>{product.title}</h2>
          <p style={styles.price}>${product.price.toFixed(2)}</p>
          <p style={styles.meta}>Category: {product.category}</p>
          <p style={styles.meta}>Seller: {product.sellerName}</p>
          <p style={styles.meta}>Posted: {product.postedDate}</p>
          {product.stock === 0 && <p style={styles.outOfStock}>Out of Stock</p>}
          {product.stock > 0 && product.stock <= 5 && <p style={styles.lowStock}>Only {product.stock} left!</p>}
          {product.stock > 0 && !isMaxed && (
            <div style={styles.qtyRow}>
              <button style={styles.qtyBtn} onClick={e => handleQtyChange(-1, e)} disabled={qty <= 1}>−</button>
              <span style={styles.qtyDisplay}>{qty}</span>
              <button style={styles.qtyBtn} onClick={e => handleQtyChange(1, e)} disabled={qty >= maxAddable}>+</button>
            </div>
          )}
          {isMaxed && <p style={styles.maxed}>Max qty in cart</p>}
          <button
            style={{ ...styles.addBtn, background: addError ? '#888' : added ? '#4CAF50' : (product.stock === 0 || isMaxed) ? '#aaa' : '#BB0000' }}
            onClick={handleAddToCart}
            disabled={added || addError || product.stock === 0 || isMaxed}
          >
            {product.stock === 0 ? 'Out of Stock' : isMaxed ? 'Max in Cart' : addError ? '⚠ Could not add' : added ? '✓ Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  )
}

const styles = {
  addBtn: {
    marginTop: 10, width: '100%', padding: '8px 0', background: '#BB0000', color: '#fff',
    border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 14, cursor: 'pointer',
  },
  qtyRow: { display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0 4px' },
  qtyBtn: {
    width: 28, height: 28, background: '#f0f0f0', border: '1px solid #ccc',
    borderRadius: 4, fontWeight: 700, fontSize: 16, cursor: 'pointer', lineHeight: 1,
  },
  qtyDisplay: { minWidth: 24, textAlign: 'center', fontWeight: 700, fontSize: 15 },
  maxed: { fontSize: 12, color: '#888', margin: '6px 0 2px', fontStyle: 'italic' },
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
  outOfStock: { fontSize: 13, fontWeight: 700, color: '#888', margin: '6px 0 2px', textTransform: 'uppercase' },
  lowStock: { fontSize: 13, fontWeight: 700, color: '#e65100', margin: '6px 0 2px' },
}
