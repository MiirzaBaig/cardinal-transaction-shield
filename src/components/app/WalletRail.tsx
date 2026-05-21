import { Copy, Plus, FileCode, Hash } from "lucide-react";
import { TOKENS, MOCK_ADDRESS, MOCK_ENS, shortAddr } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export function WalletRail({
  connected,
  onConnect,
  onNewScan,
}: {
  connected: boolean;
  onConnect: () => void;
  onNewScan: () => void;
}) {
  const total = TOKENS.reduce((acc, t) => acc + t.balance * t.usd, 0);

  return (
    <aside className="flex h-full flex-col gap-4">
      {/* Account card */}
      <div className="surface-raise rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Wallet
          </span>
          {connected && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Read-only
            </span>
          )}
        </div>
        {connected ? (
          <>
            <div className="mt-3 flex items-center gap-3">
              <div
                className="h-9 w-9 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 220deg, #8b5cf6, #6366f1, #06b6d4, #8b5cf6)",
                }}
              />
              <div className="min-w-0">
                <div className="truncate font-display text-[17px] font-medium tracking-tight">
                  {MOCK_ENS}
                </div>
                <button
                  onClick={() => navigator.clipboard?.writeText(MOCK_ADDRESS)}
                  className="mt-0.5 inline-flex items-center gap-1.5 font-mono text-[11.5px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {shortAddr(MOCK_ADDRESS)}
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="mt-5 rounded-xl border hairline bg-[var(--surface-2)] p-3">
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Total balance
              </div>
              <div className="mt-1 font-display text-2xl font-medium tabular-nums">
                ${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </div>
          </>
        ) : (
          <div className="mt-4">
            <p className="text-[13.5px] leading-relaxed text-muted-foreground">
              Connect a wallet to load balances and recent activity.
            </p>
            <button
              onClick={onConnect}
              className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-lg bg-[var(--violet)] text-[13px] font-medium text-white transition-colors hover:bg-[#9a6cff]"
              style={{ boxShadow: "0 12px 32px -12px rgba(139,92,246,0.65)" }}
            >
              Connect wallet
            </button>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Cardinal never holds your keys. Read-only access only.
            </p>
          </div>
        )}
      </div>

      {/* Balances */}
      <div className="surface-raise rounded-2xl">
        <div className="flex items-center justify-between px-5 py-3.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Balances
          </span>
          <span className="text-[11px] text-muted-foreground">{connected ? "4 tokens" : "—"}</span>
        </div>
        <ul>
          {TOKENS.map((t, i) => (
            <li
              key={t.symbol}
              className={cn(
                "flex items-center justify-between px-5 py-3 border-t hairline",
                !connected && "opacity-50",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-3)] font-mono text-[10px] text-muted-foreground"
                >
                  {t.symbol.slice(0, 2)}
                </div>
                <div>
                  <div className="text-[13.5px] text-foreground">{t.symbol}</div>
                  <div className="text-[11px] text-muted-foreground">{t.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[13px] tabular-nums text-foreground">
                  {connected ? t.balance.toLocaleString() : "—"}
                </div>
                <div className="text-[11px] tabular-nums text-muted-foreground">
                  {connected ? `$${(t.balance * t.usd).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : ""}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick actions */}
      <div className="surface-raise rounded-2xl p-3">
        <QuickAction icon={<Plus className="h-3.5 w-3.5" />} label="New scan" onClick={onNewScan} />
        <QuickAction icon={<FileCode className="h-3.5 w-3.5" />} label="Paste calldata" />
        <QuickAction icon={<Hash className="h-3.5 w-3.5" />} label="Import tx hash" />
      </div>
    </aside>
  );
}

function QuickAction({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] text-muted-foreground transition-colors hover:bg-white/[0.03] hover:text-foreground"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--surface-3)]">
        {icon}
      </span>
      {label}
    </button>
  );
}
