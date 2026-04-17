import { Link, useLocation, Navigate } from 'react-router-dom'

export default function OrderConfirmationPage() {
  const { state } = useLocation()
  const order = state?.order

  if (!order) return <Navigate to="/products" replace />

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>✅</div>
        <h1 style={styles.heading}>Order Confirmed!</h1>
        <p style={styles.sub}>Thank you for your purchase.</p>

        <div style={styles.confirmBox}>
          <span style={styles.confirmLabel}>Confirmation #</span>
          <span style={styles.confirmNumber}>{order.confirmationNumber}</span>
        </div>

        <div style={styles.details}>
          <div style={styles.detailRow}>
            <span>Order Date</span>
            <span>{new Date(order.orderDate).toLocaleDateString()}</span>
          </div>
          <div style={styles.detailRow}>
            <span>Ship To</span>
            <span style={styles.addr}>{order.shippingAddress}</span>
          </div>
          <div style={styles.detailRow}>
            <span>Status</span>
            <span style={styles.statusBadge}>{order.status}</span>
          </div>
        </div>

        <div style={styles.items}>
          <h3 style={styles.itemsTitle}>Items Ordered</h3>
          {order.items.map(item => (
            <div key={item.id} style={styles.item}>
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
            <strong>Total</strong>
            <strong style={styles.totalAmt}>${order.total.toFixed(2)}</strong>
          </div>
        </div>

        <div style={styles.actions}>
          <Link to="/orders" style={styles.ordersBtn}>View Order History</Link>
          <Link to="/products" style={styles.shopBtn}>Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#f5f5f5' },
  card: { background: '#fff', borderRadius: 12, padding: '2.5rem', maxWidth: 520, width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif', textAlign: 'center' },
  icon: { fontSize: 48, marginBottom: '0.5rem' },
  heading: { color: '#BB0000', margin: '0 0 0.25rem' },
  sub: { color: '#666', margin: '0 0 1.5rem' },
  confirmBox: { background: '#f9f0f0', border: '2px solid #BB0000', borderRadius: 8, padding: '1rem', marginBottom: '1.5rem' },
  confirmLabel: { display: 'block', fontSize: 12, color: '#999', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 },
  confirmNumber: { fontSize: 22, fontWeight: 700, color: '#BB0000', letterSpacing: 2 },
  details: { textAlign: 'left', marginBottom: '1.5rem', fontSize: 14 },
  detailRow: { display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #f0f0f0' },
  addr: { maxWidth: 260, textAlign: 'right', color: '#555' },
  statusBadge: { background: '#fffbe6', color: '#b8860b', padding: '2px 10px', borderRadius: 20, fontWeight: 600, fontSize: 13 },
  items: { textAlign: 'left', marginBottom: '1.5rem' },
  itemsTitle: { margin: '0 0 0.75rem', fontSize: 16 },
  item: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' },
  thumb: { width: 44, height: 44, objectFit: 'cover', borderRadius: 6 },
  itemInfo: { flex: 1 },
  itemTitle: { fontWeight: 600, fontSize: 13 },
  itemMeta: { fontSize: 12, color: '#777' },
  itemTotal: { fontWeight: 700, color: '#BB0000' },
  divider: { borderTop: '1px solid #eee', margin: '0.75rem 0' },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: 16 },
  totalAmt: { color: '#BB0000' },
  actions: { display: 'flex', gap: '1rem', flexDirection: 'column', marginTop: '1.5rem' },
  ordersBtn: { padding: '10px', background: '#333', color: '#fff', borderRadius: 6, textDecoration: 'none', fontWeight: 600 },
  shopBtn: { padding: '10px', background: '#BB0000', color: '#fff', borderRadius: 6, textDecoration: 'none', fontWeight: 600 },
}
