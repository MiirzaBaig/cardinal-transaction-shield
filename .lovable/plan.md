# Cardinal — Phase 1 Frontend Plan (revised)

Premium Web3 transaction firewall UI. Phase 1 is visual + UX only — no wallet SDKs, auth, or backend. **Priority order: `/app` first, then landing, then about.**

## Stack note

You asked for Next.js App Router. Lovable scaffolds web apps from a fixed TanStack Start + React + Vite + Tailwind + TS template. Every visual/UX requirement is fully achievable on it; only the framework name differs. If Next.js is a hard requirement you'd need to export. Proceeding on the supported stack.

## Design system

Single source of truth in `index.css` + `tailwind.config.ts`.

- **Typography — Linear/Phantom restraint, not sci-fi**
  - Display: **Space Grotesk**, weight 500 (not 700), tight tracking (-0.02em), used at moderate display sizes (clamp 40–72px) — confident, not theatrical
  - Body: **Inter**, 400/500, normal tracking, 15–16px base
  - Mono: JetBrains Mono for addresses, hashes, chain IDs
  - No all-caps headings, no condensed/wide stretching, no sci-fi letterforms
- **Color**
  - `--bg` #08080F, `--surface` #0E0E16, `--surface-2` #14141E, `--surface-3` #1A1A26
  - `--border` rgba(255,255,255,0.07), `--border-strong` rgba(255,255,255,0.12)
  - `--text` #ECECF2, `--muted` #9696A8, `--muted-2` #6B6B7D
  - `--violet` #8B5CF6, `--indigo` #6366F1, `--cyan` #06B6D4
  - `--success` #34D399, `--warning` #FBBF24, `--danger` #EF4444
- **Depth over blur** — surfaces are mostly solid `--surface-*` tiers with 1px hairline borders and subtle inner-top highlight; backdrop-blur reserved for the floating navbar and modal overlays only. No frosted cards stacked on frosted cards.
- **Light/glow** — one or two restrained ambient violet washes per page, far behind content, low opacity. No constant glow on every card.
- **Spacing** — generous: 8/12/16/24/32/48/64/96 scale; sections breathe.
- **Radii** — 10px inputs, 14px cards, 18px large panels. Not pill-shaped.
- **Motion** — fade-in-up on mount, 1–2px hover lift, 180–320ms easings, animated counters on results. Respect `prefers-reduced-motion`.
- **Background** — faint dotted grid at ~4% opacity + one radial violet wash. That's it.

## Routes & structure

```text
src/
  routes/
    __root.tsx
    index.tsx        # Landing
    about.tsx        # About
    app.tsx          # App — control center (primary focus)
  components/
    layout/   Navbar, Footer, AppShell
    app/      WalletRail, NetworkPill, AccountChip,
              TxComposer (Chain, Token, Recipient, Amount, Type),
              DemoPresetBar, ActivityFeed, SignalsLog,
              ScanProgress, VerdictHeader, ResultPanel,
              RiskMeter, SignalRow, DetailsDrawer
    marketing/ Hero, Features, HowItWorks, MockPreview, Roadmap, CtaBanner
    ui/       Button, Surface, Badge, Select, Input, Checkbox, Tabs, Tooltip
  lib/        mockScan.ts, mockData.ts (addresses, presets, signals)
```

## `/app` — Transaction Control Center (primary focus)

Not a centered form. A real working surface with multiple coordinated regions. Desktop is the design target; collapses to stacked panels on mobile.

### Layout (desktop)

```text
┌──────────────────────────────────────────────────────────────────────┐
│  Cardinal · Network ▾ · Mode ▾                  Account 0x1c…a93f ▾ │  top bar
├──────────────┬────────────────────────────────┬──────────────────────┤
│              │                                │                      │
│  Left rail   │     Center: Composer / Scan /  │  Right: Signals &    │
│  Wallet      │     Verdict (single surface,   │  Activity            │
│  Balances    │     swaps content by state)    │                      │
│  Quick acts  │                                │                      │
│              │                                │                      │
└──────────────┴────────────────────────────────┴──────────────────────┘
```

### Top bar
Cardinal mark, network selector (Ethereum / Base / Arbitrum / Polygon), mode selector (Standard / Strict / Watch-only), mock `ConnectWalletButton` → resolves to account chip with ENS-style label, balance, disconnect.

### Left rail — Wallet panel
- Account header: avatar pip, label, full mono address with copy
- Network + read-only badge
- Token balances list (ETH, USDC, USDT, DAI — mock), small sparkline per row
- Quick actions: "New scan", "Paste calldata", "Import tx hash" (UI only)

### Center — state machine (one surface, three states)

