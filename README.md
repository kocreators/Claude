# Kocreators — Payload CMS + Next.js

A content-managed marketing site for Kocreators, structured after
[andersonsupply.com](https://andersonsupply.com): a services grid, a "how it
works" process section, testimonials, a story/vision block, trusted brands,
and quote/contact forms — all editable from a Payload admin panel.

**This is a marketing site, not a store.** Product ordering and checkout stay
on the existing WooCommerce shop; the "Shop" link and "Get a Quote" buttons
point out to it (configured in **Site Settings** in the admin).

## Stack

- **Payload CMS 3** (Next.js-native — the admin panel and API live inside
  the same Next.js app, no separate backend)
- **Next.js 15** App Router, React Server Components
- **PostgreSQL** via `@payloadcms/db-postgres`
- **Tailwind CSS** for styling
- **Lexical** rich text editor (Payload's default)

## Design system

Colors and type are defined in `tailwind.config.ts` and
`src/app/(frontend)/globals.css`:

- `ink` (#111111) — near-black, dark sections & primary text
- `ink-soft` (#222222) — charcoal, secondary dark surfaces
- `canvas` (#F4F4F1) — warm off-white, alternating light section base
- `canvas-light` (#FFFFFF) — pure white, hero/card surfaces
- `brand` (#007A63) — Kocreators Green, CTAs/links/hover/accents
- `brand-dark` (#00614F) — hover/active state
- Display face: **Anton** (oversized editorial headlines)
- Body face: **Inter**
- Utility/mono face: **IBM Plex Mono** (labels, eyebrows, buttons)

Buttons are flat and sharp-edged (`btn-primary`, `btn-outline`,
`btn-outline-light`, `btn-text` in `globals.css`) — no shadows, gradients,
or rounded corners; photography and the green accent carry the design.

## Content model

| Collection / Global | Purpose |
|---|---|
| `pages` | Every marketing page (Home, Services, Our Work, How It Works, Brand Stores, About, Support, Contact) — built from a drag-and-drop block layout |
| `services` | Custom Apparel, Screen Printing, Embroidery, Promotional Products, Print & Signage, Custom Headwear, Company Stores, Fulfillment & Warehousing, Design Services — each with its own detail page at `/services/[slug]` |
| `projects` | Portfolio / case studies — powers the Our Work grid and `/our-work/[slug]` case-study pages |
| `posts` | Blog / Resources |
| `testimonials` | Reusable quotes, pulled into pages via the Testimonials block or attached directly to a project |
| `media` | Images/video, with responsive image sizes pre-configured |
| `form-submissions` | Leads from the Contact/Quote form block (name, email, org, message) |
| Global: `header` | Nav items — including a mega-menu mode for Services (label + description per item) — and the "Start a Project" button |
| Global: `footer` | Footer columns, tagline, social links |
| Global: `site-settings` | Phone, hours, email, and the external shop/quote URLs |

Page layouts are built from blocks in `src/blocks/`: Hero, TrustedBrands,
PortfolioGrid, ServicesGrid, ProcessSteps, CompanyStores, PromoSpotlight,
Testimonials, StoryStatement, CTABanner, RichText, and ContactForm. Add a new
block by creating a `config.ts` + `Component.tsx` pair and registering it in
`src/collections/Pages.ts` and `src/blocks/RenderBlocks.tsx`.

The Kocreators logo lives at `public/logo.webp` and is rendered directly by
`src/components/Logo.tsx` (not through Payload media) since it's a fixed
brand asset, not editable content.

## Local setup

This environment has no network access, so dependencies were **not**
installed and the dev server was **not** run — do that locally:

```bash
# 1. Install dependencies
npm install

# 2. Start Postgres (or point DATABASE_URI at an existing instance)
#    Easiest local option: Docker
docker run --name kocreators-db -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=kocreators -p 5432:5432 -d postgres:16

# 3. Copy env vars and fill them in
cp .env.example .env
# DATABASE_URI=postgresql://postgres:postgres@localhost:5432/kocreators
# PAYLOAD_SECRET=$(openssl rand -base64 32)

# 4. Generate Payload's admin import map (writes src/app/(payload)/admin/importMap.js)
npx payload generate:importmap

# 5. Generate TypeScript types from your collections (writes src/payload-types.ts)
npm run generate:types

# 6. Run the dev server — this also creates the DB tables on first boot
npm run dev
```

Visit `http://localhost:3000/admin` and create your first admin user (Payload
prompts for this automatically on first run).

Then seed starter content (services, testimonials, header/footer, and all
seven pages) so the site isn't blank:

```bash
npm run seed
```

The public site is at `http://localhost:3000`.

## Filling in real content

The seed script leaves image fields empty and uses placeholder copy. In the
admin:

1. Upload real photography to **Media**.
2. Open each page under **Pages** and attach images to the Hero, Process
   Steps, and Story Statement blocks.
3. Add real logos to the **Trusted Brands** block on the Work page.
4. Update **Site Settings** with the real shop URL, phone, and email.
5. Swap the placeholder testimonials for real ones.

## Deployment

Not yet decided in this project — two straightforward paths:

- **Vercel + hosted Postgres** (Neon or Supabase): set `DATABASE_URI`,
  `PAYLOAD_SECRET`, and `NEXT_PUBLIC_SERVER_URL` as environment variables in
  the Vercel dashboard, connect the repo, deploy. Uploaded media is stored on
  disk by default (`media/` — see `src/collections/Media.ts`), which does
  **not** persist on Vercel's serverless filesystem; add
  `@payloadcms/storage-vercel-blob` (or S3/R2 via `@payloadcms/storage-s3`)
  before going live there.
- **Self-hosted (VPS/Docker)**: disk storage works as-is since the
  filesystem persists; run `npm run build && npm run start` behind a reverse
  proxy (Caddy/Nginx), with Postgres either on the same box or managed.

## What's intentionally not built here

- E-commerce/checkout — stays on the existing WooCommerce shop by design
  (see Site Settings → External Shop URL)
- Auth/login for customers — same reason
- Image assets — placeholders only; add real photography before launch
