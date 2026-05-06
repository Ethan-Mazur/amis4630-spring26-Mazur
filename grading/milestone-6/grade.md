# Lab Evaluation Report

**Student Repository**: `ethan-mazur-amis4630-spring26-Mazur`  
**Date**: May 6, 2026  
**Rubric**: rubric.md (Milestone 6 — Final: Production Deployment, CI/CD, Testing, Documentation, AI Reflection)

## 0. Build & Run Status

| Component           | Build | Runs | Notes                                                    |
| ------------------- | ----- | ---- | -------------------------------------------------------- |
| Backend (.NET)      | ✅    | ✅    | `dotnet build` succeeded (0 warnings). Server starts on port 5000. |
| Frontend (React/TS) | ✅    | ✅    | `npm run build` (vite) succeeded. Dev server starts on port 5173.  |
| API Endpoints       | —     | ✅    | GET /api/products: 200 (10 items). Auth, cart, orders all functional. |
| Backend Tests       | —     | ✅    | 14/14 tests passed (`dotnet test`). |
| Frontend Tests      | —     | ✅    | 16/16 tests passed (`vitest run`). |

## 1. Project Structure

| Expected | Found | Status |
| -------- | ----- | ------ |
| `.github/workflows/` (CI/CD) | `.github/workflows/frontend.yml`, `.github/workflows/backend.yml` | ✅ |
| `backend/api/products/` (.NET API) | `backend/api/products/` with `ProductsApi.csproj`, controllers, models | ✅ |
| `backend/ProductsApi.Tests/` (backend tests) | `backend/ProductsApi.Tests/` with 14 xUnit tests | ✅ |
| `frontend/` (React app) | `frontend/` with Vite, React 18, pages, components, services | ✅ |
| `frontend/.env.production` | `frontend/.env.production` | ✅ |
| `backend/api/products/appsettings.Production.json` | Present with CORS origin | ✅ |
| `e2e/` (Playwright specs) | `e2e/checkout.spec.ts`, `e2e/admin.spec.ts` | ✅ |
| `docs/ADR/` (Architecture Decision Records) | 6 ADRs (001–006) | ✅ |
| `docs/user-guide.md` | Present, comprehensive | ✅ |
| `docs/ai-reflection.md` | Present, extensive | ✅ |
| `docs/testing-evidence.md` | Present | ✅ |
| `docs/screenshots/` | 12 screenshots | ✅ |
| `README.md` | Present, detailed with live URLs | ✅ |

## 2. Rubric Scorecard

