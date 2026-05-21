# Cardinal — Design System Reference

Single source of truth for the current visual & motion system. Optimized for LLM/agent ingestion: every section is short, declarative, and points at the file that owns it.

## 1. Brand
- **Logo**: `src/components/brand/Logo.tsx`
  - `CardinalMark` — squircle plate (16px radius) with violet gradient and a refined "C" monogram. Used inside the app (sidebar collapsed, top bar).
  - `CardinalWordmark` — `CardinalMark` + "Cardinal" wordmark in display font. Used in marketing navbar/footer.
- **Identity color**: `var(--violet)` `#8b5cf6`.
- **Voice**: institutional, calm, plain-English. Never crypto-flashy.

## 2. Typography (`src/styles.css` `@theme inline`)
- `--font-display`: **Space Grotesk** (medium 500 for h1/h2/h3, tight tracking `-0.02em` → `-0.025em`).
- `--font-sans`: **Inter** (body, 14–16px, leading-relaxed).
- `--font-mono`: **JetBrains Mono** (eyebrows, step numbers, hashes, uppercase tracking `0.14em`–`0.22em`).
- Font-feature-settings: `"cv11","ss01","ss03"`.

## 3. Color tokens (`:root` in `src/styles.css`)
| Token | Value | Use |
|---|---|---|
| `--background` | `#08080f` | Page background |
| `--foreground` | `#ececf2` | Default text |
| `--surface` | `#0e0e16` | Cards |
| `--surface-2` | `#14141e` | Inputs, popovers |
| `--surface-3` | `#1a1a26` | Accent surfaces |
| `--hairline` | `rgba(255,255,255,0.07)` | Default borders |
| `--hairline-strong` | `rgba(255,255,255,0.12)` | CTA borders |
| `--violet` | `#8b5cf6` | Brand / primary |
| `--indigo` | `#6366f1` | Secondary accent |
| `--cyan` | `#06b6d4` | Tertiary accent |
| `--success` | `#34d399` | ALLOW verdict |
| `--warning` | `#fbbf24` | REVIEW verdict |
| `--danger` | `#ef4444` | BLOCK verdict |
| `--muted-foreground` | `#9696a8` | Secondary text |

## 4. Verdict palette
- **ALLOW** → `--success` `#34d399` with `rgba(52,211,153,0.10)` tints.
- **REVIEW** → `--warning` `#fbbf24` with `rgba(251,191,36,0.10)` tints.
- **BLOCK** → `--danger` `#ef4444` with `rgba(239,68,68,0.10)` tints + one-shot border pulse.

## 5. Motion tokens (`src/lib/motion.ts` + `src/styles.css`)
- `ease.outExpo` = `cubic-bezier(0.16, 1, 0.3, 1)` — entrances.
- `ease.inOutQuint` = `cubic-bezier(0.83, 0, 0.17, 1)` — state morph.
- `spring` = `{ stiffness: 220, damping: 26, mass: 0.9 }` — micro.
- Durations: `xs 120 · sm 200 · md 320 · lg 520 · xl 800ms`.
- Stagger: 40ms siblings, 60–80ms for hero copy.
- Variant presets: `fade`, `riseSm`, `riseMd` (with blur), `stagger(0.04)`.

## 6. Surface & utility classes (`src/styles.css`)
- `.surface-raise` — gradient + inset highlight + outer shadow + radius via parent.
- `.hairline` / `.hairline-strong` — border color helpers.
- `.grid-bg` — 28px dotted backdrop (landing).
- `.scan-dotgrid` — 14px dotted (app workspace).
- `.scan-sweep` — vertical violet sweep, 4.2s loop.
- `.ambient-drift-a / -b` — 14s / 22s parallax loops.
- `.row-shimmer` — left→right shimmer overlay.
- `.border-pulse-danger` — one-shot BLOCK pulse.
- `.focus-halo` — focus-within violet ring.
- `.btn-lift` — hover `translateY(-1px)`, active `scale(0.99)`.
- `.glow-violet` — soft violet shadow.
- `.animate-pulse-soft` — 2.4s opacity breathe.
- `.scan-shimmer` — 1.6s linear shimmer.
- All animations short-circuit under `@media (prefers-reduced-motion: reduce)`.

