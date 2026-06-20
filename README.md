# 🚀 Vouchiqo | Verified Deals. Real Savings.

Vouchiqo is a high-performance, verified coupon marketplace and merchant growth platform. It bridges the gap between bargain-seeking customers and partner brands by guaranteeing **100% active, fraud-proof promotions** and delivering real-time checkout conversion metrics.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Core Framework** | Next.js 16.2 (Turbopack) | Server-Side Rendering (SSR) & optimized API Route endpoints. |
| **UI Library** | React 19 & Tailwind CSS v4 | Declarative components and modern styling system. |
| **Authentication** | Better Auth v1.6 | Cryptographically secure OTP authentication, sign-ins, and Role-Based Access Control (RBAC). |
| **Database** | MongoDB & Mongoose | Document store for coupons, merchant profiles, claims, and redemptions. |
| **Caching / Locks** | Redis & ioredis | Cache storage (stale-time optimizations) & lock manager for anti-fraud control. |
| **Task Queue** | BullMQ | Asynchronous, decoupled background tasks (e.g. tracking analytics views, sending Resend emails). |
| **Email Service** | Resend | OTP codes and transactional account communication. |
| **Media Host** | Cloudinary | Asset delivery (merchant brand logos, campaign headers). |
| **Linter / Formatter** | Biome v2 | Fast code formatting, syntax checking, and package audits. |

---

## 📂 Directory Structure

The project follows a modular architecture separating public routes, domain features, schema services, and background workers:

```
Vouchiqo/
├── app/                      # Next.js App Router (Pages, layouts, and API endpoints)
│   ├── (coupons)/            # Public Deals listing & Single Coupon detail pages
│   ├── (public)/             # Revival campaigns page
│   ├── admin/                # Admin Moderator views (Merchants approval, featured deals)
│   ├── api/                  # Server API endpoints (claims, auth, coupons, redemptions)
│   ├── auth/                 # Account forms (Login, Register, OTP verification)
│   ├── customer/             # Customer dashboard (Saved deals, savings metrics)
│   └── merchant/             # Merchant portal (Coupons creation, live analytics, settings)
├── components/               # Shared global UI elements (Navbar, Footer, CouponCard)
│   └── ui/                   # Radix-based UI components (Accordion, dialog, inputs, buttons)
├── features/                 # Domain-specific logic & custom hooks
│   ├── auth/                 # Sign-in/Verify mutations and Auth Guards
│   └── location/             # Location-aware geolocation detection hooks
├── hooks/                    # Global React hooks
├── lib/                      # Core singleton setups (mongodb, redis, better-auth, logger)
├── modules/                  # Schema definition and database service layer
│   ├── claim/                # User Claims services & MongoDB aggregations
│   ├── coupon/               # Coupon lifecycle models and service files
│   ├── merchant/             # Merchant registration and profile management
│   ├── redemption/           # Double-redemption locking and calculated savings
│   └── user/                 # User settings and profile tables
├── scripts/                  # Seeding & Diagnostic files
├── utils/                    # Global constants, helpers, and schemas
└── workers/                  # BullMQ background workers (e.g. analytics processor)
```

---

## 🔄 Core Flows

### 1. Customer Claim & Redemption Flow
This flow tracks how a customer claims a discount and redeems it securely, calculating lifetime savings.

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant Frontend
    participant API
    participant Redis
    participant Database

    Customer->>Frontend: Click "Claim Voucher"
    Frontend->>API: POST /api/claims
    API->>Database: Verify Coupon Active & Stock Available
    Database-->>API: Validated
    API->>Database: Create Claim Record & Increment Total Claims
    API-->>Frontend: Return Unique Claim ID & Promo Code
    Frontend-->>Customer: Display Code (Toast/Modal)

    Customer->>Frontend: Click "Redeem Coupon" (checkout)
    Frontend->>API: POST /api/redemptions
    API->>Redis: Acquire Lock: claim_lock:{userId}:{couponId}
    alt Lock Acquired
        Redis-->>API: Success
        API->>Database: Calculate Savings & Create Redemption Record
        API->>Database: Update Claim Status -> "REDEEMED"
        API->>Database: Increment totalRedemptions & Add to User Lifetime Savings
        API->>Redis: Release Lock
        API-->>Frontend: Return Success Status
        Frontend-->>Customer: Apply discount & Show Confirmed Savings
    else Lock Failed
        Redis-->>API: Conflict (Redemption in progress)
        API-->>Frontend: Error: 409 Conflict
        Frontend-->>Customer: Toast: "Redemption in progress. Please wait."
    end
