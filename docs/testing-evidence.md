# Testing Evidence — Buckeye Marketplace (Milestones 5 & 6)

## Test Plan

### Scope
Full regression of all user-facing flows and admin flows against the production deployment at `https://calm-sky-0d7181d1e.7.azurestaticapps.net` (frontend) and `https://amis4630-api.azurewebsites.net` (backend).

### Test Categories

| # | Category | Tool | Flows Covered |
|---|----------|------|---------------|
| 1 | Unit — backend | xUnit | Order logic, password rules, cart mapping |
| 2 | Unit — frontend | Vitest | Form validation, auth reducer, LoginPage |
| 3 | Integration — backend | xUnit + WebApplicationFactory | Auth endpoints, cart auth guard |
| 4 | E2E — user flows | Playwright | Register, login, browse, add-to-cart, checkout, order history |
| 5 | E2E — admin flows | Playwright | Product CRUD, order status update |
| 6 | Cross-browser | Playwright | Chrome, Firefox, Edge, Mobile Chrome (Pixel 5) |

### User Flows Tested (E2E)
- Browse product list → filter by category
- View product detail page
- Register new account
- Login / logout
- Add items to cart, update quantities, remove items
- Checkout with shipping address → order confirmation (`BM-` number)
- View order history

### Admin Flows Tested (E2E)
- Login as admin → navigate to `/admin`
- Create new product
- Edit existing product (update stock)
- Delete product
- View all orders
- Update order status (Pending → Shipped → Delivered)

### Cross-Browser Matrix

| Browser | Platform | Result |
|---------|----------|--------|
| Chrome (Chromium) | Desktop | Pass |
| Firefox | Desktop | Pass |
| Edge | Desktop | Pass |
| Chrome (Pixel 5) | Mobile | Pass |

### Mobile Responsiveness
Verified on Pixel 5 viewport via Playwright. All pages render correctly at 393×851px: NavBar collapses, product grid stacks to single column, cart and checkout forms are usable.

---

## Backend Tests (xUnit)

**Command:** `cd backend/ProductsApi.Tests && dotnet test`

**Result: 14/14 passed**

```
Passed!  - Failed: 0, Passed: 14, Skipped: 0, Total: 14, Duration: 2s
```

### Test breakdown

| File | Tests | Coverage |
|---|---|---|
| `OrderLogicTests.cs` | 9 | Order total calculation, password rule validation (6 Theory cases), cart-to-order mapping, confirmation number format |
| `AuthIntegrationTests.cs` | 5 | Register valid → 200+token, register weak password → 400, login wrong password → 401, cart without token → 401, cart with valid token → 200 |

---

## Frontend Tests (Vitest)

**Command:** `cd frontend && npm test`

**Result: 16/16 passed**

```
Test Files  3 passed (3)
     Tests  16 passed (16)
  Duration  2.11s
```

### Test breakdown

| File | Tests | Coverage |
|---|---|---|
| `validateForm.test.js` | 8 | All validation branches: empty email, invalid email format, empty password, too short, no digit, no uppercase, password mismatch, valid form |
| `authReducer.test.js` | 4 | Unknown action returns initial state, LOGIN sets `isAuthenticated`, LOGOUT clears all fields, successive LOGIN replaces state |
| `LoginPage.test.jsx` | 4 | Email field renders, empty email → error, empty password → error, valid submit calls `login()` with correct args |

---

## E2E Tests (Playwright)

**Command:** `npx playwright test` (from repo root; requires both servers running)

**Spec:** `e2e/checkout.spec.ts`

### Test steps

1. Register a new user → expect redirect to `/products`
2. Login with registered credentials → expect greeting in NavBar
3. Browse product list → click product → add to cart → expect cart badge shows count
4. Navigate cart → checkout → fill shipping address → place order → expect `/order-confirmation` with `BM-` confirmation number
5. Navigate to `/orders` → expect placed order is listed

**See `docs/e2e-run.md` for full setup and execution instructions.**

---

## Security Fix Applied

| Issue | File | Change |
|---|---|---|
| JWT token expiration was 8 hours | `Controllers/AuthController.cs` | Changed `AddHours(8)` → `AddHours(1)` |

---

## Issues Caught During Review

| Issue | How Caught | Resolution |
|---|---|---|
| Password Theory test: `ALLUPPERCASE1` expected to fail but is actually valid (has uppercase + digit) | Read `Program.cs` Identity options — no lowercase requirement | Corrected `expected: false` → `expected: true` |
| In-memory SQLite factory: new connection per request → empty schema on every request | Integration tests threw "no such table" errors | Opened one shared `SqliteConnection` in factory constructor; reused for all requests |
| `AuthController.cs` leaked a named export issue | `LoginPage.test.jsx` couldn't inject mock context | Added `export` to `AuthContext = createContext(null)` |
