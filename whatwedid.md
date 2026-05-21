# Cardinal — Build Log (full project history)

Chronological summary of every meaningful change to this repo, so a fresh agent can catch up in one read. Most recent phase at the bottom.

---

## Phase 0 — Foundation
- **Stack**: TanStack Start v1 (Vite 7, React 19), Tailwind v4 via `src/styles.css`, framer-motion, lucide-react, sonner, shadcn primitives in `src/components/ui/`.
- **Routes**: `/` (landing), `/about`, `/app` (workspace). Root layout in `src/routes/__root.tsx`.
- **No backend**: everything is mock via `src/lib/mockScan.ts` + `src/lib/mockData.ts`. No auth, no chain RPC, no Lovable Cloud yet.
- **Theme**: dark-only, institutional violet identity, `oklch`-derived hex tokens in `:root`.

## Phase 1 — Product story & landing
- Hero: "Scan before you send." with live mock REVIEW preview card on the right.
- Sections: TrustStrip (chains), Features (Risk Scan / SafeSend / Escrow Vault), HowItWorks (5 steps), Roadmap (4 quarters), CtaBanner ("Protection from every direction").
- Footer, Navbar, `PageBackground` with dot grid + two radial glows.
- `/about` page with the same brand chrome.

## Phase 2 — App workspace rebuild
- Replaced legacy crypto-dashboard layout (deleted `ActivityFeed`, `DemoPresetBar`, `SignalsLog`, `WalletRail`).
- New shell: `AppTopBar` (mark + Network/Mode selects) + collapsible `Sidebar` with Activity / Balances tabs.
- Stage machine in `src/routes/app.tsx`: `compose → scanning → verdict → submitted | cancelled` with a reset-to-compose path.
- Components added: `Stepper`, `TxComposer`, `ScanProgress`, `VerdictHeader`, `RiskMeter`, `ResultPanel`, `SignalRow`, `DetailsDrawer`, `SubmittedPanel`, `Select` (custom `DropdownMenu` wrapper replacing native selects everywhere).
- Sonner `<Toaster />` wired in `__root.tsx` for proceed/cancel feedback.

## Phase 3 — App workspace cinematic motion
- New `src/lib/motion.ts` (tokens: `ease.outExpo`, `inOutQuint`, `spring`, durations xs–xl, variant presets).
- `src/styles.css` additions: motion CSS variables, `.surface-raise`, `.scan-dotgrid`, `.scan-sweep`, `.ambient-drift-a/-b`, `.row-shimmer`, `.border-pulse-danger`, `.focus-halo`, `.btn-lift`, `.glow-violet`, reduced-motion guard.
- Stage transitions: `AnimatePresence mode="wait"` with blur-morph (`filter blur(8 → 0)`) + workspace ambient wash that crossfades hue by stage (violet → indigo/cyan → verdict-tinted green/amber/red).
- `ScanProgress` rebuilt: dot-grid, vertical scan sweep, two parallax radial glows, 8-bar waveform, propagating row reveal, left-edge active bar, shimmer pass, letter-by-letter "Inspecting" header, non-uniform step pacing (network 400 → simulation 1000 → scoring 800ms) totaling ~3.6s.
- `VerdictHeader`: badge spring-scale, count-up risk score, draw-line underline, ambient bloom matching verdict, BLOCK gets one-shot border pulse.
- `RiskMeter`: `useMotionValue` + `useTransform` count-up.
- `SubmittedPanel`: SVG checkmark path-draw + single ripple; cancelled variant is red X.
- `Sidebar`: tabs use shared `layoutId="sidebar-tab"` for sliding indicator; collapse fades + slides content.
- `Stepper`: completed step gets `scale 1→1.06→1` pulse; connector line fills `scaleX 0→1` left-to-right.

## Phase 4 — Landing-page cinematic upgrade (current)
See `latestdesign.md` for the detailed diff. Summary:
- **Navbar**: scroll-driven morph — top offset, max-width, height, radius, padding, background alpha, blur, and shadow all interpolate over `scrollY 0 → 120px`. Becomes a floating glass pill.
- **Hero**: layered entrance (eyebrow → word-by-word headline w/ blur → body → CTAs → trust chips), mouse-reactive perspective (max 2°), drifting ambient bloom behind headline.
- **Preview card**: enters with `y:24 blur:10 → 0`, slow float loop, mouse parallax counter-tilt, risk score count-up, signal-dot pulse, hover lift.
- **CTA banner**: layered radial wash + slow gradient drift + button shimmer on hover.
- **Background**: three independent radial glows (violet/indigo/cyan, 18s/26s/34s loops), dot-grid with 60s slow drift, static 2% film-grain noise.
- **Scroll choreography**: new `RevealOnScroll` wrapper around Features / HowItWorks / Roadmap / CtaBanner with `whileInView` + 80ms stagger.
- All motion gated by `useReducedMotion()`.

---

## Currently out of scope (no work done)
- Real wallet connect, chain RPC, signature flow.
- Auth / accounts.
- Backend (no Lovable Cloud enabled).
- Mobile-specific motion tuning beyond default disables.
- About-page motion pass.

## Repo map (top-level)
```
src/
  routes/            index.tsx, about.tsx, app.tsx, __root.tsx
  components/
    layout/          Navbar.tsx, Background.tsx, RevealOnScroll.tsx, AppTopBar.tsx, Footer.tsx
    brand/           Logo.tsx
    app/             Sidebar, Stepper, TxComposer, ScanProgress, VerdictHeader, RiskMeter, ResultPanel, SignalRow, DetailsDrawer, SubmittedPanel, Select
    ui/              shadcn primitives — do not modify, wrap
  lib/               motion.ts, mockScan.ts, mockData.ts, utils.ts
  hooks/             use-mobile.tsx
  styles.css         design tokens, utilities, motion vars
design.md            ← design system reference
whatwedid.md         ← this file
latestdesign.md      ← Phase 4 diff only
```