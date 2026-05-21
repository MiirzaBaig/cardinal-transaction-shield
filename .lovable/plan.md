# Cardinal · Docs + Cinematic Phase 4

Two parts: (1) author three reference `.md` files at the repo root, (2) execute a focused cinematic upgrade to the **landing page** (navbar, hero, preview card, CTA, background, scroll motion). The `/app` workspace is already polished from Phase 3 and is **out of scope** unless explicitly requested.

---

## Part 1 — Reference docs (root of repo)

### `design.md` — current design system reference
A single source of truth an LLM can read to understand what exists. Contents:
- **Brand**: `Logo.tsx` (`CardinalMark` squircle "C", `CardinalWordmark`), violet identity color `var(--violet)`.
- **Typography**: display font + body font pairing currently in use, weights, tracking conventions.
- **Color tokens** (from `src/styles.css`): `--background`, `--foreground`, `--violet`, `--success`, `--warning`, `--danger`, surface/hairline values, ambient-glow helper.
- **Motion tokens** (from `src/lib/motion.ts`): `ease.outExpo`, `ease.inOutQuint`, `dur.xs…xl`, `spring`, variant presets `fade / riseSm / riseMd / stagger`.
- **Surface utilities**: `.surface-raise`, `.glow-edge`, `.focus-halo`, `.btn-lift`, dot-grid, scan-sweep.
- **Component inventory**: landing (`Navbar`, `Footer`, `Background`, hero on `routes/index.tsx`), app (`AppTopBar`, `Sidebar`, `Stepper`, `TxComposer`, `ScanProgress`, `VerdictHeader`, `RiskMeter`, `ResultPanel`, `SubmittedPanel`, `Select`, `SignalRow`, `DetailsDrawer`).
- **Naming conventions**: route files flat dot-separated, components PascalCase under `src/components/{app,layout,brand,ui}`, hooks in `src/hooks`, pure logic in `src/lib`.
- **Verdict palette**: ALLOW green, REVIEW amber, BLOCK red with exact oklch values.

### `whatwedid.md` — full project changelog (high-level)
Chronological summary from start to today so a fresh LLM can catch up. Sections:
- **Foundation**: TanStack Start scaffold, routes (`/`, `/about`, `/app`), root layout, motion lib added.
- **Brand & Navbar revamp**: squircle "C" monogram replacing Cardinal-outside logo, YC-style rectangular glass navbar with scroll-aware backdrop.
- **App workspace rebuild**: stage machine (compose → scanning → verdict → submitted/cancelled), `Sidebar` with Activity/Balances tabs, custom `Select` replacing native dropdowns, `SubmittedPanel`, sonner toasts.
- **Phase 3 motion**: `src/lib/motion.ts`, cinematic stage transitions with blur-morph, `ScanProgress` rebuilt with dot-grid + scan sweep + propagating rows + waveform + letter reveal + non-uniform pacing, `VerdictHeader` count-up + draw-line + ambient bloom, `SubmittedPanel` SVG checkmark draw, `Sidebar` `layoutId` tab indicator, `surface-raise` / `focus-halo` / `btn-lift` utilities.
- **Files deleted**: `ActivityFeed`, `DemoPresetBar`, `SignalsLog`, `WalletRail` (replaced by Sidebar).
- **Out of scope so far**: real backend, auth, real chain data — everything is mock via `src/lib/mockScan.ts` + `mockData.ts`.

### `latestdesign.md` — notes on the Phase 4 changes done in this turn
Only the deltas from this iteration. Sections per area (Navbar scroll morph, hero entrance choreography, preview card animations, CTA section, background system, scroll choreography). For each: what changed, which files, key values (durations, easings, opacity ranges) so the user can revert by reading this doc.

These three files live at the repo root, are pure markdown, and are not imported anywhere.

---

## Part 2 — Cinematic Phase 4 (landing page only)

### A. Navbar — morphing scroll behavior (`src/components/layout/Navbar.tsx`)
Drive interpolation from `useScroll` + `useTransform` (framer-motion, already installed) instead of the current binary `scrolled` boolean.

Interpolated over scrollY `0 → 120px`:
- Top offset: `0 → 12px` (lifts off screen edge into floating pill).
- Max-width: `1200 → 880px` (compresses).
- Horizontal padding: `24 → 20px`, height `64 → 56px`.
- Border-radius: `0 → 16px` (becomes floating glass panel).
- Background alpha: `rgba(8,8,15, 0.45 → 0.78)`, blur `8 → 20px`, saturate `100 → 150%`.
- Inset highlight + outer shadow fade in over the same range.
- Inner content (logo + nav + CTA) eases spacing via `gap` interpolation.

