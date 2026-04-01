# amis4630-spring26-Mazur
AMIS 4630 Buckeye Marketplace Project
Table of Contents
# Summary
Buckeye Marketplace is a student-focused e-commerce platform designed to connect Ohio State students with peer-to-peer buying and selling opportunities. The platform aims to simplify the student experience by:
* Enabling students to quickly list and discover products and services.
* Providing secure and intuitive payment and messaging systems.
* Supporting university clubs, student organizations, and partner company listings to boost engagement on campus.
# Feature Prioritization 
Feature Prioritization is done through labels. Low, Medium, and High labels are attached to features matching the respective priority. Any feature labeled [launch requirement] has the highest priority.

## Kanban Board

| Backlog | In Progress | Done |
|---|---|---|
| Admin Dashboard | User Authentication (OAuth) | Product List Page |
| Seller Ratings & Reviews | Messaging System | Product Detail Page |
| Payment / Transactions | Search & Filtering | Static Product API (Demo) |
| Notifications | | |
| Club / Org Listings | | |
# Architecture Decisions
Overall Architecture Style
3-Tier Web Application Architecture (Frontend, Backend, Database)

Reasons:
* Separates concerns for UI, Business Logic, and Data
* Makes future scaling easier
* Industry standard for marketplace platforms (according to ChatGPT)
* Supports modular frontend foundation requirement

Frontend Technology
Use React

Reasons:
* Component-based architecture (ideal for listings, cards, forms)
* Fast UI updates for dynamic marketplace browsing
* Large ecosystem and strong documentation
* Aligns well with REST APIs

Backend Technology
Use Node.js with Express.js

Reasons:
* Lightweight and fast for REST APIs
* Same language as frontend (JavaScript)
* Easy integration with authentication and database layers

Database Technology
Use PostgreSQL

Reasons:
* Relational model fits ERD design (User, Listing, Order/Transaction, Review)
* Supports one-to-many and many-to-many relationships
* Strong data integrity
* Widely used in production systems

Authentication Strategy
OAuth (Google/OSU login)

Reasons:
* No new passwords
* Fast signup
* Trust & verification
OAuth:
* Reduces fake accounts
* Improves recruiter trust
* Speeds onboarding

Hosting
AWS

Reasons:
* Industry standard
* Scalable
* Supports EC2 (backend), RDS (database), S3 (images)
# AI Usage
USED PROMPTS for 2.System Architecture Diagram
* Could I use Draw.io to create a System Architecture Diagram?
* I need to create a System Architecture Diagram for Buckeye Marketplace. I'm working on Milestone 2. This milestone is focused on Architecture Design and Frontend Foundation.
* I'm also supposed to "Connect architecture decisions back to user needs from Milestone 1"

USED PROMPTS for 3.Database Schema Design
* I need to create a Database Schema Design using an Entity Relationship Diagram. I only need to create the main tables and relationships needed to support my prioritized features. The relationship mappings are one-to-many & many-to-many Do Not Include: Column-level details (data types, constraints) or worry about things like normalization at this stage. I need to Focus on the big picture of how data entities relate to each other and support my user stories. 
* I also need to explain how schema supports my user stories

USED PROMPTS for 4.Architecture Decision Records
* Architecture Decision Records 
* What technology should I use and why?

USED PROMPTS for 5.Component Architecture
* Component Architecture
* I need to use Atomic Design principles to create a component hierarchy. I need to scope the components to the Product Catalog feature for now to keep it simple

USED Prompt to generate sample summary of business system
* I need to make a summary of my business system

Milestone 3 Project Description
Milestone 3 adds a static list of products available for sale on Buckeye Marketplace.
This is temporary until later Milestones. Milestone 3 shows off what the marketplace may look like when it is finished.
To run this temporary DEMO, you must open a terminal to backend\api\products and run dotnet run to launch 
.NET API locally. You will open the REACT app in a separate terminal and run npm install > npm run dev to launch the React app.

MILESTONE 3 Prompts and Decisions

