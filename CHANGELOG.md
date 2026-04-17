# Changelog — Buckeye Marketplace

## [Milestone 5] — 2025-04 (Spring 2026 semester)

### Added

- **JWT Authentication** — `AuthController` issues signed JWT tokens on `/api/auth/register` and `/api/auth/login`. Token lifetime is 8 hours; the signing key is stored in .NET user-secrets (never in source control).
- **ASP.NET Core Identity** — `ApplicationUser` extends `IdentityUser`; password policy enforces minimum 8 characters, at least one uppercase letter, and at least one digit.
- **Role-based authorization** — Two roles: `User` (default on register) and `Admin`. Admin credentials are seeded at startup; admin routes are protected with `[Authorize(Roles = "Admin")]`.
- **Protected cart endpoints** — `CartController` now requires a valid JWT; `userId` is read from the `NameIdentifier` claim instead of a hard-coded string, preventing BOLA (Broken Object Level Authorization).
- **Orders API** — `OrdersController`: `POST /api/orders` (place order), `GET /api/orders/mine` (own orders only, scoped to JWT identity), `GET /api/orders` (admin), `PUT /api/orders/{id}/status` (admin).
- **Products DB-backed** — `ProductsController` now reads/writes `ProductEntity` rows in SQLite via EF Core instead of the in-memory `ProductStore`. Admin CRUD (`POST`/`PUT`/`DELETE`) is protected.
- **EF Core migration** — `AddIdentityOrdersAndProducts` adds Identity tables, `Products`, `Orders`, and `OrderItems` with seed data for 10 sample products.
- **Frontend AuthContext** — React context with a reducer handling `LOGIN`/`LOGOUT` actions; state persists to `localStorage` and reloads on page refresh.
- **Protected routes** — `ProtectedRoute` component redirects unauthenticated users to `/login` and redirects wrong-role users to `/products`.
- **New pages** — `LoginPage`, `RegisterPage`, `CheckoutPage`, `OrderConfirmationPage`, `OrderHistoryPage`, `AdminDashboard`.
- **Axios service layer** — `src/services/api.js` creates an Axios instance with a request interceptor that attaches the JWT Bearer token from `localStorage` to every outgoing request.
- **Backend xUnit tests** — 14 tests: 9 unit tests (order total, password rules, cart-to-order mapping, confirmation number format) + 5 integration tests using `WebApplicationFactory<Program>` against in-memory SQLite.
- **Frontend Vitest tests** — 16 tests across three files: `validateForm.test.js` (8 cases), `authReducer.test.js` (4 cases), `LoginPage.test.jsx` (4 cases using React Testing Library).
- **Playwright E2E** — `e2e/checkout.spec.ts` covers the full checkout happy path in Chromium; see `docs/e2e-run.md` for execution instructions.

### Security practices applied

| Practice | Implementation |
|---|---|
| Parameterized queries | All DB reads use LINQ (EF Core) — no raw SQL string concatenation |
| Secret management | `Jwt:Key` stored in .NET user-secrets, not in `appsettings.json` or source code |
| HTTPS redirect | `app.UseHttpsRedirection()` added to `Program.cs` |
| JWT-scoped queries | `GET /api/orders/mine` filters by `userId` from the JWT claim; users cannot read other users' orders |
| Password policy | ASP.NET Core Identity requires ≥8 chars, digit, uppercase |
| Role enforcement | Admin endpoints decorated with `[Authorize(Roles = "Admin")]`; non-admin users receive 403 |

### Fixed

- `CartController` previously hard-coded `user-001` as the cart owner — replaced with JWT claim extraction.
- Record validation attributes in .NET 10 must appear without the `[property: ...]` prefix on primary-constructor parameters; corrected in `AuthController` and `OrdersController`.
- In-memory SQLite test factory: using separate `SqliteConnection("Data Source=:memory:")` per request caused empty schemas; fixed by opening one shared connection for the factory lifetime.
- `useProduct.js` hook used raw `fetch` response shape (`res.ok`, `res.json()`) after `productApi.js` was switched to Axios; updated to catch `err.response?.status === 404`.
