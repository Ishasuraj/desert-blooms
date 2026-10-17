# Desert Blooms Website — Project Structure Guide

This document explains how the project is organized, what technologies it uses, how the runtime works, and what to watch out for when hosting it on Vercel.

It is written so that a Copilot or another AI assistant can understand the codebase quickly and make safe changes.

---

## 1. Project Summary

This is a Vite + React + TypeScript frontend for a landscaping and agricultural tools business in Kuwait, with:

- a marketing/home page
- a tools catalog page
- service detail pages
- English and Arabic localized routes and content
- a cart and checkout flow
- enquiry form submission
- Supabase-backed order persistence and receipt generation
- order/customer email notifications with delivery status tracking
- WhatsApp order receipt flow
- local development server support
- Vercel serverless API support

The app is structured as a hybrid project:

- Frontend lives under `client/src`
- Shared validation and business rules live under `shared`
- API logic is split between `server` (local Express usage) and `api` (Vercel serverless handlers)
- Build output is generated into `dist`

---

## 2. High-Level Architecture

```mermaid
flowchart TD
    A[Browser / Client UI
    React + Vite + Tailwind]
    B[client/src
    Pages, components, contexts, data]
    C[shared
    Schemas + shared constants]
    D[api/
    Vercel serverless handlers]
    E[server/
    Local Express runtime]
    F[External Services
    Gmail SMTP, WhatsApp, Google Maps]
    G[Vercel Hosting
    Frontend + API routes]

    A --> B
    B -->|fetch /api/enquiry| D
    B -->|fetch /api/order/create| D
    B -->|fetch /api/order/create| E
    D --> C
    E --> C
    D --> F
    E --> F
    B --> G
    D --> G
    E --> G
```

### Runtime interpretation

- Local development is powered by Vite dev server from `vite.config.ts`
- The Vite server injects custom middleware for:
  - `/api/enquiry`
  - `/api/order/create`
  - `/manus-storage`
  - `/__manus__/logs`
- On Vercel, the app does not use `server/index.ts` directly. Instead, the `api/` folder provides the production serverless endpoints.

---

## 3. Tech Stack

### Frontend

- React 19
- TypeScript
- Vite 7
- Wouter for routing
- Tailwind CSS v4
- Framer Motion for UI interactions
- Radix UI primitives for dialogs, drawers, dropdowns, etc.
- Lucide React for icons
- React Hook Form + Zod for forms
- Recharts for charts
- Sonner for toast notifications
- jsPDF for receipt PDF generation

### Backend / Server

- Express 4
- Node.js runtime
- `nodemailer` for SMTP mail delivery
- `zod` for request validation
- `express-rate-limit` for local API rate limiting
- `dotenv` for environment variables

### Build / Tooling

- TypeScript
- Vite plugins
- esbuild for server bundle generation
- pnpm as package manager
- Prettier
- Vitest is installed, but not clearly used in visible tests yet

### External integrations

- Gmail SMTP for enquiry emails
- WhatsApp links for order receipts
- Google Maps frontend script integration in `client/src/components/Map.tsx`
- `client/src/const.ts` includes OAuth-related code, but this feature is not clearly wired into the current visible app flow

---

## 4. How the Project Is Arranged

### Root files

- `package.json` — scripts, dependencies, package manager, Vite build configuration
- `pnpm-lock.yaml` — lockfile for pnpm
- `tsconfig.json` — TypeScript config
- `vite.config.ts` — main Vite configuration and local dev API plugins
- `vercel.json` — Vercel deployment config
- `components.json` — design-system component mapping (shadcn-style)
- `ideas.md`, `todo.md` — project notes and planning docs

### Main folders

```text
.
├── api/
│   ├── enquiry.ts
│   └── order/
│       └── create.ts
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── data/
│       ├── hooks/
│       ├── lib/
│       ├── pages/
│       ├── types/
│       ├── App.tsx
│       ├── const.ts
│       ├── contact.ts
│       ├── index.css
│       └── main.tsx
├── server/
│   ├── devRateLimit.ts
│   ├── index.ts
│   ├── mail.ts
│   ├── processEnquiry.ts
│   ├── processOrder.ts
│   └── serverRateLimit.ts
├── shared/
│   ├── const.ts
│   ├── enquirySchema.ts
│   ├── orderSchema.ts
│   └── tools.json
├── dist/
├── patches/
├── extracted_cards/
├── extracted_tools_images/
└── public/
```

