# Truesaarthi

Marketing site and admin panel for Truesaarthi, a life and leadership coaching
practice. Next.js 16 (App Router) + Tailwind v4 + Firebase.

Everything on the public site — copy, images, programs, events, articles,
prices, policies — is stored in Firestore and edited at `/admin`. No content
lives in a component.

Pages are rows in a `page_tb` collection keyed by URL. One row carries the
page's content, its SEO metadata and its FAQs together, so a page is edited in
one place — and new pages can be built from blocks and published without a
deploy.

## Getting started

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

**Before the admin panel can save anything, publish the Firestore and Storage
rules.** See [SETUP.md](./SETUP.md) — it takes about five minutes and also
covers loading the starter content and changing the admin password.

Until then the site still renders: every reader falls back to the starter
content in `src/content/`, so a missing document or an unreachable Firestore
degrades to the shipped copy rather than a blank page.

## Layout

```
src/app/(site)/        the public site
src/app/admin/         the admin panel (password-gated)
src/content/           starter content — seeds the database, and is the fallback
  pageTable.js         one row per page: URL, template, meta, content, FAQs
src/lib/content.js     Firestore reads, deep-merged over the defaults, cached
src/lib/admin/         schema, auth and the write actions
src/components/        site components (props only — none of them fetch)
firestore.rules        publish these in the Firebase console
storage.rules
```

The admin panel is generated from `src/lib/admin/schema.js`. Adding an editable
field is one line there plus using it in a component — there are no
hand-written forms.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
