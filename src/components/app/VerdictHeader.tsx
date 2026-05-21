import { motion } from "framer-motion";
import { CheckCircle2, ShieldAlert, ShieldX } from "lucide-react";
import type { Verdict } from "@/lib/mockScan";
import { cn } from "@/lib/utils";
import { RiskMeter } from "./RiskMeter";

const config = {
  ALLOW: {
    label: "Allow",
    accent: "var(--success)",
    bar: "from-emerald-400/60 via-emerald-400/10",
    Icon: CheckCircle2,
    pill: "Safe to proceed",
  },
  REVIEW: {
    label: "Review",
    accent: "var(--warning)",
    bar: "from-amber-400/60 via-amber-400/10",
    Icon: ShieldAlert,
    pill: "Needs your attention",
  },
  BLOCK: {
    label: "Block",
    accent: "var(--danger)",
    bar: "from-rose-500/60 via-rose-500/10",
    Icon: ShieldX,
    pill: "Blocked for your safety",
  },
} as const;

export function VerdictHeader({
  verdict,
  score,
  summary,
  compact,
}: {
  verdict: Verdict;
  score: number;
  summary: string;
  compact?: boolean;
}) {
  const c = config[verdict];
  const Icon = c.Icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden"
    >
      {/* Ambient bloom matching verdict */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: [0, 0.55, 0.3], scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], times: [0, 0.6, 1] }}
        className="pointer-events-none absolute -top-24 right-[-80px] h-[260px] w-[360px] rounded-full"
        style={{
          background: `radial-gradient(closest-side, color-mix(in oklab, ${c.accent} 35%, transparent), transparent 70%)`,
          filter: "blur(20px)",
        }}
      />
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r to-transparent",
          c.bar,
        )}
        style={{ animation: "draw-line 0.5s cubic-bezier(0.16,1,0.3,1) both" }}
      />
      <div
        className={cn(
          "relative z-10 flex flex-col gap-5 p-6",
          compact ? "md:p-6" : "md:p-8",
        )}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 20 }}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: `color-mix(in oklab, ${c.accent} 14%, transparent)`,
                border: `1px solid color-mix(in oklab, ${c.accent} 35%, transparent)`,
                color: c.accent,
              }}
            >
              <Icon className="h-5 w-5" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-display text-[28px] font-medium leading-none tracking-tight"
                  style={{ color: c.accent }}
                >
                  {c.label}
                </span>
                <span className="rounded-md border hairline-strong px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  Verdict
                </span>
              </div>
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.4 }}
                className="mt-2 max-w-md text-[15px] leading-relaxed text-foreground/85"
              >
                {summary}
              </motion.p>
            </div>
          </div>
          <RiskMeter score={score} accent={c.accent} />
        </div>
      </div>
      <style>{`@keyframes draw-line { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
    </motion.div>
  );
}
