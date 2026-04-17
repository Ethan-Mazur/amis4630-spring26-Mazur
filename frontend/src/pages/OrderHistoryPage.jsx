import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyOrders } from '../services/orderApi.js'

const STATUS_COLORS = {
  Pending: '#b8860b',
  Processing: '#1565c0',
  Shipped: '#2e7d32',
  Delivered: '#388e3c',
  Cancelled: '#c62828',
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch(err => setError(err.response?.data?.error ?? err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={styles.page}><p>Loading your orders…</p></div>
  if (error) return <div style={styles.page}><p style={{ color: '#c0392b' }}>{error}</p></div>

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>My Orders</h1>

      {orders.length === 0 ? (
        <div style={styles.empty}>
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" style={styles.link}>Browse Products</Link>
        </div>
      ) : (
        <div style={styles.list}>
          {orders.map(order => (
            <div key={order.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <div style={styles.confirmNum}>{order.confirmationNumber}</div>
                  <div style={styles.orderDate}>{new Date(order.orderDate).toLocaleDateString()}</div>
                </div>
                <div style={{ ...styles.statusBadge, color: STATUS_COLORS[order.status] ?? '#333' }}>
                  {order.status}
                </div>
                <div style={styles.orderTotal}>${order.total.toFixed(2)}</div>
              </div>

              <div style={styles.addr}>📦 {order.shippingAddress}</div>

              <div style={styles.items}>
                {order.items.map(item => (
                  <div key={item.id} style={styles.item}>
                    <img src={item.imageUrl} alt={item.title} style={styles.thumb} />
                    <div style={styles.itemInfo}>
                      <div style={styles.itemTitle}>{item.title}</div>
                      <div style={styles.itemMeta}>Qty {item.quantity} × ${item.price.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  page: { maxWidth: 760, margin: '2rem auto', padding: '0 1rem', fontFamily: 'Arial, sans-serif' },
  heading: { color: '#BB0000', marginBottom: '1.5rem' },
  empty: { textAlign: 'center', color: '#666', padding: '3rem 0' },
  link: { color: '#BB0000', fontWeight: 700 },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { background: '#fff', borderRadius: 10, padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' },
  confirmNum: { fontWeight: 700, fontSize: 16, color: '#BB0000' },
  orderDate: { fontSize: 13, color: '#888' },
  statusBadge: { fontWeight: 600, fontSize: 14, background: '#f9f9e8', padding: '3px 12px', borderRadius: 20 },
  orderTotal: { fontWeight: 700, fontSize: 18, color: '#333' },
  addr: { fontSize: 13, color: '#666', marginBottom: '0.75rem' },
  items: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  item: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  thumb: { width: 40, height: 40, objectFit: 'cover', borderRadius: 6 },
  itemInfo: {},
  itemTitle: { fontSize: 14, fontWeight: 600 },
  itemMeta: { fontSize: 12, color: '#888' },
}
