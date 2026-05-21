import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ScanResult } from "@/lib/mockScan";

export function DetailsDrawer({
  open,
  onClose,
  result,
}: {
  open: boolean;
  onClose: () => void;
  result: ScanResult | null;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-[460px] border-l hairline bg-[var(--surface)]"
          >
            <div className="flex h-14 items-center justify-between border-b hairline px-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Scan details
              </span>
              <button onClick={onClose} className="rounded-md p-1.5 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-y-auto p-6" style={{ height: "calc(100% - 56px)" }}>
              <h3 className="font-display text-xl font-medium tracking-tight">
                Why we returned “{result?.verdict.toLowerCase()}”
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                {result?.summary}
              </p>

              <h4 className="mt-7 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Signal breakdown
              </h4>
              <ul className="mt-3 space-y-4">
                {result?.signals.map((s, i) => (
                  <li key={i} className="rounded-xl border hairline bg-[var(--surface-2)] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[13.5px] text-foreground">{s.label}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        {s.group}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                      {s.detail}
                    </p>
                  </li>
                ))}
              </ul>

              <h4 className="mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Simulation trace
              </h4>
              <pre className="mt-3 overflow-x-auto rounded-xl border hairline bg-[var(--surface-2)] p-4 font-mono text-[11.5px] leading-[1.7] text-muted-foreground">
{`step 01  → eth_call  preflight        ok
step 02  → resolveRecipient            ok
step 03  → checkApprovals              ${result?.verdict === "BLOCK" ? "warn" : "ok"}
step 04  → simulateBundle              ${result?.verdict === "BLOCK" ? "fail" : "ok"}
step 05  → scoreRisk                   ${result?.score}/100`}
              </pre>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}