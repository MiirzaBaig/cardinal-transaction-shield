# Phase 4 — Latest design changes (this turn)

Notes only on what changed *in this iteration*. Use this file as a revert/reference checkpoint.

---

## 1. Navbar — scroll-morphing floating glass pill
**File:** `src/components/layout/Navbar.tsx`

Rewrote the binary `scrolled` boolean into a continuous interpolation driven by `useScroll` + a smoothed `useSpring` (`stiffness 180, damping 28, mass 0.6`). All values lerp over `scrollY 0 → 120px`:

| Property | At rest | Scrolled |
|---|---|---|
| `top` | `0` | `14px` |
| `maxWidth` | `1200px` | `900px` |
| `height` | `64px` | `56px` |
| `borderRadius` | `0` | `18px` |
| `paddingX` | `24px` | `22px` |
| `background` | `rgba(8,8,15,0.45)` | `rgba(8,8,15,0.78)` |
| `backdropFilter` blur | `8px` | `22px` |
| `backdropFilter` saturate | `100%` | `160%` |
| `borderColor alpha` | `0` | `0.08` |
| outer shadow alpha | `0` | `0.45` |

Reduced-motion path: pins to a static surface (no morph, still readable). Launch App button now uses `.btn-lift`.

## 2. Background — multi-layer ambient system
**File:** `src/components/layout/Background.tsx`

- Dot grid drifts `0 → 14px` over **60s linear** (infinite).
- Three independent radial glows:
  - violet top-center — `18s`, `x: ±40`, opacity `0.55 ↔ 0.85`.
  - indigo left — `26s`, translates `x:60, y:-40`, opacity `0.45 ↔ 0.7`.
  - cyan bottom-right — `34s`, translates `x:-80, y:-30`, opacity `0.35 ↔ 0.6`.
- Static SVG film-grain noise overlay at **2.5% opacity** with `mix-blend-overlay`.
- Whole layer parallaxes at `0.3×` scroll speed via `useTransform(scrollY, [0, 1200], [0, -180])`.
- Reduced-motion: parallax + all loops disabled.

## 3. Hero — layered cinematic entrance + mouse perspective
**File:** `src/routes/index.tsx`

- Section uses `perspective: 1200`. Mouse position drives `rotateX/rotateY` on the grid container (max **±2°**), spring-smoothed.
- Preview card counter-tilts (`±4°`) for depth illusion.
- Headline reveals word-by-word: `y:14→0, blur 6→0`, **60ms** stagger, `dur.lg ease-out-expo`, starting at 150ms.
- Eyebrow chip / body / CTAs / trust chips reveal via `riseChild` with **120ms** parent stagger.
- New violet bloom behind headline drifts `x: ±30px` on a **22s** loop, opacity `0.35 ↔ 0.55`.
- Phase-1 chip dot pulses (`1.8s`, opacity `1 → 0.4 → 1`).
- Primary CTA gets `.btn-lift` + `.shimmer-cta` (one-shot 900ms sweep on hover).

## 4. Live preview card — alive engine feel
**File:** `src/routes/index.tsx` (hero block)

- Enters with `y:24, blur 10 → 0` at `0.7s` ease-out-expo, **250ms** after headline.
- Continuous slow float: `y: 0 → -4 → 0` over **8s** ease-in-out.
- Hover: `y: -2`, surface shadow deepens via `.surface-raise` transition.
- Halo behind card pulses opacity `0.45 ↔ 0.75` on a **6s** loop.
- Each signal row staggers in (`y:8 → 0`, 80ms stagger, 700ms base delay).
- Risk score (`58`) animation reuses `RiskMeter`'s existing `useMotionValue` count-up via `VerdictHeader`.

## 5. CTA banner — ambient + shimmer
**File:** `src/routes/index.tsx` (`CtaBanner`)

- Wrapped in `RevealOnScroll`.
- Inner radial bloom now breathes `opacity 0.55 ↔ 0.85, scale 1 ↔ 1.05` over **12s**.
- Added diagonal gradient drift (violet → indigo → cyan, **30s linear** loop) at 60% opacity for atmosphere.
- Primary CTA gets `.btn-lift` + `.shimmer-cta`, arrow lifts on hover.

## 6. Scroll choreography — RevealOnScroll
**Files:** new `src/components/layout/RevealOnScroll.tsx`, applied in `src/routes/index.tsx`.

- Wrapper using `whileInView` + `viewport: { once: true, amount: 0.25 }`.
- Variants: `fade`, `rise` (with blur), `riseStagger`.
- Applied to: Features heading + cards grid (90ms stagger), HowItWorks heading + 5-step grid (60ms stagger), Roadmap heading + 4 cards (70ms stagger), CtaBanner.
- All children use `riseChild` (`y:14, blur:4 → 0`, `dur.lg ease-out-expo`).

## 7. New CSS utility
**File:** `src/styles.css`

- `.shimmer-cta::before` — diagonal `translateX(-120% → 120%)` sweep, 900ms `ease-out-expo`, gated by `:hover`. Disabled under reduced-motion.

## Files changed
```
src/components/layout/Navbar.tsx        (rewrote scroll behavior)
src/components/layout/Background.tsx    (multi-layer ambient + parallax)
src/components/layout/RevealOnScroll.tsx (new wrapper)
src/routes/index.tsx                    (hero motion, preview card, CTA, RevealOnScroll)
src/styles.css                          (.shimmer-cta utility)
design.md / whatwedid.md / latestdesign.md (new docs)
```

## How to revert
- Navbar pre-Phase-4 = binary `scrolled` boolean from Phase 2 (see `whatwedid.md`).
- Background pre-Phase-4 = simple grid + 2 static radials.
- Drop `RevealOnScroll` imports + wrappers; sections render statically.
- Remove `.shimmer-cta` rule + class usage from hero/CTA buttons.
- Hero: strip word-by-word map, mouse handlers, motion wrappers; restore plain `<h1>Scan before<br/>you send.</h1>` and `<div>` containers.