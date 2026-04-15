# BetterBankings Frontend — Context for Claude

> Next.js 14 (App Router) + TypeScript + React 19 + Tailwind CSS 4.
> No UI library (no shadcn/radix) — all components are custom.

---

## Quick Start

```bash
npm install                          # also runs: prisma generate
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8080/api
npm run dev                          # :3000
npm run build && npm start           # production
```

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 16.0.10 (App Router) |
| Language | TypeScript 5 |
| React | 19.2.1 |
| Styling | Tailwind CSS 4 + PostCSS |
| Animations | Framer Motion 12 |
| Icons | Lucide React 0.561 |
| Rich text | Tiptap 3.x (headless) |
| Math rendering | KaTeX 0.16 |
| Document viewer | react-pageflip 2.0 |
| Image CDN | Cloudinary 2.8 |
| Auth utilities | jsonwebtoken 9 + bcryptjs 3 |
| Class utilities | clsx + tailwind-merge |
| ORM client | Prisma Client 5.22 (client-side schema only) |

---

## Environment Variables

```env
# .env.local (required)
NEXT_PUBLIC_API_URL=http://localhost:8080/api   # dev
# NEXT_PUBLIC_API_URL=https://betterbankings.com/api  # prod

# Optional (Cloudinary client-side uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

---

## Directory Structure

```
betterbankings-fe/
├── app/                         # Next.js App Router
│   ├── layout.tsx               # Root layout: AuthProvider, Sidebar, metadata/SEO
│   ├── page.tsx                 # Home page: Hero + all landing sections
│   ├── globals.css              # Global Tailwind base styles
│   ├── not-found.tsx            # 404 page
│   ├── robots.ts                # robots.txt generation
│   ├── sitemap.ts               # sitemap.xml generation
│   │
│   ├── auth/                    # Authentication pages
│   │   ├── page.tsx             # Login + signup tabs
│   │   ├── verify-email/        # Post-signup email verification gate
│   │   ├── forgot-password/     # Request password reset email
│   │   └── reset-password/      # Reset form (reads ?token= from URL)
│   │
│   ├── regmaps/                 # Basel regulatory map (hierarchical navigation)
│   │   ├── layout.tsx           # Shared layout
│   │   ├── page.tsx             # Standards listing
│   │   ├── [standard]/          # Standard detail → chapters
│   │   │   └── [chapter]/       # Chapter detail → sections → subsections
│   │   └── category/[id]/       # Category-filtered standards
│   │
│   ├── betterbankings-angle/    # Podcast platform
│   │   └── page.tsx             # Category filter + podcast grid
│   │
│   ├── b-foresight/             # Banking analytics & data visualization
│   │   ├── page.tsx             # Overview/landing
│   │   ├── individual-bank-data/
│   │   │   ├── capital-solvency/
│   │   │   ├── credit-market-risk/
│   │   │   ├── funding-liquidity/
│   │   │   ├── performance-monitoring/
│   │   │   └── custom-data-visualization/
│   │   └── industry-bank-data/
│   │       ├── deposit/
│   │       ├── lending/
│   │       ├── market-exchange-rate/
│   │       ├── pass-through-rate/
│   │       └── rate-comparison/
│   │
│   ├── advisory-products/       # Advisory products page
│   ├── advisory-services/       # Advisory services page
│   ├── ilaap-workshop/          # Workshop landing + registration form
│   ├── notifications/           # User notifications page
│   ├── settings/                # User settings (account + password)
│   ├── count/                   # Rate limiting demo page
│   ├── coming-soon/             # Placeholder pages
│   │
│   └── admin/                   # Admin dashboard (requires admin role)
│       ├── angle/               # Podcast management
│       ├── basel/               # Basel content management
│       ├── notifications/       # Notification management
│       └── workshop/            # Workshop registration list + CSV export
│
├── app/api/                     # Next.js Route Handlers (server-side API proxies)
│   ├── auth/                    # Auth proxy routes
│   ├── basel/                   # Basel proxy routes
│   ├── angle/                   # Podcast proxy routes
│   ├── count/                   # Rate limit routes
│   ├── notifications/           # Notification routes
│   └── settings/                # Settings routes
│
├── components/                  # All React components (custom, no UI library)
│   ├── Sidebar.tsx              # Main navigation sidebar (~29K lines, complex)
│   ├── Hero.tsx                 # Landing hero section
│   ├── MissionSection.tsx       # Mission section
│   ├── ServicesSection.tsx      # Services overview
│   ├── WhySection.tsx           # Why BetterBankings section
│   ├── StatsSection.tsx         # Stats/metrics section
│   ├── TeamSection.tsx          # Team section
│   ├── CTASection.tsx           # Call to action section
│   ├── Footer.tsx               # Site footer
│   ├── Carousel.tsx             # Image carousel
│   ├── Magazine.tsx             # Magazine-style layout
│   ├── MagazinePage.tsx         # Individual magazine page
│   ├── AnalysisBox.tsx          # Rich text analysis editor/viewer (B-Foresight)
│   ├── RestrictedViz.tsx        # Gate component for authenticated-only visualizations
│   ├── SEOSchema.tsx            # JSON-LD structured data component
│   ├── AdvisoryHero.tsx         # Advisory page hero
│   ├── AdvisoryFeatures.tsx     # Advisory features grid
│   ├── AdvisoryProducts.tsx     # Products component
│   ├── AdvisoryServicesList.tsx # Services list
│   ├── AdvisoryStats.tsx        # Advisory stats
│   ├── AdvisoryMagazine.tsx     # Advisory magazine component
│   ├── AdvisoryCTA.tsx          # Advisory CTA
│   └── editor/                  # Tiptap editor components
│
├── contexts/
│   └── AuthContext.tsx          # Global auth state + all auth methods
│
├── hooks/
│   └── useAuth.ts               # useAuth() hook — reads AuthContext
│
├── lib/
│   ├── api.ts                   # Centralized API client + all typed wrappers
│   ├── auth.ts                  # Auth utilities (server-side token parsing)
│   ├── admin.ts                 # Admin utilities / checks
│   ├── cache.ts                 # Cache helpers
│   ├── cloudinary.ts            # Cloudinary config
│   ├── prisma.ts                # Prisma client singleton
│   ├── utils.ts                 # General utilities
│   └── validation.ts            # Form validation helpers
│
├── prisma/
│   └── schema.prisma            # Prisma schema (client-side only; backend uses GORM)
│
├── public/                      # Static assets (images, icons, favicons)
├── next.config.ts               # Security headers, image optimization, compression
├── package.json
└── tsconfig.json
```

---

## Auth System

### `contexts/AuthContext.tsx`

Global `AuthProvider` wraps the entire app. Provides `AuthContextType`:

```typescript
interface User {
  id: string; email: string; name: string;
  phone: string | null; position: string | null; organization: string | null;
  role: string;  // "user" | "admin"
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn(email, password): Promise<{ success, error?, emailVerified?, email? }>
  signUp(data): Promise<{ success, error?, emailSent? }>
  signOut(): Promise<void>
  refreshUser(): Promise<void>
  forgotPassword(email): Promise<{ success, error? }>
  resetPassword(token, password, confirmPassword): Promise<{ success, error? }>
  resendVerification(email): Promise<{ success, error? }>
}
```

- On mount: calls `GET /api/auth/me` to hydrate `user` state
- Auth stored in HTTP-only cookie set by backend — NOT localStorage
- All fetch calls use `credentials: "include"`

### `hooks/useAuth.ts`
```typescript
import { useAuth } from "@/hooks/useAuth";
const { user, loading, signIn, signOut } = useAuth();
```

### Checking admin:
```typescript
const { user } = useAuth();
if (user?.role === "admin") { /* show admin UI */ }
```

---

## API Client (`lib/api.ts`)

### `apiRequest(endpoint, options)`
Base function. Auto-prepends `NEXT_PUBLIC_API_URL`. Sets `credentials: "include"` and `Content-Type: application/json`. Throws `Error` with server message on non-ok responses.

### Available exports:
```typescript
authAPI.signin({ email, password })
authAPI.signup({ email, password, name, phone?, position?, organization? })
authAPI.getMe()
authAPI.signout()

