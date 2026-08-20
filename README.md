# GrabGear (GearUp) - Peer-to-Peer Sports & Outdoor Equipment Rental Platform 🏋️🏕️

[![Next.js 15](https://img.shields.io/badge/Next.js-15.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Stripe Payment](https://img.shields.io/badge/Stripe-Checkout_&_Elements-635bff?style=for-the-badge&logo=stripe)](https://stripe.com/)
[![Zustand](https://img.shields.io/badge/Zustand-v5.0-443e38?style=for-the-badge)](https://github.com/pmndrs/zustand)

**GrabGear** (Assignment 5) is a full-stack, responsive **Next.js 15** peer-to-peer sports and outdoor equipment rental application. It bridges the gap between outdoor enthusiasts and gear owners across Bangladesh (Dhaka, Chittagong, Sylhet, Cox's Bazar, etc.). 

Customers can explore verified equipment, calculate rental duration and tiered costs in real-time in Bangladeshi Taka (**৳ BDT**), and pay securely via **Stripe**. Equipment Providers can manage listings, upload compressed images, and fulfill incoming orders. Platform Administrators have complete oversight over platform analytics, category taxonomies, and user moderation.

---

## 🚀 Live Demo & Links

- **Frontend Repository**: [https://github.com/m-d-Irfan/Frontend_Gear_up_prisma_Stripe](https://github.com/m-d-Irfan/Frontend_Gear_up_prisma_Stripe)
- **Live Backend API**: `https://backend-gear-up-prisma-stripe.vercel.app/api/v1`
- **Frontend Live Deployment**: Hosted on Vercel

---

## 🔑 Pre-Seeded Test Accounts (For Grading & Testing)

The application supports both custom registration and 1-click pre-seeded accounts (accessible on `/login` for instant testing):

| Role | Email Address | Password | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **👑 Admin** | `admin@gearup.com` | `Admin123!` | System analytics, 6-month revenue trends, category manager, user moderation (`ACTIVE` / `SUSPENDED`). |
| **🏕️ Provider** | `provider@gearup.com` | `Provider123!` | Add & edit gear with image upload, adjust stock, manage order fulfillment status (`PENDING` → `CONFIRMED` → `PICKED_UP` → `RETURNED`). |
| **🚴 Customer** | `customer@gearup.com` | `Customer123!` | Rent equipment, calculate tiered pricing, complete Stripe checkout, view order history, submit gear reviews. |

---

## ✨ Key Features & Architectural Highlights

### 1. 🌐 Hybrid SSR & React Context Data Architecture
- **Root Layout Hydration (`fetchGlobalAppData`)**: Server-Side Renders initial categories, gear items, locations, and platform metrics in `layout.tsx` for optimal SEO and initial page performance.
- **Global Context Provider (`AppDataContext`)**: Eliminates redundant network calls by caching catalog items and categories in client memory with real-time mutation updates.

### 2. 🔍 Advanced Equipment Catalog & Dynamic Discovery (`/gear`)
- **Multi-Filter Faceting**: Search by keyword, category selector, brand filter, location picker across Bangladesh divisions, price range slider (in ৳ BDT), and in-stock toggle.
- **Live URL Query Sync**: Seamless synchronization of filter state with browser search parameters (`useSearchParams` & Next.js router) for shareable, bookmarkable search results.
- **Dual View Modes**: Switch between responsive Grid Cards and Detailed List View.

### 3. 💳 Smart Rental Calculator & Stripe Payment Flow
- **Tiered Pricing Engine (`RentalCalculator.tsx`)**:
  - Automatically calculates rental days from start and end dates with date validation and timezone-safe parsing.
  - Computes `Day 1 Rate (৳)` + `Additional Days (৳ at 60% discounted rate)` to provide total pricing.
- **Stripe Checkout & Elements (`/checkout/[orderId]`)**:
  - Initiates payment sessions with backend (`POST /payments/create-checkout-session`) in **BDT (`৳`)**.
  - Provides callback handling on `/payment/success` and `/payment/cancel`.
  - Offline / Sandbox fallback support for seamless testing without gateway downtime.
- **Payment & Order Synchronization**:
  - Confirmed Stripe payments immediately update order state to `PAID` & `CONFIRMED` in both the **Customer Dashboard** and **Provider Dashboard**.

### 4. 📊 Multi-Role Responsive Dashboards (`/dashboard/*`)
- **🚴 Customer Dashboard (`/dashboard/customer`)**:
  - View current and past rental bookings with status badges (`PENDING`, `CONFIRMED`, `PICKED_UP`, `RETURNED`, `CANCELLED`).
  - Total Invested spending calculation and payment receipts.
  - Interactive Review Modal (`WriteReviewModal.tsx`) with 5-star ratings and written feedback.
- **🏕️ Provider Dashboard (`/dashboard/provider`)**:
  - Add & edit gear with live client-side image compression (`ImageUpload.tsx` / `imageCompressor.ts`).
  - Incoming customer order table with status transition dropdown selector (`PATCH /orders/:id/status`).
  - Inventory stock management, delete controls, and provider revenue tracking.
- **👑 Admin Dashboard (`/dashboard/admin`)**:
  - Real-time business analytics and 6-month gross revenue trajectory charts (`AnalyticsCharts.tsx`).
  - User management table with one-click status toggling (`ACTIVE` vs. `SUSPENDED`).
  - Category manager modal for adding and updating equipment classifications.

### 5. 🔐 Authentication, Middleware & Security
- **Next.js Edge Middleware (`middleware.ts`)**:
  - Intercepts `/dashboard/*` routes and decodes JWT payloads from cookies.
  - Automatically redirects unauthorized visitors to `/login?callbackUrl=...` and prevents cross-role access (e.g., Customers accessing Admin dashboard).
- **Zod & React Hook Form**: Strict validation on login, multi-step registration (with password strength rules), gear creation, and review submissions.
- **Axios Interceptor (`src/lib/axios.ts`)**: Automatically injects JWT Bearer tokens from `localStorage` into all API requests and gracefully handles session expiry.

### 6. 🎨 Modern Design System & Theme Engine
- **Tailwind CSS v4**: Glassmorphism design tokens, subtle gradients, and sleek dark mode palette.
- **Theme Switching**: Dark / Light mode toggle with zero-flicker script in root `<head>`.
- **Dynamic Micro-Animations**:
  - `ScrollReveal.tsx` for scroll-triggered card and section animations.
  - Dynamic count-up counter on `/about` (`useCountUp` hook).
  - Hover zoom effects and responsive mobile drawer navigation.

---

## 🛠️ Tech Stack & Dependencies

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15.2.0 (App Router)** | Hybrid Server & Client Components, Edge Middleware, File-based Routing |
| **UI Library** | **React 19.0.0** | Core component rendering engine |
| **Language** | **TypeScript 5.7.3** | Strict type safety across models, API responses, and components |
| **Styling** | **Tailwind CSS v4.0.3** | Modern utility-first styling with dark mode and glassmorphism |
| **State Management** | **Zustand 5.0.3** | Lightweight persistent authentication store (`useAuthStore`) |
| **Context API** | **React Context (`AppDataContext`)** | Global equipment catalog and category caching |
| **HTTP Client** | **Axios 1.7.9** | API client with authorization interceptors and error handling |
| **Form Validation** | **React Hook Form 7.54 + Zod 3.24** | Type-safe form validation with `@hookform/resolvers` |
| **Payment Gateway** | **Stripe JS & React Stripe JS** | Embedded Stripe Checkout session and payment verification |
| **Notifications** | **Sonner 1.7.4** | Modern, responsive toast notifications |
| **Icons** | **Lucide React 0.475** | Consistent, scalable vector icons |
| **Image Optimization** | **Canvas Image Compressor** | Client-side compression before uploading equipment photos |

---

## 📂 Project Folder Structure

```text
Frontend_Gear_up_prisma_Stripe/
├── public/
│   ├── favicon.svg
│   └── images/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx             # Login page with demo credentials & auto-redirect
│   │   │   └── register/page.tsx          # Multi-role customer/provider registration
│   │   ├── about/page.tsx                 # About page with animated stats counters
│   │   ├── checkout/[orderId]/page.tsx    # Stripe payment checkout session
│   │   ├── contact/page.tsx               # Contact & support inquiry page
│   │   ├── dashboard/
│   │   │   ├── admin/page.tsx             # Admin management & analytics dashboard
│   │   │   ├── customer/page.tsx          # Customer rentals, receipts & reviews
│   │   │   └── provider/page.tsx          # Provider inventory & order fulfillment
│   │   ├── gear/
│   │   │   ├── [id]/page.tsx              # Detailed gear specs, provider info & reviews
│   │   │   └── page.tsx                   # Filterable equipment catalog & search
│   │   ├── payment/
│   │   │   ├── cancel/page.tsx            # Payment cancellation recovery page
│   │   │   └── success/page.tsx           # Stripe payment verification & receipt
│   │   ├── privacy-policy/page.tsx        # Privacy policy & data protection
│   │   ├── rental-policy/page.tsx         # Equipment rental terms & guidelines
│   │   ├── terms-of-service/page.tsx      # Terms of service
│   │   ├── error.tsx                      # Global error boundary
│   │   ├── globals.css                    # Tailwind CSS v4 & theme variables
│   │   ├── layout.tsx                     # Root layout with SSR data hydration & theme script
│   │   ├── loading.tsx                    # Suspense loading skeletons
│   │   ├── not-found.tsx                  # Custom 404 page
│   │   └── page.tsx                       # Homepage with hero, categories & featured gear
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── AddCategoryModal.tsx       # Admin category creation modal
│   │   │   ├── AddGearModal.tsx           # Provider equipment listing modal
│   │   │   ├── AnalyticsCharts.tsx        # Revenue & booking trend visualization
│   │   │   ├── DashboardLayout.tsx        # Shared dashboard wrapper & sidebar navigation
│   │   │   ├── EditCategoryModal.tsx      # Admin category edit modal
│   │   │   ├── EditGearModal.tsx          # Provider equipment update modal
│   │   │   └── WriteReviewModal.tsx       # Customer rating & feedback modal
│   │   ├── gear/
│   │   │   ├── GearCard.tsx               # Equipment card with stock & price badges
│   │   │   └── RentalCalculator.tsx       # Dynamic tiered price & date calculator
│   │   ├── home/
│   │   │   ├── AboutStatsSection.tsx      # Platform metrics & highlight cards
│   │   │   ├── CategoryShowcase.tsx       # Category grid with image cards
│   │   │   └── HeroSection.tsx            # Hero banner with search bar & CTA
│   │   ├── providers/
│   │   │   └── AuthProvider.tsx           # Client auth initialization provider
│   │   ├── shared/
│   │   │   ├── Footer.tsx                 # Global footer with quick links & policies
│   │   │   ├── Navbar.tsx                 # Responsive navigation with role indicators
│   │   │   └── ThemeToggle.tsx            # Light/Dark mode switcher
│   │   └── ui/
│   │       ├── Badge.tsx                  # Status and category badge indicators
│   │       ├── ImageUpload.tsx            # Drag-and-drop file upload with compression
│   │       ├── LoadingSkeleton.tsx        # Content placeholder skeletons
│   │       ├── Modal.tsx                  # Accessible modal dialog primitive
│   │       └── ScrollReveal.tsx           # Viewport scroll animation container
│   ├── context/
│   │   └── AppDataContext.tsx             # Global catalog and category context
│   ├── data/
│   │   └── gearCatalog.ts                 # Seeded fallback catalog for offline reliability
│   ├── lib/
│   │   ├── appDataFetcher.ts              # Unified SSR/Client data fetching utility
│   │   ├── axios.ts                       # Axios client with JWT interceptor
│   │   └── imageCompressor.ts             # HTML5 Canvas client-side image compression
│   ├── store/
│   │   └── useAuthStore.ts                # Zustand auth & session store
│   ├── types/
│   │   └── index.ts                       # Global TypeScript interfaces & enums
│   └── middleware.ts                      # Next.js Edge Middleware for route protection
├── .env.example
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Getting Started Locally

### 1. Prerequisites
- **Node.js**: `v18.18.0` or higher
- **npm** or **yarn** / **pnpm**

### 2. Clone the Repository
```bash
git clone https://github.com/m-d-Irfan/Frontend_Gear_up_prisma_Stripe.git
cd Frontend_Gear_up_prisma_Stripe
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
# Backend Base API Endpoint
NEXT_PUBLIC_API_URL=https://backend-gear-up-prisma-stripe.vercel.app/api/v1

# Stripe Public Key (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

### 6. Build for Production
```bash
npm run build
npm run start
```

---

## 🔗 Backend API Integration Reference

The frontend interacts with the following backend endpoints (`/api/v1`):

- **Auth**: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- **Gear**: `GET /gear`, `GET /gear/:id`, `POST /gear`, `PATCH /gear/:id`, `DELETE /gear/:id`
- **Categories**: `GET /categories`, `POST /categories`, `PATCH /categories/:id`, `DELETE /categories/:id`
- **Orders**: `POST /orders`, `GET /orders/my-orders`, `PATCH /orders/:id/status`
- **Payments**: `POST /payments/create-checkout-session`, `POST /payments/verify`
- **Reviews**: `POST /reviews`, `GET /reviews/gear/:gearId`

---

## 📜 License

This project is open-source and available under the **MIT License**.
