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
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden"
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-px bg-gradient-to-r to-transparent",
          c.bar,
        )}
      />
      <div
        className={cn(
          "flex flex-col gap-5 p-6",
          compact ? "md:p-6" : "md:p-8",
        )}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: `color-mix(in oklab, ${c.accent} 14%, transparent)`,
                border: `1px solid color-mix(in oklab, ${c.accent} 35%, transparent)`,
                color: c.accent,
              }}
            >
              <Icon className="h-5 w-5" />
            </div>
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
              <p className="mt-2 max-w-md text-[15px] leading-relaxed text-foreground/85">
                {summary}
              </p>
            </div>
          </div>
          <RiskMeter score={score} accent={c.accent} />
        </div>
      </div>
    </motion.div>
  );
}
