# QRAFT — QR Codes, Redesigned

A full-stack QR design, deployment, management and intelligence SaaS. Create
beautiful, branded QR codes (gradients, logos, custom shapes), make them dynamic
(change the destination without reprinting), track scans with analytics, and
export at print quality.

Built with **Next.js 15 (App Router)**, **MongoDB (Mongoose)**, **NextAuth v5**
and **Supabase Storage** (for uploaded PDFs).

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
  - [Environment variables](#environment-variables)
  - [Install & run](#install--run)
- [Data model](#data-model)
- [QR export system](#qr-export-system)
- [Dynamic redirects & analytics](#dynamic-redirects--analytics)
- [Document uploads & auto-delete](#document-uploads--auto-delete)
- [Security](#security)
- [Production deployment (Vercel)](#production-deployment-vercel)
- [Scripts](#scripts)

---

## Features

- **QR Studio** — live preview, design panel (patterns, colors, logo, frame),
  real-time scanability score.
- **6 QR types** — Website, Wi-Fi, vCard, Email, Event, Document (PDF).
- **Premium designs** — data patterns, eye styles, gradients, embedded logos,
  background/frame choices.
- **Dynamic QR codes** — change the destination anytime via a short slug
  (`/r/...`) without reprinting.
- **Scan analytics** — total/unique scans, device breakdown, top countries and
  time-series charts.
- **Print-quality export** — PNG, JPG, WebP and SVG at any size (a single
  consistent 85% coverage layout across every format).
- **Documents** — upload PDFs directly to Supabase Storage (bypasses
  serverless body limits); auto-deleted after 7 days to reclaim storage.
- **Landing page** — marketing site with sections, CTAs, pricing, FAQ and
  footer (all links mapped to real pages/routes).

---

## Tech stack

| Area            | Choice                                         |
| --------------- | ---------------------------------------------- |
| Framework       | Next.js 15 (App Router, React 19)              |
| Language        | JavaScript (ESM)                               |
| Auth            | NextAuth v5 (CredentialsProvider, JWT sessions)|
| Database        | MongoDB via Mongoose                           |
| File storage    | Supabase Storage (public `pdf` bucket)         |
| QR rendering    | `qr-code-styling`                              |
| Animations      | `motion` (Framer Motion successor)             |
| Icons           | `lucide-react`                                 |
| Charts          | `recharts`                                     |
| Styling         | CSS variables + Tailwind/tailwind v4 (build)   |

---

## Project structure

```
src/
├── app/                     # App Router pages & API routes
│   ├── (landing)            # src/app/page.js — marketing site
│   ├── studio/              # QR Studio (main editor)
│   ├── login/ register/     # auth screens
│   ├── dashboard/           # authed dashboard (overview, analytics, settings)
│   ├── r/[slug]/            # dynamic-QR redirect engine
│   ├── api/
│   │   ├── auth/            # NextAuth + registration
│   │   ├── qrcodes/         # CRUD for QR codes
│   │   ├── folders/         # folder CRUD
│   │   ├── upload-url/      # mints signed Supabase upload URL
│   │   ├── cron/cleanup-documents/  # auto-delete expired PDFs
│   │   └── user/            # profile
│   ├── about/ blog/ contact/ docs/ api-docs/ help/
│   │   privacy/ terms/ cookies/ gdpr/
│   │   careers/ press/ status/ changelog/ integrations/
│   │                       # lightweight public pages (footer links)
├── components/
│   ├── studio/              # QRTypeSelector, QRPreview, DesignPanel,
│   │                        #   ExportPanel, LogoUploader, FrameSelector, ...
│   ├── dashboard/           # metrics, charts, tables, folder sidebar
│   ├── landing/             # Navbar, Hero, sections, Footer, ...
│   └── ui/                  # Button, Input, Tabs, Toggle, Select, Accordion, ...
├── hooks/                   # useQRGenerator, useMediaQuery
├── lib/                     # db, security, qr-engine, qr-export, rate-limit,
│                            #   supabase (client), supabase-server
├── models/                  # Mongoose schemas
└── auth.js                  # NextAuth config
```

---

## Getting started

### Environment variables

Copy `.env.example` to `.env.local` and fill in the values (see the file for
explanations). Required:

| Variable                     | Purpose                                        |
| ---------------------------- | ---------------------------------------------- |
| `MONGODB_URI`                | MongoDB / Atlas connection string              |
| `AUTH_SECRET`                | NextAuth session JWT secret                    |
| `NEXT_PUBLIC_SUPABASE_URL`   | Supabase project URL (client)                  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (client)                  |
| `SUPABASE_SERVICE_ROLE_KEY`  | Supabase service-role key (server only)        |

Optional:

| Variable                       | Purpose                                        |
| ------------------------------ | ---------------------------------------------- |
| `REDIRECT_ALLOWED_HOSTS`       | Allow-list of hosts for dynamic QR redirects   |
| `CRON_SECRET`                  | Protects the document-cleanup cron endpoint    |

Note: the Supabase bucket must be named `pdf` (lowercase) and public.

### Install & run

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
```

---

## Data model

Mongoose schemas in `src/models/`:

- **User** — `name`, `email`, `password` (bcrypt hash), `role`.
- **QRCode** — `userId`, `title`, `type`, `contentData` (Mixed, e.g. `{ url }` or
  `{ ssid, password }`), `isDynamic`, `shortSlug`, `destinationUrl`, `status`
  (`active`/`paused`/`archived`), `folderId`, `designId`, `scansCount`.
- **QRDesign** — `qrCodeId`, `options` (the full design config for
  `qr-code-styling`).
- **Folder** — user folders for organizing codes.
- **Scan** — per-scan analytics event (device, country, timestamp).

`QRCode.contentData` for a **document** QR stores:

```json
{
  "url": "https://<project>.supabase.co/storage/v1/object/public/pdf/...",
  "filename": "menu.pdf",
  "fileId": "<storage path>"
}
```

On document expiry (see below) the `url` is cleared and `expired: true` is set.

---

## QR export system

`src/hooks/useQRGenerator.js` + `src/lib/qr-export.js` provide a format-agnostic
export pipeline.

**Key principle — the export frame is the source of truth:**

```
EXPORT FRAME (W x H)
  └── QR AREA = min(W,H) * 0.85, centered at (x,y)
        x = (W - qrSize) / 2,  y = (H - qrSize) / 2
```

- `calculateQRExportLayout({ canvasWidth, canvasHeight, coverage })` returns
  `{ qrSize, x, y }` — shared by **all** formats so the QR is always centered,
  square (1:1), and occupies **85%** of the frame.
- The quiet zone is preserved (never cropped); any logo/gradient scales together
  with the QR.
- **SVG export** uses `buildFramedSvg` (a nested data-URI image — fine in a
  standalone SVG document).
- **Raster export (PNG/JPG/WebP)** draws the QR&apos;s own SVG directly onto a
  canvas at the export resolution — this avoids the Chromium bug where
  rasterizing an SVG-within-an-SVG via `<img>` produced a blank image.
- Sizes are never hard-coded; export uses the request resolution.

---

## Dynamic redirects & analytics

- Creating a QR with **dynamic** enabled generates a high-entropy `shortSlug`.
- Scanning links to `GET /r/:slug` (`src/app/r/[slug]/route.js`), which:
  1. Validates the destination (defense in depth, allow-list aware).
  2. Records a `Scan` (IP, user-agent, device, country).
  3. Increments `scansCount` atomically.
  4. Issues a 302 redirect.
- Analytics are shown in the dashboard from the `Scan` collection.

---

## Document uploads & auto-delete

PDFs are uploaded **directly from the browser** to Supabase Storage via a signed
URL (minted by `/api/upload-url` with the service-role key). This bypasses
Vercel&apos;s 4.5 MB serverless request-body limit, so files up to **10 MB** are
supported.

**Storage reclamation (auto-delete):**

To keep storage usage down, any document QR whose uploaded PDF is **older than
7 days** (measured from its last `updatedAt`) is automatically removed:

- **`/api/cron/cleanup-documents`** — the scheduled job. For each stale document
  it deletes the file from Supabase Storage (via `src/lib/supabase-server.js`),
  clears the live `url`, sets `expired: true`, and pauses the QR so it never
  serves a dead link. Re-saving a document QR resets the 7-day clock.
- **`vercel.json`** — a daily cron (`0 0 * * *`) invokes the route.
- **`CRON_SECRET`** — protects the endpoint. Vercel automatically sends
  `Authorization: Bearer <CRON_SECRET>`. When unset, the route falls back to a
  same-origin check so it can still be run manually in local dev:
  `curl http://localhost:3000/api/cron/cleanup-documents`

Increase/decrease the retention window in
`src/app/api/cron/cleanup-documents/route.js` (`DOCUMENT_RETENTION_DAYS`).

---

## Security

- **bcrypt** password hashing; NextAuth **JWT** sessions.
- **Login rate-limiting** per account (`src/lib/rate-limit.js`) to slow brute
  force.
- **Redirect URL sanitization** (`validateDestinationUrl`) rejects non-http(s)
  schemes and enforces an optional host allow-list.
- **CSRF origin validation** (`isSameOrigin`) on state-changing API routes.
- **Security HTTP headers** in `next.config.mjs` (CSP, `X-Frame-Options`,
  HSTS, etc.). Note the strict CSP applies **only in production**; `next dev`
  requires looser headers for HMR.
- Service-role keys are **server-only**; browsers only ever use the anon key and
  signed upload URLs.
- The document-cleanup endpoint is guarded by `CRON_SECRET`.

---

## Production deployment (Vercel)

1. Push this repo to GitHub and import it in Vercel (Framework: **Next.js**,
   build command `npm run build`).
2. Add environment variables (see [Environment variables](#environment-variables))
   for **both** Production and Preview (NEXT_PUBLIC_* are inlined into the
   client bundle).
3. In MongoDB Atlas → Network Access, allow access from anywhere (`0.0.0.0/0`).
4. In Supabase → Storage, create a **public** bucket named `pdf`.
5. Add `REDIRECT_ALLOWED_HOSTS` and `CRON_SECRET` as needed.
6. Deploy. The daily document-cleanup cron is defined in `vercel.json`.

---

## Scripts

| Command            | Description                    |
| ------------------ | ------------------------------ |
| `npm run dev`      | Start the dev server (3000)    |
| `npm run build`    | Production build               |
| `npm start`        | Run the production build       |
| `npm run lint`     | Run ESLint                     |