---

## 5. Why the Main Folders Exist

### `client/`

This is the user-facing web application.

- `client/src/App.tsx` sets up routing and providers
- `client/src/pages/Home.tsx` contains the primary landing page
- `client/src/pages/ToolsPage.tsx` contains the shop/catalog page
- `client/src/components/` contains reusable UI and storefront components
- `client/src/contexts/` holds state like cart and theme
- `client/src/data/tools.ts` contains the catalog data used by the storefront
- `client/src/contact.ts` contains public contact metadata and WhatsApp settings

### `shared/`

This folder contains cross-cutting logic that both frontend and backend consume.

- `shared/enquirySchema.ts` defines enquiry validation and allowed services
- `shared/orderSchema.ts` defines order payload validation
- `shared/tools.json` contains canonical tool metadata used for order verification
- `shared/const.ts` contains shared constants

This is important because the order validation process compares incoming order items against `shared/tools.json` to make sure the requested tools exist and to calculate verified totals.

### `server/`

This folder contains the local server-side runtime used during development and local production-style runs.

- `server/index.ts` starts an Express app and exposes routes
- `server/processEnquiry.ts` validates and sends enquiries
- `server/processOrder.ts` verifies cart items against the tools catalog and builds the WhatsApp receipt
- `server/mail.ts` defines SMTP mail sending
- `server/devRateLimit.ts` and `server/serverRateLimit.ts` implement in-memory rate limiting

### `api/`

This folder is the Vercel-specific deployment surface.

- `api/enquiry.ts` handles enquiry requests on Vercel
- `api/order/create.ts` handles order requests on Vercel

These functions are effectively the production version of the local server API endpoints.

---

## 6. API Flow and Request Handling

### Enquiry flow

1. Browser submits form data from `client/src/pages/Home.tsx`
2. Client calls `POST /api/enquiry`
3. Server validates body using `shared/enquirySchema.ts`
4. A honeypot field ` _gotcha ` is checked and rejected if filled
5. SMTP email is sent via `server/mail.ts`
6. Response is returned to the browser

### Order flow

1. Browser adds tools to cart in `client/src/contexts/CartContext.tsx`
2. Client calls `POST /api/order/create`
3. Server validates order payload with `shared/orderSchema.ts`
4. Items are matched against `shared/tools.json`
5. Verified item list and total are constructed
6. A WhatsApp URL is generated with the formatted receipt message
7. Browser receives receipt JSON and opens the receipt modal

### Validation strategy

The app avoids trusting the frontend alone.

- client-side validation is present, but not sufficient
- server-side validation is the real source of truth
- order items are matched against a canonical catalog and not just accepted by raw ID

This is a strong design choice and helps avoid fake or manipulated order requests.

---

## 7. Frontend Structure, Page-by-Page

### `client/src/App.tsx`

Main app shell.

Responsibilities:

- sets up `ErrorBoundary`
- sets up `ThemeProvider`
- sets up `CartProvider`
- sets up `TooltipProvider`
- sets up `Toaster`
- wires routes using Wouter

### `client/src/pages/Home.tsx`

Landing page with:

- hero banner
- services section
- featured tools section
- projects section
- contact form
- cart drawer and receipt modal integration
- WhatsApp floating action button

### `client/src/pages/ToolsPage.tsx`

Tools catalog page with:

- search bar
- category filters
- sorting
- product grid
- cart summary button

### `client/src/components/`

Contains reusable UI pieces.

Examples:

- `ToolCard.tsx` — card for each tool
- `CartDrawer.tsx` — shopping cart UI
- `ReceiptModal.tsx` — order receipt modal
- `Map.tsx` — Google Maps frontend integration
- UI primitives under `components/ui/` are generated/borrowed Radix/Tailwind-style components

### `client/src/contexts/`

- `CartContext.tsx` manages cart state
- `ThemeContext.tsx` manages light/dark theme state

---

## 8. Data and Shared Logic

### `shared/tools.json`

This file is the main catalog source of truth.

It stores:

- tool IDs
- bin numbers
- names
- categories
- pricing
- image metadata

This file is used in the order verification process to prevent invalid or tampered item entries.

