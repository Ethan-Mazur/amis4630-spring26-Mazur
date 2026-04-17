# AI Usage Log — Buckeye Marketplace

## Milestone 5 — Authentication, Orders, Testing & Security

---

### Part 1 — Testing Agent

**Prompt used with TESTING-AGENT.md:**
> "Tell me the best candidates for: 1. three backend unit tests, 2. one backend integration test, 3. three frontend unit tests, 4. one E2E happy-path test. Do not edit code yet. Return a short plan with file targets and why each test matters."

**Copilot plan returned:**

| # | Type | Target | Why it matters |
|---|---|---|---|
| 1 | Backend unit | `OrdersController` — order total calculation | Verifies price × quantity math is correct |
| 2 | Backend unit | `AuthController` — password rule validation | Ensures weak passwords are rejected at the service layer |
| 3 | Backend unit | `OrdersController` — confirmation number format | Confirms `BM-XXXXXXXX` pattern before it reaches users |
| 4 | Backend integration | `POST /api/auth/register` + `GET /api/cart` | Covers a real Week 13 scenario: auth required, 401 without token |
| 5 | Frontend unit | `validateForm` from `RegisterPage.jsx` | Pure function with many branches — easy to test exhaustively |
| 6 | Frontend unit | Auth reducer in `AuthContext.jsx` | State machine with LOGIN/LOGOUT — pure, no rendering needed |
| 7 | Frontend component | `<LoginPage>` render + empty-submit error | Verifies user-visible validation feedback |
| 8 | E2E | Register → login → add to cart → checkout → order history | The full happy path — exercises every auth-protected route |

---

### Part 2 — Security Audit

**Prompt used with security-agent.md:**
> "Audit my auth setup for M5. Do not edit files yet. Check: JWT key source, JWT claims, token expiration, password hashing, CORS config. Return findings as file / issue / severity / minimal fix."

**Findings:**

| File | Issue | Severity | Fix |
|---|---|---|---|
| `AuthController.cs` | Token expiration set to 8 hours — too long | Medium | Changed `AddHours(8)` → `AddHours(1)` |
| `appsettings.json` | `Jwt:Key` not present ✅ | — | Already in user-secrets — no action needed |
| `Program.cs` | CORS allows only `localhost:5173` and `localhost:3000` ✅ | — | Correct — no wildcard origin |
| `Program.cs` | `app.UseHttpsRedirection()` present ✅ | — | No action needed |
| `AppDbContext.cs` | No `FromSqlRaw` or raw SQL ✅ | — | All queries use LINQ |

**Fix applied:** JWT expiration reduced from 8 hours to 1 hour in `AuthController.cs`.

**Manual verification:** Confirmed login still returns a token after the change (`dotnet run` + Swagger).

---

### Part 3 — Security/QA Bug Fix

**Prompt used:**
> "Audit my project for one high-impact Week 13 issue. Do not edit yet. Look for: userId trusted from route/body, admin endpoints missing role checks, dangerouslySetInnerHTML, FromSqlRaw, missing CORS, missing 401/403 handling in frontend."

**Highest-priority finding:** JWT token expiration was 8 hours — addressed in Part 2 above.

**Other findings confirmed clean:**
- `userId` sourced from `User.FindFirstValue(ClaimTypes.NameIdentifier)` in both `CartController` and `OrdersController` ✅
- All admin endpoints have `[Authorize(Roles = "Admin")]` ✅
- No `dangerouslySetInnerHTML` anywhere in the React codebase ✅
- No `FromSqlRaw` — all queries use EF Core LINQ ✅
- CORS correctly scoped to `http://localhost:5173` ✅

---

### Part 4 — Automated Tests

**Backend prompt used (with TESTING-AGENT.md):**
> "Create at least 3 unit tests for real code that already exists. Create 1 integration test using WebApplicationFactory<Program>. The integration test should cover authorization. Do not invent classes that do not exist. Run dotnet test and show me the output."

**Result:** 14/14 tests passing

**One thing Copilot got wrong:** In the password rule Theory test, `ALLUPPERCASE1` was expected to return `false`. Copilot's reasoning was that it lacked a lowercase letter — but the Identity policy only requires uppercase + digit, not lowercase. Caught by reading `Program.cs` password options. Fixed `expected: false` → `expected: true`.

**Second issue caught:** The `CustomWebApplicationFactory` initially created a new `SqliteConnection("Data Source=:memory:")` per DbContext registration. Each new connection gets a completely empty database, so migrations ran but tables disappeared between requests. Fixed by opening one shared connection in the factory constructor and reusing it.

**Frontend prompt used (with TESTING-AGENT.md):**
> "Create at least 3 tests: one pure function test, one reducer/context test, one component test. Use React Testing Library and Vitest. Run npm test and show me the output."

**Result:** 16/16 tests passing

---

### Part 5 — Playwright E2E

**Prompt used:**
> "Generate a Playwright spec file for the checkout happy path: register → login → browse products → add to cart → checkout → verify confirmation → view order history. Use getByRole, getByLabel, or getByPlaceholder where possible."

**Spec generated:** `e2e/checkout.spec.ts` (5 sequential tests)

**See `docs/e2e-run.md` for full execution instructions.**

---

### Self-Check Against Quality Dimensions

| Dimension | Status |
|---|---|
| Functionality | All CRUD, auth, and order flows implemented and manually tested |
| Security | JWT key in user-secrets; token 1-hour expiry; userId from JWT; role-gated admin endpoints; parameterized queries only |
| Code quality | Service layer (`cartApi`, `productApi`, `orderApi`, `authApi`), custom hooks (`useProduct`, `useProducts`), context separation (`AuthContext`, `CartContext`) |
| Test coverage | 14 backend tests (unit + integration), 16 frontend tests (unit + component), 5 E2E tests |

### Week 13 Final Checklist

- [x] `userId` comes from JWT claim, not route/body
- [x] Admin endpoints enforce `[Authorize(Roles = "Admin")]`
- [x] JWT key in user-secrets, not committed config
- [x] No raw SQL string concatenation — EF Core LINQ only
- [x] No `dangerouslySetInnerHTML` with user data
- [x] CORS configured for `http://localhost:5173` only
- [x] README includes test credentials and run instructions
