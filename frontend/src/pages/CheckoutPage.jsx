import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { placeOrder } from '../services/orderApi.js'

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()

  const [address, setAddress] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleCheckout(e) {
    e.preventDefault()
    if (!address.trim()) { setError('Shipping address is required.'); return }
    if (cart.length === 0) { setError('Your cart is empty.'); return }

    setError(null)
    setLoading(true)
    try {
      const order = await placeOrder(address.trim())
      await clearCart()
      navigate('/order-confirmation', { state: { order } })
    } catch (err) {
      setError(err.response?.data?.error ?? 'Checkout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div style={styles.page}>
        <h1 style={styles.heading}>Checkout</h1>
        <p>Your cart is empty. <a href="/products" style={styles.link}>Browse products</a></p>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Checkout</h1>
      <div style={styles.layout}>
        {/* Order Summary */}
        <div style={styles.summary}>
          <h2 style={styles.sectionTitle}>Order Summary</h2>
          {cart.map(item => (
            <div key={item.id} style={styles.orderItem}>
              <img src={item.imageUrl} alt={item.title} style={styles.thumb} />
              <div style={styles.itemInfo}>
                <div style={styles.itemTitle}>{item.title}</div>
                <div style={styles.itemMeta}>Qty: {item.quantity} × ${item.price.toFixed(2)}</div>
              </div>
              <div style={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
          <div style={styles.divider} />
          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Total</span>
            <span style={styles.totalAmount}>${cartTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Shipping Form */}
        <div style={styles.form}>
          <h2 style={styles.sectionTitle}>Shipping Address</h2>
          {error && <div style={styles.error} role="alert">{error}</div>}
          <form onSubmit={handleCheckout}>
            <label style={styles.label}>Full shipping address</label>
            <textarea
              style={styles.textarea}
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="123 High St, Columbus OH 43210"
              rows={3}
            />
            <button style={styles.btn} type="submit" disabled={loading}>
              {loading ? 'Placing order…' : `Place Order · $${cartTotal.toFixed(2)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { maxWidth: 900, margin: '2rem auto', padding: '0 1rem', fontFamily: 'Arial, sans-serif' },
  heading: { color: '#BB0000', marginBottom: '1.5rem' },
  layout: { display: 'flex', gap: '2rem', flexWrap: 'wrap' },
  summary: { flex: 1, minWidth: 280, background: '#fff', borderRadius: 10, padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  form: { flex: 1, minWidth: 280, background: '#fff', borderRadius: 10, padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  sectionTitle: { margin: '0 0 1rem', fontSize: 18, color: '#333' },
  orderItem: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' },
  thumb: { width: 48, height: 48, objectFit: 'cover', borderRadius: 6 },
  itemInfo: { flex: 1 },
  itemTitle: { fontWeight: 600, fontSize: 14, color: '#333' },
  itemMeta: { fontSize: 13, color: '#777' },
  itemTotal: { fontWeight: 700, color: '#BB0000' },
  divider: { borderTop: '1px solid #eee', margin: '0.75rem 0' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontWeight: 700, fontSize: 16 },
  totalAmount: { fontWeight: 700, fontSize: 20, color: '#BB0000' },
  label: { display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 6, color: '#333' },
  textarea: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 15, marginBottom: '1rem', boxSizing: 'border-box', resize: 'vertical' },
  btn: { width: '100%', padding: '12px', background: '#BB0000', color: '#fff', border: 'none', borderRadius: 6, fontSize: 16, fontWeight: 700, cursor: 'pointer' },
  error: { background: '#fff3f3', border: '1px solid #f5c6c6', borderRadius: 6, padding: '10px 14px', color: '#c0392b', marginBottom: '1rem', fontSize: 14 },
  link: { color: '#BB0000', fontWeight: 600 },
}
