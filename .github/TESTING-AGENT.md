# Testing Agent — Buckeye Marketplace

You are a testing assistant for the Buckeye Marketplace project. Before generating any test, read the relevant source files first. Never invent classes, methods, or routes that do not exist. Never weaken assertions to make tests pass.

---

## Project Layout

| Layer | Path |
|---|---|
| .NET API | `backend/api/products/` |
| xUnit test project | `backend/ProductsApi.Tests/` |
| React frontend | `frontend/src/` |
| E2E specs | `e2e/` |

---

## Test Commands

```bash
# Backend unit + integration tests
cd backend/ProductsApi.Tests
dotnet test

# Frontend unit + component tests
cd frontend
npm test

# E2E tests (requires both servers running)
npx playwright test
```

---

## Backend (.NET / xUnit)

**Test project:** `backend/ProductsApi.Tests/ProductsApi.Tests.csproj`  
**Namespace:** `ProductsApi.Tests`  
**Framework target:** `net10.0`

### Unit test rules
- Test pure logic only — no database, no HTTP
- Use `[Theory]` + `[InlineData]` for data-driven cases
- Good targets: order total calculation, password rule validation, cart-to-order mapping, confirmation number format
- Source files to inspect first: `Models/OrderEntity.cs`, `Models/CartEntity.cs`, `Controllers/OrdersController.cs`

### Integration test rules
- Use `CustomWebApplicationFactory` (already defined in `AuthIntegrationTests.cs`) — do not create a second factory
- Use a shared in-memory SQLite connection (see existing factory for pattern)
- Override `Jwt:Key`, `Jwt:Issuer`, `Jwt:Audience` via `builder.UseSetting()`
- Good targets: auth flows, protected endpoints returning 401/403, ownership filtering on `/api/orders/mine`
- Always assert the HTTP status code AND meaningful response body content

### Assertion rules
- Use `Assert.Equal`, `Assert.Contains`, `Assert.NotNull` — never `Assert.True(true)` or trivially passing assertions
- If a test requires a workaround to pass, report the underlying problem instead

---

## Frontend (Vitest + React Testing Library)

**Test directory:** `frontend/src/tests/`  
**Setup file:** `frontend/src/tests/setup.js`  
**Framework:** Vitest with jsdom, globals enabled

### Unit test rules
- Pure function tests: import the function directly, no rendering needed
- Good targets: `validateForm` from `RegisterPage.jsx`, auth reducer logic from `AuthContext.jsx`

### Component test rules
- Use `render`, `screen`, `fireEvent` / `userEvent` from `@testing-library/react`
- Wrap components in `MemoryRouter` if they use `useNavigate` or `<Link>`
- Inject mock `AuthContext` via `<AuthContext.Provider value={...}>` — do not mock the entire module
- Assert on visible text, roles, and ARIA attributes — not on internal state
- Good targets: `LoginPage.jsx`, `RegisterPage.jsx`, `NavBar.jsx`

### Assertion rules
- Use `expect(...).toBeInTheDocument()`, `toHaveTextContent()`, `toBeDisabled()` etc.
- Never use `expect(true).toBe(true)` or equivalent no-op assertions

---

## E2E (Playwright)

**Config:** `playwright.config.js` at repo root  
**Spec directory:** `e2e/`  
**Base URL:** `http://localhost:5173`  
**Browser:** Chromium only

### Rules
- Use `getByRole`, `getByLabel`, `getByPlaceholder`, or `getByTestId` — avoid fragile CSS selectors
- After each major step, snapshot the page before continuing
- If a selector is ambiguous, add a minimal `data-testid` attribute and report it as a QA improvement
- Test users should use a unique timestamp in the email (`e2e_${Date.now()}@osu.edu`) to avoid conflicts
- Good targets: register → login → add to cart → checkout → order confirmation → order history
