import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, ShieldAlert, ShieldX, Loader2 } from "lucide-react";
import { ease, dur } from "@/lib/motion";

type Verdict = "ALLOW" | "REVIEW" | "BLOCK";
type Severity = "info" | "warn" | "danger";

type Scenario = {
  id: string;
  verdict: Verdict;
  score: number;
  label: string;
  recipient: string;
  amount: string;
  summary: string;
  signals: { group: string; label: string; severity: Severity }[];
};

const SCENARIOS: Scenario[] = [
  {
    id: "safe",
    verdict: "ALLOW",
    score: 8,
    label: "Send · USDC",
    recipient: "0x9c2…a14",
    amount: "250.00 USDC",
    summary: "Looks safe — recipient seen before, no approvals requested.",
    signals: [
      { group: "Recipient", label: "Seen 4× in last 90 days", severity: "info" },
      { group: "Permissions", label: "No approvals requested", severity: "info" },
      { group: "Simulation", label: "Completes as expected", severity: "info" },
    ],
  },
  {
    id: "review",
    verdict: "REVIEW",
    score: 58,
    label: "Approve · USDT",
    recipient: "0x4f1…be7",
    amount: "Unlimited",
    summary: "A few signals need your attention before signing.",
    signals: [
      { group: "Permissions", label: "Unlimited spending approval", severity: "warn" },
      { group: "Recipient", label: "New counterparty · 6d old", severity: "warn" },
      { group: "Simulation", label: "Approval simulates cleanly", severity: "info" },
    ],
  },
  {
    id: "block",
    verdict: "BLOCK",
    score: 96,
    label: "Contract · 0xDead…",
    recipient: "0xdead…beef",
    amount: "0.42 ETH + all USDC",
    summary: "Blocked — drainer signature and hidden transfer detected.",
    signals: [
      { group: "Recipient", label: "Flagged in 3 threat feeds", severity: "danger" },
      { group: "Simulation", label: "Hidden transfer detected", severity: "danger" },
      { group: "Contract", label: "Obfuscated call data", severity: "danger" },
    ],
  },
];

const STAGE_MS = { compose: 1400, scanning: 2600, verdict: 3200 } as const;
type Stage = keyof typeof STAGE_MS;

const verdictColor: Record<Verdict, string> = {
  ALLOW: "var(--success)",
  REVIEW: "var(--warning)",
  BLOCK: "var(--danger)",
};

const sevColor: Record<Severity, string> = {
  info: "var(--success)",
  warn: "var(--warning)",
  danger: "var(--danger)",
};

const VerdictIcon = { ALLOW: CheckCircle2, REVIEW: ShieldAlert, BLOCK: ShieldX } as const;

export function LiveScanDemo() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [stage, setStage] = useState<Stage>("compose");
  const scenario = SCENARIOS[idx];

  useEffect(() => {
    if (reduce) {
      setStage("verdict");
      return;
    }
    const ms = STAGE_MS[stage];
    const t = setTimeout(() => {
      if (stage === "compose") setStage("scanning");
      else if (stage === "scanning") setStage("verdict");
      else {
        setIdx((i) => (i + 1) % SCENARIOS.length);
        setStage("compose");
      }
    }, ms);
    return () => clearTimeout(t);
  }, [stage, reduce]);

  const accent = verdictColor[scenario.verdict];

  return (
    <div className="relative">
      {/* ambient bloom keyed to verdict */}
      <motion.div
        aria-hidden
        key={`bloom-${scenario.id}-${stage}`}
        className="pointer-events-none absolute -inset-10 -z-10 rounded-[44px]"
        style={{
          background: `radial-gradient(closest-side, color-mix(in oklab, ${accent} 28%, transparent), transparent 70%)`,
        }}
        initial={{ opacity: 0.35 }}
        animate={{ opacity: stage === "verdict" ? 0.7 : 0.4 }}
        transition={{ duration: 0.8, ease: ease.outExpo }}
      />

      <div className="surface-raise overflow-hidden rounded-2xl">
        {/* top status bar */}
        <div className="flex items-center justify-between border-b hairline px-5 py-3">
          <div className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: accent, boxShadow: `0 0 0 3px color-mix(in oklab, ${accent} 22%, transparent)` }}
            />
            <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Live · auto demo
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {SCENARIOS.map((s, i) => (
              <span
                key={s.id}
                className="h-1 rounded-full transition-all"
                style={{
                  width: i === idx ? 18 : 6,
                  background:
                    i === idx
                      ? verdictColor[s.verdict]
                      : "rgba(255,255,255,0.12)",
                }}
              />
            ))}
          </div>
        </div>

        {/* tx summary line — always visible */}
        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="min-w-0">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
              {scenario.label}
            </div>
            <div className="mt-1 truncate font-mono text-[12.5px] text-foreground/85">
              to {scenario.recipient} · {scenario.amount}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: dur.sm, ease: ease.outExpo }}
              className="ml-3 inline-flex items-center gap-1.5 rounded-md border hairline bg-[var(--surface-2)] px-2 py-1 text-[10.5px] font-medium uppercase tracking-[0.14em]"
              style={{
                color: stage === "verdict" ? accent : "var(--muted-foreground)",
              }}
            >
              {stage === "compose" && "Ready"}
              {stage === "scanning" && (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" /> Scanning
                </>
              )}
              {stage === "verdict" && scenario.verdict}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* body — morphs by stage */}
        <div className="relative min-h-[260px] border-t hairline">
          <AnimatePresence mode="wait">
            {stage === "compose" && <ComposeView key="compose" />}
            {stage === "scanning" && <ScanningView key="scanning" />}
            {stage === "verdict" && (
              <VerdictView key={`verdict-${scenario.id}`} scenario={scenario} />
            )}
          </AnimatePresence>
        </div>

        <div className="border-t hairline px-5 py-3 text-[11px] text-muted-foreground">
          Auto-cycling through real scenarios · no wallet needed
        </div>
      </div>
    </div>
  );
}

