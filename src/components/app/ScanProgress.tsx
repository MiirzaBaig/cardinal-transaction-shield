import { motion, useReducedMotion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SCAN_STEPS, SCAN_STEP_DURATIONS_MS } from "@/lib/mockScan";
import { cn } from "@/lib/utils";

export function ScanProgress({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const reduce = useReducedMotion();

  // Advance steps with non-uniform pacing
  useEffect(() => {
    if (step >= SCAN_STEPS.length) {
      const t = setTimeout(onDone, 420);
      return () => clearTimeout(t);
    }
    const d = SCAN_STEP_DURATIONS_MS[step] ?? 600;
    const t = setTimeout(() => setStep((s) => s + 1), d);
    return () => clearTimeout(t);
  }, [step, onDone]);

  // Elapsed timer
  const start = useRef(Date.now());
  useEffect(() => {
    const i = setInterval(() => setElapsed(Date.now() - start.current), 80);
    return () => clearInterval(i);
  }, []);

  const seconds = (elapsed / 1000).toFixed(1);

  return (
    <div className="relative overflow-hidden">
      {/* Ambient layer */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 scan-dotgrid opacity-60" />
        <div
          className="ambient-drift-a absolute -left-24 top-1/3 h-[320px] w-[420px] rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(139,92,246,0.18), transparent 70%)",
            filter: "blur(20px)",
          }}
        />
        <div
          className="ambient-drift-b absolute right-[-80px] bottom-0 h-[260px] w-[360px] rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(99,102,241,0.16), transparent 70%)",
            filter: "blur(24px)",
          }}
        />
        {!reduce && <div className="scan-sweep" />}
      </div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="mb-7 flex items-start justify-between gap-6">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Scanning
            </span>
            <h3 className="mt-1.5 font-display text-2xl font-medium tracking-tight">
              <LetterReveal text="Inspecting your transaction" />
            </h3>
            <div className="mt-2 flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
              <span className="tabular-nums text-foreground/70">{seconds}s</span>
              <span className="h-1 w-1 rounded-full bg-white/15" />
              <span>
                {Math.min(step, SCAN_STEPS.length)} / {SCAN_STEPS.length} checks
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-full border hairline-strong bg-white/[0.02] px-3 py-1.5 text-[11px] text-muted-foreground">
            <Waveform active={!reduce} />
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-[var(--violet)]" />
            Live
          </div>
        </div>

        {/* Rows */}
        <ol className="space-y-1">
          {SCAN_STEPS.map((label, i) => {
            const state = i < step ? "done" : i === step ? "active" : "idle";
            return <Row key={label} label={label} index={i} state={state} reduce={!!reduce} />;
          })}
        </ol>
      </div>
    </div>
  );
}

function Row({
  label,
  index,
  state,
  reduce,
}: {
  label: string;
  index: number;
  state: "idle" | "active" | "done";
  reduce: boolean;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3 transition-colors",
        state === "active" && "bg-[rgba(139,92,246,0.06)]",
      )}
      style={
        state === "active"
          ? {
              boxShadow:
                "inset 0 0 0 1px rgba(139,92,246,0.18), 0 0 32px -10px rgba(139,92,246,0.25)",
            }
          : undefined
      }
    >
      {/* Left active bar */}
      {state === "active" && (
        <motion.span
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 top-1/2 h-6 w-[2px] -translate-y-1/2 origin-center rounded-full bg-[var(--violet)]"
          style={{ boxShadow: "0 0 12px rgba(139,92,246,0.65)" }}
        />
      )}
      {/* Shimmer sweep on active */}
      {state === "active" && !reduce && (
        <span aria-hidden className="row-shimmer pointer-events-none absolute inset-0" />
      )}

      <span className="relative flex h-5 w-5 items-center justify-center">
        {state === "done" && (
          <motion.span
            initial={{ scale: 0.6, rotate: -90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <Check className="h-4 w-4 text-[var(--success)]" />
          </motion.span>
        )}
        {state === "active" && (
          <Loader2 className="h-4 w-4 animate-spin text-[var(--violet)]" />
        )}
        {state === "idle" && (
          <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
        )}
      </span>
      <span
        className={cn(
          "text-[14px] tracking-tight transition-colors",
          state === "idle" && "text-muted-foreground/65",
          state === "active" && "text-foreground",
          state === "done" && "text-foreground/80",
        )}
      >
        {label}
      </span>
      <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.16em]">
        {state === "done" && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18, duration: 0.24 }}
            className="text-[var(--success)]/80"
          >
            OK
          </motion.span>
        )}
        {state === "active" && <span className="text-[var(--violet)]/70">…</span>}
        {state === "idle" && <span className="text-muted-foreground/40">—</span>}
      </span>
    </motion.li>
  );
}

function LetterReveal({ text }: { text: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <span>{text}</span>;
  return (
    <span aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.012, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

function Waveform({ active }: { active: boolean }) {
  const bars = 7;
  return (
    <span className="flex items-end gap-[2px]" aria-hidden>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.span
          key={i}
          className="w-[2px] rounded-full bg-[var(--violet)]/70"
          initial={{ height: 4 }}
          animate={active ? { height: [4, 10, 6, 12, 4] } : { height: 4 }}
          transition={{
            duration: 1.6,
            ease: "easeInOut",
            repeat: Infinity,
            delay: i * 0.08,
          }}
          style={{ height: 4 }}
        />
      ))}
    </span>
  );
}