I used this prompt to generate an agent
(Follow instructions in create-agent.prompt.md.
This agent should create the following components
Frontend (React)
• Product List Page — a page displaying all available products as cards
• Product Detail Page — a page showing full details for a single product
• Client-side routing between the two pages using React Router
• API integration — all product data fetched from your .NET API, no hardcoded data in
components
Backend (.NET API)
• GET /api/products — returns all products as a JSON array
• GET /api/products/{id} — returns a single product by ID, or 404 if not found
• In-memory data store — a static list of at least 8 sample products in C#)

I used this prompt to build the backend and frontend. ("Build the complete backend and frontend for the product catalog")
I reviewed and accepted the changes it made.

I used the following prompt to get dotnet working.(Please change the framework for the backend to run on NETCore 10.0.3)

I used the following prompt to correct the product fields, so they would match the requirements.
I went through each file it modified to ensure the changes were satisfactory.
I need to include the following Product Fields in the API response and React components
id — unique identifier
• title — product name
• description — seller's description
• price — listed price (number)
• category — e.g., Textbooks, Electronics, Furniture, Clothing
• sellerName — display name of the seller
• postedDate — when the listing was created
• imageUrl — placeholder image URL is fine (e.g., from picsum.photos)

MILESTONE 4 Prompts and Decisions

STEP 1 — Cart State Management (Frontend)
Prompt: "Implement cart state management for the Buckeye Marketplace React frontend. Requirements: cart state managed with useReducer and Context API; Add to Cart from product listing and detail pages; update item quantity; remove individual items; clear entire cart; cart item count visible in navigation/header; cart totals calculated and displayed."

Generated and reviewed the following:
• CartContext.jsx — cartReducer handles ADD_TO_CART, UPDATE_QUANTITY, REMOVE_ITEM, CLEAR_CART; CartProvider exposes cart, addToCart, updateQuantity, removeItem, clearCart, itemCount, and cartTotal via useCart hook
• NavBar.jsx — persistent header with Buckeye branding; cart link displays live item count badge
• CartPage.jsx — full cart view with product thumbnail, quantity +/− controls, per-item subtotal, remove button, clear cart button, and grand total
• Updated App.jsx — wrapped app in CartProvider, added NavBar, added /cart route
• Updated ProductCard.jsx — "Add to Cart" button calls addToCart without navigating away
• Updated ProductDetailPage.jsx — "Add to Cart" button below product metadata
• Updated ProductListPage.jsx — removed redundant header/logos now handled by NavBar

No modifications were needed; generated code was accepted as-is after review.

STEP 2 — Cart API Endpoints (Backend)
Prompt: "Add cart API endpoints to the .NET backend. Requirements: GET /api/cart, POST /api/cart, PUT /api/cart/{cartItemId}, DELETE /api/cart/{cartItemId}, DELETE /api/cart/clear. Use a hardcoded user ID (to be replaced with auth in Milestone 5). Cart items should relate to products. Return proper HTTP status codes (200, 201, 400, 404)."

Generated and reviewed the following:
• Data/ProductStore.cs — shared static product list and Product record extracted here so both controllers can access them
• Controllers/CartController.cs — in-memory cart scoped to hardcoded user-001; POST increments quantity if product already in cart and returns 201 on new item; PUT updates quantity; DELETE /clear removes all user items; DELETE /{id} removes single item; 400 on invalid quantity, 404 on missing product or item
• Updated Controllers/ProductsController.cs — now references ProductStore.Products instead of its own static list

Build verified with dotnet build (exit code 0). No modifications were needed; generated code was accepted as-is after review.

STEP 3 — Database Persistence (Backend)
Prompt: "Add Entity Framework Core database persistence to the cart. Define Cart and CartItem entities with navigation properties, create a migration for the cart tables, and make cart data persist across page refreshes and browser sessions. Use SQLite. Apply migrations automatically on startup."

Generated and reviewed the following:
• NuGet packages added: Microsoft.EntityFrameworkCore.Sqlite, .Design, and .Tools (v9.0.3)
• Models/CartEntity.cs — CartEntity (Id, UserId, Items nav property) and CartItemEntity (Id, CartId, ProductId, Quantity, Title, Price, ImageUrl) with Cart → CartItem relationship
• Data/AppDbContext.cs — EF DbContext with Carts and CartItems DbSets; cascade delete on Cart → Items; decimal stored as TEXT for SQLite compatibility
• Data/Migrations/InitCart — migration that creates Carts and CartItems tables
• Updated Program.cs — registers AppDbContext with SQLite (buckeye_marketplace.db); calls db.Database.Migrate() on startup to apply migrations automatically
• Updated Controllers/CartController.cs — replaced static in-memory list with AppDbContext; all endpoints are async; GetOrCreateCartAsync finds or creates the cart row for user-001
• Updated CartContext.jsx — added SET_CART action to cartReducer; useEffect on mount fetches GET /api/cart to populate reducer; all mutations call the API then dispatch into the reducer so useReducer remains the UI state manager while SQLite provides persistence

Modifications made: CartContext was revised to restore useReducer (keeping cartReducer) while adding API-backed persistence, rather than switching to useState. A SET_CART action seeds the reducer from the backend on mount.

Seed Data / Test Scenarios:
• 10 sample products are pre-loaded in ProductStore.cs (Textbooks, Electronics, Clothing, Furniture categories)
• Test scenario 1 — Add item: Start the API (dotnet run), open the React app, click "Add to Cart" on any product, navigate to /cart and confirm the item appears
• Test scenario 2 — Persistence: With items in the cart, refresh the browser page — cart items reload from the SQLite database via GET /api/cart on mount
• Test scenario 3 — Quantity update: In /cart, click + or − to change quantity, confirm the count updates and the subtotal recalculates
• Test scenario 4 — Remove item: Click Remove on a cart item, confirm it disappears from the UI and is deleted from the DB
• Test scenario 5 — Clear cart: Click "Clear Cart", confirm all items are removed from the UI and GET /api/cart returns an empty array

STEP 4 — Frontend-Backend Integration
Prompt: "Complete the frontend-backend integration for the Buckeye Marketplace. Requirements: product catalog pulls from real API with no mock data; cart operations call backend API; useEffect and fetch for all cart API calls; optimistic UI updates where appropriate; cart state synchronized between frontend and backend."

Generated and reviewed the following:
• Updated CartContext.jsx — updateQuantity, removeItem, and clearCart now dispatch to the reducer optimistically (UI updates instantly) then call the API; if the API call fails, re-fetch from GET /api/cart and SET_CART reverts to server state; removed unused variable from addToCart
• Updated ProductCard.jsx — handleAddToCart is async; awaits addToCart before showing "✓ Added!" feedback; button turns green and disables for 1.5s to prevent double-adds
• Updated ProductDetailPage.jsx — same optimistic feedback pattern; button shows "✓ Added to Cart!" for 1.5s after a successful add

No mock data exists anywhere in the frontend — product catalog and cart have been fully API-backed since earlier steps. No modifications were needed beyond the additions above.

STEP 5 — Error Handling, UX Polish & Stock Enforcement
Prompt: "Add comprehensive error handling and UX improvements to the Buckeye Marketplace cart. Requirements: loading and error states for cart fetches; empty cart state with call-to-action; remove/clear success notifications; button feedback for failed add attempts; addToCart should return a boolean to indicate success or failure."

Generated and reviewed the following:
• Updated CartContext.jsx — added cartLoading (useState(true)) and cartError (useState(null)); exposed both via context; addToCart now returns true on success, false on failure
• Updated CartPage.jsx — shows "Loading your cart..." spinner during fetch; shows red error banner with message on API failure; styled empty state with cart icon, description, and "Browse Products" button; remove and clear actions show a green success notification for 2.5s; notification uses showNotification() helper
• Updated ProductCard.jsx — handleAddToCart checks boolean return from addToCart; on failure shows "⚠ Could not add" in grey for 2.5s
• Updated ProductDetailPage.jsx — same failure feedback pattern; shows "⚠ Could not add to cart" on failure

Stock feature (added during Step 5):
Prompt: "Add out-of-stock and limited stock product awareness. Some products should have stock = 0 (out of stock) and some should have limited stock (e.g. 5 remaining). The backend should block adding out-of-stock items. The frontend should show badges and disable the add button for out-of-stock items."

Generated and reviewed the following:
• Updated ProductStore.cs — added Stock field to Product record; Mini Fridge (id=3) set to Stock=0, AirPods Pro Gen 2 (id=8) set to Stock=5, all others set to Stock=10
• Updated CartItemEntity.cs — added Stock property to CartItemEntity so the stock limit is stored with each cart item
• Updated CartController.cs — POST /api/cart returns 400 if product.Stock == 0; returns 400 with remaining count if existing.Quantity + request.Quantity > product.Stock; PUT /api/cart/{id} returns 400 if request.Quantity > item.Stock; Stock stored on CartItemEntity at creation; returned in ToDto
• Created migration AddStockToCartItem — adds Stock column to CartItems table
• Updated ProductCard.jsx — shows "Out of Stock" badge (grey) when stock==0; shows "Only N left!" badge (orange) when 0 < stock <= 5; Add to Cart button disabled and greyed when stock==0 or cart is at stock limit; shows "Max in Cart" label
• Updated ProductDetailPage.jsx — shows "⚠ Out of Stock" message when stock==0; shows "⚡ Only N left" urgency message when 0 < stock <= 5; button disabled when out of stock

Quantity picker feature (added during Step 5):
Prompt: "Each product should have + and - buttons to allow for adjusting the amount to add to cart before selecting "Add to Cart". This needs to be limited by out of stock and limited inventory."

Generated and reviewed the following:
• Updated CartContext.jsx — addToCart(product, quantity = 1) now accepts a quantity parameter and passes it to POST /api/cart
• Updated ProductCard.jsx — added qty state (default 1); added −/+ picker row shown when product is in stock and not at cart limit; + disabled when qty >= maxAddable (stock − cartQty); − disabled when qty <= 1; picker hidden when out of stock or cart is already at the stock limit; qty resets to 1 after a successful add
• Updated ProductDetailPage.jsx — same quantity picker with a "Quantity:" label; picker hidden when out of stock or cart is maxed; isMaxed computed from product.stock − cartQty

STEP 6 — Code Quality
Prompt: "Refactor the frontend for code quality. Requirements: clean component structure (CartPage, CartItem, CartSummary); separation of concerns with API calls in a service layer and data-fetching in custom hooks; consistent naming and coding patterns throughout."

Generated and reviewed the following:
• Created src/services/cartApi.js — service module exporting getCart, addCartItem, updateCartItem, removeCartItem, clearCartItems; all cart fetch calls centralized here with no raw fetch calls remaining in CartContext
• Created src/services/productApi.js — service module exporting getProducts and getProduct; all product fetch calls centralized here
• Created src/hooks/useProducts.js — custom hook encapsulating product list fetch, loading, and error state; ProductListPage now calls useProducts() instead of managing useEffect/useState directly
• Created src/hooks/useProduct.js — custom hook encapsulating single product fetch with 404 and error handling; ProductDetailPage now calls useProduct(id) instead of managing useEffect/useState directly
• Created src/components/CartItem.jsx — isolated component for a single cart row; renders thumbnail, title, unit price, quantity controls (with stock limit enforcement), subtotal, and remove button
• Created src/components/CartSummary.jsx — isolated component for the cart footer; renders total price and Clear Cart button
• Updated CartContext.jsx — replaced all inline fetch calls with imported service functions; logic and state management unchanged
• Updated CartPage.jsx — replaced inline item rows with CartItem, replaced inline footer with CartSummary; removed styles that moved to sub-components
• Updated ProductListPage.jsx — removed useState/useEffect/fetch boilerplate; replaced with useProducts() hook
• Updated ProductDetailPage.jsx — removed useState/useEffect/fetch boilerplate for product loading; replaced with useProduct(id) hook