const stepLabels = [
  "Checking network",
  "Resolving recipient",
  "Reviewing permissions",
  "Running simulation",
  "Scoring risk",
];

function ComposeView() {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(6px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(6px)" }}
      transition={{ duration: dur.md, ease: ease.outExpo }}
      className="flex h-full flex-col gap-3 px-5 py-5"
    >
      {["Recipient", "Token & amount", "Chain"].map((l, i) => (
        <motion.div
          key={l}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.md, ease: ease.outExpo, delay: i * 0.08 }}
          className="flex items-center justify-between rounded-lg border hairline bg-[var(--surface-2)] px-3.5 py-2.5"
        >
          <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
            {l}
          </span>
          <span className="h-2 w-24 rounded-full bg-white/[0.06]" />
        </motion.div>
      ))}
      <div className="mt-auto flex items-center justify-end">
        <span className="inline-flex h-8 items-center rounded-lg bg-foreground px-3 text-[12px] font-medium text-background">
          Scan transaction
        </span>
      </div>
    </motion.div>
  );
}

function ScanningView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: dur.sm }}
      className="relative h-full overflow-hidden px-5 py-5"
    >
      {/* scan sweep */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(139,92,246,0.7), transparent)",
        }}
        initial={{ y: 0 }}
        animate={{ y: [0, 240, 0] }}
        transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
      />
      <div className="space-y-2.5">
        {stepLabels.map((l, i) => (
          <motion.div
            key={l}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: dur.md, ease: ease.outExpo, delay: i * 0.18 }}
            className="flex items-center gap-3"
          >
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-[var(--violet)]"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
            />
            <span className="text-[12.5px] text-foreground/80">{l}</span>
            <span className="ml-auto font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
              ok
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function VerdictView({ scenario }: { scenario: Scenario }) {
  const Icon = VerdictIcon[scenario.verdict];
  const accent = verdictColor[scenario.verdict];
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(8px)", y: 6 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      exit={{ opacity: 0, filter: "blur(6px)", y: -4 }}
      transition={{ duration: dur.lg, ease: ease.outExpo }}
      className="flex h-full flex-col px-5 py-4"
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg"
          style={{
            background: `color-mix(in oklab, ${accent} 14%, transparent)`,
            color: accent,
          }}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span
              className="font-display text-[20px] font-medium leading-none tracking-tight"
              style={{ color: accent }}
            >
              {scenario.verdict === "ALLOW" ? "Allow" : scenario.verdict === "REVIEW" ? "Review" : "Block"}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              risk {scenario.score}
            </span>
          </div>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-foreground/80">
            {scenario.summary}
          </p>
        </div>
      </div>
      {/* draw line */}
      <motion.div
        className="mt-3 h-px origin-left"
        style={{
          background: `linear-gradient(90deg, ${accent}, transparent)`,
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, ease: ease.outExpo, delay: 0.1 }}
      />
      <div className="mt-3 space-y-2">
        {scenario.signals.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur.md, ease: ease.outExpo, delay: 0.2 + i * 0.08 }}
            className="flex items-center gap-3"
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{
                background: sevColor[s.severity],
                boxShadow: `0 0 0 3px color-mix(in oklab, ${sevColor[s.severity]} 22%, transparent)`,
              }}
            />
            <span className="w-[80px] shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {s.group}
            </span>
            <span className="flex-1 text-[12.5px] text-foreground/85">{s.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}