```

### 2. Async Analytics view-tracking (BullMQ)
To prevent tracking lookups from blocking API response times, analytics view counts are executed in the background.

```mermaid
flowchart LR
    A[Customer Views Coupon] --> B(API Endpoint)
    B -->|Return Coupon Details| C[Customer Screen]
    B -->|Decoupled Dispatch| D(BullMQ analyticsQueue)
    D -.-> E[Redis Queue Buffer]
    E -.-> F[analytics.worker.js]
    F -->|findByIdAndUpdate $inc: viewCount| G[(MongoDB)]
```

---

## 🔒 Fraud Protection & Locks

To prevent concurrent API requests from claiming/redeeming a coupon multiple times (e.g. race conditions), Vouchiqo employs **Redis locks**:
* Before performing redemptions, the API runs `acquireLock` via Redis.
* If a duplicate request arrives before the first db transaction completes, it is instantly blocked with a `409 Conflict` response.
* Locks automatically expire after 10 seconds to avoid deadlocks.

---

## 🚀 Advanced Database Optimizations

We bypass standard Mongoose populated objects for high-frequency user endpoints, eliminating the **N+1 query problem**:
* **Aggregation Pipelines**: List endpoints (like `/api/claims` and `/api/redemptions`) use native MongoDB `$lookup` stages to join related `coupons` and `merchants` directly on the database cluster, returning joined payloads in a single roundtrip.
* **Lean Queries**: Queries leverage Mongoose `.lean()` to load raw, lightweight JSON documents instead of heavy hydrated model instances, boosting read performance.

---

## 💻 Local Development Setup

### 1. Environment Configuration
Create a `.env` file in the project root:

```ini
# Server
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (MongoDB)
# Use direct connection strings to bypass Windows DNS SRV lookup issues
MONGODB_URI=mongodb://username:password@shard-00-00.mongodb.net:27017,shard-00-01.mongodb.net:27017/vouchiqo?ssl=true&replicaSet=atlas-shard-0&authSource=admin

# Redis
REDIS_URL=redis://default:password@your-redis-host.io:12860

# Better Auth
BETTER_AUTH_SECRET=your_32_character_hex_secret
BETTER_AUTH_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Resend (Email)
RESEND_API_KEY=re_your_api_key
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Seeding
To populate your database with approved merchants, categories, and test coupons, run the seeder (it imports a custom ESM resolver for paths aliases):
```bash
node --import ./scripts/alias-register.mjs scripts/seed.mjs
```

### 4. Running the App
Start both your development server and the background analytics worker:

```bash
# Terminal 1: Next.js dev server
npm run dev

# Terminal 2: BullMQ background consumer
node workers/analytics.worker.js
```

---

## 🔑 Test Credentials (Seeded Accounts)

| Account Role | Email Address | Password | Description |
| :--- | :--- | :--- | :--- |
| **👤 Customer** | `customer@vouchiqo.com` | `Password123!` | Primary buyer account. |
| **👤 Customer** | `customer2@vouchiqo.com` | `Password123!` | Secondary buyer account. |
| **🏪 Merchant** | `merchant@vouchiqo.com` | `Merchant@123!` | Approved owner of *Burger House*. |
| **🏪 Merchant** | `merchant2@vouchiqo.com` | `Merchant@123!` | Approved owner of *StyleZone*. |
| **🏪 Merchant** | `merchant3@vouchiqo.com` | `Merchant@123!` | Approved owner of *TechGadgets*. |
| **🔑 Admin** | `admin@vouchiqo.com` | `Admin@123!` | Platform moderator/approver. |
