export default function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <div style={styles.row}>
      <img src={item.imageUrl} alt={item.title} style={styles.thumbnail} />
      <div style={styles.info}>
        <p style={styles.name}>{item.title}</p>
        <p style={styles.unitPrice}>${item.price.toFixed(2)} each</p>
      </div>
      <div style={styles.qtyControls}>
        <button
          style={styles.qtyBtn}
          onClick={() => onQuantityChange(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
          title="Minimum quantity is 1"
        >−</button>
        <span style={styles.qty}>{item.quantity}</span>
        <button
          style={styles.qtyBtn}
          onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          disabled={item.quantity >= item.stock}
          title={item.quantity >= item.stock ? `Only ${item.stock} available` : undefined}
        >+</button>
      </div>
      <p style={styles.subtotal}>${(item.price * item.quantity).toFixed(2)}</p>
      <button style={styles.removeBtn} onClick={() => onRemove(item.id, item.title)}>Remove</button>
    </div>
  )
}

const styles = {
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
}
