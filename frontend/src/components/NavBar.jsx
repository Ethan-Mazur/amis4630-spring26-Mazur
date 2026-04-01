import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import blockOLogo from '../assets/ohio-stadium-block-o-university.png'
import buckeyeLogo from '../assets/Ohio_State_Buckeyes_logo.svg'

export default function NavBar() {
  const { itemCount } = useCart()
  const [cartHovered, setCartHovered] = useState(false)

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <div style={styles.brand}>
          <img src={blockOLogo} alt="Block O" style={styles.logo} />
          <Link to="/products" style={styles.title}>Buckeye Marketplace</Link>
          <img src={buckeyeLogo} alt="Ohio State logo" style={styles.logo} />
        </div>
        <Link
          to="/cart"
          style={{ ...styles.cartLink, background: cartHovered ? '#333333' : '#BB0000' }}
          onMouseEnter={() => setCartHovered(true)}
          onMouseLeave={() => setCartHovered(false)}
        >
          🛒 Cart
          {itemCount > 0 && <span style={styles.badge}>{itemCount}</span>}
        </Link>
      </div>
    </nav>
  )
}

const styles = {
  nav: { background: '#A7B1B7', padding: '0 24px', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' },
  inner: { maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 },
  brand: { display: 'flex', alignItems: 'center', gap: 12 },
  title: { color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 20, fontFamily: 'Arial, sans-serif' },
  logo: { height: 36, width: 'auto' },
  cartLink: {
    position: 'relative', color: '#fff', textDecoration: 'none', fontWeight: 700,
    fontSize: 16, fontFamily: 'Arial, sans-serif', display: 'flex', alignItems: 'center', gap: 6,
    padding: '6px 14px', borderRadius: 6, transition: 'background 0.2s',
  },
  badge: {
    background: '#fff', color: '#BB0000', borderRadius: '50%', fontWeight: 700,
    fontSize: 12, width: 20, height: 20, display: 'flex', alignItems: 'center',
    justifyContent: 'center', marginLeft: 4,
  },
}