## 7. Component inventory

### Landing (`src/routes/index.tsx`, `src/routes/about.tsx`)
- `Navbar` — `src/components/layout/Navbar.tsx`. Scroll-aware floating glass bar (Phase 4 morph).
- `PageBackground` — `src/components/layout/Background.tsx`. Multi-layer ambient (dot grid + 3 drifting radial glows + faint noise).
- `RevealOnScroll` — `src/components/layout/RevealOnScroll.tsx`. `whileInView` wrapper, variants `fade | rise | riseStagger`.
- `Footer` — `src/components/layout/Footer.tsx`.
- Hero / TrustStrip / Features / HowItWorks / Roadmap / CtaBanner / SectionHeading — defined inline in `routes/index.tsx`.

### App workspace (`src/routes/app.tsx`)
- `AppTopBar` — `src/components/layout/AppTopBar.tsx`. Mark + Network/Mode `Select`s.
- `Sidebar` — `src/components/app/Sidebar.tsx`. Collapsible rail, Activity/Balances tabs with shared `layoutId="sidebar-tab"`.
- `Stepper` — `src/components/app/Stepper.tsx`. Three-stage indicator with animated connector fill.
- `TxComposer` — `src/components/app/TxComposer.tsx`. Inputs with `.focus-halo`, chain/token `Select`s, scan CTA with `.btn-lift`.
- `ScanProgress` — `src/components/app/ScanProgress.tsx`. Dot-grid + scan-sweep + propagating rows + waveform + letter reveal + non-uniform pacing (~3.6s total).
- `VerdictHeader` — `src/components/app/VerdictHeader.tsx`. Count-up score + draw-line underline + ambient bloom by verdict.
- `RiskMeter` — `src/components/app/RiskMeter.tsx`. `useMotionValue` count-up.
- `ResultPanel` / `SignalRow` / `DetailsDrawer` — verdict screen.
- `SubmittedPanel` — `src/components/app/SubmittedPanel.tsx`. SVG checkmark draw + ripple.
- `Select` — `src/components/app/Select.tsx`. `DropdownMenu` wrapper with curtain reveal.

## 8. Naming conventions
- Routes: flat dot-separated under `src/routes/` (e.g. `app.tsx`, not `app/index.tsx`).
- Components: PascalCase under `src/components/{app,layout,brand,ui}`.
- Hooks: `useFoo` under `src/hooks/`.
- Pure logic / mocks: `src/lib/` (`mockScan.ts`, `mockData.ts`, `motion.ts`, `utils.ts`).
- Shadcn primitives: `src/components/ui/` — do not modify, wrap.

## 9. Spacing & radii
- Container: `max-w-[1180px]` (landing), `max-w-[1200px]` (app shell).
- Section vertical: `py-24 md:py-28`.
- Card radius: `rounded-2xl` (16px) default; navbar floating state `rounded-2xl` (16px); hero preview ambient halo `rounded-[40px]`.
- Button radius: `rounded-xl` (12px). Pills/chips: `rounded-full`.
- Hairlines = 1px; all panels use `--hairline` for inner separators.

## 10. Mock data
- `src/lib/mockScan.ts` — scan steps, per-step durations, verdict presets.
- `src/lib/mockData.ts` — sidebar activity + balances.

## 11. Forbidden patterns
- Native `<select>` — use `src/components/app/Select.tsx`.
- Hex/Tailwind color literals (`text-white`, `bg-black`) — use tokens.
- Hash-anchor section navigation as primary nav (use TanStack routes).
- Touching `src/routeTree.gen.ts` (auto-generated).
- Crypto/casino accents (neon green-on-black, animated gradients on text, large emoji shields).