| # | Requirement | Points | Status | Evidence |
| --- | --- | --- | --- | --- |
| 1 | **Production Deployment** — Flawless deployment, HTTPS, professional setup | 5 | ✅ Met | Live URLs in [README.md](README.md#L11-L13) (frontend: `calm-sky-0d7181d1e.7.azurestaticapps.net`, backend: `amis4630-api.azurewebsites.net`). HTTPS via Azure SWA + App Service. Security headers (HSTS, X-Frame-Options, X-Content-Type-Options) in [frontend/public/staticwebapp.config.json](frontend/public/staticwebapp.config.json#L6-L10). CORS configured in [backend/api/products/appsettings.Production.json](backend/api/products/appsettings.Production.json). Successful deployment log at `api-logs-latest/deployments/988ce6a2.../status.xml` showing `Status: Success` on 2026-04-30. |
| 2 | **CI/CD Pipeline** — Automated pipeline working perfectly | 4 | ✅ Met | [.github/workflows/frontend.yml](.github/workflows/frontend.yml) — builds, tests, deploys frontend to Azure Static Web Apps on push to `main`. [.github/workflows/backend.yml](.github/workflows/backend.yml) — restores, builds, tests, publishes, deploys to Azure App Service on push to `main`. Both use conditional deploy (`if: github.ref == 'refs/heads/main'`), proper caching, and official Azure actions. |
| 3 | **Testing & QA** — Comprehensive testing, well-documented | 4 | ✅ Met | Backend: 14/14 xUnit tests passing (9 unit + 5 integration in [backend/ProductsApi.Tests/](backend/ProductsApi.Tests/)). Frontend: 16/16 Vitest tests passing (3 files). E2E: 2 Playwright specs — [e2e/checkout.spec.ts](e2e/checkout.spec.ts) (5 tests) + [e2e/admin.spec.ts](e2e/admin.spec.ts) (4 tests). Cross-browser config in [playwright.config.js](playwright.config.js) (Chromium, Firefox, Edge, Mobile Chrome). Full documentation in [docs/testing-evidence.md](docs/testing-evidence.md) and [docs/e2e-run.md](docs/e2e-run.md). |
| 4 | **Technical Docs** — Excellent documentation, comprehensive | 5 | ✅ Met | 6 ADRs in [docs/ADR/](docs/ADR/) covering architecture style, frontend tech, backend tech, database, authentication, hosting. [README.md](README.md) includes tech stack table, all API endpoints, env variable reference, local setup, and deployment instructions. [docs/Architecture Connections.txt](docs/Architecture%20Connections.txt) maps needs to decisions. [docs/Database Schema Detail.txt](docs/Database%20Schema%20Detail.txt) provides full column-level schema. [CHANGELOG.md](CHANGELOG.md) tracks features per milestone. |
| 5 | **User Docs** — Professional user guide with screenshots | 4 | ✅ Met | [docs/user-guide.md](docs/user-guide.md) — 10-section guide with TOC covering browsing, registration, cart, checkout, order history, and full admin guide. [docs/screenshots/](docs/screenshots/) contains 12 annotated screenshots (Browse, Login, Register, Cart, Checkout, Order Confirmed, Order History, Admin Dashboard, etc.). Live URL provided at top of guide. |
| 6 | **AI Reflection** — Insightful reflection, specific examples, deep analysis | 3 | ✅ Met | [docs/ai-reflection.md](docs/ai-reflection.md) — ~3,000-word reflection covering per-milestone AI usage, specific debugging stories (zip deploy loop, SQLite factory bug), honest "what didn't work" section, productivity impact estimates (40–60% time savings), 5 concrete lessons learned, and quantitative stats (65% accepted / 35% corrected). Supported by [AI-USAGE.md](AI-USAGE.md) session log with exact prompts and outputs. |

**Total: 25 / 25**

## 3. Detailed Findings

All rubric items are met. No deficiencies to report.

## 4. Action Plan

No corrective actions required — full marks earned.

## 5. Code Quality Coaching (Non-Scoring)

- **ADR-006 drift**: [docs/ADR/ADR-006-Hosting.txt](docs/ADR/ADR-006-Hosting.txt) still references AWS (EC2, RDS, S3) as the hosting decision, but the actual deployment uses Azure (App Service, Azure SQL, Static Web Apps). Updating this ADR to reflect the final hosting choice (with a "Superseded" status on the original) would improve documentation accuracy.

- **Admin credentials in user guide**: [docs/user-guide.md](docs/user-guide.md#L186-L187) includes `admin@buckeyemarketplace.com / Admin123!` in plain text. In a production context, credentials should not be published in user-facing documentation. For a course project this is fine, but worth noting for professional practice.

- **Playwright test isolation**: [e2e/checkout.spec.ts](e2e/checkout.spec.ts) and [e2e/admin.spec.ts](e2e/admin.spec.ts) create users with timestamp-based emails but never clean them up. Over time this accumulates test accounts in the database. A `test.afterAll` hook or dedicated test database reset would improve test hygiene.

- **Security headers could be stronger**: [frontend/public/staticwebapp.config.json](frontend/public/staticwebapp.config.json) includes HSTS, X-Frame-Options, and X-Content-Type-Options — good. Adding `Content-Security-Policy` and `Referrer-Policy` headers would complete the security header set per OWASP recommendations.

## 6. Git Practices Coaching (Non-Scoring)

- **Deployment logs committed to repo**: The `api-logs-latest/` and `api-logs-out/` directories contain Azure deployment XML logs that should typically be in `.gitignore`. These add noise to the repository and could leak deployment infrastructure details.

- **Changelog not updated for M6**: [CHANGELOG.md](CHANGELOG.md) only covers through Milestone 5. Adding a `[Milestone 6]` section documenting deployment, CI/CD setup, and final documentation would complete the changelog.

---

**25/25** — All six rubric criteria met at the Excellent level. The project demonstrates a complete production deployment with automated CI/CD, comprehensive multi-level testing, thorough technical and user documentation, and an exceptionally reflective AI usage analysis. The coaching notes above (ADR drift, test isolation, security headers, changelog hygiene) are suggestions for professional growth, not scoring deductions.