All transitions via `transform` / `opacity` / `filter` only; spring `{stiffness: 180, damping: 28}`. Mobile: morph disabled (already pinned). Respect `useReducedMotion()`.

### B. Hero (`src/routes/index.tsx`)
- Layered staggered entrance: eyebrow chip (`PHASE 1 · PREVIEW`) → headline (word-by-word `y:14→0, blur 6→0`, 60ms stagger) → body copy → CTA row → trust chips. Total ~1.4s, ease-out-expo.
- Subtle mouse-reactive perspective: hero container reads pointer position, applies max `rotateX 2deg / rotateY 2deg` with damped spring. Disabled on touch / reduced motion.
- Ambient violet bloom behind headline drifts on a 22s loop (translate ±40px, opacity 0.35↔0.55).
- Inline color spans (`allow` / `review` / `block`) get a one-shot underline draw on mount.

### C. Live preview card (right side of hero)
- Card enters with `y:24, blur 10 → 0`, 700ms, 200ms after headline.
- Continuous slow float: `y: ±4px` over 8s ease-in-out, looped.
- Mouse parallax: card tilts inverse to hero tilt (depth illusion), max 4deg.
- Risk score number animates from 0 → 58 via `useMotionValue` + `useTransform` (700ms ease-out-expo) when in view.
- Each signal row pulses its colored dot (1.6s loop, opacity 0.5↔1) and reveals with 80ms stagger after card enters.
- Hover: card lifts `y:-2px`, shadow deepens, ambient glow behind it intensifies (`opacity 0.4 → 0.7`).

### D. CTA section ("Protection from every direction")
- Section gets a layered background: radial violet glow top-center + faint dot-grid + slow gradient drift (30s loop).
- Heading + subhead reveal on scroll via `whileInView` with `riseMd` variant, 80ms stagger.
- Feature tiles (if present) get `surface-raise` + hover lift (`translateY -3px`, shadow grows, ambient inner glow fades in).
- Primary CTA button: hover triggers a sweeping shimmer (linear-gradient pass, 900ms, one-shot per hover).

### E. Background system (`src/components/layout/Background.tsx`)
- Three independently animated radial glows (violet, indigo, faint cyan) with 18s / 26s / 34s loops, translate ±80px, opacity 0.25↔0.55.
- 14px dot-grid overlay at `rgba(255,255,255,0.03)` with very slow drift (`background-position` 0 → 14px over 60s linear).
- Optional film-grain SVG noise at 2% opacity (static, not animated — keeps GPU cost flat).
- All layers `pointer-events-none`, `will-change: transform, opacity`. Disabled under `useReducedMotion()`.

### F. Scroll choreography (sections on `/`)
- Add a small `RevealOnScroll` wrapper component in `src/components/layout/RevealOnScroll.tsx` using `useInView` (framer-motion). Variants: `fade`, `rise`, `riseStagger`. Threshold `0.2`, `once: true`.
- Apply to each landing section (How it works, Roadmap, About teaser, CTA). Section headings rise first, supporting content staggers in.
- Parallax: background ambient layer translates at `0.3x` scroll speed for depth; foreground sections at `1x` (no jank — `transform: translate3d` only).

### G. Performance & accessibility
- All animation uses `transform / opacity / filter` only.
- Single `useScroll` instance shared via context if multiple components need it.
- `useReducedMotion()` short-circuits all loops, parallax, and entrance animations to instant fade.
- No new dependencies — framer-motion already covers everything.

---

## Files touched

```text
design.md                                       (new — design system reference)
whatwedid.md                                    (new — full changelog)
latestdesign.md                                 (new — Phase 4 deltas)
src/components/layout/Navbar.tsx                (scroll-morph rewrite)
src/components/layout/Background.tsx            (multi-layer ambient system)
src/components/layout/RevealOnScroll.tsx        (new — scroll reveal wrapper)
src/routes/index.tsx                            (hero entrance + parallax + CTA section + RevealOnScroll application)
src/styles.css                                  (any new utilities: .floating-nav, .shimmer-sweep, noise layer)
```

## Out of scope
- `/app` workspace (already polished in Phase 3)
- `/about` page motion pass
- Any new business logic, routes, or dependencies
- Real backend / auth
