import { createContext, useContext, useReducer, useCallback } from 'react'
import { registerUser, loginUser } from '../services/authApi.js'

export const AuthContext = createContext(null)

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        token: action.token,
        email: action.email,
        displayName: action.displayName,
        role: action.role,
        isAuthenticated: true,
      }
    case 'LOGOUT':
      return { token: null, email: null, displayName: null, role: null, isAuthenticated: false }
    default:
      return state
  }
}

function loadInitialState() {
  const token = localStorage.getItem('token')
  const email = localStorage.getItem('userEmail')
  const displayName = localStorage.getItem('userDisplayName')
  const role = localStorage.getItem('userRole')
  return token
    ? { token, email, displayName, role, isAuthenticated: true }
    : { token: null, email: null, displayName: null, role: null, isAuthenticated: false }
}

export function AuthProvider({ children }) {
  const [auth, dispatch] = useReducer(authReducer, null, loadInitialState)

  const login = useCallback(async (email, password) => {
    const data = await loginUser(email, password)
    localStorage.setItem('token', data.token)
    localStorage.setItem('userEmail', data.email)
    localStorage.setItem('userDisplayName', data.displayName)
    localStorage.setItem('userRole', data.role)
    dispatch({ type: 'LOGIN', ...data })
    return data
  }, [])

  const register = useCallback(async (email, password, displayName) => {
    const data = await registerUser(email, password, displayName)
    localStorage.setItem('token', data.token)
    localStorage.setItem('userEmail', data.email)
    localStorage.setItem('userDisplayName', data.displayName)
    localStorage.setItem('userRole', data.role)
    dispatch({ type: 'LOGIN', ...data })
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userDisplayName')
    localStorage.removeItem('userRole')
    dispatch({ type: 'LOGOUT' })
  }, [])

  return (
    <AuthContext.Provider value={{ auth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
