import { useEffect, useState } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productApi.js'
import { getAllOrders, updateOrderStatus } from '../services/orderApi.js'

const EMPTY_PRODUCT = { title: '', description: '', price: '', category: '', sellerName: '', imageUrl: '', stock: '' }

export default function AdminDashboard() {
  const [tab, setTab] = useState('products')

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Admin Dashboard</h1>
      <div style={styles.tabs}>
        <button style={{ ...styles.tab, ...(tab === 'products' ? styles.activeTab : {}) }} onClick={() => setTab('products')}>Products</button>
        <button style={{ ...styles.tab, ...(tab === 'orders' ? styles.activeTab : {}) }} onClick={() => setTab('orders')}>Orders</button>
      </div>
      {tab === 'products' ? <ProductsTab /> : <OrdersTab />}
    </div>
  )
}

function ProductsTab() {
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null)   // null | product object
  const [form, setForm] = useState(EMPTY_PRODUCT)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => { loadProducts() }, [])

  async function loadProducts() {
    setLoading(true)
    try { setProducts(await getProducts()) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  function startEdit(product) {
    setEditing(product)
    setForm({ ...product, price: String(product.price), stock: String(product.stock) })
  }

  function startNew() { setEditing('new'); setForm(EMPTY_PRODUCT) }
  function cancel() { setEditing(null); setForm(EMPTY_PRODUCT) }

  async function handleSave(e) {
    e.preventDefault()
    setError(null)
    const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock, 10) }
    try {
      if (editing === 'new') { await createProduct(payload) }
      else { await updateProduct(editing.id, payload) }
      setSuccess('Saved!')
      setTimeout(() => setSuccess(null), 2000)
      cancel()
      loadProducts()
    } catch (e) { setError(e.response?.data?.title ?? e.message) }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return
    try { await deleteProduct(id); loadProducts() }
    catch (e) { setError(e.message) }
  }

  if (loading) return <p>Loading products…</p>

  return (
    <div>
      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.successMsg}>{success}</div>}

      <button style={styles.addBtn} onClick={startNew}>+ Add Product</button>

      {editing && (
        <div style={styles.formCard}>
          <h3 style={{ margin: '0 0 1rem' }}>{editing === 'new' ? 'New Product' : 'Edit Product'}</h3>
          <form onSubmit={handleSave} style={styles.formGrid}>
            {['title', 'description', 'price', 'category', 'sellerName', 'imageUrl', 'stock'].map(field => (
              <div key={field}>
                <label style={styles.label}>{field}</label>
                <input style={styles.input} value={form[field] ?? ''} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} required={['title', 'price', 'stock'].includes(field)} />
              </div>
            ))}
            <div style={styles.formActions}>
              <button style={styles.saveBtn} type="submit">Save</button>
              <button style={styles.cancelBtn} type="button" onClick={cancel}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <table style={styles.table}>
        <thead><tr>{['ID', 'Title', 'Category', 'Price', 'Stock', 'Actions'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td style={styles.td}>{p.id}</td>
              <td style={styles.td}>{p.title}</td>
              <td style={styles.td}>{p.category}</td>
              <td style={styles.td}>${p.price.toFixed(2)}</td>
              <td style={styles.td}>{p.stock}</td>
              <td style={styles.td}>
                <button style={styles.editBtn} onClick={() => startEdit(p)}>Edit</button>
                <button style={styles.deleteBtn} onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function OrdersTab() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { loadOrders() }, [])
  async function loadOrders() {
    setLoading(true)
    try { setOrders(await getAllOrders()) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function handleStatus(orderId, status) {
    try { await updateOrderStatus(orderId, status); loadOrders() }
    catch (e) { setError(e.message) }
  }

  if (loading) return <p>Loading orders…</p>

  return (
    <div>
      {error && <div style={styles.error}>{error}</div>}
      <table style={styles.table}>
        <thead><tr>{['ID', 'Confirmation', 'Date', 'User', 'Total', 'Status', 'Change Status'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td style={styles.td}>{o.id}</td>
              <td style={styles.td}>{o.confirmationNumber}</td>
              <td style={styles.td}>{new Date(o.orderDate).toLocaleDateString()}</td>
              <td style={styles.td}>{o.userId?.slice(0, 8)}…</td>
              <td style={styles.td}>${o.total.toFixed(2)}</td>
              <td style={styles.td}>{o.status}</td>
              <td style={styles.td}>
                <select value={o.status} onChange={e => handleStatus(o.id, e.target.value)} style={styles.select}>
                  {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const styles = {
  page: { maxWidth: 1000, margin: '2rem auto', padding: '0 1rem', fontFamily: 'Arial, sans-serif' },
  heading: { color: '#BB0000', marginBottom: '1rem' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
  tab: { padding: '8px 20px', border: '2px solid #ddd', borderRadius: 6, background: '#fff', cursor: 'pointer', fontWeight: 600 },
  activeTab: { background: '#BB0000', color: '#fff', borderColor: '#BB0000' },
  error: { background: '#fff3f3', border: '1px solid #f5c6c6', color: '#c0392b', padding: '10px 14px', borderRadius: 6, marginBottom: '1rem' },
  successMsg: { background: '#f0fff4', border: '1px solid #b2dfdb', color: '#2e7d32', padding: '10px 14px', borderRadius: 6, marginBottom: '1rem' },
  addBtn: { padding: '8px 18px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, marginBottom: '1rem' },
  formCard: { background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: '1.25rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' },
  label: { display: 'block', fontWeight: 600, fontSize: 12, marginBottom: 3, textTransform: 'capitalize' },
  input: { width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 5, fontSize: 14, boxSizing: 'border-box' },
  formActions: { gridColumn: '1 / -1', display: 'flex', gap: '0.75rem', marginTop: '0.5rem' },
  saveBtn: { padding: '8px 20px', background: '#BB0000', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700 },
  cancelBtn: { padding: '8px 20px', background: '#eee', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700 },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderRadius: 8, overflow: 'hidden' },
  th: { background: '#333', color: '#fff', padding: '10px 12px', textAlign: 'left', fontSize: 13 },
  td: { padding: '10px 12px', borderBottom: '1px solid #f0f0f0', fontSize: 14 },
  editBtn: { padding: '4px 12px', background: '#1565c0', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', marginRight: 6, fontSize: 12 },
  deleteBtn: { padding: '4px 12px', background: '#c62828', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 },
  select: { padding: '4px 8px', borderRadius: 4, border: '1px solid #ddd', fontSize: 13 },
}
