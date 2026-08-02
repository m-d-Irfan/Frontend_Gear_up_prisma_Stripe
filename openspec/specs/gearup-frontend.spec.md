# OpenSpec Specification - GearUp Frontend Application

## Intent & Overview
Provide an intent-driven specification for the GearUp Next.js 15 App Router frontend application.

## Architectural Specs

### Spec 1: Authentication & Role-Based Middleware
- WHEN an unauthenticated user attempts to access `/dashboard/*`
- THEN redirect to `/login?redirect=...` with user-friendly toast message.
- WHEN a user with role `CUSTOMER` attempts to access `/dashboard/provider` or `/dashboard/admin`
- THEN deny access and redirect to `/dashboard/customer`.

### Spec 2: Gear Rental & Dynamic Price Calculation
- WHEN a user selects a Start Date and End Date on `/gear/[id]`
- THEN compute `totalDays = (endDate - startDate)` and `totalPrice = totalDays * pricePerDay` in real-time.
- WHEN `startDate >= endDate` or `startDate < today`
- THEN display inline validation error and disable "Proceed to Rental Checkout" button.

### Spec 3: Stripe Payment Flow Integrity
- WHEN checkout is initiated on `/checkout/[orderId]`
- THEN call `/payments/create-checkout-session` to retrieve `clientSecret` and Stripe `transactionId`.
- WHEN payment completes or redirects to `/payment/success?orderId=...&transactionId=...`
- THEN invoke `/payments/verify` to confirm database sync before displaying confirmation UI.

### Spec 4: Role-Based Dashboard Capabilities
- CUSTOMERS: View rental orders, payment history, write gear reviews.
- PROVIDERS: Manage gear inventory (Add/Edit/Delete), update order status (`CONFIRMED`, `PICKED_UP`, `RETURNED`).
- ADMINS: Manage user status (Suspend/Activate), manage categories, view global statistics.
