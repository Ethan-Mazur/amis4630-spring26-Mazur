# Buckeye Marketplace — User Guide

**Live Application:** https://calm-sky-0d7181d1e.7.azurestaticapps.net

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Browsing Products](#2-browsing-products)
3. [Creating an Account](#3-creating-an-account)
4. [Signing In](#4-signing-in)
5. [Adding Items to Your Cart](#5-adding-items-to-your-cart)
6. [Managing Your Cart](#6-managing-your-cart)
7. [Placing an Order](#7-placing-an-order)
8. [Viewing Your Order History](#8-viewing-your-order-history)
9. [Admin Guide — Managing Products](#9-admin-guide--managing-products)
10. [Admin Guide — Managing Orders](#10-admin-guide--managing-orders)

---

## 1. Getting Started

Open your browser and navigate to:

**https://calm-sky-0d7181d1e.7.azurestaticapps.net**

You will land on the **Product List** page, which shows all available listings. No account is required to browse.

---

## 2. Browsing Products

### Product List Page

The main page displays all available products as cards. Each card shows:

- Product image
- Title and seller name
- Price
- Category badge
- Stock availability (e.g., "Only 5 left!" or "Out of Stock")

### Filtering by Category

Use the category buttons at the top of the product list to filter by:
- **All** — show every listing
- **Textbooks**
- **Electronics**
- **Clothing**
- **Furniture**

### Viewing Product Details

Click any product card (or the product title) to open the **Product Detail Page**. This page shows:

- Full product description
- Price and seller name
- Stock status
- Quantity selector (if in stock)
- **Add to Cart** button

---

## 3. Creating an Account

To add items to your cart and place orders, you need a Buckeye Marketplace account.

1. Click **Register** in the navigation bar at the top of the page.
2. Fill in the registration form:
   - **Display Name** — the name shown on your profile
   - **Email** — must be a valid email address (used to sign in)
   - **Password** — must be at least 8 characters, contain at least one uppercase letter, and at least one digit
   - **Confirm Password** — must match the password field
3. Click **Create Account**.
4. On success, you are automatically signed in and redirected to the home page. Your display name appears in the navigation bar.

**Password requirements:**
- Minimum 8 characters
- At least one uppercase letter (A–Z)
- At least one digit (0–9)

---

## 4. Signing In

If you already have an account:

1. Click **Sign In** in the navigation bar.
2. Enter your **Email** and **Password**.
3. Click **Sign In**.
4. On success, your display name appears in the navigation bar and you are returned to the page you were on.

**Forgot your password?** Password reset is not currently supported. Contact the site administrator at admin@buckeyemarketplace.com.

---

## 5. Adding Items to Your Cart

You must be signed in to add items to your cart.

### From the Product List

1. On the product list page, locate the item you want.
2. Use the **−** and **+** buttons to select a quantity (if the product is in stock).
3. Click **Add to Cart**.
4. The button briefly turns green with "✓ Added!" to confirm the item was added.
5. The cart count in the navigation bar updates immediately.

### From the Product Detail Page

1. Click a product to open its detail page.
2. Use the quantity picker to choose how many you want.
3. Click **Add to Cart**.

**Stock limits:** You cannot add more items than are in stock. The **+** button disables when you reach the available quantity.

**Out of Stock:** Items showing "Out of Stock" cannot be added to the cart. The Add to Cart button is disabled.

---

## 6. Managing Your Cart

Click the **Cart** link in the navigation bar (shows the item count) to open your cart.

### Cart Page Features

| Action | How |
|--------|-----|
| Change quantity | Click **−** or **+** next to an item |
| Remove one item | Click **Remove** next to the item |
| Clear entire cart | Click **Clear Cart** at the bottom |
| See order total | Displayed at the bottom right |

The cart automatically saves to your account — your items will still be there if you close the browser and return later (as long as you sign back in).

When you are ready to buy, click **Checkout** at the bottom of the cart page.

---

## 7. Placing an Order

1. From the Cart page, click **Checkout**.
2. Review your cart summary on the left side of the checkout page.
3. Fill in your **Shipping Address**:
   - Street Address
   - City
   - State
   - ZIP Code
4. Click **Place Order**.
5. You are taken to the **Order Confirmation** page, which shows:
   - Your confirmation number (format: `BM-XXXXXXXX`)
   - A list of items ordered with quantities and prices
   - Your total and shipping address
   - Order status: **Pending**

Save your confirmation number for your records.

---

## 8. Viewing Your Order History

1. Click **My Orders** in the navigation bar (only visible when signed in).
2. The Order History page lists all your past orders, showing:
   - Confirmation number
   - Date placed
   - Items and quantities
   - Order total
   - Current status

### Order Statuses

| Status | Meaning |
|--------|---------|
| **Pending** | Order received, not yet processed |
| **Processing** | Seller is preparing your order |
| **Shipped** | Order is on its way |
| **Delivered** | Order has been delivered |

---

## 9. Admin Guide — Managing Products

> This section is for administrators only. The Admin link only appears in the navigation bar when you are signed in with an admin account.

**Admin credentials:**
- Email: `admin@buckeyemarketplace.com`
- Password: `Admin123!`

### Accessing the Admin Dashboard

1. Sign in with the admin account.
2. Click **Admin** in the navigation bar.
3. The Admin Dashboard opens on the **Products** tab by default.

### Adding a New Product

1. On the Products tab, fill in the **Add New Product** form at the top:
   - **Title** — product name
   - **Description** — seller's description of the item
   - **Price** — listed price (numbers only, e.g. `29.99`)
   - **Category** — select from Textbooks, Electronics, Clothing, or Furniture
   - **Seller Name** — name to display on the listing
   - **Stock** — number of units available
   - **Image URL** — link to a product image (e.g. from picsum.photos)
2. Click **Add Product**.
3. The new product appears in the product list immediately.

### Editing a Product

1. Find the product in the product table on the Products tab.
2. Click **Edit** next to the product.
3. The form at the top populates with the product's current values.
4. Make your changes.
5. Click **Update Product** to save.

### Deleting a Product

1. Find the product in the product table.
2. Click **Delete** next to the product.
3. The product is removed immediately from the marketplace.

> **Note:** Deleting a product does not remove it from existing orders. Order history is preserved.

---

## 10. Admin Guide — Managing Orders

### Viewing All Orders

1. From the Admin Dashboard, click the **Orders** tab.
2. All orders from all customers are displayed, showing:
   - Confirmation number
   - Customer email
   - Items ordered
   - Total
   - Current status

### Updating an Order Status

1. Find the order in the orders table.
2. In the **Status** column, select a new status from the dropdown:
   - Pending
   - Processing
   - Shipped
   - Delivered
3. Click **Update** next to the order.
4. The status updates immediately and the customer will see the new status in their Order History.

---

*Buckeye Marketplace — AMIS 4630, Spring 2026*