baselAPI.getStandards()
baselAPI.getChapters(standardId?)
baselAPI.getChapter(id)
baselAPI.getSections(chapterId?)
baselAPI.getSubsections(sectionId?)
baselAPI.getSubsection(id)
baselAPI.search(query)
baselAPI.getUpdates()
baselAPI.createStandard(data)   // admin
baselAPI.createChapter(data)    // admin
baselAPI.createSection(data)    // admin
baselAPI.createSubsection(data) // admin
baselAPI.createUpdate(data)     // admin

podcastAPI.getCategories()
podcastAPI.getPodcasts(categoryId?, search?)
podcastAPI.getPodcast(id)
podcastAPI.createCategory(data)       // admin
podcastAPI.createPodcast(data)        // admin
podcastAPI.updatePodcast(id, data)    // admin
podcastAPI.deletePodcast(id)          // admin

notificationAPI.getAll()
notificationAPI.getUnread()
notificationAPI.markAsRead(id)
notificationAPI.markAllAsRead()
notificationAPI.create(data)    // admin
notificationAPI.delete(id)      // admin

settingsAPI.updateAccount(data)
settingsAPI.changePassword({ currentPassword, newPassword })

foresightAPI.getAnalysisBox(page, tabKey)
foresightAPI.upsertAnalysisBox({ page, tabKey, content })  // admin
foresightAPI.deleteAnalysisBox(page, tabKey)               // admin

