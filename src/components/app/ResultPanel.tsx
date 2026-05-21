import { useState } from "react";
import { ArrowRight, ChevronDown, RotateCcw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ScanResult } from "@/lib/mockScan";
import { VerdictHeader } from "./VerdictHeader";
import { SignalRow } from "./SignalRow";
import { cn } from "@/lib/utils";

const TRACE_LINES = [
  "Resolved network metadata",
  "Recipient lookup completed (14 prior interactions, 90d)",
  "Token approval scope analyzed",
  "Transaction simulated on chain state",
  "Counterparty risk feeds: 3 sources scanned",
  "Signal weights aggregated",
  "Verdict ready",
];

export function ResultPanel({
  result,
  onReset,
  onDetails,
  onProceed,
  onCancel,
}: {
  result: ScanResult;
  onReset: () => void;
  onDetails: () => void;
  onProceed: () => void;
  onCancel: () => void;
}) {
  const [ack, setAck] = useState(false);
  const [traceOpen, setTraceOpen] = useState(false);

  const v = result.verdict;
  const accent =
    v === "ALLOW" ? "var(--success)" : v === "REVIEW" ? "var(--warning)" : "var(--danger)";
  const tint =
    v === "ALLOW"
      ? "rgba(52,211,153,0.08)"
      : v === "REVIEW"
        ? "rgba(251,191,36,0.08)"
        : "rgba(239,68,68,0.08)";

  return (
    <div
      className={cn("relative", v === "BLOCK" && "border-pulse-danger rounded-2xl")}
      style={{
        backgroundImage: `radial-gradient(60% 40% at 100% 0%, ${tint}, transparent 70%)`,
      }}
    >
      <VerdictHeader verdict={v} score={result.score} summary={result.summary} />
      <div className="border-t hairline">
        <div className="px-6 py-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Signals · {result.signals.length}
          </span>
        </div>
        <motion.div
          className="border-t hairline"
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
        >
          {result.signals.map((s, i) => (
            <motion.div
              key={i}
              variants={{
                initial: { opacity: 0, y: 8 },
                animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              <SignalRow signal={s} />
            </motion.div>
          ))}
        </motion.div>

        {/* Live trace */}
        <div className="border-t hairline">
          <button
            onClick={() => setTraceOpen((v) => !v)}
            className="flex w-full items-center justify-between px-6 py-3 transition-colors hover:bg-white/[0.02]"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Live trace · {TRACE_LINES.length} events
            </span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground transition-transform",
                traceOpen && "rotate-180",
              )}
            />
          </button>
          <AnimatePresence initial={false}>
            {traceOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <ul className="space-y-1 px-6 pb-4 font-mono text-[11.5px] leading-[1.7] text-muted-foreground">
                  {TRACE_LINES.map((l, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-muted-foreground/50">›</span>
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer actions */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="border-t hairline p-6"
      >
        {v === "REVIEW" && (
          <label className="mb-4 flex cursor-pointer items-start gap-3 rounded-xl border border-amber-400/25 bg-amber-400/[0.06] p-4">
            <input
              type="checkbox"
              checked={ack}
              onChange={(e) => setAck(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-amber-400"
            />
            <span className="text-[13.5px] leading-relaxed text-amber-100/90">
              I've read the warnings and I want to proceed anyway.
            </span>
          </label>
        )}
        <div className="flex flex-wrap items-center gap-3">
          {v === "ALLOW" && (
            <button
              onClick={onProceed}
              className="btn-lift inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--success)] px-5 text-[14px] font-medium text-[#062014]"
              style={{ boxShadow: "0 12px 36px -12px rgba(52,211,153,0.55)" }}
            >
              Proceed <ArrowRight className="h-4 w-4" />
            </button>
          )}
          {v === "REVIEW" && (
            <button
              onClick={onProceed}
              disabled={!ack}
              className={cn(
                "btn-lift inline-flex h-11 items-center gap-2 rounded-xl px-5 text-[14px] font-medium",
                ack
                  ? "bg-[var(--warning)] text-[#2a1f00]"
                  : "bg-white/[0.04] text-muted-foreground",
              )}
              style={ack ? { boxShadow: "0 12px 36px -12px rgba(251,191,36,0.5)" } : undefined}
            >
              Proceed anyway <ArrowRight className="h-4 w-4" />
            </button>
          )}
          {v === "BLOCK" && (
            <>
              <button
                onClick={onCancel}
                className="btn-lift inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--danger)] px-5 text-[14px] font-medium text-white"
                style={{ boxShadow: "0 12px 36px -12px rgba(239,68,68,0.55)" }}
              >
                <X className="h-4 w-4" /> Cancel transaction
              </button>
              <button
                disabled
                className="inline-flex h-11 cursor-not-allowed items-center gap-2 rounded-xl bg-white/[0.04] px-5 text-[14px] font-medium text-muted-foreground/60"
              >
                Proceed
              </button>
            </>
          )}

          <button
            onClick={onReset}
            className="btn-lift inline-flex h-11 items-center gap-2 rounded-xl border hairline px-4 text-[13px] text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Run another scan
          </button>
          <button
            onClick={onDetails}
            className="ml-auto text-[13px] underline-offset-4 transition-colors hover:underline"
            style={{ color: accent }}
          >
            {v === "BLOCK" ? "Why was this blocked?" : "Full signal details"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
