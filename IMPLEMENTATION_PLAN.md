# Wobb Assignment — Comprehensive Implementation Plan

## Context

The folder `vibe-coder-assignment-main` currently holds the **untouched Wobb starter app** — a React 19 + TypeScript + Vite + Tailwind v4 influencer-search app that is "functional but not production-ready." The assignment (PDF + repo README) asks us to take it to a polished, submission-ready state across 7 tasks: fix bugs, redesign the UI, replace React Context with Zustand, implement "Add to List," improve code quality/structure, optimize performance, and use libraries thoughtfully. Deadline: **2 July 2026, 2:00 PM IST** — so all commits must land before then.

This plan turns the starter into a modern, accessible, well-typed app with a persistent "Saved list" feature, deployed to Vercel.

**Decisions locked with the user:**
- **UI:** shadcn/ui + Tailwind v4 (Radix primitives, `lucide-react` icons).
- **Saved-list UX:** **Both** a header-triggered slide-over drawer (with a count badge) **and** a dedicated `/list` route.
- **Bonus:** Deploy to **Vercel** (tests/animations are out of core scope; a few micro-interactions come free with shadcn/Radix; tests noted as a future improvement).
- **Git:** The user runs git. This plan provides explicit **commit checkpoints** (message + command) at each milestone; the folder is **not yet a git repo**, so the first checkpoint is `git init`.

---

## Current state — bugs & issues found (from reading every file)

