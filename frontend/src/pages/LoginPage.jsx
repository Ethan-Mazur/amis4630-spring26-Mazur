import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname ?? '/products'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!email) { setError('Email is required.'); return }
    if (!password) { setError('Password is required.'); return }

    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.error ?? 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Sign In</h1>
        <p style={styles.sub}>Welcome back to Buckeye Marketplace</p>

        {error && <div style={styles.error} role="alert">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@osu.edu"
            autoComplete="email"
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />

          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={styles.footer}>
          New here? <Link to="/register" style={styles.link}>Create an account</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' },
  card: { background: '#fff', padding: '2rem', borderRadius: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', width: '100%', maxWidth: 400 },
  heading: { margin: '0 0 4px', color: '#BB0000', fontFamily: 'Arial, sans-serif' },
  sub: { margin: '0 0 1.5rem', color: '#666', fontSize: 14 },
  label: { display: 'block', marginBottom: 4, fontWeight: 600, fontSize: 14, color: '#333' },
  input: { width: '100%', padding: '10px 12px', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: 6, fontSize: 15, boxSizing: 'border-box' },
  btn: { width: '100%', padding: '11px', background: '#BB0000', color: '#fff', border: 'none', borderRadius: 6, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 4 },
  error: { background: '#fff3f3', border: '1px solid #f5c6c6', borderRadius: 6, padding: '10px 14px', color: '#c0392b', marginBottom: '1rem', fontSize: 14 },
  footer: { marginTop: '1.2rem', textAlign: 'center', fontSize: 14, color: '#555' },
  link: { color: '#BB0000', fontWeight: 600 },
}
