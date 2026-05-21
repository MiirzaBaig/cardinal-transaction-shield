
# Cardinal · Motion & interaction polish (Phase 3)

Goal: take `/app` from "clean but static" to **alive, intelligent, cinematic** — Linear / Arc / Phantom restraint, not crypto-flashy. No new business logic, no new routes, no new deps (Framer Motion already in).

---

## 1. Motion system (foundation)

Codify a tiny motion vocabulary so every screen feels choreographed by the same hand. Added to `src/styles.css` + a new `src/lib/motion.ts`.

- Easing tokens
  - `ease-out-expo` `[0.16, 1, 0.3, 1]` — primary entrance
  - `ease-in-out-quint` `[0.83, 0, 0.17, 1]` — state morph
  - `ease-spring` (framer spring `{ stiffness: 220, damping: 26, mass: 0.9 }`) — micro
- Duration tokens: `xs 120 · sm 200 · md 320 · lg 520 · xl 800ms`
- Stagger token: `40ms` between siblings (rows, signals, trace lines)
- CSS variables: `--ease-out-expo`, `--dur-sm`, `--dur-md`, `--dur-lg`, plus `--ambient-glow` color helper

`motion.ts` exports `fade`, `riseSm`, `riseMd`, `morph`, `stagger(0.04)` variant presets so every component pulls from one source.

---

## 2. Stage transitions: Compose → Scan → Decide

Currently each stage swaps with a plain 220ms y-fade. Replace with **layered choreography** in `src/routes/app.tsx`:

- Wrap the surface in `motion.div` with `layout` + shared `layoutId="workspace-surface"` so the card height **morphs fluidly** between stages instead of jumping.
- Use `AnimatePresence mode="wait"`, but extend exit to `420ms` with a subtle blur (`filter: blur(0 → 6px)`) + opacity, while the incoming stage rises from `y: 12, blur 8px → 0` over `520ms ease-out-expo`.
- The `Stepper` numerals animate: completed step gets a brief `scale 1 → 1.06 → 1` pulse + the connector line fills left-to-right (`scaleX 0 → 1`, `transform-origin: left`, `400ms`).
- Background ambient wash gently shifts hue per stage:
  - compose → violet (current)
  - scanning → indigo + faint cyan
  - verdict → tinted by result (green / amber / red), 800ms crossfade

Files: `src/routes/app.tsx`, `src/components/app/Stepper.tsx`, `src/components/layout/Background.tsx` (or inline wash).

---

## 3. Scan experience (the centerpiece)

Rebuild `src/components/app/ScanProgress.tsx` into a believable "system is thinking" surface. Keep the same checklist data, raise the production value.

### 3a. Ambient layer (behind the list)

- A faint **dot-grid** (12px, 1px dots at `rgba(255,255,255,0.04)`) covers the panel.
- A soft **vertical scan sweep** (1px violet gradient line, 70% opacity, `120s` linear loop is too slow — use `4s` ease-in-out) travels top→bottom, looping with a 600ms rest. Subtle, single sweep, not a strobe.
- Two slow **radial glows** drift on independent 14s / 22s loops (translate ±60px, opacity 0.3↔0.6) for parallax depth.
- A **tiny waveform** (8 vertical bars, 2px wide, heights animated via sine, 60–80% muted violet) sits in the header next to "Live" — reads as live signal activity. Not a chart, just rhythm.

### 3b. Checklist rows

Replace the current instant reveal with a **propagating wave**:

- Rows enter staggered (40ms each) with `y: 6 → 0`, `opacity 0 → 1`.
- The active row shows a **left-edge violet bar** that grows `scaleY 0 → 1` (300ms), a soft `box-shadow` glow that breathes (`2s` ease-in-out), and a **shimmer sweep** across its background (linear-gradient moving left→right, 1.6s loop).
- Transitioning active → done: the spinner morphs into the check via `scale 0.6 → 1` + `rotate -90 → 0`, the row's glow briefly intensifies then settles, and a faint **trail line** (1px gradient) draws from the previous row to the next over 280ms — visually connects the propagation.
- Idle rows: dot at `opacity 0.3`; on becoming active it grows to a 3px pulsing violet dot.
- "OK" label fades in with a 200ms delay after the check, in mono `text-[var(--success)]/80`.

### 3c. Header micro

- "Inspecting your transaction" gets a single-pass **letter-by-letter** opacity reveal (12ms stagger) on mount — only once, no loop.
- "Live" pill: dot is a true 2-keyframe pulse (`opacity 1 → 0.4 → 1`, 1.8s).
- Add a tiny **elapsed counter** under the title (`00:01.4 · 5 checks`) that ticks in mono, reinforcing the "system working" feel.

### 3d. Pacing

Lengthen total scan from current ~2.4s to **~3.6s** with non-uniform step durations (network 400ms, recipient 600ms, permissions 800ms, simulation 1000ms, scoring 800ms) — feels like real work, not a fake loader.

Files: `src/components/app/ScanProgress.tsx`, `src/lib/mockScan.ts` (export per-step durations).

---

## 4. Verdict reveal (ALLOW / REVIEW / BLOCK)

`VerdictHeader` + `ResultPanel` get a cinematic emergence:

- On mount: the verdict badge scales `0.92 → 1` with spring, then a soft **radial ambient glow** (accent color, blur 80px, opacity 0 → 0.45 → 0.25) blooms behind it over 700ms and settles low.
- The risk score number **counts up** from 0 → final (700ms, ease-out-expo) via `useMotionValue` + `useTransform`.
- A 1px hairline under the header draws left→right (`scaleX 0 → 1`, 500ms) like a confirmation underline.
- Signal rows stagger in (40ms) from `y: 8, opacity 0` — they feel like they're being filed in.
- The whole panel inherits a faint **ambient tint** matching verdict (green / amber / red) — `background: radial-gradient` at 8% opacity in the top-right corner. Calm, not loud.
- BLOCK adds a single, restrained 1.2s **border glow pulse** on the panel edge then stops (one-shot, not looping — institutional, not casino).
- Action buttons rise in last with a 120ms delay; primary CTA gets a soft shadow that lifts on hover (`translateY -1px`, shadow grows).

Files: `src/components/app/VerdictHeader.tsx`, `src/components/app/ResultPanel.tsx`, `src/components/app/RiskMeter.tsx`.

---

## 5. Submitted / Cancelled state

`SubmittedPanel.tsx`:

- Checkmark draws via SVG `pathLength 0 → 1` (450ms ease-out-expo), then the ring scales in.
- A single ripple (`scale 1 → 1.4`, opacity `0.6 → 0`) emits once from the check.
- "Transaction submitted" text fades up after the ripple.
- Tx hash row slides in from `y: 6` with 80ms delay; "Explorer" link gets the underline-from-left hover.
- Cancelled variant: red ring, no ripple, X icon draws the same way.

---

## 6. Micro-interactions (global)

Sweep across the app surface:

- **Buttons** (`button` in TxComposer, ResultPanel, Sidebar): hover lifts `y -1px` over 180ms ease-out-expo, shadow softly grows. Active: `y 0, scale 0.99`. No color flash.
- **Inputs** (`TxComposer`): focus animates the border from hairline → `var(--violet)` at 40% opacity, and a 1px focus halo fades in (`box-shadow 0 0 0 3px rgba(139,92,246,0.12)`, 200ms). Label color shifts to foreground.
- **Select dropdowns** (existing `Select.tsx`): menu opens with `y -4 → 0`, opacity, and a `clip-path inset(0 0 100% 0 → 0 0 0% 0)` "curtain" reveal (240ms). Items stagger in (20ms). Hover: smooth `bg` crossfade (140ms), not instant.
- **Tabs / segmented controls** (Sidebar Activity/Balances): active pill uses `layoutId="sidebar-tab"` for a fluid sliding indicator (Framer's shared layout).
- **Sidebar collapse**: width transition stays 200ms but content fades + slides `x -8 → 0`; the rail icons stagger in (30ms).
- **Cards / surfaces**: add `transition-shadow duration-300` so hover depth changes feel intentional.

Files: `src/components/app/TxComposer.tsx`, `Select.tsx`, `Sidebar.tsx`, `SubmittedPanel.tsx`, `styles.css` (utility classes).

---

## 7. Depth & ambient atmosphere

The flat feeling comes from uniform surface. Subtle layering:

- New CSS class `.surface-raise`: linear-gradient top→bottom from `rgba(255,255,255,0.02) → rgba(255,255,255,0)` + inset top highlight `inset 0 1px 0 rgba(255,255,255,0.05)` + outer shadow `0 24px 80px -40px rgba(0,0,0,0.6)`. Applied to the workspace surface.
- Workspace ambient wash gets a second, very slow drift (`60s` translate loop, `opacity 0.5 → 0.7 → 0.5`) so the page is never fully still.
- A new `.glow-edge` utility (transparent border-radius card with a single-pass conic-gradient sweep) used sparingly: once on stage change, once on verdict.

---

## 8. Accessibility & performance

- Wrap all motion in `useReducedMotion()` — degrade to instant fade/opacity only. Ambient sweeps disabled entirely.
- All animations use `transform` / `opacity` / `filter` only — no layout thrash.
- Background ambient layers are `pointer-events-none` and `will-change: transform, opacity`.
- Single shared `AnimatePresence` per stage boundary — no nested presence.

---

## Files touched

```text
src/lib/motion.ts                          (new — easing + variant presets)
src/styles.css                             (motion vars, .surface-raise, .glow-edge, dot-grid)
src/routes/app.tsx                         (stage choreography, ambient hue shift)
src/components/app/Stepper.tsx             (animated connectors + step pulse)
src/components/app/ScanProgress.tsx        (rebuilt — ambient layer + propagating rows)
src/components/app/VerdictHeader.tsx       (count-up + glow bloom + underline)
src/components/app/RiskMeter.tsx           (animated fill)
src/components/app/ResultPanel.tsx         (staggered signals, panel tint, BLOCK pulse)
src/components/app/SubmittedPanel.tsx      (SVG checkmark draw + ripple)
src/components/app/TxComposer.tsx          (focus halo, button lift)
src/components/app/Select.tsx              (curtain reveal + staggered items)
src/components/app/Sidebar.tsx             (layoutId tab indicator, collapse fade)
src/lib/mockScan.ts                        (per-step durations)
```

## Out of scope (ask later)
- Landing page motion pass (focus is `/app`)
- Real-time data wiring
- Sound design / haptics

