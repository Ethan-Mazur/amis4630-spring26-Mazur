# Lab Evaluation Report

**Student Repository**: `ethan-mazur-amis4630-spring26-Mazur`
**Date**: May 6, 2026
**Rubric**: `grading/milestone-4/rubric.md`

## 0. Build & Run Status

| Component           | Build | Runs | Notes                                                    |
| ------------------- | ----- | ---- | -------------------------------------------------------- |
| Backend (.NET)      | ✅    | ✅    | `dotnet build` succeeded (0 warnings). Server starts on port 5000. |
| Frontend (React/TS) | ✅    | ✅    | `npm run build` (vite) succeeded. Dev server starts on port 5173.  |
| API Endpoints       | —     | ✅    | GET /api/products: 200 (10 items). Auth, cart, orders all functional. |
| Backend Tests       | —     | ✅    | 14/14 tests passed (`dotnet test`). |
| Frontend Tests      | —     | ✅    | 16/16 tests passed (`vitest run`). |

## 1. Project Structure

| Component | Expected | Found | Status |
| --------- | -------- | ----- | ------ |
| Backend API project | `backend/api/products/` | `backend/api/products/` | ✅ |
| Cart Controller | `Controllers/CartController.cs` | `backend/api/products/Controllers/CartController.cs` | ✅ |
| Cart EF Entities | `Models/CartEntity.cs` | `backend/api/products/Models/CartEntity.cs` | ✅ |
| EF Migrations | `Data/Migrations/` | `backend/api/products/Data/Migrations/` (3 migrations) | ✅ |
| DbContext with Cart DbSets | `Data/AppDbContext.cs` | `backend/api/products/Data/AppDbContext.cs` | ✅ |
| Frontend CartContext | `src/context/CartContext.jsx` | `frontend/src/context/CartContext.jsx` | ✅ |
| Cart API service | `src/services/cartApi.js` | `frontend/src/services/cartApi.js` | ✅ |
| Cart page | `src/pages/CartPage.jsx` | `frontend/src/pages/CartPage.jsx` | ✅ |
| CartItem component | `src/components/CartItem.jsx` | `frontend/src/components/CartItem.jsx` | ✅ |
| CartSummary component | `src/components/CartSummary.jsx` | `frontend/src/components/CartSummary.jsx` | ✅ |
| NavBar with cart count | `src/components/NavBar.jsx` | `frontend/src/components/NavBar.jsx` | ✅ |
| AI usage documentation | `AI-USAGE.md` or `docs/ai-reflection.md` | Both present | ✅ |

## 2. Rubric Scorecard

