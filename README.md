# GearUp Frontend - Rent Sports & Outdoor Gear Instantly 🏋️

[![Next.js 15](https://img.shields.io/badge/Next.js-15.1.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Stripe Payment](https://img.shields.io/badge/Stripe-Checkout_&_Elements-635bff?style=for-the-badge&logo=stripe)](https://stripe.com/)

**GearUp** is a modern, responsive Next.js 15 application for a peer-to-peer sports and outdoor equipment rental platform. Customers can explore available gear, pick dynamic rental dates, calculate total costs in real-time, and complete secure payments via Stripe. Providers manage equipment inventory and fulfill orders, while Admins oversee platform users, statistics, and category indexing.

---

## 🚀 Live Demo & Links

- **Repository**: [https://github.com/m-d-Irfan/Frontend_Gear_up_prisma_Stripe](https://github.com/m-d-Irfan/Frontend_Gear_up_prisma_Stripe)
- **Backend Base API URL**: `https://backend-gear-up-prisma-stripe.vercel.app/api/v1`

---

## 🔑 Seed Test Credentials (For Grading & Testing)

You can use the following pre-seeded test accounts to explore the role-specific dashboards and exciting features:

| Role | Email Address | Password | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **👑 Admin** | `admin@gearup.com` | `Admin123!` | Moderate platform users, oversee analytics, manage & create gear categories. |
| **🏕️ Provider** | `provider@gearup.com` | `Provider123!` | Create & edit equipment inventory, fulfill incoming orders, update rental status. |
| **🚴 Customer** | `customer@gearup.com` | `Customer123!` | Rent equipment, complete Stripe checkout payments, leave reviews, track order history. |

---

## ✨ Features & Architecture

### 🌐 1. Public Exploration & Discovery
- **Responsive Gear Catalog**: Equipment cards displaying optimized images (`next/image`), price/day, location badges, and stock availability badges.
- **Advanced Real-Time Filtering**: Search keywords, category selector dropdowns, equipment brand inputs, date availability pickers, max price range sliders, and stock toggles with live URL query param synchronization (`useSearchParams`).
- **Gear Details & Reviews**: Full specifications, verified provider credentials, average star rating, and customer feedback comments.

### 🔐 2. Authentication & Middleware Security
- **Zod & React Hook Form**: Client-side validation for email, password length, and role selection (`CUSTOMER` vs `PROVIDER`).
- **Persistent Session Sync**: Zustand state store (`useAuthStore`) synced with HTTP `accessToken` cookies and `localStorage`.
- **Next.js Edge Middleware**: Route protection for `/dashboard/*` with role-based redirects for `CUSTOMER`, `PROVIDER`, and `ADMIN` roles.

### 💳 3. Rental Order & Stripe Payment Flow
- **Dynamic Rental Calculator**: Real-time date range picker computing duration (`totalDays`) and total cost (`totalPrice = days * pricePerDay`) with inline date validation.
- **Stripe Integration**: Single-page embedded Stripe Checkout & Elements session on `/checkout/[orderId]` (`POST /payments/create-checkout-session`), returning client secret and callback verification (`POST /payments/verify`) on `/payment/success`.
  > *Architecture Note*: Implemented embedded Stripe Elements checkout on `/checkout/[orderId]` to ensure a single-page user flow without leaving the app domain, fully integrated with backend Stripe session endpoints.

### 📊 4. Role-Based Dashboards
- **Customer Dashboard**: Rental order history with status badges (`PENDING`, `CONFIRMED`, `PICKED_UP`, `RETURNED`, `CANCELLED`), payment receipts table, and Leave Review modal.
- **Provider Dashboard**: Equipment listing creation modal (`POST /gear`) and order fulfillment table with status transition dropdown controls (`PATCH /orders/:id/status`).
- **Admin Dashboard**: Global platform analytics cards, user moderation table (`ACTIVE` vs `SUSPENDED`), and Category Manager modal (`POST /categories`).

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Server components & Client Components, Edge Middleware)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4, Glassmorphism design tokens, Lucide React Icons
- **State Management**: Zustand
- **HTTP Client**: Axios with request authorization interceptors and `sonner` toast notifications
- **Forms & Validation**: React Hook Form + Zod Schema Resolver
- **Payment Gateway**: `@stripe/stripe-js` & `@stripe/react-stripe-js`

---

## 📂 Folder Structure Overview

```text
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── checkout/[orderId]/page.tsx
│   │   ├── dashboard/
│   │   │   ├── admin/page.tsx
│   │   │   ├── customer/page.tsx
│   │   │   └── provider/page.tsx
│   │   ├── gear/
│   │   │   ├── [id]/page.tsx
│   │   │   └── page.tsx
│   │   ├── payment/
│   │   │   ├── cancel/page.tsx
│   │   │   └── success/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── AddCategoryModal.tsx
│   │   │   ├── AddGearModal.tsx
│   │   │   └── WriteReviewModal.tsx
│   │   ├── gear/
│   │   │   ├── GearCard.tsx
│   │   │   └── RentalCalculator.tsx
│   │   ├── providers/
│   │   │   └── AuthProvider.tsx
│   │   ├── shared/
│   │   │   ├── Footer.tsx
│   │   │   └── Navbar.tsx
│   │   └── ui/
│   │       ├── Badge.tsx
│   │       ├── LoadingSkeleton.tsx
│   │       └── Modal.tsx
│   ├── lib/
│   │   └── axios.ts
│   ├── store/
│   │   └── useAuthStore.ts
│   ├── types/
│   │   └── index.ts
│   └── middleware.ts
├── API_INTEGRATION.md
├── implementation_plan.md
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## ⚙️ Getting Started Locally

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/m-d-Irfan/Frontend_Gear_up_prisma_Stripe.git
cd Frontend_Gear_up_prisma_Stripe
npm install
```

### 2. Environment Variables Setup
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=https://backend-gear-up-prisma-stripe.vercel.app/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 License
This project is open-source under the MIT License.
