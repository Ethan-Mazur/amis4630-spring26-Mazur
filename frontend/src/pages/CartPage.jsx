import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import CartItem from '../components/CartItem.jsx'
import CartSummary from '../components/CartSummary.jsx'

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
          <CartItem
            key={item.id}
            item={item}
            onQuantityChange={updateQuantity}
            onRemove={handleRemove}
          />
        ))}
      </div>

      <CartSummary total={cartTotal} onClear={handleClear} />
      <div style={styles.checkoutRow}>
        <Link to="/products" style={styles.back}>← Continue Shopping</Link>
        <Link to="/checkout" style={styles.checkoutBtn}>Proceed to Checkout →</Link>
      </div>
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
  checkoutRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  back: { display: 'inline-block', color: '#BB0000', textDecoration: 'none', fontWeight: 600 },
  checkoutBtn: { display: 'inline-block', background: '#BB0000', color: '#fff', textDecoration: 'none', fontWeight: 700, padding: '10px 24px', borderRadius: 6 },
  itemList: { display: 'flex', flexDirection: 'column', gap: 16 },
}
