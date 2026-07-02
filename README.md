# Influencer Search — Wobb Frontend Assignment

An influencer search & discovery app built with **React 19, TypeScript, Vite, and Tailwind CSS v4**. This takes the provided Wobb starter and turns it into a polished, production-minded application: bugs fixed, UI fully redesigned, shared state moved to Zustand, a persistent "Saved list" feature implemented, and code quality, types, performance, and tests added throughout.

**Live demo:** [https://vibe-coder-assignment-one.vercel.app](https://vibe-coder-assignment-one.vercel.app)

---

## Features

- **Search & filter** creators by platform (Instagram / YouTube / TikTok) and by username or full name.
- **Profile details** — rich stats view loaded from per-profile JSON, with a loading skeleton and graceful "not found" handling.
- **Save profiles** — add/remove creators to a personal list that is **deduplicated** and **persists across page reloads** (localStorage). View them in a header slide-over drawer or on a dedicated `/list` page.
- **Light / dark / system theme**, responsive from mobile to desktop, keyboard-accessible, with toast feedback and a 404 page.

---

## Tech Stack

- **React 19** + **TypeScript** + **Vite 8** + **Tailwind CSS v4** (from the starter)
- **Zustand** (+ `persist`) — shared state for the Saved list
- **shadcn/ui** (Radix primitives) + **lucide-react** — accessible components & icons
- **next-themes** — theme switching · **sonner** — toasts
- **Vitest** + **React Testing Library** — unit/component tests

---

## Getting Started

### Prerequisites
- **Node.js `20.19+` or `22.12+`** — required by Vite 8 / Rolldown. Older versions (e.g. 20.17) will fail to start the dev server. Check with `node -v`.

### Install & run
```bash
npm install
npm run dev
```
Then open **http://localhost:5173**.

### Scripts
| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start the Vite dev server            |
| `npm run build`    | Type-check + production build        |
| `npm run preview`  | Preview the production build locally |
| `npm run lint`     | Run ESLint                           |
| `npm run test`     | Run the test suite once (Vitest)     |
| `npm run test:watch` | Run tests in watch mode            |

---

## Project Structure

```
src/
  components/
    layout/     Layout, Header, ThemeToggle
    profile/    ProfileCard, ProfileList, VerifiedBadge, AddToListButton, PlatformBadge
    saved/      SavedListDrawer
    ui/         shadcn/ui primitives
  features/
    search/     PlatformFilter, useFilteredProfiles
  hooks/        useDebouncedValue
  pages/        SearchPage, ProfileDetailPage, SavedListPage, NotFoundPage
  store/        useSavedStore (Zustand + persist)
  utils/        dataHelpers, formatters, profileLoader
  types/        shared TypeScript types
```

---

## What I Changed

### 🐛 Bugs & correctness
- **Engagement Rate** stat multiplied by `10000` instead of `100` (showed ~142% instead of ~1.43%) — now reuses the shared `formatEngagementRate` helper.
- **"Engagements"** stat rendered the rate percentage instead of the engagement **count** — now shows the formatted count.
- **Search** was case-sensitive on username (but not full name), so "INSTAGRAM" missed `instagram`. Now trimmed + case-insensitive on both fields.
- **Broken route:** 2 of 10 YouTube records have no `username` (only `handle`), which produced a dead `/profile/undefined` link. `extractProfiles` now falls back to `username || handle || user_id`.
- **Profile loading** now has error handling (`.catch`) and a race guard, and shows a loading state when switching between profiles (no stale-data flash).
- Removed the dead `clickCount` state (unused, caused re-renders + a stale-closure log) and the prop plumbing it required.
- Removed the unused, React-19-incompatible `react-beautiful-dnd` dependency.

### 🗃️ State management → Zustand
Shared "Saved list" state lives in [src/store/useSavedStore.ts](src/store/useSavedStore.ts) — a Zustand store with `persist` middleware (localStorage key `wobb:saved-list`). The starter shipped no React Context, so per the assignment Zustand is the app's state layer. Consumed via atomic selectors (`useIsProfileSaved`, `useSavedCount`) so unrelated updates don't re-render every card.

### ⭐ "Add to List" feature
- `AddToListButton` — reusable toggle (icon-only on cards, labeled on the detail page) with toast feedback, used on both `ProfileCard` and the detail page.
- **Deduplicated** by `user_id` at the store level, **removable** per-item, and **persistent** across reloads.
- Viewable via a header **slide-over drawer** and a dedicated **`/list`** page, both with empty states.

### 🎨 UI/UX redesign
- Sticky header with brand mark, Saved count badge, and a light/dark/system theme toggle.
- Dashboard: segmented platform filter (proper toggle-group semantics — `role="group"` + `aria-pressed`, not misused ARIA tabs), icon search input, responsive **1/2/3-column card grid**, platform-colored badges.
- Profile detail: hero card + responsive stats grid + loading skeleton.
- Rewrote `index.css` around shadcn's design tokens (light + dark); removed the legacy fixed-width `#root` shell. Added a friendly **404 page**.
- **Micro-interactions** (`framer-motion`): staggered card entrance on the results grid (replays on tab switch), animated add/remove in the saved drawer, and a subtle hover lift on cards — all automatically disabled for users with `prefers-reduced-motion` (`MotionConfig reducedMotion="user"` + Tailwind `motion-safe:`).

### 🧹 Code quality
- **Feature-oriented folder structure** (see above); deleted the dead `SearchBar` component.
- Unified number formatting on shared helpers (removed 3 duplicate local formatters).
- Tightened `FullUserProfile` to only the fields the app actually reads.

### ⚡ Performance
- `useFilteredProfiles` memoizes the derive-and-filter step so it only recomputes when `platform` or the (debounced) query changes.
- `useDebouncedValue` keeps the input instant while deferring filtering by 200ms.
- `ProfileCard` wrapped in `React.memo`; Zustand consumed via atomic selectors.

### 🛠️ Developer experience
- **GitHub Actions CI** ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs lint, the 19-test suite, and the production build on every push and pull request — complementing Vercel's deploy-time build check, which doesn't run tests.

### ✅ Testing
19 tests across 4 files (Vitest + React Testing Library):
- `useSavedStore` — add, dedupe-by-id, remove, clear, and localStorage persistence.
- `filterProfiles` — case-insensitivity, trimming, empty query; `extractProfiles` username fallback; `isPlatform`/`getPlatformLabel`.
- `formatFollowers` / `formatEngagementRate` — including the fixed engagement-rate math.
- `AddToListButton` — add/remove toggle updates the store and reflects accessible state.

---

## Libraries Added

| Library | Purpose |
| ------- | ------- |
| `zustand` | Shared Saved-list state (replaces Context), persisted to localStorage |
| `shadcn/ui` (+ `radix-ui`) | Accessible UI primitives (button, card, sheet, dropdown, tooltip, …) |
| `lucide-react` | Icon set |
| `sonner` | Toast notifications |
| `next-themes` | Light/dark/system theme |
| `framer-motion` | Micro-interactions (staggered grid entrance, animated drawer add/remove) with reduced-motion support |
| `clsx` + `tailwind-merge` | `cn()` class composition helper |
| `class-variance-authority` | Typed style variants for components |
| `vitest`, `@testing-library/*`, `jsdom` | Unit/component testing |
| ~~`react-beautiful-dnd`~~ | **Removed** — unused, deprecated, incompatible with React 19 |

---

## Assumptions

- The starter shipped **no** React Context, so "replace Context with Zustand" is interpreted as "implement the app's shared state with Zustand rather than Context."
- Data is static JSON bundled with the app (no backend). Only a subset of usernames have a detailed profile JSON file, so clicking a creator without one shows a graceful "could not load" message rather than an error — this is a data-completeness limit of the sample set, not a bug.
- A saved profile stores a compact snapshot (id, handle, name, avatar, followers, platform, url) — enough to render the list without re-fetching.

## Trade-offs

- **Client-side bundled JSON** instead of an API layer — matches the starter and keeps the app deployable as a static site, at the cost of realistic data-fetching/caching concerns.
- **shadcn/ui (copied components)** over a packaged UI kit — more files in the repo, but full control over styling/behavior and no runtime lock-in.
- **Debounced filtering (200ms)** trades a tiny delay for smoother typing on large lists; imperceptible on the current 10-item lists but scales better.

## Remaining Improvements

- Swap the bundled JSON for a real API with a data-fetching layer (e.g. TanStack Query) and list virtualization for large result sets.
- Deeper a11y (skip-to-content link, `aria-live` announcement of the result count).
- Broaden test coverage to pages/routing and add a CI workflow (build + lint + test on push).

---

## Deployment

The app is a static SPA. `vercel.json` adds an SPA rewrite so client-side routes (`/list`, `/profile/:username`) resolve on direct load/refresh.

**Deploy on Vercel:** import the repo at [vercel.com/new](https://vercel.com/new) → Vercel auto-detects Vite (build `npm run build`, output `dist`) → Deploy. No environment variables required.
