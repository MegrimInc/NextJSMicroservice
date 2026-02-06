# Megrim Merchant Admin (Next.js)

Merchant web dashboard for Megrim. Provides onboarding, inventory management,
analytics, messaging, and store configuration.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Open http://localhost:3000.

## Features

- Merchant onboarding (Stripe connect redirect)
- Inventory CRUD with S3 image uploads
- Analytics dashboards (revenue, units, tips)
- Store configuration (categories, discounts, store image)
- Merchant-customer messaging

## Tech Stack

- Next.js (App Router)
- Tailwind CSS
- REST API integration with Postgres service

## Configuration

Endpoints are defined in `src/lib/api/config.ts` and use the same
environment split as the backend (test/live). If you want to route requests
through a different API host, set:

```
NEXT_PUBLIC_API_URL=...
```

## Related Services

- Postgres microservice: core REST API, auth, inventory, analytics
- Redis microservice: live order flow and terminal coordination
- Flutter app: customer ordering + merchant terminal experience

