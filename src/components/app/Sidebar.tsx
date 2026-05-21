import { useState } from "react";
import { Copy, PanelLeftClose, PanelLeftOpen, Plus } from "lucide-react";
import { PRESETS, RECENT_ACTIVITY, TOKENS, MOCK_ADDRESS, MOCK_ENS, shortAddr } from "@/lib/mockData";
import { cn } from "@/lib/utils";

type Tab = "activity" | "balances";

export function Sidebar({
  collapsed,
  onToggleCollapsed,
  activePreset,
  onPickPreset,
  onCustom,
  onPickActivity,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  activePreset?: string;
  onPickPreset: (id: "safe" | "review" | "block") => void;
  onCustom: () => void;
  onPickActivity?: (id: string) => void;
}) {
  const [tab, setTab] = useState<Tab>("activity");

  if (collapsed) {
    return (
      <aside className="flex h-full flex-col items-center gap-3 border-r hairline bg-[var(--surface)] py-4">
        <button
          onClick={onToggleCollapsed}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
          title="Expand sidebar"
        >
          <PanelLeftOpen className="h-4 w-4" />
        </button>
        <div className="h-px w-6 bg-white/10" />
        <button
          onClick={onCustom}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
            !activePreset ? "bg-[var(--surface-3)] text-foreground" : "text-muted-foreground hover:bg-white/[0.04]",
          )}
          title="Custom transaction"
        >
          <Plus className="h-4 w-4" />
        </button>
        {PRESETS.map((p) => {
          const color = p.id === "safe" ? "var(--success)" : p.id === "review" ? "var(--warning)" : "var(--danger)";
          const active = activePreset === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onPickPreset(p.id)}
              title={p.label}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                active ? "bg-[var(--surface-3)]" : "hover:bg-white/[0.04]",
              )}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: color, boxShadow: `0 0 0 3px color-mix(in oklab, ${color} 22%, transparent)` }}
              />
            </button>
          );
        })}
      </aside>
    );
  }

  return (
    <aside className="flex h-full flex-col border-r hairline bg-[var(--surface)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Workspace
        </span>
        <button
          onClick={onToggleCollapsed}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
          title="Collapse sidebar"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      {/* Scenarios */}
      <div className="px-2">
        <button
          onClick={onCustom}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors",
            !activePreset ? "bg-[var(--surface-3)] text-foreground" : "text-muted-foreground hover:bg-white/[0.03] hover:text-foreground",
          )}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--surface-2)]">
            <Plus className="h-3.5 w-3.5" />
          </span>
          <span className="flex-1">Custom transaction</span>
        </button>

        <div className="mt-3 px-1 pb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Try a demo
        </div>
        <ul className="space-y-0.5">
          {PRESETS.map((p) => {
            const color = p.id === "safe" ? "var(--success)" : p.id === "review" ? "var(--warning)" : "var(--danger)";
            const active = activePreset === p.id;
            return (
              <li key={p.id}>
                <button
                  onClick={() => onPickPreset(p.id)}
                  className={cn(
                    "group flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors",
                    active ? "bg-[var(--surface-3)]" : "hover:bg-white/[0.03]",
                  )}
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: color, boxShadow: `0 0 0 3px color-mix(in oklab, ${color} 22%, transparent)` }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] text-foreground">{p.label}</span>
                    <span className="mt-0.5 block truncate text-[11.5px] text-muted-foreground">
                      {p.description}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Wallet */}
      <div className="mx-2 mt-5 rounded-xl border hairline bg-[var(--surface-2)] p-3">
        <div className="flex items-center gap-2.5">
          <div
            className="h-8 w-8 rounded-full"
            style={{
              background: "conic-gradient(from 220deg, #8b5cf6, #6366f1, #06b6d4, #8b5cf6)",
            }}
          />
          <div className="min-w-0 flex-1">
            <div className="truncate font-display text-[13.5px] font-medium tracking-tight">
              {MOCK_ENS}
            </div>
            <button
              onClick={() => navigator.clipboard?.writeText(MOCK_ADDRESS)}
              className="mt-0.5 inline-flex items-center gap-1 font-mono text-[10.5px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {shortAddr(MOCK_ADDRESS)} <Copy className="h-2.5 w-2.5" />
            </button>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.14em] text-emerald-300">
            <span className="h-1 w-1 rounded-full bg-emerald-400" /> Read-only
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-2 mt-4 flex items-center gap-1 rounded-lg bg-[var(--surface-2)] p-1">
        <TabBtn active={tab === "activity"} onClick={() => setTab("activity")}>Activity</TabBtn>
        <TabBtn active={tab === "balances"} onClick={() => setTab("balances")}>Balances</TabBtn>
      </div>

      {/* Tab content */}
      <div className="mt-2 flex-1 overflow-y-auto px-2 pb-4">
        {tab === "activity" ? (
          <ul className="space-y-0.5">
            {RECENT_ACTIVITY.map((a) => {
              const color = a.verdict === "ALLOW" ? "var(--success)" : a.verdict === "REVIEW" ? "var(--warning)" : "var(--danger)";
              return (
                <li key={a.id}>
                  <button
                    onClick={() => onPickActivity?.(a.id)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-white/[0.03]"
                  >
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: color, boxShadow: `0 0 0 3px color-mix(in oklab, ${color} 22%, transparent)` }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] text-foreground/90">{a.label}</span>
                      <span className="block truncate font-mono text-[10.5px] text-muted-foreground">{a.recipient}</span>
                    </span>
                    <span className="text-right">
                      <span className="block font-mono text-[11px] tabular-nums text-foreground/85">{a.amount}</span>
                      <span className="block text-[10px] text-muted-foreground">{a.time}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <ul className="space-y-0.5">
            {TOKENS.map((t) => (
              <li
                key={t.symbol}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--surface-2)] font-mono text-[10px] text-muted-foreground">
                  {t.symbol.slice(0, 2)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] text-foreground">{t.symbol}</span>
                  <span className="block text-[10.5px] text-muted-foreground">{t.name}</span>
                </span>
                <span className="text-right">
                  <span className="block font-mono text-[11.5px] tabular-nums text-foreground">
                    {t.balance.toLocaleString()}
                  </span>
                  <span className="block text-[10px] tabular-nums text-muted-foreground">
                    ${(t.balance * t.usd).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors",
        active ? "bg-[var(--surface-3)] text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
