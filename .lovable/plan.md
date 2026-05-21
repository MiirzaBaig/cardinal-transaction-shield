
# Cardinal · UI revamp plan

Four focused upgrades. No business-logic changes — purely presentation + one missing interaction.

---

## 1. New Cardinal mark (logo)

The current shield reads "generic crypto". Replace with a more distinctive, institutional mark inspired by Linear / Vercel / Phantom / Arc:

- **Concept**: a compact monogram — a refined "C" formed by two concentric arcs with a single inset notch (suggesting a "scan line" / shield gap). Pure geometry, no gradients by default; a single subtle violet→indigo gradient only on hover/active.
- **Shape**: 28×28, 1.5px stroke, rounded line caps, on a soft 8px squircle plate (`rgba(139,92,246,0.08)` background, hairline border). Plate gives it weight without a heavy fill.
- **Wordmark**: drop "Cardinal" text from the in-app top bar (mark only, like Linear's sidebar). Keep wordmark on the marketing navbar and footer.
- **Files**: rewrite `src/components/brand/Logo.tsx` — export `CardinalMark` (plate + glyph) and `CardinalWordmark` (mark + text). Replace usage in `AppTopBar` with `<CardinalMark />` only.

---

## 2. Navbar revamp (marketing)

Move from the current floating pill to a **YC/Linear-style rectangular glass bar**:

- Full-width fixed bar, 64px tall, hairline bottom border only (no floating pill, no rounded outer card).
- Background: `rgba(10,10,16,0.55)` + `backdrop-blur(20px) saturate(140%)`, with a faint top inner highlight (`inset 0 1px 0 rgba(255,255,255,0.04)`).
- Centered max-width 1200px content row: wordmark left, nav links center (Product · How it works · About · Roadmap), right cluster = "Sign in" ghost link + "Launch App" primary.
- Links: 13px, `text-muted-foreground`, hover→foreground, active gets a 2px violet underline that animates in (layout shift-free using absolute positioning).
- Scroll behavior: at scrollY > 8px, background opacity rises to 0.75 and the bottom hairline becomes visible. Smooth transition.
- File: rewrite `src/components/layout/Navbar.tsx`.

---

## 3. Dropdowns / select revamp (global)

Today the network + mode selects in `AppTopBar` are native `<select>` elements rendering the OS menu (the screenshot of the white menu). Replace with **shadcn `DropdownMenu`** themed to Cardinal:

- **Trigger**: same compact pill (`h-9`, hairline border, mono uppercase label + value).
- **Menu surface**: `bg-[rgba(14,14,22,0.92)]` + `backdrop-blur-xl`, 1px hairline border `rgba(255,255,255,0.08)`, 12px radius, soft shadow `0 24px 60px -20px rgba(0,0,0,0.7)`, 6px inner padding.
- **Items**: 13px, 36px tall, 10px horizontal padding, rounded 8px. Hover = `bg-white/[0.04]`. Active item gets a left 2px violet bar + violet text. Check icon (lucide `Check`) on the right for the selected one. Subtle 120ms fade+slide-in animation.
- **Color dot** retained for chains (violet for Ethereum, etc.).
- Apply same treatment everywhere we use native `<select>` (audit `AppTopBar`, `TxComposer` chain/token selectors, any preset menus).
- File changes: update `AppTopBar.tsx`, `TxComposer.tsx`, lean on existing `src/components/ui/dropdown-menu.tsx` (already shadcn). Add a small wrapper `Select` in `src/components/app/Select.tsx` for reuse (label + trigger + menu) so all dropdowns stay consistent.

---

## 4. "Proceed" actually does something + verdict polish

Currently `Proceed` / `Proceed anyway` / `Cancel transaction` buttons in `ResultPanel.tsx` have no `onClick`. Wire them:

- Add `onProceed` and `onCancel` callbacks from `app.tsx`.
- On click → show a **success toast** ("Transaction submitted · mock") via existing `sonner`, then transition the workspace surface to a new lightweight **"Submitted" state**: a centered checkmark, tx hash placeholder (`0x…mock`), "View on explorer" (disabled link), and a primary "Run another scan" button → resets to `compose`.
- For `BLOCK` → "Cancel transaction" routes back to `compose` with a muted toast ("Transaction cancelled").
- Adds new `Stage = 'submitted' | 'cancelled'` variants and a tiny `SubmittedPanel.tsx`.

---

## Technical notes

- All colors stay on existing tokens in `src/styles.css` (`--violet`, `--success`, hairline). No new tokens needed except a `--menu-surface` for dropdown background (added to `:root`).
- Animations via Framer Motion already in the project — no new deps.
- No backend, no schema, no routing changes.

### Files touched
```text
src/components/brand/Logo.tsx          (rewrite — new mark)
src/components/layout/Navbar.tsx       (rewrite — glass rectangle)
src/components/layout/AppTopBar.tsx    (mark only + new Select)
src/components/app/Select.tsx          (new — themed dropdown wrapper)
src/components/app/TxComposer.tsx      (swap native selects)
src/components/app/ResultPanel.tsx     (wire Proceed/Cancel)
src/components/app/SubmittedPanel.tsx  (new — post-action state)
src/routes/app.tsx                     (new stages + handlers + toast)
src/styles.css                         (add --menu-surface token)
```

### Out of scope (ask later if wanted)
- Sidebar visual changes
- Landing page hero rework
- Real wallet / RPC integration
