# Truesaarthi — setup

The whole site reads its content from Firestore and is edited at `/admin`.

Until Firestore is opened up, **the site still works** — it falls back to the
starter content bundled in `src/content/`, so nothing is ever blank. But the
admin panel cannot save anything, and login will report that it could not reach
the database. So do steps 1 and 2 first.

---

## 1. Publish the Firestore rules

Firebase Console → **Firestore Database** → **Rules** → paste the contents of
[`firestore.rules`](./firestore.rules) → **Publish**.

If you have never created the database: Console → Firestore Database → *Create
database* → pick a region (`asia-south1` for India) → start in **production
mode**, then paste the rules.

## 2. Enable Storage and publish its rules

Console → **Storage** → *Get started* → same region → then **Rules** tab →
paste [`storage.rules`](./storage.rules) → **Publish**.

This is what lets you upload images from the admin panel. Skip it and every
image field still works, but only by pasting a URL.

## 3. Sign in and load the content

1. Run the site (`npm run dev`) and open `/admin`.
2. The password is **`truesaarthi`**.
3. On the dashboard press **Load starter content**. This copies everything in
   `src/content/` into Firestore — including the nine pages into `page_tb`.
   It is safe to press again later: it fills in what is missing and keeps
   whatever you have already written.
4. Go to **Settings → Change password** and set a real one. Do this before you
   share the site with anyone.

After step 3 every page is being served from the database, and every edit you
make in the panel appears on the live site as soon as you save.

---

## What you can edit

| Where | What it controls |
| --- | --- |
| **Pages** | Every page on the site, listed by URL. Open one to edit its words, its Google listing and its questions together. This is also where you add a new page |
| **Brand & Contact** | Name, tagline, email, phone, address, socials, the top menu, the headline numbers |
| **Images** | Every photograph, in one place. Upload a file to replace one |
| **Podcast block** | The dark podcast band on the home page |
| **Programs** | The packages, prices, and what each includes |
| **Events** | Workshops, circles and retreats |
| **Journal** | Articles |
| **Testimonials, Transformation areas, Coaching subjects, Philosophy, Podcast episodes** | The list sections |
| **Messages** | Everything sent through the contact form and the free-guide box |

---

## Pages

Every page lives as one row in the `page_tb` collection, filed under its URL.
Opening a page gives you five tabs, and between them they hold everything that
page shows:

| Tab | What is in it |
| --- | --- |
| **Content** | The words on the page. Which fields appear depends on the template |
| **Blocks** | *(custom pages only)* The stack of sections the page is built from |
| **Search & sharing** | Browser title, Google description, keywords, social image, and a "hide from search engines" switch — with a preview of how the result will look |
| **Questions** | The FAQs for that page. They render on the page and are submitted to Google as an FAQ rich result |
| **Page settings** | The URL, the template, the order in this list, and whether it is live |

### Adding a page

1. **Pages → Add a page**.
2. On **Page settings**, set the URL (say `/coaching-for-teams`) and leave the
   template as **Custom page**.
3. On **Content**, write the heading and intro.
4. On **Blocks**, stack the sections you want — text, card grid, numbered
   steps, headline numbers, questions, a picture, or a call to action.
5. Fill in **Search & sharing**, tick **Live on the site** and save.

The page is served at its URL immediately. To put it in the top menu, add it
under **Brand & Contact → Main menu** — that is deliberately a separate step, so
a page can go live before it is linked.

### Templates

The nine pages that ship with the site use built-in templates (`home`, `about`,
`programs`, `events`, `pricing`, `blog`, `contact`, `legal`), each matching a
hand-built route. **Do not change their URL or template** — the route looks the
page up by path, and moving it means the route falls back to the starter copy.

Anything you add uses the `custom` template and is served by a catch-all route.

### Two formatting rules

Headings support exactly two things, and nothing else:

- `*asterisks*` around a word give it the purple-to-pink gradient.
- A line break in the box becomes a line break on wide screens.

So `Find your direction.\n*Reclaim* your life.` renders as two lines with
"Reclaim" in gradient. There is no HTML anywhere in the database, which is why
an editor cannot accidentally break the layout.

### Images

An image field takes any of three things:

- an **image key** like `heroPortrait` — points at an entry under **Images**, so
  changing it there updates every place it is used;
- an **uploaded file** — press *Upload an image*, which puts it in Firebase
  Storage and fills in the URL;
- a **pasted URL**.

`logo.png` and `hero.png` in `public/` are wired to the `logo` and
`heroPortrait` keys.

---

## If you set this up before pages moved to `page_tb`

Two things to do once:

1. **Re-publish `firestore.rules`.** `page_tb` is a new collection and the rules
   list which collections are readable by name, so an older copy will block it.
2. **Press "Load starter content"** on the dashboard. It writes the nine pages
   into `page_tb` and fills in any fields your existing documents are missing,
   without touching what you have already edited.

The old `settings/home`, `settings/about`, `settings/pricingPage` and similar
documents are no longer read by anything. They do no harm; delete them in the
Firebase console if you want a tidy database.

---

## Security — read this before taking payments

The panel uses **one shared password**, checked by the Next.js server. Your
password is stored as a salted scrypt hash, never in plain text, and never sent
to the browser; the session is an httpOnly, signed cookie that lasts 7 days and
is invalidated the moment you change the password.

**But**: because there is no Firebase Auth user, Firestore cannot tell an
administrator apart from a visitor. That is why `firestore.rules` has to allow
writes. In practice this means someone who finds your project id could write to
your content collections directly, bypassing the panel.

That is an acceptable trade for a brochure site. It is **not** acceptable once
you store client data or payment records. To close it:

1. Console → **Authentication** → enable **Email/Password**, and add yourself as
   a user.
2. Replace the login form with Firebase Auth's `signInWithEmailAndPassword`, and
   send the resulting ID token to the server.
3. In `firestore.rules` and `storage.rules`, change every
   `allow write: if true` to `allow write: if request.auth != null`.

The alternative — and the stronger one — is to add a service account key and do
all writes through the Firebase Admin SDK, which is not subject to rules at all.

---

## Environment variables (optional)

The Firebase web config is inlined in `src/lib/firebase.js` because it is public
by design — it identifies the project, it does not authorise anything. To point
the site at a different Firebase project without editing code, set these in
`.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

---

## How it fits together

```
src/content/          starter content — seeds the database, and is the
                      fallback whenever a document is missing
  pageTable.js        one row per page: URL, template, meta, content, FAQs
src/lib/content.js    reads Firestore, deep-merges over the defaults, caches
src/lib/admin/
  schema.js           declares every editable section and field — the panel
                      is generated from this, there are no hand-written forms
  auth.js             password hashing and the cookie session
  actions.js          every write, each one re-checking the session
src/app/(site)/       the public site
src/app/admin/        the panel
```

Adding a new editable field is one line in `schema.js` plus using it in the
component. The form, the save and the validation come for free.

## Caching

Reads are cached for five minutes and tagged. Every save calls `revalidateTag`
and `revalidatePath`, so edits appear immediately rather than after the timer.
