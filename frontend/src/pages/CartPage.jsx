import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function CartPage() {
  const { cart, cartLoading, cartError, updateQuantity, removeItem, clearCart, cartTotal } = useCart()
  const [notification, setNotification] = useState(null)

  function showNotification(msg, isError = false) {
    setNotification({ msg, isError })
    setTimeout(() => setNotification(null), 2500)
  }

  async function handleRemove(id, title) {
    await removeItem(id)
    showNotification(`"${title}" removed from cart.`)
  }

  async function handleClear() {
    await clearCart()
    showNotification('Cart cleared.')
  }

  if (cartLoading) {
    return (
      <div style={styles.page}>
        <h1 style={styles.heading}>Your Cart</h1>
        <p style={styles.status}>Loading your cart...</p>
      </div>
    )
  }

  if (cartError) {
    return (
      <div style={styles.page}>
        <h1 style={styles.heading}>Your Cart</h1>
        <div style={styles.errorBanner}>
          ⚠ Could not load cart: {cartError}. Please make sure the API is running and refresh the page.
        </div>
        <Link to="/products" style={styles.back}>← Browse Products</Link>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div style={styles.page}>
        <h1 style={styles.heading}>Your Cart</h1>
        <div style={styles.emptyState}>
          <p style={styles.emptyIcon}>🛒</p>
          <p style={styles.emptyText}>Your cart is empty.</p>
          <p style={styles.emptySubtext}>Browse the marketplace and add items to get started.</p>
          <Link to="/products" style={styles.browseBtn}>Browse Products</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Your Cart</h1>

      {notification && (
        <div style={{ ...styles.notification, background: notification.isError ? '#fdecea' : '#e8f5e9', borderColor: notification.isError ? '#BB0000' : '#4CAF50', color: notification.isError ? '#BB0000' : '#2e7d32' }}>
          {notification.msg}
        </div>
      )}

      <div style={styles.itemList}>
        {cart.map(item => (
          <div key={item.id} style={styles.row}>
            <img src={item.imageUrl} alt={item.title} style={styles.thumbnail} />
            <div style={styles.info}>
              <p style={styles.name}>{item.title}</p>
              <p style={styles.unitPrice}>${item.price.toFixed(2)} each</p>
            </div>
            <div style={styles.qtyControls}>
              <button
                style={styles.qtyBtn}
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                title="Minimum quantity is 1"
              >−</button>
              <span style={styles.qty}>{item.quantity}</span>
              <button
                style={styles.qtyBtn}
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                disabled={item.quantity >= item.stock}
                title={item.quantity >= item.stock ? `Only ${item.stock} available` : undefined}
              >+</button>
            </div>
            <p style={styles.subtotal}>${(item.price * item.quantity).toFixed(2)}</p>
            <button style={styles.removeBtn} onClick={() => handleRemove(item.id, item.title)}>Remove</button>
          </div>
        ))}
      </div>

      <div style={styles.footer}>
        <button style={styles.clearBtn} onClick={handleClear}>Clear Cart</button>
        <div style={styles.totalRow}>
          <span style={styles.totalLabel}>Total:</span>
          <span style={styles.totalAmount}>${cartTotal.toFixed(2)}</span>
        </div>
      </div>
      <Link to="/products" style={styles.back}>← Continue Shopping</Link>
    </div>
  )
}

const styles = {
  page: { fontFamily: 'Arial, sans-serif', maxWidth: 900, margin: '0 auto', padding: '32px 16px' },
  heading: { color: '#BB0000', marginBottom: 24 },
  status: { textAlign: 'center', fontSize: 18, color: '#555', marginTop: 48 },
  errorBanner: {
    background: '#fdecea', border: '1px solid #BB0000', color: '#BB0000',
    borderRadius: 6, padding: '12px 16px', marginBottom: 24, fontSize: 15,
  },
  emptyState: { textAlign: 'center', padding: '48px 0' },
  emptyIcon: { fontSize: 64, margin: '0 0 8px' },
  emptyText: { fontSize: 22, fontWeight: 700, color: '#333', margin: '0 0 8px' },
  emptySubtext: { fontSize: 15, color: '#666', margin: '0 0 24px' },
  browseBtn: {
    display: 'inline-block', background: '#BB0000', color: '#fff', textDecoration: 'none',
    padding: '12px 28px', borderRadius: 6, fontWeight: 700, fontSize: 15,
  },
  notification: {
    border: '1px solid', borderRadius: 6, padding: '10px 16px',
    marginBottom: 16, fontSize: 14, fontWeight: 600,
  },
  back: { display: 'inline-block', color: '#BB0000', textDecoration: 'none', fontWeight: 600, marginTop: 16 },
  itemList: { display: 'flex', flexDirection: 'column', gap: 16 },
  row: {
    display: 'flex', alignItems: 'center', gap: 16, background: '#fff',
    border: '1px solid #ddd', borderRadius: 8, padding: 12,
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
  },
  thumbnail: { width: 80, height: 80, objectFit: 'cover', borderRadius: 6, flexShrink: 0 },
  info: { flex: 1 },
  name: { fontWeight: 700, fontSize: 15, margin: '0 0 4px' },
  unitPrice: { color: '#555', fontSize: 13, margin: 0 },
  qtyControls: { display: 'flex', alignItems: 'center', gap: 8 },
  qtyBtn: {
    width: 28, height: 28, border: '1px solid #ccc', borderRadius: 4, background: '#f5f5f5',
    fontWeight: 700, fontSize: 16, cursor: 'pointer', lineHeight: 1,
  },
  qty: { fontSize: 16, fontWeight: 700, minWidth: 24, textAlign: 'center' },
  subtotal: { fontWeight: 700, fontSize: 16, color: '#BB0000', minWidth: 72, textAlign: 'right', margin: 0 },
  removeBtn: {
    padding: '6px 12px', background: 'transparent', border: '1px solid #BB0000',
    color: '#BB0000', borderRadius: 4, cursor: 'pointer', fontWeight: 600, fontSize: 13,
  },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 16, borderTop: '2px solid #ddd' },
  clearBtn: {
    padding: '10px 20px', background: 'transparent', border: '1px solid #888',
    color: '#555', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 14,
  },
  totalRow: { display: 'flex', alignItems: 'center', gap: 16 },
  totalLabel: { fontSize: 20, fontWeight: 700 },
  totalAmount: { fontSize: 24, fontWeight: 700, color: '#BB0000' },
}
