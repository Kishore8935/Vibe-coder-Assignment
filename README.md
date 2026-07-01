# Wobb Influencer Search — Frontend Assignment

An influencer search & discovery app built with **React 19, TypeScript, Vite, and Tailwind CSS v4**. This repository takes the provided Wobb starter and improves it: fixing bugs, redesigning the UI, moving shared state to Zustand, implementing a persistent "Saved list," and tightening code quality, types, and performance.

> 🚧 **Status: Work in progress.** See the [Progress Log](#progress-log) at the bottom for exactly what's done so far. As of now, planning and environment setup are complete; feature implementation is starting.

---

## Live Demo

_To be added after Vercel deployment._ → `https://<your-app>.vercel.app`

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
| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite dev server            |
| `npm run build`   | Type-check + production build        |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint                           |

---

## Tech Stack

- **React 19** + **TypeScript** + **Vite 8** + **Tailwind CSS v4** (from the starter)
- **Zustand** — shared state for the Saved list _(planned)_
- **shadcn/ui** (Radix primitives) + **lucide-react** — accessible UI components & icons _(planned)_

---

## What I Changed

_Sections are marked ✅ done / 🔧 in progress / ⬜ planned and filled in as work lands._

### 🐛 Bug Fixes ⬜
Identified in the starter (details in [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)):
- Engagement Rate stat multiplied by `10000` instead of `100` (showed ~142% instead of ~1.4%).
- "Engagements" stat rendered a percentage instead of the engagement **count**.
- Username search was case-sensitive (fullname wasn't) → "Instagram" missed `instagram`.
- Dead `clickCount` state in `SearchPage` causing needless re-renders + stale-closure log.
- No error handling / no loading reset on profile load (`ProfileDetailPage`).
- Non-responsive layout: hardcoded `w-[700px]` card and fixed `#root { width: 1126px }`.
- Accessibility gaps: images without `alt`, verified glyph without a label, non-focusable clickable `<div>` cards.
- Removed unused, React-19-incompatible dependency `react-beautiful-dnd`.

### 🗃️ State Management → Zustand ⬜
Shared "Saved list" state implemented with a Zustand store + `persist` middleware (localStorage). The starter had no React Context; per the assignment, Zustand is the state layer.

### ⭐ "Add to List" Feature ⬜
Add/remove profiles to a saved list, deduped by user id, viewable via a header **drawer** and a dedicated **`/list`** page, persistent across refreshes.

### 🎨 UI/UX Redesign ⬜
Modern, responsive, accessible redesign with shadcn/ui — responsive card grid, sticky header with saved-count badge, light/dark mode, loading skeletons, and empty states.

### 🧹 Code Quality ⬜
Feature-oriented folder structure, unified formatting utilities (removed 3 duplicate follower-formatters), accurate TypeScript types matching the JSON data, removed dead `SearchBar` component.

### ⚡ Performance ⬜
Memoized derived lists, `React.memo` on cards, debounced search input, atomic Zustand selectors.

---

## Libraries Added

| Library | Purpose |
| ------- | ------- |
| `zustand` | Shared state management for the Saved list (replaces React Context, persisted to localStorage) |
| `shadcn/ui` (+ `radix-ui`) | Accessible, unstyled UI primitives (button, card, sheet/drawer, dropdown, tooltip, etc.) |
| `lucide-react` | Icon set used throughout the redesigned UI |
| `sonner` | Toast notifications (e.g. "Added to list") |
| `next-themes` | Light/dark mode toggle |
| `clsx` + `tailwind-merge` (`cn()` helper) | Safely compose conditional Tailwind class names |
| `class-variance-authority` | Typed style variants for shadcn components |
| `tw-animate-css` | Small utility animations/transitions |
| `@fontsource-variable/geist` | Self-hosted Geist variable font |
| ~~`react-beautiful-dnd`~~ | **Removed** — unused, deprecated, incompatible with React 19 |

---

## Assumptions

- The starter shipped **no** React Context, so "replace Context with Zustand" is interpreted as "implement the app's shared state with Zustand rather than Context."
- Sample data is static JSON bundled with the app; only a subset of usernames have detailed profile JSON files, so profiles without a matching file show a graceful "could not load" state.
- _(more to be added as decisions are made)_

---

## Trade-offs

- Data is loaded client-side from bundled JSON (no backend/API layer) — matches the starter's setup.
- _(more to be added)_

---

## Remaining Improvements

- Automated tests (Vitest + React Testing Library) for the store, utils, and key components.
- List virtualization if the dataset grows large.
- _(updated as work progresses)_

---

## Progress Log

_Newest first. Dates are IST._

### 2026-07-01 (Step 1: Dependencies & tooling)
- Installed **Zustand** for state management.
- Initialized **shadcn/ui** for Vite + Tailwind v4 (auto-detected the existing `@/*` alias and Radix setup); added components: `button`, `badge`, `input`, `card`, `sheet`, `skeleton`, `tooltip`, `sonner`, `dropdown-menu`.
- Picked up `lucide-react` (icons), `clsx` + `tailwind-merge` + `class-variance-authority` (styling utils), `next-themes` (dark mode), `tw-animate-css` (animations), and the Geist variable font via the shadcn preset.
- Added `src/lib/utils.ts` (`cn()` helper).
- Verified `npm run build` (`tsc -b && vite build`) and `npm run dev` both succeed with no errors.

### 2026-07-01 (Environment setup)
- **Planning:** Read the full starter codebase; produced a detailed implementation plan ([IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)) covering all 7 assignment tasks.
- **Environment diagnosis & fixes:**
  - `npm install` failed with `ERESOLVE` — root cause: `react-beautiful-dnd@13.1.1` (deprecated, unused) requires React 16–18 but the project is on React 19. Resolution: remove the package.
  - `npm run dev` failed with two issues: (1) Node.js `20.17.0` is below Vite 8's minimum (`20.19+`/`22.12+`); (2) missing Rolldown native binding from an incomplete install. Resolution: upgrade Node, then clean reinstall (`node_modules` + `package-lock.json` removed).
- **Docs:** Initialized this submission README as a living document.
- **Environment working:** Upgraded Node to v24.18.0, removed `react-beautiful-dnd`, did a clean reinstall (0 vulnerabilities), and confirmed the dev server runs (Vite 8.1.2 on http://localhost:5173).
- **Next up:** Begin implementation — Step 1 (dependencies + shadcn/ui setup) → bug fixes → Zustand store → Add to List → redesign → quality/perf → deploy.