workshopAPI.register({ name, company, phone, email, numPeople })
workshopAPI.getRegistrations()      // admin
workshopAPI.exportCSV()             // returns URL string (direct download)
workshopAPI.deleteRegistration(id)  // admin

countAPI.increment()
countAPI.getStatus()

uploadToVPS(file, folder?)
uploadToCloudinary(file, folder?)
deleteFromVPS(filepath)
deleteFromCloudinary(publicId)
```

---

## Component Conventions

- All components are in `components/` — NO shadcn, radix, or any external UI library
- Custom Tailwind classes only; use `clsx` + `tailwind-merge` for conditional classes:
  ```typescript
  import { clsx } from "clsx";
  import { twMerge } from "tailwind-merge";
  const cn = (...inputs) => twMerge(clsx(inputs));
  ```
- Animations via Framer Motion (`motion.div`, `AnimatePresence`)
- Icons from `lucide-react`
- Images use Next.js `<Image>` component from `next/image`

### `Sidebar.tsx`
The main navigation — very large file (~29K lines). Contains:
- All navigation items, routes, section mappings
- Collapsible sections
- Auth state display (user name, role badge)
- Responsive behavior
- Active route highlighting

**Do not refactor or split without careful review — it has complex internal state.**

### `AnalysisBox.tsx`
Admin-editable rich text box shown on B-Foresight pages. Uses Tiptap editor.
- In view mode: renders HTML content
- In edit mode (admin only): full Tiptap editor with toolbar
- Saves to backend via `foresightAPI.upsertAnalysisBox(page, tabKey, content)`
- Each page+tab combination has a unique analysis box

### `RestrictedViz.tsx`
Wraps B-Foresight visualization content. Shows login gate if user is not authenticated.

---

## Page Patterns

### Route layout
All pages use the App Router. No `pages/` directory exists.

### Fetching data
Prefer client-side fetching for dynamic content using `useEffect` + API client:
```typescript
"use client";
import { baselAPI } from "@/lib/api";

