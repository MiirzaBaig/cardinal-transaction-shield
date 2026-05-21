# `/app` — Revamp plan

## What's wrong today

Looking at the current screen, the page is doing too much in parallel and you can't tell where to look first.

- **Three columns of equal weight.** Wallet rail (left), composer (center), signal log + activity (right) all compete. The composer — the actual product — is the smallest of the three.
- **The wallet rail has four stacked cards** (account, total balance, balances, quick actions) and most of them are just chrome. "Total balance" and "Balances" overlap. "Quick actions" doesn't do anything useful yet.
- **The signal log on the right is empty** until you scan. That's a big idle card eating the page.
- **Recent activity sits next to the composer**, pulling attention away from the thing you're supposed to be doing.
- **The header takes ~25% of vertical space** ("Control center / Scan before you send / Compose a transaction…") before you can see the actual composer.
- **Demo presets are in a horizontal row that crowds the top of the composer column**, so the three options feel like nav, not like a primary CTA.

Net effect: the page feels like a dashboard instead of a single, confident workflow.

## New direction — focused workspace, one job at a time

Strip `/app` down to one clear path: **pick a scenario → compose → scan → decide**. Everything else collapses or moves out of the way.

```text
┌─────────────────────────────────────────────────────────────────────┐
│  Cardinal · Ethereum ▾ · Standard ▾           vault.cardinal.eth ▾  │  thin topbar (unchanged)
├──────────────────┬──────────────────────────────────────────────────┤
│                  │                                                  │
│  Sidebar         │  ── Stepper: ① Compose  ② Scan  ③ Decide ───     │
│  (collapsible)   │                                                  │
│                  │  ┌──────────────────────────────────────────┐    │
│  Wallet (compact)│  │                                          │    │
│  Tabs:           │  │      One large workspace surface         │    │
│  · Activity      │  │      Composer → Scan → Verdict           │    │
│  · Balances      │  │                                          │    │
│                  │  │                                          │    │
│  Demo scenarios  │  └──────────────────────────────────────────┘    │
│  (chips/list)    │                                                  │
│                  │                                                  │
└──────────────────┴──────────────────────────────────────────────────┘
```

## What changes specifically

### 1. Kill the three-column layout
- Drop to **two columns**: a compact 260px sidebar, and a wide workspace.
- Sidebar is **collapsible** (chevron in the corner) → workspace goes full-width.

### 2. Compact wallet block (top of sidebar)
- One small card: avatar pip + ENS + short address + "read-only" badge.
- That's it. No "total balance" card, no quick actions card.
- A single **tabbed strip** below: `Activity` · `Balances`. Default = Activity. List view in both.

### 3. Demo scenarios become the entry point, not an afterthought
- Move them into the sidebar as a labeled list, **above the wallet** (because that's the first decision):
  - `Safe transfer` · green dot
  - `Risky approval` · amber dot
  - `Drainer contract` · red dot
- Each is a single tap. The active one is highlighted in the sidebar so you always know which scenario is loaded.
- Also keep a single small "Custom transaction" entry that opens the blank composer.

### 4. Workspace surface — one large card, three sequential states
- Replace the page heading "Control center / Scan before you send" with a thin **stepper** inside the surface header: `① Compose  ② Scan  ③ Decide`. The stepper itself communicates what page you're on, so the giant H1 is unnecessary.
- The surface fills the rest of the viewport and only ever shows one state at a time:
  1. **Compose** — the existing TxComposer, but breathing in the full width: type tabs across the top, recipient on its own row, amount + token on one row, gas/sim strip as a foot, primary "Scan transaction" button anchored bottom-right.
  2. **Scan** — checklist + soft progress bar, exactly as today.
  3. **Decide** — `VerdictHeader` + grouped signals. The **right rail's old "Signal log" merges into here** as a collapsible "Live trace" panel under the signals (so it only shows when there's something to show).

### 5. Sidebar Activity tab replaces the right rail
- The "Recent activity" feed that was on the right slides into the sidebar's Activity tab.
- Clicking an item rehydrates the workspace with that scan's verdict (already in mock data).
- Empty signal-log card is removed entirely.

### 6. Header cleanup
- Remove "Control center / Scan before you send / Compose a transaction, run it…" block above the grid. It's redundant once the stepper is in place.
- Top app bar (Cardinal · network · mode · account) stays as is.

### 7. Density + hierarchy
- One ambient violet wash behind the workspace surface only (not the whole page).
- Sidebar surfaces drop to flat `--surface` (no glass, no shadow) so the workspace surface visually leads.
- Recent activity rows lose the timestamp column on narrow widths and rely on tooltips.

## What stays

- All existing components: `TxComposer`, `ScanProgress`, `VerdictHeader`, `RiskMeter`, `SignalRow`, `ResultPanel`, `DetailsDrawer`, `ActivityFeed`, mock scan logic, demo presets.
- Color tokens, type system, motion language.
- The verdict footer pattern (Allow/Review/Block) — proven, don't touch.

## What gets removed

- `WalletRail`'s "Total balance" card and "Quick actions" card.
- Right-column `SignalsLog` standalone surface (merges into Decide state).
- Standalone `DemoPresetBar` (its content moves into the sidebar).
- Page-level "Control center" heading block.

## Files affected (technical, FYI)

- `src/routes/app.tsx` — restructure to 2-col layout + stepper state.
- `src/components/app/WalletRail.tsx` — slim down to compact card.
- New `src/components/app/Sidebar.tsx` — scenarios list, wallet, tabs.
- `src/components/app/SignalsLog.tsx` — repurpose as "Live trace" inside the verdict state.
- `src/components/app/DemoPresetBar.tsx` — delete (replaced by sidebar list).
- `src/components/app/ResultPanel.tsx` — embed the live trace toggle.

## Open question

Want the sidebar to default **open** (260px) or **collapsed to icons** (56px)? Open feels more inviting for first-time users; collapsed feels more "pro tool / control center." I'll default to **open** unless you say otherwise.

Approve and I'll build it.