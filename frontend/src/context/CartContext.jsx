import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext(null)
const API_BASE = 'http://localhost:5000'

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_CART':
      return action.cart
    case 'ADD_TO_CART': {
      const existing = state.find(item => item.id === action.product.id)
      if (existing) {
        return state.map(item =>
          item.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...state, action.product]
    }
    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item.id === action.id ? { ...item, quantity: action.quantity } : item
      )
    case 'REMOVE_ITEM':
      return state.filter(item => item.id !== action.id)
    case 'CLEAR_CART':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [])

  // On mount: load persisted cart from the backend
  useEffect(() => {
    fetch(`${API_BASE}/api/cart`)
      .then(res => res.json())
      .then(data => dispatch({ type: 'SET_CART', cart: data }))
      .catch(() => {})
  }, [])

  const addToCart = async (product) => {
    const res = await fetch(`${API_BASE}/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, quantity: 1 }),
    })
    if (!res.ok) return
    const saved = await res.json()
    // Use the DB-assigned item (with real id) to keep reducer in sync
    const refreshed = await fetch(`${API_BASE}/api/cart`).then(r => r.json())
    dispatch({ type: 'SET_CART', cart: refreshed })
  }

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return
    const res = await fetch(`${API_BASE}/api/cart/${cartItemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    })
    if (!res.ok) return
    dispatch({ type: 'UPDATE_QUANTITY', id: cartItemId, quantity })
  }

  const removeItem = async (cartItemId) => {
    const res = await fetch(`${API_BASE}/api/cart/${cartItemId}`, { method: 'DELETE' })
    if (!res.ok) return
    dispatch({ type: 'REMOVE_ITEM', id: cartItemId })
  }

  const clearCart = async () => {
    const res = await fetch(`${API_BASE}/api/cart/clear`, { method: 'DELETE' })
    if (!res.ok) return
    dispatch({ type: 'CLEAR_CART' })
  }

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeItem, clearCart, itemCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
