import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
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
        </div>
      </div>
    </Link>
  )
}

const styles = {
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
}