### `shared/orderSchema.ts`

Defines:

- order item requirements
- customer fields
- phone number validation
- delivery notes validation
- honeypot field guard

### `shared/enquirySchema.ts`

Defines enquiry validation:

- name/email/service/message requirements
- service options
- honeypot field protection

---

## 9. What the App Does in Practice

The project is not just a marketing website. It contains a useful storefront flow:

- browse tools
- add items to cart
- validate order payload on the server
- verify every item against a canonical catalog
- generate a receipt in KWD
- generate a WhatsApp message with the receipt
- send the customer to WhatsApp for confirmation

This means the order system is more like a lightweight verified catalog/order workflow than a typical e-commerce checkout.

---

## 10. Local Development and Build Commands

From `package.json`:

```json
"scripts": {
  "dev": "vite --host",
  "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
  "start": "NODE_ENV=production node dist/index.js",
  "preview": "vite preview --host",
  "check": "tsc --noEmit",
  "format": "prettier --write ."
}
```

### Typical local workflow

```bash
pnpm install
pnpm run dev
```

### Production-style local run

```bash
pnpm run build
pnpm run start
```

### Type check

```bash
pnpm run check
```

---

## 11. Vercel Hosting and Deployment Details

### Current deployment configuration

`vercel.json` contains:

```json
{
  "buildCommand": "npm run build",
  "installCommand": "pnpm install --frozen-lockfile",
  "outputDirectory": "dist/public",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/((?!api(?:/|$)).*)",
      "destination": "/index.html"
    }
  ]
}
```

### What this means

- Vercel is configured to serve the built frontend from `dist/public`
- SPA routes are rewritten back to `index.html`
- API routes under `api/` are expected to work as serverless functions
- The Vite build output is also generating a Node server bundle in `dist/index.js`, but that is primarily for local production-style serving, not Vercel’s serverless runtime

---

## 12. Vercel-Specific Caveats / Potential Loopholes

These are the main things to be aware of when this project is hosted on Vercel.

### 1. Local Express server and Vercel are not the same runtime

The project has two runtime entry points that share request processing:

- `server/index.ts` for local Express hosting
- `api/enquiry.ts` and `api/order/create.ts` for Vercel serverless functions

The local Express routes and Vercel handlers both call the shared `server/processEnquiry.ts` and `server/processOrder.ts` modules. Check both entry points when changing routing, middleware, or runtime-specific behavior.

### 2. In-memory rate limiting will not be reliable on Vercel serverless

Both `server/devRateLimit.ts` and `server/serverRateLimit.ts` use in-memory `Map` storage.

On Vercel:

- function instances may be reused or restarted unpredictably
- rate-limit buckets will not be shared across invocations reliably
- per-instance memory is not a durable or globally shared store

This means the rate limiting is reasonable for local dev, but it is not a production-grade distributed limiter.

Recommended improvement:

- move rate limiting state into Redis, Upstash, or another persistent/store-backed service

### 3. The app uses environment variables extensively

The code relies on environment variables such as:

- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`
- `ORDER_NOTIFY_EMAIL`
- `VITE_CONTACT_PHONE`
- `VITE_CONTACT_PHONE_TEL`
- `VITE_CONTACT_WHATSAPP`
- `VITE_CONTACT_EMAIL`
- `BUILT_IN_FORGE_API_URL`
- `BUILT_IN_FORGE_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` (reserved for future public client use; not used by current server writes)
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only; configure in Vercel project environment settings and never use a `VITE_` prefix)
- `WHATSAPP_TARGET_NUMBER`

If these are missing in Vercel, parts of the app may silently fail or behave incorrectly.

### 4. `server/index.ts` is not the production execution path on Vercel

Even though `npm run build` produces `dist/index.js`, that file is not what Vercel uses to serve the app by default.

The production API route that matters on Vercel is the `api/` directory.

The `api/` handlers are the Vercel request entry points and invoke the shared processing code. Runtime-specific middleware from Express is not automatically applied to serverless handlers.

### 5. SPA rewrites can mask route issues

`vercel.json` rewrites all non-API routes to `index.html`.

This enables SPA routing, but it also means:

- missing pages may appear to work as front-end routes
- route-level errors may be hidden behind client-side handling
- misconfigured backend paths can be harder to debug visually

### 6. `client/src/const.ts` looks unfinished or unused

This file contains OAuth-related code and a runtime login URL generator, but the visible current frontend does not appear to rely on it strongly.

Possible explanations:

- unfinished feature left in the repo
- future integration not yet completed
- code kept for future use

This should be reviewed before adding new auth or callback flows.

### 7. The Vite dev API middleware is local-only

`vite.config.ts` injects middleware for `/api/enquiry`, `/api/order/create`, `/manus-storage`, and `/__manus__/logs`.

The API behavior is also exposed through `api/` handlers for Vercel. Manus storage/log middleware remains part of local development tooling and should not be treated as a production API.

### 8. Environment configuration for local development and Vercel

Copy `.env.example` to `.env` for local development. Set the same required values in Vercel Project Settings → Environment Variables for deployment. Supabase writes use `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` on the server. The anon key is not used by the current application. The WhatsApp contact number is configured through `VITE_CONTACT_WHATSAPP` (with a code default in `client/src/contact.ts`).

---

## 13. Current Project Structure and Recent Features

The following reflects the current source tree. Build output and dependency folders are generated or installed locally and are intentionally omitted.

```text
.
├── api/                         # Vercel API functions
│   ├── db.ts                    # server-only Supabase adapter
│   ├── enquiry.ts
│   └── order/create.ts
├── client/
│   ├── index.html
│   ├── public/                  # static images, SEO files, tool images
│   └── src/
│       ├── assets/services/     # imported service photography
│       ├── components/
│       │   ├── tools/           # ToolCard, CartDrawer, ReceiptModal
│       │   └── ui/              # reusable UI primitives
│       ├── contexts/            # cart, locale, and theme providers
│       ├── data/                # tool and service catalogs
│       ├── hooks/
│       ├── i18n/                # translations, locale paths, localized helpers
│       ├── lib/                 # utilities and PDF receipt generation
│       ├── pages/               # Home, ToolsPage, ServiceDetail, NotFound
│       ├── types/
│       └── App.tsx / main.tsx / index.css / contact.ts / const.ts
├── scripts/
│   ├── dev.mjs                  # local Vite/API development launcher
│   └── resendOrderEmail.ts      # list/retry failed order email notifications
├── server/
│   ├── db.ts                    # server-only Supabase client
│   ├── index.ts                 # local Express runtime
│   ├── mail.ts                  # enquiry and order email delivery
│   ├── processEnquiry.ts
│   ├── processOrder.ts          # validate, persist, notify, and build receipt
│   └── *RateLimit.ts
├── shared/                      # schemas, constants, canonical tools.json
├── supabase/migrations/          # database migrations 001 through 006
├── patches/                      # package patches
├── extracted_cards/              # extracted product artwork/source material
├── extracted_tools_images/       # extracted product images/source material
├── package.json / pnpm-lock.yaml
├── vite.config.ts / vercel.json / tsconfig*.json
├── Tools.xlsx / PRODUCTS DESSERTBLOOMS.docx
└── ideas.md / todo.md / PROJECT_STRUCTURE_GUIDE.md
```

### Localization and routes

`client/src/App.tsx` wraps the application in `LocaleProvider` and defines English routes (`/`, `/tools`, `/services/:slug`) plus Arabic-prefixed routes (`/ar`, `/ar/tools`, `/ar/services/:slug`). `client/src/contexts/LocaleContext.tsx` resolves the locale from the path and exposes translation and locale-aware path helpers. `client/src/i18n/` contains English/Arabic dictionaries, route helpers, and localized service, tool, and enquiry labels. `LanguageSwitcher.tsx` and `LocalizedLink.tsx` keep navigation within the selected language. RTL styling is handled in the client styles and locale-aware components.

`client/src/pages/ServiceDetail.tsx` renders a service page by slug using `client/src/data/services.ts` and localized service data. `client/src/pages/Home.tsx` is the landing page and enquiry form; `ToolsPage.tsx` is the catalog and cart entry point. Tool UI lives in `client/src/components/tools/`. `client/src/lib/receiptPdf.ts` generates a downloadable receipt PDF.

### Persistent orders and notifications

`server/processOrder.ts` is the shared order workflow used by both local Express and Vercel handlers. It validates the payload, rechecks item IDs/prices against `shared/tools.json`, creates the order and line items in Supabase, and returns a verified receipt and WhatsApp URL. A client idempotency key and request fingerprint prevent duplicate orders on identical retries and detect reuse of a key with different order details. Order references are assigned by the database (`DB-100001`, etc.).

`server/mail.ts` sends enquiry email, an order notification to the configured business address, and an order confirmation to the customer. Outcomes are recorded in Supabase `notifications`, including channel, status, and error details. `scripts/resendOrderEmail.ts` supports listing failed messages and retrying a selected order's business or customer email. The command is `pnpm run resend:order-email -- --list-failed` or `pnpm run resend:order-email -- DB-100001` (add `-- --customer` to resend the customer message).

`server/db.ts` creates the Supabase client with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`; `api/db.ts` re-exports this server-only client. Never import this module into browser code or expose the service role key. `supabase/migrations/001_init.sql` through `006_add_delivery_notes.sql` define the customers/orders/items schema, customer contact fields, notification log, order reference, idempotency support, and the `orders.delivery_notes` column. Apply migrations to the Supabase project before using order submission.

