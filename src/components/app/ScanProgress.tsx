import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { SCAN_STEPS } from "@/lib/mockScan";

export function ScanProgress({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= SCAN_STEPS.length) {
      const t = setTimeout(onDone, 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), 480);
    return () => clearTimeout(t);
  }, [step, onDone]);

  return (
    <div className="relative overflow-hidden p-8">
      <div className="absolute inset-x-0 top-0 h-px scan-shimmer" />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Scanning
          </span>
          <h3 className="mt-1.5 font-display text-2xl font-medium tracking-tight">
            Inspecting your transaction
          </h3>
        </div>
        <div className="flex items-center gap-2 rounded-full border hairline-strong px-3 py-1 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-[var(--violet)]" />
          Live
        </div>
      </div>
      <ol className="space-y-1.5">
        {SCAN_STEPS.map((label, i) => {
          const state = i < step ? "done" : i === step ? "active" : "idle";
          return (
            <motion.li
              key={label}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5"
              style={{
                background:
                  state === "active"
                    ? "rgba(139,92,246,0.06)"
                    : "transparent",
              }}
            >
              <span className="flex h-5 w-5 items-center justify-center">
                {state === "done" && (
                  <Check className="h-4 w-4 text-[var(--success)]" />
                )}
                {state === "active" && (
                  <Loader2 className="h-4 w-4 animate-spin text-[var(--violet)]" />
                )}
                {state === "idle" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
                )}
              </span>
              <span
                className={
                  state === "idle"
                    ? "text-sm text-muted-foreground/70"
                    : state === "active"
                      ? "text-sm text-foreground"
                      : "text-sm text-foreground/80"
                }
              >
                {label}
              </span>
              <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {state === "done" ? "OK" : state === "active" ? "…" : "—"}
              </span>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}