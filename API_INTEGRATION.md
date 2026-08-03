# GearUp Frontend - API Integration Documentation 🏋️

This document maps all frontend components, pages, and interactive flows to their corresponding REST API endpoints consumed from the deployed backend service:
**Base URL:** `https://backend-gear-up-prisma-stripe.vercel.app/api/v1`

---

## 🔑 1. Authentication Module

| Frontend Route / Component | Backend Endpoint | HTTP Method | Auth Required | Description |
|----------------------------|------------------|-------------|---------------|-------------|
| `app/login/page.tsx` | `/auth/login` | `POST` | No | Authenticates user (Customer/Provider/Admin) & receives JWT Access Token. |
| `app/register/page.tsx` | `/auth/register` | `POST` | No | Registers a new Customer or Provider account with Zod validation. |
| `src/components/providers/AuthProvider.tsx` | `/auth/me` | `GET` | Yes (Bearer) | Fetches the authenticated user profile & verifies token validity. |

---

## 🎒 2. Categories Module

| Frontend Route / Component | Backend Endpoint | HTTP Method | Auth Required | Description |
|----------------------------|------------------|-------------|---------------|-------------|
| `app/page.tsx` (Showcase) | `/categories` | `GET` | No | Fetches list of gear categories for home page showcase. |
| `app/gear/page.tsx` (Filter) | `/categories` | `GET` | No | Populates category filter sidebar dropdowns. |
| `app/dashboard/admin/page.tsx` | `/categories` | `POST` | Admin | Creates a new gear category (e.g. "Climbing & Trekking"). |

---

## 🚴 3. Gear Inventory Module

| Frontend Route / Component | Backend Endpoint | HTTP Method | Auth Required | Description |
|----------------------------|------------------|-------------|---------------|-------------|
| `app/gear/page.tsx` | `/gear` | `GET` | No | Fetches paginated gear list with query parameters (`searchTerm`, `minPrice`, `maxPrice`, `page`, `limit`). |
| `app/gear/[id]/page.tsx` | `/gear/:id` | `GET` | No | Fetches single gear specifications, image gallery, provider info, and availability. |
| `app/dashboard/provider/page.tsx` | `/gear` | `POST` | Provider/Admin | Creates a new gear listing with stock and daily rental rate. |

---

## 🛒 4. Rental Orders Module

| Frontend Route / Component | Backend Endpoint | HTTP Method | Auth Required | Description |
|----------------------------|------------------|-------------|---------------|-------------|
| `app/gear/[id]/page.tsx` (Rent Now Box) | `/orders` | `POST` | Customer | Places a new rental order with start date, end date, and gear ID. |
| `app/dashboard/customer/page.tsx` | `/orders/my-orders` | `GET` | Customer | Fetches customer's rental history with real-time status badges. |
| `app/dashboard/provider/page.tsx` | `/orders/:id/status` | `PATCH` | Provider/Admin | Updates rental order status (`CONFIRMED`, `PICKED_UP`, `RETURNED`, `CANCELLED`). |

---

## 💳 5. Payment Gateway Module

| Frontend Route / Component | Backend Endpoint | HTTP Method | Auth Required | Description |
|----------------------------|------------------|-------------|---------------|-------------|
| `app/checkout/[orderId]/page.tsx` | `/payments/create-checkout-session` | `POST` | Customer | Creates Stripe PaymentIntent session & returns client secret. |
| `app/payment/success/page.tsx` | `/payments/verify` | `POST` | Customer | Verifies transaction ID with Stripe and updates order status to `PAID` & `CONFIRMED`. |
| `app/dashboard/customer/page.tsx` | `/payments/history` | `GET` | Customer/Admin | Displays completed payment receipt table. |

---

## ⭐ 6. Reviews Module

| Frontend Route / Component | Backend Endpoint | HTTP Method | Auth Required | Description |
|----------------------------|------------------|-------------|---------------|-------------|
| `app/dashboard/customer/page.tsx` (Modal) | `/reviews` | `POST` | Customer | Submits star rating and feedback comment for returned equipment. |
| `app/gear/[id]/page.tsx` | Embedded in `/gear/:id` | `GET` | No | Displays reviews left by previous customer renters. |

---

## 👥 7. User Management Module

| Frontend Route / Component | Backend Endpoint | HTTP Method | Auth Required | Description |
|----------------------------|------------------|-------------|---------------|-------------|
| `app/dashboard/admin/page.tsx` | `/users` | `GET` | Admin | Fetches list of all platform users (Customers, Providers, Admins). |
| `app/dashboard/admin/page.tsx` | `/users/:id` | `PATCH` | Admin | Updates user moderation status (toggles between `ACTIVE` and `SUSPENDED`). |
