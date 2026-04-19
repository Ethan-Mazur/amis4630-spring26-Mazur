# Lab Evaluation Report

**Student Repository**: `amis4630-spring26-Mazur`  
**Date**: April 19, 2026  
**Rubric**: rubric.md

## 1. Build & Run Status

| Component           | Build | Runs | Notes                                                                            |
| ------------------- | ----- | ---- | -------------------------------------------------------------------------------- |
| Backend (.NET)      | ✅    | ✅   | `dotnet build` succeeded. Server starts on http://localhost:5000.                |
| Frontend (React/TS) | ✅    | ✅   | `vite build` succeeded (44 modules). Dev server starts on http://localhost:5173. |
| API Endpoints       | —     | ✅   | See details below.                                                               |

**API Endpoint Tests:**

| Endpoint                | HTTP Status | Result                                                                           |
| ----------------------- | ----------- | -------------------------------------------------------------------------------- |
| `GET /api/products`     | 200         | Returns JSON array of 10 products with correct shape.                            |
| `GET /api/products/1`   | 200         | Returns single product JSON with all fields (title, category, sellerName, etc.). |
| `GET /api/products/999` | 404         | Returns 404 as expected for unknown ID.                                          |

### Project Structure Comparison

| Expected    | Found       | Status |
| ----------- | ----------- | ------ |
| `/backend`  | `/backend`  | ✅     |
| `/frontend` | `/frontend` | ✅     |
| `/docs`     | `/docs`     | ✅     |

## 2. Rubric Scorecard

| #   | Requirement                          | Points | Status | Evidence                                                                                                                                                                                                                                                                   |
| --- | ------------------------------------ | ------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | React Product List Page              | 5      | ✅ Met | `ProductListPage.jsx` — displays products via grid of `ProductCard` components; handles loading ("Loading products..."), error, and empty states (L7-9). Component hierarchy uses `ProductCard` atoms.                                                                     |
| 2   | React Product Detail Page            | 5      | ✅ Met | `ProductDetailPage.jsx` — separate route at `/products/:id` (App.jsx L17); shows all fields (title, price, description, category, seller, posted date, image); "← Back to Products" link for list↔detail navigation; handles 404/notFound state (L39-43).                  |
| 3   | API Endpoint: GET /api/products      | 5      | ✅ Met | `ProductsController.cs` L11 — returns `Ok(ProductStore.Products)` (200 JSON array). In-memory data store defined in `ProductStore.cs` with 10 seed products. Verified live: status 200, count 10, correct JSON shape.                                                      |
| 4   | API Endpoint: GET /api/products/{id} | 5      | ✅ Met | `ProductsController.cs` L13-18 — looks up by ID with `FirstOrDefault`, returns `Ok(product)` or `NotFound()`. Verified live: `/api/products/1` → 200, `/api/products/999` → 404.                                                                                           |
| 5   | Frontend-to-API Integration          | 5      | ✅ Met | `productApi.js` — fetches from `http://localhost:5000/api/products`. `useProducts.js` hook manages loading/error state. `useProduct.js` handles 404 responses. No hardcoded product data in components. Error states handled in both list page (L8) and detail page (L45). |

**Total: 25 / 25**

## 3. Detailed Findings

All rubric items are met. No deficiencies to report.

## 4. Action Plan

No corrective actions required — full marks earned.

## 5. Code Quality Coaching (Non-Scoring)

- **Inline styles throughout**: `ProductListPage.jsx`, `ProductDetailPage.jsx`, `ProductCard.jsx`, `NavBar.jsx` — all components use large inline style objects. Consider extracting to CSS modules or a styling library for better maintainability and separation of concerns.

- **API base URL hardcoded**: `productApi.js` L1 — `const API_BASE = 'http://localhost:5000'` is hardcoded. Use an environment variable (e.g., `import.meta.env.VITE_API_URL`) so the URL can change between development and production without code changes.

- **Target framework mismatch with EF Core packages**: `ProductsApi.csproj` — targets `net10.0` but uses EF Core 9.0.3 packages. While this works, keeping the SDK and package versions aligned avoids potential compatibility issues.

- **getProduct returns raw Response**: `productApi.js` L9-10 — `getProduct()` returns the raw `fetch` Response object while `getProducts()` returns parsed JSON. Inconsistent API service contracts make the service layer harder to reason about.

## 6. Git Practices Coaching (Non-Scoring)

- **Meaningful commit messages**: Commit messages like "Frontend-Backend Integration completed" and "Error Handling integrated & UX updated" describe what was done. Consider adding a short "why" to commit messages for better context (e.g., "Integrate frontend with API to satisfy M3 requirements").

- **Incremental development**: Work was broken across multiple commits (seed data, integration, error handling, cleanup). This is good practice. A few duplicate commits (d5bd4d2/6094d48, ae2c654/f1d02d8) suggest some merge confusion — learning to rebase or squash before merging would clean this up.

- **Merge commits present**: The history includes merge commits from pulling. Consider using `git pull --rebase` for a cleaner linear history on a solo project.

---

**25/25** — All milestone 3 requirements are fully met. The coaching notes above (inline styles, hardcoded API URL, EF Core version alignment, inconsistent service contracts, git hygiene) are suggestions for professional growth, not scoring deductions.
