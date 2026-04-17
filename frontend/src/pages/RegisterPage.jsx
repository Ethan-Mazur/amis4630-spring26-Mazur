import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function validateForm(email, password, confirm) {
  if (!email) return 'Email is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.'
  if (!password) return 'Password is required.'
  if (password.length < 8) return 'Password must be at least 8 characters.'
  if (!/\d/.test(password)) return 'Password must contain at least one digit.'
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.'
  if (password !== confirm) return 'Passwords do not match.'
  return null
}

export { validateForm }

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const validationError = validateForm(email, password, confirm)
    if (validationError) { setError(validationError); return }

    setError(null)
    setLoading(true)
    try {
      await register(email, password, displayName)
      navigate('/products', { replace: true })
    } catch (err) {
      const errs = err.response?.data?.errors
      setError(errs ? errs[0] : 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Create Account</h1>
        <p style={styles.sub}>Join the Buckeye Marketplace</p>

        {error && <div style={styles.error} role="alert">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <label style={styles.label}>Display Name</label>
          <input
            style={styles.input}
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder="Brutus Buckeye"
          />

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
            placeholder="Min 8 chars, 1 uppercase, 1 digit"
            autoComplete="new-password"
          />

          <label style={styles.label}>Confirm Password</label>
          <input
            style={styles.input}
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
          />

          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' },
  card: { background: '#fff', padding: '2rem', borderRadius: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', width: '100%', maxWidth: 420 },
  heading: { margin: '0 0 4px', color: '#BB0000', fontFamily: 'Arial, sans-serif' },
  sub: { margin: '0 0 1.5rem', color: '#666', fontSize: 14 },
  label: { display: 'block', marginBottom: 4, fontWeight: 600, fontSize: 14, color: '#333' },
  input: { width: '100%', padding: '10px 12px', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: 6, fontSize: 15, boxSizing: 'border-box' },
  btn: { width: '100%', padding: '11px', background: '#BB0000', color: '#fff', border: 'none', borderRadius: 6, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 4 },
  error: { background: '#fff3f3', border: '1px solid #f5c6c6', borderRadius: 6, padding: '10px 14px', color: '#c0392b', marginBottom: '1rem', fontSize: 14 },
  footer: { marginTop: '1.2rem', textAlign: 'center', fontSize: 14, color: '#555' },
  link: { color: '#BB0000', fontWeight: 600 },
}
