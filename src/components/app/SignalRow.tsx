import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Signal } from "@/lib/mockScan";
import { cn } from "@/lib/utils";

const sevColor: Record<Signal["severity"], string> = {
  info: "var(--success)",
  warn: "var(--warning)",
  danger: "var(--danger)",
};

export function SignalRow({ signal }: { signal: Signal }) {
  const [open, setOpen] = useState(false);
  const color = sevColor[signal.severity];
  return (
    <div className="border-t hairline first:border-t-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-white/[0.02]"
      >
        <span
          className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ background: color, boxShadow: `0 0 0 3px color-mix(in oklab, ${color} 22%, transparent)` }}
        />
        <span className="w-[88px] shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {signal.group}
        </span>
        <span className="flex-1 text-[14px] text-foreground/90">{signal.label}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 pl-[124px] text-[13.5px] leading-relaxed text-muted-foreground">
              {signal.detail}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