1. **Composer (default)**
   - Tabs: **Transfer · Approval · Contract call · Swap**
   - Recipient input (mono, with paste, with avatar resolver showing seen-before / unknown / flagged pill)
   - Amount with token select + USD estimate + max button
   - For Approval: spender + allowance (Unlimited toggle visible and called out)
   - For Contract call: target + function signature + decoded params (mocked)
   - Gas estimate strip + simulation status pill ("Ready to scan")
   - **DemoPresetBar** above composer: "Safe transfer", "Risky approval", "Drainer contract" — one click prefills a believable scenario
   - Primary: **Scan transaction**. Secondary: Reset.

2. **Scan in progress** (replaces composer in place, ~2.5s)
   - Header keeps tx summary visible (don't lose context)
   - Sequential checklist with subtle progress shimmer:
     1. Checking network
     2. Resolving recipient
     3. Reviewing permissions
     4. Running simulation
     5. Scoring risk
   - Soft violet wash pulses behind the surface; no spinner theatrics

3. **Verdict** (replaces scan)
   - `VerdictHeader`: large status word (Allow / Review / Block), one-line plain-English summary, animated risk score 0–100 with `RiskMeter`
   - **Signals list** — grouped rows (Recipient, Permissions, Simulation, Network, Contract). Each row: severity dot, label, one-line plain-English explanation, expand for detail. No jargon in the headline; jargon allowed inside expanded detail.
   - Footer actions per state:
     - **ALLOW** — green accent line, "Proceed" (primary), "Run another scan"
     - **REVIEW** — amber accent line, required acknowledgement checkbox ("I've read the warnings"), "Proceed anyway" disabled until checked, "Cancel"
     - **BLOCK** — red accent line, "Cancel transaction" primary, proceed permanently disabled, link "Why was this blocked?" opens `DetailsDrawer`

### Right rail — Signals & Activity
- **Live signal log** during scan: streaming lines as each check completes (e.g. "Recipient address has 14 prior interactions", "Token approval requested: Unlimited")
- **Recent activity** below: mock past scans, each a row with verdict pill, recipient short, amount, timestamp — click to re-open verdict
- This rail is what makes it feel like a control center, not a form

### Details drawer
Slide-in from the right covering the right rail. Shows full per-signal breakdown, simulation trace summary, raw recipient metadata. Plain-English up top, technical detail collapsed below.

### Empty / disconnected state
Center panel shows a calm "Connect a wallet to begin" with one CTA; rails remain visible but muted. Demo presets still usable without connect.

## Mock scan logic

`lib/mockScan.ts` — pure typed function. Presets map to deterministic verdicts with believable signal sets. Freeform inputs route by simple heuristics (recipient suffix, amount, type, approval=unlimited) so the UI stays alive without randomness.

```ts
type Severity = 'info' | 'warn' | 'danger';
type Verdict = 'ALLOW' | 'REVIEW' | 'BLOCK';
type Signal = { group: 'Recipient'|'Permissions'|'Simulation'|'Network'|'Contract';
                label: string; detail: string; severity: Severity };
type ScanResult = { verdict: Verdict; score: number; summary: string; signals: Signal[] };
```

## Landing page (`/`) — secondary

Calm, restrained. The `/app` experience does the heavy lifting; landing supports it.

- Floating navbar (only place blur is used)
- **Hero**: "Scan before you send." / sub: "Cardinal inspects every transaction before you sign — and tells you to allow, review, or block." Primary "Launch App", ghost "How it works". Quiet trust row.
- **Live mock preview**: a real `VerdictHeader` + signals snippet rendered from the same components as `/app` — sells the product in one glance
- **Features (3)**: Risk Scan, SafeSend, Escrow Vault — icon + one-line promise + 3 capabilities
- **How it works**: 5-step horizontal timeline (Connect → Compose → Scan → Verdict → Proceed/Stop)
- **Positioning strip**: non-custodial, deterministic, plain-English
- **Roadmap**: 4 quarters, status pills
- **CTA banner**: "Protection from every direction." + Launch App
- **Footer**: minimal three-column

## About page (`/about`)

Mission · Why Cardinal exists · Four security principles (Non-custodial, Deterministic, Plain English, Open by design) · Architecture diagram (Client → Scan Engine → Signal Sources → Verdict) · Placeholder team grid.

## Out of scope (Phase 1)

Wagmi, RainbowKit, real wallets, auth, DB, NestJS backend, SafeSend contracts, risk APIs. Adapter boundaries left clean: `ConnectWalletButton`, `mockScan`, `mockData` swap out 1:1 later.

## Build order

1. Design tokens + base UI primitives (Button, Surface, Badge, Input, Select, Tabs)
2. `AppShell` + `/app` state machine (Composer → Scan → Verdict) with all three result states and demo presets
3. Right-rail Signals & Activity + Details drawer
4. Landing page (reusing verdict components for the mock preview)
5. About page
6. Polish pass: motion, focus rings, reduced-motion, responsive collapse

Confirm and I'll build.