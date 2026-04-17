import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from '../pages/LoginPage.jsx'
import { AuthContext } from '../context/AuthContext.jsx'

// Minimal AuthContext value so LoginPage can render without a real provider
function renderLoginPage(loginFn = vi.fn()) {
  const authValue = {
    auth: { isAuthenticated: false, token: null, email: null, role: null, displayName: null },
    login: loginFn,
    register: vi.fn(),
    logout: vi.fn(),
  }
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </AuthContext.Provider>
  )
}

describe('<LoginPage />', () => {
  it('renders email and password fields', () => {
    renderLoginPage()
    expect(screen.getByPlaceholderText(/you@osu.edu/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument()
  })

  it('shows error when submitted with empty email', async () => {
    renderLoginPage()
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Email is required.')
  })

  it('shows error when submitted with empty password', async () => {
    renderLoginPage()
    fireEvent.change(screen.getByPlaceholderText(/you@osu.edu/i), { target: { value: 'user@osu.edu' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Password is required.')
  })

  it('calls login with email and password on valid submit', async () => {
    const loginFn = vi.fn().mockResolvedValue({ token: 'tok', role: 'User' })
    renderLoginPage(loginFn)
    fireEvent.change(screen.getByPlaceholderText(/you@osu.edu/i), { target: { value: 'user@osu.edu' } })
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'SomePass1' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    // login called with correct args
    await vi.waitFor(() => {
      expect(loginFn).toHaveBeenCalledWith('user@osu.edu', 'SomePass1')
    })
  })
})
