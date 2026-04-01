export default function CartSummary({ total, onClear }) {
  return (
    <div style={styles.footer}>
      <button style={styles.clearBtn} onClick={onClear}>Clear Cart</button>
      <div style={styles.totalRow}>
        <span style={styles.totalLabel}>Total:</span>
        <span style={styles.totalAmount}>${total.toFixed(2)}</span>
      </div>
    </div>
  )
}

const styles = {
  footer: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 32, paddingTop: 16, borderTop: '2px solid #ddd',
  },
  clearBtn: {
    padding: '10px 20px', background: 'transparent', border: '1px solid #888',
    color: '#555', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 14,
  },
  totalRow: { display: 'flex', alignItems: 'center', gap: 16 },
  totalLabel: { fontSize: 20, fontWeight: 700 },
  totalAmount: { fontSize: 24, fontWeight: 700, color: '#BB0000' },
}
