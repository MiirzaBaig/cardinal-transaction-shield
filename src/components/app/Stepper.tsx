import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type Stage = "compose" | "scanning" | "verdict";

const STEPS: { id: Stage; label: string; n: string }[] = [
  { id: "compose", n: "01", label: "Compose" },
  { id: "scanning", n: "02", label: "Scan" },
  { id: "verdict", n: "03", label: "Decide" },
];

export function Stepper({ stage }: { stage: Stage }) {
  const activeIndex = STEPS.findIndex((s) => s.id === stage);
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((s, i) => {
        const state = i < activeIndex ? "done" : i === activeIndex ? "active" : "idle";
        return (
          <div key={s.id} className="flex items-center gap-2">
            <motion.div
              animate={
                state === "active"
                  ? { scale: [1, 1.06, 1] }
                  : { scale: 1 }
              }
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "flex items-center gap-2 rounded-full px-2.5 py-1 text-[11.5px] transition-colors duration-300",
                state === "active"
                  ? "bg-[rgba(139,92,246,0.12)] text-foreground"
                  : state === "done"
                    ? "text-foreground/80"
                    : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "font-mono text-[10px] uppercase tracking-[0.14em]",
                  state === "active" ? "text-[var(--violet)]" : "text-muted-foreground",
                )}
              >
                {s.n}
              </span>
              <span className="font-medium">{s.label}</span>
            </motion.div>
            {i < STEPS.length - 1 && (
              <span className="relative block h-px w-6 overflow-hidden bg-white/10">
                <motion.span
                  className="absolute inset-y-0 left-0 origin-left bg-[var(--violet)]/70"
                  initial={false}
                  animate={{ scaleX: i < activeIndex ? 1 : 0, width: "100%" }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{ height: 1 }}
                />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}