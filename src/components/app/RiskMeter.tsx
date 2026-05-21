import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

export function RiskMeter({ score, accent }: { score: number; accent: string }) {
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(0);
  const rounded = useTransform(mv, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(mv, score, { duration: 0.9, ease: "easeOut" });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [score, mv, rounded]);

  const pct = Math.min(100, Math.max(0, score));
  return (
    <div className="flex w-[130px] flex-col items-end gap-1.5">
      <div className="flex items-baseline gap-1">
        <motion.span
          className="font-display text-3xl font-medium tabular-nums"
          style={{ color: accent }}
        >
          {display}
        </motion.span>
        <span className="text-xs text-muted-foreground">/ 100</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: accent }}
        />
      </div>
      <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground">
        Risk score
      </span>
    </div>
  );
}
