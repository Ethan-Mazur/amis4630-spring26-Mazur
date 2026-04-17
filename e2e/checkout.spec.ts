import { test, expect } from '@playwright/test'

// Happy-path E2E: register → login → browse → add to cart → checkout → view order history
// Requires both backend (port 5000) and frontend (port 5173) to be running.

const timestamp = Date.now()
const testEmail = `e2e_${timestamp}@osu.edu`
const testPassword = 'E2eTest1!'
const testName = 'E2E Tester'

test.describe('Checkout happy path', () => {
  test('register a new user', async ({ page }) => {
    await page.goto('/register')
    await page.getByPlaceholder('Brutus Buckeye').fill(testName)
    await page.getByPlaceholder('you@osu.edu').fill(testEmail)
    await page.getByPlaceholder('Min 8 chars, 1 uppercase, 1 digit').fill(testPassword)
    await page.getByPlaceholder('••••••••').fill(testPassword)
    await page.getByRole('button', { name: /create account/i }).click()
    await expect(page).toHaveURL(/\/products/)
  })

  test('login with registered user', async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('you@osu.edu').fill(testEmail)
    await page.getByPlaceholder('••••••••').fill(testPassword)
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL(/\/products/)
    await expect(page.getByText(/hi,/i)).toBeVisible()
  })

  test('browse products and add to cart', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.getByPlaceholder('you@osu.edu').fill(testEmail)
    await page.getByPlaceholder('••••••••').fill(testPassword)
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL(/\/products/)

    // Click first product
    await page.getByRole('link', { name: /econ 2001 textbook/i }).first().click()
    await expect(page).toHaveURL(/\/products\/\d+/)

    // Add to cart
    await page.getByRole('button', { name: /add to cart/i }).click()
    // Cart badge should show 1
    await expect(page.getByText('1')).toBeVisible()
  })

  test('checkout and place order', async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.getByPlaceholder('you@osu.edu').fill(testEmail)
    await page.getByPlaceholder('••••••••').fill(testPassword)
    await page.getByRole('button', { name: /sign in/i }).click()

    // Go to product and add to cart
    await page.goto('/products/1')
    await page.getByRole('button', { name: /add to cart/i }).click()

    // Go to cart
    await page.getByRole('link', { name: /cart/i }).click()
    await expect(page).toHaveURL(/\/cart/)

    // Proceed to checkout
    await page.getByRole('link', { name: /proceed to checkout/i }).click()
    await expect(page).toHaveURL(/\/checkout/)

    // Fill shipping address and place order
    await page.getByPlaceholder(/123 high st/i).fill('123 High St, Columbus OH 43210')
    await page.getByRole('button', { name: /place order/i }).click()

    // Should land on confirmation page
    await expect(page).toHaveURL(/\/order-confirmation/)
    await expect(page.getByText(/order confirmed/i)).toBeVisible()
    await expect(page.getByText(/BM-/)).toBeVisible()
  })

  test('view order in history', async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.getByPlaceholder('you@osu.edu').fill(testEmail)
    await page.getByPlaceholder('••••••••').fill(testPassword)
    await page.getByRole('button', { name: /sign in/i }).click()

    // Navigate to order history
    await page.getByRole('link', { name: /my orders/i }).click()
    await expect(page).toHaveURL(/\/orders/)

    // Should see at least one order with BM- prefix
    await expect(page.locator('text=/BM-/')).toBeVisible()
  })
})
