import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart, cartTotal } = useCart()

  if (cart.length === 0) {
    return (
      <div style={styles.page}>
        <h1 style={styles.heading}>Your Cart</h1>
        <p style={styles.empty}>Your cart is empty.</p>
        <Link to="/products" style={styles.back}>← Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Your Cart</h1>
      <div style={styles.itemList}>
        {cart.map(item => (
          <div key={item.id} style={styles.row}>
            <img src={item.imageUrl} alt={item.title} style={styles.thumbnail} />
            <div style={styles.info}>
              <p style={styles.name}>{item.title}</p>
              <p style={styles.unitPrice}>${item.price.toFixed(2)} each</p>
            </div>
            <div style={styles.qtyControls}>
              <button style={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
              <span style={styles.qty}>{item.quantity}</span>
              <button style={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
            <p style={styles.subtotal}>${(item.price * item.quantity).toFixed(2)}</p>
            <button style={styles.removeBtn} onClick={() => removeItem(item.id)}>Remove</button>
          </div>
        ))}
      </div>
      <div style={styles.footer}>
        <button style={styles.clearBtn} onClick={clearCart}>Clear Cart</button>
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
  empty: { fontSize: 18, color: '#555', marginBottom: 16 },
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
