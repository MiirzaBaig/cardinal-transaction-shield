import { ArrowRight, Paperclip, RotateCcw, Zap } from "lucide-react";
import { CHAINS, TOKENS, type TxType } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Select } from "./Select";

export type ComposerState = {
  type: TxType;
  chain: string;
  token: string;
  recipient: string;
  amount: string;
  unlimited: boolean;
  spender: string;
  fn: string;
};

const TYPES: { id: TxType; label: string }[] = [
  { id: "transfer", label: "Transfer" },
  { id: "approval", label: "Approval" },
  { id: "contract", label: "Contract call" },
  { id: "swap", label: "Swap" },
];

export function TxComposer({
  value,
  onChange,
  onScan,
  onReset,
}: {
  value: ComposerState;
  onChange: (v: ComposerState) => void;
  onScan: () => void;
  onReset: () => void;
}) {
  const set = <K extends keyof ComposerState>(k: K, v: ComposerState[K]) =>
    onChange({ ...value, [k]: v });

  const token = TOKENS.find((t) => t.symbol === value.token) ?? TOKENS[0];
  const usd = token ? (parseFloat(value.amount || "0") * token.usd).toFixed(2) : "0.00";

  const ready = value.recipient.length >= 8 && (value.amount !== "" || value.type !== "transfer");

  return (
    <div className="p-7">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Compose
          </span>
          <h3 className="mt-1.5 font-display text-2xl font-medium tracking-tight">
            New transaction
          </h3>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-md border hairline px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>

      {/* Type tabs */}
      <div className="flex w-full items-center gap-1 rounded-xl surface-2 p-1">
        {TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => set("type", t.id)}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
              value.type === t.id
                ? "bg-[var(--surface-3)] text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4">
        {/* Chain + Token row */}
        <div className="grid grid-cols-2 gap-3">
          <FieldShell label="Chain">
            <Select
              value={value.chain}
              onChange={(v) => set("chain", v)}
              options={CHAINS.map((c) => ({ value: c.id, label: c.name, hint: c.short }))}
              className="h-9 w-full justify-between"
            />
          </FieldShell>
          <FieldShell label="Token">
            <Select
              value={value.token}
              onChange={(v) => set("token", v)}
              options={TOKENS.map((t) => ({ value: t.symbol, label: `${t.symbol} — ${t.name}` }))}
              className="h-9 w-full justify-between"
            />
          </FieldShell>
        </div>

        {/* Recipient */}
        <Field label={value.type === "approval" ? "Spender address" : "Recipient address"}>
          <input
            value={value.recipient}
            onChange={(e) => set("recipient", e.target.value)}
            placeholder="0x…"
            spellCheck={false}
            className="w-full bg-transparent font-mono text-[13.5px] text-foreground outline-none placeholder:text-muted-foreground/50"
          />
          <button
            onClick={async () => {
              try {
                const t = await navigator.clipboard.readText();
                if (t) set("recipient", t.trim());
              } catch {}
            }}
            className="inline-flex items-center gap-1 rounded-md border hairline px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <Paperclip className="h-3 w-3" /> Paste
          </button>
        </Field>

        {/* Amount */}
        {value.type !== "contract" && (
          <Field
            label={value.type === "approval" ? "Allowance" : "Amount"}
            right={
              value.type === "approval" ? (
                <button
                  onClick={() => set("unlimited", !value.unlimited)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] transition-colors",
                    value.unlimited
                      ? "border-amber-400/35 bg-amber-400/10 text-amber-300"
                      : "hairline text-muted-foreground hover:text-foreground",
                  )}
                >
                  Unlimited
                </button>
              ) : (
                <span className="text-[11px] text-muted-foreground">
                  ≈ ${usd}
                </span>
              )
            }
          >
            <input
              value={value.unlimited ? "Unlimited" : value.amount}
              disabled={value.unlimited}
              onChange={(e) => set("amount", e.target.value)}
              placeholder="0.00"
              inputMode="decimal"
              className="w-full bg-transparent font-display text-[20px] font-medium text-foreground outline-none placeholder:text-muted-foreground/40 disabled:text-amber-300"
            />
            <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
              {value.token}
            </span>
          </Field>
        )}

        {value.type === "contract" && (
          <Field label="Function">
            <input
              value={value.fn}
              onChange={(e) => set("fn", e.target.value)}
              placeholder="transfer(address,uint256)"
              spellCheck={false}
              className="w-full bg-transparent font-mono text-[13.5px] text-foreground outline-none placeholder:text-muted-foreground/50"
            />
          </Field>
        )}

        {/* Gas / sim strip */}
        <div className="flex items-center justify-between rounded-xl border hairline bg-[var(--surface)] px-4 py-3 text-[12.5px]">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              Est. gas <span className="ml-1 font-mono text-foreground">0.0021 ETH</span>
            </span>
            <span className="hidden h-3 w-px bg-white/10 sm:inline-block" />
            <span className="hidden text-muted-foreground sm:inline">
              Network fee <span className="ml-1 font-mono text-foreground">~$6.55</span>
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-[0.14em] text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Ready to scan
          </span>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={onScan}
          disabled={!ready}
          className={cn(
            "btn-lift group inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-[14px] font-medium",
            ready
              ? "bg-[var(--violet)] text-white hover:bg-[#9a6cff]"
              : "bg-white/[0.04] text-muted-foreground",
          )}
          style={ready ? { boxShadow: "0 12px 36px -12px rgba(139,92,246,0.65)" } : undefined}
        >
          <Zap className="h-4 w-4" />
          Scan transaction
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  right,
  children,
}: {
  label: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="focus-halo rounded-xl border hairline bg-[var(--surface)] px-4 py-3">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </span>
        {right}
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

function FieldShell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 px-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
      {children}
    </div>
  );
}