The browser catalog is in `client/src/data/tools.ts`; `shared/tools.json` is the server verification catalog. Keep their IDs, names, and prices aligned when editing products. Product/source documents and extracted image folders are reference/material assets, not runtime modules.

### Runtime and environment details

`pnpm run dev` invokes `scripts/dev.mjs`, which starts Vite with local API middleware. The local Express server is `server/index.ts`; Vercel uses `api/enquiry.ts` and `api/order/create.ts`. Both paths call the shared processing modules. The API handlers use `api/db.ts` to reach the server Supabase client. Vercel does not run the Express entry point.

Server configuration includes Supabase (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`), SMTP (`GMAIL_USER`, `GMAIL_APP_PASSWORD`), the business notification recipient (`ORDER_NOTIFY_EMAIL`), and `WHATSAPP_TARGET_NUMBER`. Configure these in the local environment and in the Vercel project environment. The service role key must only exist server-side. `pnpm run resend:order-email` uses the same database and mail settings.

The package scripts currently include `dev`, `build`, `start`, `preview`, `check`, `format`, and `resend:order-email`. `pnpm run build` runs the Vite client build and bundles the Express server. The configured Vercel output is `dist/public`; Vercel's `api/` directory is deployed separately as functions.

## 14. Recommended Improvements for Production Hardening

If you want this project to be more robust on Vercel, the following changes would help:

1. Replace in-memory rate limiting with Redis, Upstash, or another shared store for serverless deployments
2. Add production logging and monitoring for API errors, order persistence, and notification delivery
3. Decide whether the OAuth-related code in `client/src/const.ts` is still needed
4. Add tests for order idempotency, database persistence, mail flows, and schema validation
5. Keep the browser catalog and canonical server catalog synchronized, or generate both from a single source

---

## 15. Practical Notes for Copilot / AI Agents

When going into this repo, key files to read first are:

- `package.json`
- `vite.config.ts`
- `vercel.json`
- `client/src/App.tsx`
- `client/src/pages/Home.tsx`
- `client/src/pages/ToolsPage.tsx`
- `server/processOrder.ts`
- `server/processEnquiry.ts`
- `server/mail.ts`
- `server/db.ts`
- `client/src/contexts/LocaleContext.tsx`
- `client/src/i18n/`
- `supabase/migrations/`
- `scripts/resendOrderEmail.ts`
- `api/enquiry.ts`
- `api/order/create.ts`
- `shared/tools.json`
- `shared/enquirySchema.ts`
- `shared/orderSchema.ts`

If you are changing behavior, always check both the local runtime path and the Vercel runtime path, because the project uses both.

---

## 16. Final Takeaway

This project is a hybrid Vite + React + TypeScript application with a frontend storefront, a validated server-side order system, email sending, and Vercel deployment support.

The main architectural caveat is that the repo contains both:

- a local Express/server setup, and
- a Vercel serverless API setup

So the safest way to maintain it is to treat the `api/` handlers as the production path and keep them synchronized with the local server logic.

---

## 17. Optional Next Step

If you want, I can also turn this into:

- a shorter Copilot-ready summary prompt,
- a more formal architecture document for clients,
- or a deployment checklist specifically for Vercel setup and environment variables.
