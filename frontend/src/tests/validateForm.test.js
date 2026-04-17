import { describe, it, expect } from 'vitest'
import { validateForm } from '../pages/RegisterPage.jsx'

describe('validateForm (registration validation)', () => {
  it('returns error when email is empty', () => {
    expect(validateForm('', 'ValidPass1', 'ValidPass1')).toBe('Email is required.')
  })

  it('returns error for invalid email format', () => {
    expect(validateForm('notanemail', 'ValidPass1', 'ValidPass1')).toBe('Enter a valid email address.')
  })

  it('returns error when password is empty', () => {
    expect(validateForm('user@osu.edu', '', '')).toBe('Password is required.')
  })

  it('returns error when password is too short', () => {
    expect(validateForm('user@osu.edu', 'short1', 'short1')).toBe('Password must be at least 8 characters.')
  })

  it('returns error when password lacks a digit', () => {
    expect(validateForm('user@osu.edu', 'NoDigitsHere', 'NoDigitsHere')).toBe('Password must contain at least one digit.')
  })

  it('returns error when password lacks uppercase', () => {
    expect(validateForm('user@osu.edu', 'alllower1', 'alllower1')).toBe('Password must contain at least one uppercase letter.')
  })

  it('returns error when passwords do not match', () => {
    expect(validateForm('user@osu.edu', 'ValidPass1', 'Mismatch1')).toBe('Passwords do not match.')
  })

  it('returns null for a valid form', () => {
    expect(validateForm('user@osu.edu', 'ValidPass1', 'ValidPass1')).toBeNull()
  })
})
