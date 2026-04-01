import { createContext, useContext, useReducer, useEffect, useState } from 'react'
import { getCart, addCartItem, updateCartItem, removeCartItem, clearCartItems } from '../services/cartApi.js'

const CartContext = createContext(null)

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
  const [cartLoading, setCartLoading] = useState(true)
  const [cartError, setCartError] = useState(null)

  // On mount: load persisted cart from the backend
  useEffect(() => {
    setCartLoading(true)
    setCartError(null)
    getCart()
      .then(data => {
        dispatch({ type: 'SET_CART', cart: data })
        setCartLoading(false)
      })
      .catch(err => {
        setCartError(err.message)
        setCartLoading(false)
      })
  }, [])

  // Returns true on success, false on failure so callers can show error feedback
  const addToCart = async (product, quantity = 1) => {
    const res = await addCartItem(product.id, quantity)
    if (!res.ok) return false
    // Re-fetch to get DB-assigned cart item ID so subsequent operations use the correct ID
    const refreshed = await getCart()
    dispatch({ type: 'SET_CART', cart: refreshed })
    return true
  }

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return
    // Optimistic update — reflect change in UI immediately
    dispatch({ type: 'UPDATE_QUANTITY', id: cartItemId, quantity })
    const res = await updateCartItem(cartItemId, quantity)
    // Revert to server state if the API call fails
    if (!res.ok) {
      const refreshed = await getCart()
      dispatch({ type: 'SET_CART', cart: refreshed })
    }
  }

  const removeItem = async (cartItemId) => {
    // Optimistic update — remove from UI immediately
    dispatch({ type: 'REMOVE_ITEM', id: cartItemId })
    const res = await removeCartItem(cartItemId)
    // Revert to server state if the API call fails
    if (!res.ok) {
      const refreshed = await getCart()
      dispatch({ type: 'SET_CART', cart: refreshed })
    }
  }

  const clearCart = async () => {
    // Optimistic update — clear UI immediately
    dispatch({ type: 'CLEAR_CART' })
    const res = await clearCartItems()
    // Revert to server state if the API call fails
    if (!res.ok) {
      const refreshed = await getCart()
      dispatch({ type: 'SET_CART', cart: refreshed })
    }
  }

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, cartLoading, cartError, addToCart, updateQuantity, removeItem, clearCart, itemCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