useEffect(() => {
  baselAPI.getStandards().then(setStandards).catch(console.error);
}, []);
```

Server components can be used for static/public content but must NOT use auth context (client-only).

### Admin page pattern
```typescript
"use client";
const { user, loading } = useAuth();
if (loading) return <LoadingSpinner />;
if (!user || user.role !== "admin") return <redirect to /auth />;
```

### Next.js Route Handlers (`app/api/`)
These exist as thin server-side proxies to the Go backend. They forward requests and handle cookies. Use them when direct client-to-backend calls need to be proxied through Next.js server.

---

## Tiptap Editor (`components/editor/`)

Used in `AnalysisBox.tsx` and admin content pages. Extensions configured:
- `@tiptap/starter-kit` — bold, italic, heading, lists, code, etc.
- `@tiptap/extension-underline`
- `@tiptap/extension-link`
- `@tiptap/extension-image`
- `@tiptap/extension-table`, `table-row`, `table-cell`, `table-header`
- `@tiptap/extension-text-align`
- `@tiptap/extension-text-style`
- `@tiptap/extension-color`
- `@tiptap/extension-placeholder`

Content is stored as HTML string. Retrieve with `editor.getHTML()`, initialize with `content: htmlString`.

---

## Security Headers (`next.config.ts`)

Applied to all routes (`/:path*`):
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()`

Server Actions body size limit: `50mb` (for PDF uploads).
Image formats: AVIF + WebP.

---

## Basel RegMaps Navigation

The Basel Framework uses a 4-level hierarchy displayed as nested pages:

```
/regmaps                         → list all standards
/regmaps/[standard]              → standard detail + chapters
/regmaps/[standard]/[chapter]    → chapter + sections + subsections
/regmaps/category/[id]           → filter standards by category
```

URL params (`[standard]`, `[chapter]`) are the ID or code of the entity.
Subsections render inline on the chapter page with footnotes, FAQs, and revisions.
BetterBankingNotes (admin-annotated notes) shown if present.

---

## B-Foresight Pages

Two main sections under `/b-foresight/`:
- **Individual Bank Data** — capital, credit/market risk, funding, performance, custom viz
- **Industry Bank Data** — deposit, lending, exchange rates, pass-through rates, rate comparison

Each page has tabs, and each tab can have an `AnalysisBox` (admin-editable rich text).
`RestrictedViz` gates visualization content behind auth.

---

## Key Lib Files

### `lib/auth.ts`
Server-side auth utilities for Route Handlers: parse JWT from cookies, extract user.

### `lib/admin.ts`
Admin role check utilities.

### `lib/validation.ts`
Form validation helpers (email format, password strength, etc.).

### `lib/cache.ts`
Request deduplication / simple memoization helpers.

### `lib/prisma.ts`
Prisma client singleton. Note: Prisma schema (`prisma/schema.prisma`) is client-side only — it is NOT used for database operations (the Go backend owns the DB via GORM). `prisma generate` runs on install to satisfy type generation.

### `lib/cloudinary.ts`
Cloudinary client config for client-side direct uploads using upload presets.

---

## Common Patterns & Pitfalls

- **"use client" directive:** Required for any component using hooks, context, event handlers, or browser APIs. Default is server component in App Router.
- **cookies + credentials:** All API calls must include `credentials: "include"` — auth lives in HTTP-only cookies set by the Go backend.
- **API URL fallback:** `lib/api.ts` and `contexts/AuthContext.tsx` both fall back to `http://localhost:8080/api` for local dev if `NEXT_PUBLIC_API_URL` is not set.
- **Prisma is NOT the DB:** `prisma/schema.prisma` exists for type generation client-side. The actual database is managed entirely by the Go backend's GORM AutoMigrate. Do not run `prisma migrate` or `prisma db push`.
- **No CSP header** in `next.config.ts` — intentionally omitted (likely due to inline scripts or Tiptap requirements). Do not add a restrictive CSP without testing.
- **Sidebar.tsx size:** Do not attempt to fully read or refactor this file without a specific targeted task — it is ~29K lines.
- **Image optimization:** Use `<Image>` from `next/image` for all images. Remote patterns may need adding to `next.config.ts` if new image hosts are introduced.
- **Build command:** `npm run build` runs `prisma generate` first, then `next build`. If Prisma types are stale, run `npx prisma generate` manually.
