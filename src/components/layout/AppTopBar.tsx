import { Link } from "@tanstack/react-router";
import { CardinalWordmark } from "@/components/brand/Logo";
import { CHAINS, MOCK_ENS, shortAddr } from "@/lib/mockData";
import { ChevronDown, Power } from "lucide-react";

export function AppTopBar({
  connected,
  onToggleConnect,
  chain,
  onChain,
  mode,
  onMode,
}: {
  connected: boolean;
  onToggleConnect: () => void;
  chain: string;
  onChain: (c: string) => void;
  mode: "Standard" | "Strict" | "Watch-only";
  onMode: (m: "Standard" | "Strict" | "Watch-only") => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b hairline bg-[rgba(8,8,15,0.78)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1380px] items-center gap-3 px-5">
        <Link to="/" className="mr-2">
          <CardinalWordmark />
        </Link>
        <span className="hidden h-5 w-px bg-white/10 md:inline-block" />
        <Pill>
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--violet)]" />
          <select
            value={chain}
            onChange={(e) => onChain(e.target.value)}
            className="bg-transparent text-[12.5px] text-foreground outline-none"
          >
            {CHAINS.map((c) => (
              <option key={c.id} value={c.id} className="bg-[var(--surface-2)]">
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Pill>
        <Pill>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Mode
          </span>
          <select
            value={mode}
            onChange={(e) => onMode(e.target.value as typeof mode)}
            className="bg-transparent text-[12.5px] text-foreground outline-none"
          >
            <option className="bg-[var(--surface-2)]">Standard</option>
            <option className="bg-[var(--surface-2)]">Strict</option>
            <option className="bg-[var(--surface-2)]">Watch-only</option>
          </select>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Pill>

        <div className="ml-auto flex items-center gap-2">
          {connected ? (
            <button
              onClick={onToggleConnect}
              className="group inline-flex h-9 items-center gap-2 rounded-lg border hairline bg-[var(--surface-2)] px-3 text-[12.5px] text-foreground transition-colors hover:border-[rgba(255,255,255,0.18)]"
            >
              <span
                className="h-5 w-5 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 220deg, #8b5cf6, #6366f1, #06b6d4, #8b5cf6)",
                }}
              />
              <span>{MOCK_ENS}</span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {shortAddr("0x1c4f9b8a3e2d0c6e1a7f5b4a83c6d1e2f0a93f7d")}
              </span>
              <Power className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-[var(--danger)]" />
            </button>
          ) : (
            <button
              onClick={onToggleConnect}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--violet)] px-3.5 text-[13px] font-medium text-white"
              style={{ boxShadow: "0 12px 32px -12px rgba(139,92,246,0.6)" }}
            >
              Connect wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="hidden h-8 items-center gap-2 rounded-lg border hairline bg-[var(--surface)] px-2.5 sm:inline-flex">
      {children}
    </div>
  );
}