**Functional bugs**
1. **Engagement Rate stat is 100× too high.** [src/pages/ProfileDetailPage.tsx:99](src/pages/ProfileDetailPage.tsx#L99) does `(user.engagement_rate * 10000).toFixed(2) + "%"`. Rate is a fraction (e.g. `0.01425` = 1.425%). Should be `* 100`. A correct helper already exists: `formatEngagementRate` in [src/utils/formatters.ts:11](src/utils/formatters.ts#L11) — reuse it.
2. **"Engagements" stat shows the wrong value.** [src/pages/ProfileDetailPage.tsx:131-138](src/pages/ProfileDetailPage.tsx#L131-L138) is labeled "Engagements" but renders `formatEngagementRate(user.engagement_rate)` (a percentage) instead of the `user.engagements` **count**. Should show the formatted count.
3. **Case-sensitive username search.** [src/utils/dataHelpers.ts:27](src/utils/dataHelpers.ts#L27) uses `p.username.includes(query)` (raw) while fullname is lower-cased. Searching "Instagram" misses username `instagram`. Lower-case both sides; also `trim()` the query.
4. **Dead click-counter causing re-renders.** [src/pages/SearchPage.tsx:11-19](src/pages/SearchPage.tsx#L11-L19): `clickCount` is never rendered, uses a stale-closure update (`setClickCount(clickCount + 1)` + logs stale value), and every click re-renders SearchPage → re-runs `extractProfiles`/`filterProfiles`. Remove it entirely.
5. **No error handling on profile load.** [src/pages/ProfileDetailPage.tsx:27-30](src/pages/ProfileDetailPage.tsx#L27-L30) — the `loadProfileByUsername(...).then(...)` has no `.catch`; a rejection leaves `loaded` false forever. Add try/catch + `loaded` reset when `username` changes (stale-data race when navigating profile→profile).

**Responsiveness / layout bugs**
6. **Hardcoded card width.** [src/components/ProfileCard.tsx:34](src/components/ProfileCard.tsx#L34) `w-[700px]` overflows mobile. Make fluid/grid.
7. **Fixed-width app shell.** [src/index.css:55-65](src/index.css#L55-L65) `#root { width: 1126px; text-align:center }` fights any responsive redesign. Replace with a fluid container.

**Accessibility**
8. Images have no `alt` ([ProfileCard.tsx:37](src/components/ProfileCard.tsx#L37), [ProfileDetailPage.tsx:72-75](src/pages/ProfileDetailPage.tsx#L72-L75)).
9. Verified "✓" is a bare glyph with no accessible label ([src/components/VerifiedBadge.tsx](src/components/VerifiedBadge.tsx)).
10. Cards are clickable `<div>`s (not keyboard-focusable/operable) — [ProfileCard.tsx:32-36](src/components/ProfileCard.tsx#L32-L36).

**Code quality / structure**
11. **Three duplicate follower-formatters** with inconsistent rounding: `formatFollowers` ([formatters.ts:1](src/utils/formatters.ts#L1)), `formatFollowersDetail` ([ProfileDetailPage.tsx:9](src/pages/ProfileDetailPage.tsx#L9)), `formatFollowersLocal` ([ProfileCard.tsx:12](src/components/ProfileCard.tsx#L12)). Collapse to one utility.
12. **Dead component:** [src/components/SearchBar.tsx](src/components/SearchBar.tsx) is unused (the real input lives in `PlatformFilter`). Remove or repurpose.
13. **Duplicated TODO comments** and two disabled "Add to List" stubs ([ProfileCard.tsx:46-54](src/components/ProfileCard.tsx#L46-L54), [ProfileDetailPage.tsx:151-158](src/pages/ProfileDetailPage.tsx#L151-L158)) — the feature to build.
14. **Types don't match data.** Search JSON has `account_type` (number) and detail JSON has many fields (`sec_uid`, `stat_history`, `top_posts`, `geo`, `contacts`, `total_likes`, `avg_shares`, `avg_saves`, `language`…) not in [src/types/index.ts](src/types/index.ts). `handle`/`avg_reels_plays` in the type never appear in data. Tighten types to reality.

**Dependency issue**
15. **`react-beautiful-dnd@13.1.1` is unused and incompatible with React 19** (peer-deps React 16–18; the library is deprecated). Remove it — nothing in the requirements needs drag-and-drop.

**Performance**
16. `extractProfiles`/`filterProfiles` recompute every render (no `useMemo`); `ProfileCard` isn't memoized; the whole list re-renders on each keystroke.

---

## Target architecture

Reorganize into a clear, feature-oriented structure:

```
src/
  components/
    ui/                 # shadcn/ui primitives (button, badge, input, dialog, sheet, skeleton, card…)
    layout/             # Layout, Header (with Saved-count badge + theme toggle)
    profile/            # ProfileCard, ProfileList, ProfileStats, VerifiedBadge
    saved/              # SavedListDrawer (Sheet), SavedProfileItem, SavedListEmpty
  features/
    search/             # PlatformFilter, SearchInput, useFilteredProfiles hook
  pages/                # SearchPage, ProfileDetailPage, SavedListPage (/list), NotFoundPage
  store/                # useSavedStore.ts (Zustand + persist)
  lib/                  # utils.ts (cn helper for shadcn)
  utils/                # formatters.ts (single formatNumber/formatEngagementRate), dataHelpers.ts, profileLoader.ts
  types/                # index.ts (accurate types)
```

Keep the existing `@/*` alias — already wired in [vite.config.ts:9-13](vite.config.ts#L9-L13) and [tsconfig.app.json:11-13](tsconfig.app.json#L11-L13), so shadcn init will detect it.

---

## Implementation steps

### 1. Dependencies & tooling
- Add: `zustand`, `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority` (+ Radix packages pulled in by shadcn components).
- Remove: `react-beautiful-dnd`.
- Init shadcn/ui for Vite + Tailwind v4 + React 19 (`npx shadcn@latest init`, use `--force` if React 19 peer warnings block it). Generate primitives: `button`, `badge`, `input`, `card`, `sheet` (drawer), `skeleton`, `tooltip`, `sonner` (toasts), `dropdown-menu`.
- Create `src/lib/utils.ts` with the `cn()` helper.

### 2. Zustand store — the app's shared state (replaces "React Context")
> Note: the starter has **no** existing React Context. The README/PDF wording means "implement shared state with Zustand, not Context." We satisfy this by making the Saved list a Zustand store.

Create `src/store/useSavedStore.ts`:
- State: `saved: SavedProfile[]` (store a compact shape: `user_id`, `username`, `fullname`, `picture`, `is_verified`, `followers`, `platform`, `url`).
- Actions: `addProfile(p)` (**dedupe by `user_id`** — no-op if present), `removeProfile(user_id)`, `clear()`, and a selector/helper `isSaved(user_id)`.
- **Persistence:** wrap with Zustand `persist` middleware (localStorage key e.g. `wobb:saved-list`) → satisfies "persistent after refresh."
- Consume with **atomic selectors** (`useSavedStore(s => s.saved)`, etc.) to avoid needless re-renders.

### 3. "Add to List" feature (Task 4)
- Replace the two disabled stubs with an **`AddToListButton`** component that reads `isSaved(user_id)` and toggles add/remove, with a `sonner` toast on add/remove. Used in both `ProfileCard` and `ProfileDetailPage`. Stop click-propagation on the card so the button doesn't trigger navigation.
- **Header** (`components/layout/Header`): a "Saved" button showing a live count **badge**; opens the **drawer** (shadcn `Sheet`).
- **`SavedListDrawer`**: lists saved profiles with avatar, name, remove (×) button, "Clear all," and a link to the full `/list` page; empty-state when none.
- **`/list` route** (`SavedListPage`): full-page grid of saved profiles (reuses `ProfileCard` in a "saved" variant) with remove + link to each profile; empty-state with CTA back to search. Register route in [src/App.tsx](src/App.tsx).

### 4. Bug fixes (batch)
Apply fixes for issues 1–10, 16 above. Concretely: reuse `formatEngagementRate` for the rate stat; render `user.engagements` (count) for the Engagements stat; case-insensitive+trimmed search in `dataHelpers`; delete `clickCount`; add try/catch + loading reset in `ProfileDetailPage`; make cards responsive; add `alt` text and `aria-label`s; make cards keyboard-accessible (use a `<Link>`/`role=button` + focus ring).

### 5. Redesign UI/UX (Task 2) with shadcn/ui
- Rewrite `index.css`: keep `@import "tailwindcss"`, drop the fixed `#root` width and `text-align:center`; keep design tokens as Tailwind theme vars; support light/dark (there's already a `prefers-color-scheme` block — expose a manual toggle via `dropdown-menu`).
- **Header:** sticky, brand + search-context, Saved badge, theme toggle.
- **Dashboard (`SearchPage`):** platform filter as segmented control/tabs, prominent search input with icon, results as a **responsive card grid** (1/2/3 cols), result-count text, skeletons while "loading," and a friendly empty-state.
- **Profile detail:** hero header (avatar, name, verified, platform pill, follower count), a **stats grid** built from real fields, external link button, and the Add/Remove button.
- Consistent spacing, focus states, hover/active micro-interactions (Radix/shadcn built-ins).

### 6. Code quality & performance (Tasks 5 & 6)
- Single `formatNumber` (followers/likes/views) + `formatEngagementRate` in `utils/formatters.ts`; delete the two local dupes.
- Delete dead `SearchBar.tsx`.
- Accurate TypeScript types in `types/index.ts` reflecting the JSON (make rarely-present fields optional; add `account_type`, detail-only fields as optional). No `any`.
- `useMemo` the derived `extractProfiles`/`filterProfiles` (memoize per `platform`/`query`); wrap `ProfileCard` in `React.memo`; debounce the search input (small `useDebouncedValue` hook) for smoother typing.
- Extract a `useFilteredProfiles(platform, query)` hook to keep `SearchPage` lean.

### 7. Deployment (Bonus)
- Add SPA rewrite config so `/profile/*` and `/list` deep-links work: `vercel.json` with a catch-all rewrite to `/index.html` (React Router uses `BrowserRouter`).
- Deploy via Vercel; put the live URL in the README.

### 8. README (required)
Rewrite `README.md` to cover: what changed (bug list + features), libraries added (zustand, shadcn/ui, lucide, etc.) and why, assumptions (e.g. "starter had no Context; Zustand is the state layer"; only some usernames have detail JSON), trade-offs (client-side JSON data, no backend), remaining improvements (tests, virtualized lists), and the live Vercel URL.

---

## Git commit checkpoints (user runs these)

The folder isn't a git repo yet. Suggested meaningful history — run each after the corresponding milestone:

1. **Init & baseline**
   `git init && git add -A && git commit -m "chore: import starter project as baseline"`
2. **Tooling** — `git commit -am "chore: add zustand + shadcn/ui, remove unused react-beautiful-dnd"`
3. **Bug fixes** — `git commit -am "fix: engagement-rate/engagements stats, case-insensitive search, remove dead click-counter, add profile-load error handling"`
4. **Zustand store** — `git commit -am "feat: add persistent saved-list store with zustand"`
5. **Add to List feature** — `git commit -am "feat: implement Add to List (drawer, /list page, dedupe, remove, persistence)"`
6. **Redesign** — `git commit -am "feat: redesign UI with shadcn/ui — responsive, accessible, dark mode"`
7. **Quality/perf** — `git commit -am "refactor: unify formatters, tighten types, memoize list + debounce search"`
8. **Deploy + docs** — `git commit -am "docs: rewrite README; chore: add vercel SPA config"`

Then create a **new** GitHub repo (not a fork), `git remote add origin …`, `git push -u origin main`.

---

## Verification

- `npm install` clean (no react-beautiful-dnd peer conflicts).
- `npm run lint` passes (note strict `noUnusedLocals`/`noUnusedParameters` in [tsconfig.app.json:25-26](tsconfig.app.json#L25-L26)).
- `npm run build` succeeds (`tsc -b && vite build`) — **required by the checklist**.
- `npm run dev` manual pass:
  - Switch platforms (Instagram/YouTube/TikTok); search is case-insensitive; count updates.
  - Open a profile with a detail file (`mrbeast`, `cristiano`, `khaby.lame`, `tseries`, `instagram`, `MrBeast6000`): Engagement Rate shows a sane % (~1.4%, not 142%), Engagements shows a count; non-existent detail → graceful "could not load."
  - Add to List from both card and detail; badge count increments; **duplicates are ignored**; open drawer and `/list`; remove works; **refresh the page → list persists**.
  - Resize to mobile width → layout is responsive (no 700px/1126px overflow); keyboard-tab through cards/buttons; verified badge is announced.
- Confirm the deployed Vercel URL loads and deep-links (`/list`, `/profile/mrbeast`) work.
