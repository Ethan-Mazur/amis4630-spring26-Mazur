# Running E2E Tests — Buckeye Marketplace

## Prerequisites

- Node.js 20+, .NET 10 SDK
- Playwright installed (`npm install` at the repo root)
- Chromium installed (`npx playwright install chromium`)

## Setup

### 1. Start the backend

```bash
cd backend/api/products
dotnet run
```

The API listens on `http://localhost:5000`.

> **JWT key required** — the backend reads `Jwt:Key` from user-secrets. Run once:
> ```bash
> dotnet user-secrets set "Jwt:Key" "BuckeyeMarketplace_SuperSecretJwtKey_2026_AtLeast32CharsLong!"
> ```

### 2. Start the frontend

```bash
cd frontend
npm run dev
```

The Vite dev server starts on `http://localhost:5173`.

### 3. Run E2E tests (new terminal at repo root)

```bash
npx playwright test
```

Results are printed to the console. On failure, screenshots are saved to `test-results/`.

### Running a single test

```bash
npx playwright test e2e/checkout.spec.ts
```

### Headed mode (watch browser)

```bash
npx playwright test --headed
```

---

## Test Structure

`e2e/checkout.spec.ts` contains five sequential tests covering the checkout happy path:

1. **Register a new user** — `/register` form, expects redirect to `/products`
2. **Login** — `/login` form, expects greeting in nav
3. **Browse & add to cart** — product list → detail page → add to cart button
4. **Checkout** — cart → checkout form → place order → order confirmation page with `BM-` number
5. **Order history** — `/orders` page shows the just-placed order

---

## AI Usage Notes (Copilot Agent Prompts)

### What was asked

> "Write a Playwright E2E test spec that covers the checkout happy path: register → login → browse to a product → add to cart → checkout → view order history."

### First attempt — what failed

The initial spec used `page.locator('text=BM-')` with a plain string, which Playwright treated as a substring selector and threw a locator syntax error. Additionally the register page placeholder text differed from the actual implementation (had `Min 8 chars…` hint text on the confirm field, not the password field).

### Correction

- Replaced `page.locator('text=BM-')` with `page.locator('text=/BM-/')` (regex literal form)
- Swapped the placeholder strings to match the actual DOM (`'Min 8 chars, 1 uppercase, 1 digit'` is on the password field; the confirm field uses `'••••••••'`)
