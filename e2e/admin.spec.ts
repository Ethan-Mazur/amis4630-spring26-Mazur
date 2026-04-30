import { test, expect } from '@playwright/test'

// Admin flow E2E: login as admin → manage products → manage order status
// Requires both backend (port 5000) and frontend (port 5173) running locally,
// with admin seeded as admin@buckeyemarketplace.com / Admin123!

const ADMIN_EMAIL = 'admin@buckeyemarketplace.com'
const ADMIN_PASSWORD = 'Admin123!'

async function loginAsAdmin(page) {
  await page.goto('/login')
  await page.getByPlaceholder('you@osu.edu').fill(ADMIN_EMAIL)
  await page.getByPlaceholder('••••••••').fill(ADMIN_PASSWORD)
  await page.getByRole('button', { name: /sign in/i }).click()
  await expect(page).toHaveURL(/\/products/)
}

test.describe('Admin flows', () => {
  test('admin can navigate to dashboard', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin')
    await expect(page.getByRole('heading', { name: /admin dashboard/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /products/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /orders/i })).toBeVisible()
  })

  test('admin can add a new product', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin')

    await page.getByRole('button', { name: /\+ add product/i }).click()
    await expect(page.getByRole('heading', { name: /new product/i })).toBeVisible()

    await page.getByPlaceholder(/title/i).fill('E2E Test Item')
    await page.getByPlaceholder(/description/i).fill('Created by automated test')
    await page.getByPlaceholder(/price/i).fill('9.99')
    await page.getByPlaceholder(/category/i).fill('Electronics')
    await page.getByPlaceholder(/sellerName/i).fill('Test Seller')
    await page.getByPlaceholder(/imageUrl/i).fill('https://picsum.photos/seed/e2e/300/200')
    await page.getByPlaceholder(/stock/i).fill('5')

    await page.getByRole('button', { name: /save/i }).click()
    await expect(page.getByText('Saved!')).toBeVisible()
    await expect(page.getByText('E2E Test Item')).toBeVisible()
  })

  test('admin can edit an existing product', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin')

    // Edit the first product in the list
    await page.getByRole('button', { name: /edit/i }).first().click()
    await expect(page.getByRole('heading', { name: /edit product/i })).toBeVisible()

    const stockField = page.getByPlaceholder(/stock/i)
    await stockField.fill('99')
    await page.getByRole('button', { name: /save/i }).click()
    await expect(page.getByText('Saved!')).toBeVisible()
  })

  test('admin can update order status', async ({ page }) => {
    // First create an order as a regular user
    const timestamp = Date.now()
    const userEmail = `admin_e2e_${timestamp}@osu.edu`
    const userPassword = 'AdminE2e1!'

    // Register user
    await page.goto('/register')
    await page.getByPlaceholder('Brutus Buckeye').fill('Admin E2E User')
    await page.getByPlaceholder('you@osu.edu').fill(userEmail)
    await page.getByPlaceholder('Min 8 chars, 1 uppercase, 1 digit').fill(userPassword)
    await page.getByPlaceholder('••••••••').fill(userPassword)
    await page.getByRole('button', { name: /create account/i }).click()
    await expect(page).toHaveURL(/\/products/)

    // Place an order
    await page.goto('/products/1')
    await page.getByRole('button', { name: /add to cart/i }).click()
    await page.getByRole('link', { name: /cart/i }).click()
    await page.getByRole('link', { name: /proceed to checkout/i }).click()
    await page.getByPlaceholder(/123 high st/i).fill('123 High St, Columbus OH 43210')
    await page.getByRole('button', { name: /place order/i }).click()
    await expect(page).toHaveURL(/\/order-confirmation/)

    // Now login as admin and update the order status
    await loginAsAdmin(page)
    await page.goto('/admin')
    await page.getByRole('button', { name: /orders/i }).click()
    await expect(page.getByText(/pending|shipped|delivered/i).first()).toBeVisible()

    // Change the first order's status
    const statusSelect = page.locator('select').first()
    await statusSelect.selectOption('Shipped')
    await page.getByRole('button', { name: /update/i }).first().click()
    await expect(page.getByText(/shipped/i).first()).toBeVisible()
  })
})
