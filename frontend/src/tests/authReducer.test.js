import { describe, it, expect } from 'vitest'

// Pure reducer extracted from AuthContext for unit testing
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

const initialState = { token: null, email: null, displayName: null, role: null, isAuthenticated: false }

describe('authReducer', () => {
  it('returns initial state for unknown action', () => {
    expect(authReducer(initialState, { type: 'UNKNOWN' })).toEqual(initialState)
  })

  it('sets isAuthenticated and stores user on LOGIN', () => {
    const action = { type: 'LOGIN', token: 'abc123', email: 'u@osu.edu', displayName: 'Brutus', role: 'User' }
    const result = authReducer(initialState, action)
    expect(result.isAuthenticated).toBe(true)
    expect(result.token).toBe('abc123')
    expect(result.email).toBe('u@osu.edu')
    expect(result.role).toBe('User')
  })

  it('clears all fields on LOGOUT', () => {
    const loggedIn = { token: 'tok', email: 'u@osu.edu', displayName: 'Brutus', role: 'User', isAuthenticated: true }
    const result = authReducer(loggedIn, { type: 'LOGOUT' })
    expect(result.isAuthenticated).toBe(false)
    expect(result.token).toBeNull()
    expect(result.email).toBeNull()
  })

  it('replaces login state with new user on successive LOGIN', () => {
    const first = authReducer(initialState, { type: 'LOGIN', token: 't1', email: 'a@osu.edu', displayName: 'A', role: 'User' })
    const second = authReducer(first, { type: 'LOGIN', token: 't2', email: 'b@osu.edu', displayName: 'B', role: 'Admin' })
    expect(second.role).toBe('Admin')
    expect(second.email).toBe('b@osu.edu')
  })
})