| # | Requirement | Points | Status | Evidence |
| --- | --- | --- | --- | --- |
| 1a | useReducer or Context API for cart state | 2 | ✅ Met | [CartContext.jsx](frontend/src/context/CartContext.jsx#L7-L33) — `useReducer` with `cartReducer` handling `SET_CART`, `ADD_TO_CART`, `UPDATE_QUANTITY`, `REMOVE_ITEM`, `CLEAR_CART` actions; wrapped in `CartProvider` Context |
| 1b | Add, update quantity, remove operations | 2 | ✅ Met | [CartContext.jsx](frontend/src/context/CartContext.jsx#L63-L99) — `addToCart()`, `updateQuantity()`, `removeItem()`, `clearCart()` all implemented with optimistic updates and server-state revert on failure |
| 1c | Cart count in header + calculated totals | 1 | ✅ Met | [CartContext.jsx](frontend/src/context/CartContext.jsx#L101-L102) — `itemCount` and `cartTotal` computed via `reduce`; [NavBar.jsx](frontend/src/components/NavBar.jsx#L36-L41) — badge renders `itemCount` next to cart icon |
| 2a | GET /api/cart | 1 | ✅ Met | [CartController.cs](backend/api/products/Controllers/CartController.cs#L42-L47) — `[HttpGet]` returns cart items as DTOs; API verification returned 200 |
| 2b | POST /api/cart (add item) | 1 | ✅ Met | [CartController.cs](backend/api/products/Controllers/CartController.cs#L50-L89) — `[HttpPost]` validates quantity, checks product existence, checks stock, handles duplicate items; API verification returned 201 |
| 2c | PUT /api/cart/{cartItemId} (update qty) | 1 | ✅ Met | [CartController.cs](backend/api/products/Controllers/CartController.cs#L92-L109) — `[HttpPut("{cartItemId:int}")]` validates quantity ≥ 1, checks stock limit, returns updated DTO |
| 2d | DELETE endpoints (item + clear) | 1 | ✅ Met | [CartController.cs](backend/api/products/Controllers/CartController.cs#L112-L131) — `[HttpDelete("clear")]` removes all items; `[HttpDelete("{cartItemId:int}")]` removes single item |
| 2e | Proper status codes and responses | 1 | ✅ Met | [CartController.cs](backend/api/products/Controllers/CartController.cs) — returns `Ok()`, `CreatedAtAction()`, `BadRequest()`, `NotFound()` appropriately; `[Authorize]` attribute on controller returns 401 for unauthenticated requests (verified by orchestrator) |
| 3a | Cart/CartItem EF entities | 2 | ✅ Met | [CartEntity.cs](backend/api/products/Models/CartEntity.cs) — `CartEntity` (Id, UserId, Items) and `CartItemEntity` (Id, CartId, ProductId, Quantity, Title, Price, ImageUrl, Stock) with denormalized product snapshot |
| 3b | Relationships and navigation properties | 1 | ✅ Met | [CartEntity.cs](backend/api/products/Models/CartEntity.cs#L14-L15) — `CartItemEntity` has `Cart` navigation property and `CartId` FK; [AppDbContext.cs](backend/api/products/Data/AppDbContext.cs#L23-L27) — `HasMany`/`WithOne` with cascade delete configured in `OnModelCreating` |
| 3c | Migrations applied, data persists | 1 | ✅ Met | `Data/Migrations/20260401203455_InitCart.cs` creates `Carts` and `CartItems` tables with FK constraint; `20260401220318_AddStockToCartItem.cs` adds Stock column; SQLite database file `buckeye_marketplace.db` present; API verification confirmed POST then GET returns persisted data |
| 4a | Real API replaces mock/localStorage | 2 | ✅ Met | [cartApi.js](frontend/src/services/cartApi.js) — all 5 functions call real API via Axios (`api.get`, `api.post`, `api.put`, `api.delete`); no mock data arrays or localStorage cart storage found in codebase; products also fetched from API via [productApi.js](frontend/src/services/productApi.js) |
| 4b | All cart operations call API | 2 | ✅ Met | [CartContext.jsx](frontend/src/context/CartContext.jsx#L63-L99) — `addToCart` calls `addCartItem()`, `updateQuantity` calls `updateCartItem()`, `removeItem` calls `removeCartItem()`, `clearCart` calls `clearCartItems()`; initial load calls `getCart()` on auth change (L44-L55) |
| 4c | State synchronization | 1 | ✅ Met | [CartContext.jsx](frontend/src/context/CartContext.jsx#L44-L55) — cart re-fetched from API on `auth.isAuthenticated` change; optimistic updates with server-state revert on failure for `updateQuantity`, `removeItem`, `clearCart`; `addToCart` re-fetches full cart to get DB-assigned IDs |
| 5a | Loading states | 1 | ✅ Met | [CartPage.jsx](frontend/src/pages/CartPage.jsx#L29-L34) — "Loading your cart..." message when `cartLoading` is true; [ProductListPage.jsx](frontend/src/pages/ProductListPage.jsx#L7) — "Loading products..." state; [ProductDetailPage.jsx](frontend/src/pages/ProductDetailPage.jsx#L36) — "Loading product..." state |
| 5b | Error messages and edge cases | 1 | ✅ Met | [CartPage.jsx](frontend/src/pages/CartPage.jsx#L36-L44) — error banner with specific error message; empty cart state with browse link (L46-L57); [CartController.cs](backend/api/products/Controllers/CartController.cs) — stock validation, quantity ≥ 1 validation, out-of-stock handling; [CartItem.jsx](frontend/src/components/CartItem.jsx#L13-L14) — qty buttons disabled at min/max with stock-aware limits |
| 5c | Success feedback | 1 | ✅ Met | [CartPage.jsx](frontend/src/pages/CartPage.jsx#L12-L15) — notification system with `showNotification()` for remove and clear actions; [ProductDetailPage.jsx](frontend/src/pages/ProductDetailPage.jsx#L82-L86) — button text changes to "✓ Added to Cart!" on success, "⚠ Could not add to cart" on failure |
| 6a | Clean component structure | 1 | ✅ Met | Cart UI split across `CartPage.jsx`, `CartItem.jsx`, `CartSummary.jsx`; state in `CartContext.jsx`; API calls in `cartApi.js`; pages, components, services, context, and hooks directories cleanly separated |
| 6b | Service layer / custom hooks | 1 | ✅ Met | [cartApi.js](frontend/src/services/cartApi.js) — dedicated cart API service; [api.js](frontend/src/services/api.js) — shared Axios instance with JWT interceptor; [useProduct.js](frontend/src/hooks/useProduct.js) and [useProducts.js](frontend/src/hooks/useProducts.js) — custom data-fetching hooks |
| 6c | AI usage documented | 1 | ✅ Met | [ai-reflection.md](docs/ai-reflection.md#L26-L37) — Milestone 4 section documents six iterative AI steps, notes `useReducer` correction and stock enforcement follow-up prompt; [AI-USAGE.md](AI-USAGE.md) covers broader AI usage patterns |

**Total: 25 / 25**

## 3. Detailed Findings

All rubric items are met. No deficiencies to report.

## 4. Action Plan

No corrective actions required — full marks earned.

## 5. Code Quality Coaching (Non-Scoring)

- **JWT secret in appsettings.json**: [appsettings.json](backend/api/products/appsettings.json) — verify the JWT key is not committed here in plain text. The `AI-USAGE.md` states it's in user-secrets, which is the correct approach. If the key appears in `appsettings.json`, move it to user-secrets or environment variables before any public deployment.

- **Optimistic update inconsistency**: [CartContext.jsx](frontend/src/context/CartContext.jsx#L63-L70) — `addToCart` does NOT use optimistic update (waits for API, then re-fetches), while `updateQuantity`, `removeItem`, and `clearCart` do use optimistic updates with rollback. This is actually a reasonable design choice (new items need a server-assigned ID), but worth noting for consistency awareness.

- **Error swallowing in cartApi.js**: [cartApi.js](frontend/src/services/cartApi.js) — catch blocks return `{ ok: false }` without the error message. Consider propagating `err.response?.data?.error` so the UI can display specific server validation messages (e.g., "Only 5 available for this item").

- **No input sanitization on quantity picker**: [CartItem.jsx](frontend/src/components/CartItem.jsx) — quantity changes are button-driven (not free-text input), which avoids injection risk, but consider adding a direct numeric input for accessibility.

## 6. Git Practices Coaching (Non-Scoring)

- **Commit granularity**: The CHANGELOG groups all of Milestone 4 work under the Milestone 5 entry rather than having its own section, suggesting cart work may have been committed alongside later milestone work. Keeping milestone work in separate, clearly tagged commits makes it easier to review incremental progress.

- **AI reflection quality**: The `docs/ai-reflection.md` Milestone 4 section is well-written — it documents specific corrections made to AI output (useReducer regression, stock enforcement follow-up), which demonstrates critical engagement with AI tools rather than blind acceptance.

---

**25/25** — All cart state management, API endpoints, database persistence, frontend-backend integration, error handling, and code quality requirements are fully met. The coaching notes above (error message propagation, commit organization) are suggestions for professional growth, not scoring deductions.
