import { motion } from "framer-motion";
import { ArrowUpRight, RotateCcw } from "lucide-react";

export function SubmittedPanel({
  kind,
  onReset,
}: {
  kind: "submitted" | "cancelled";
  onReset: () => void;
}) {
  const submitted = kind === "submitted";
  const accent = submitted ? "var(--success)" : "var(--muted-foreground)";
  const title = submitted ? "Transaction submitted" : "Transaction cancelled";
  const body = submitted
    ? "Your transaction has been broadcast. In production, Cardinal would monitor inclusion and notify on settlement."
    : "No transaction was sent. You can compose a new one or pick another scenario.";

  const hash = "0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e";

  return (
    <div className="px-7 py-14">
      <div className="mx-auto flex max-w-[420px] flex-col items-center text-center">
        <div className="relative">
          {submitted && (
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
              style={{ border: "1px solid rgba(52,211,153,0.5)" }}
            />
          )}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="relative flex h-14 w-14 items-center justify-center rounded-full"
            style={{
              background: submitted ? "rgba(52,211,153,0.10)" : "rgba(239,68,68,0.10)",
              border: `1px solid ${submitted ? "rgba(52,211,153,0.4)" : "rgba(239,68,68,0.35)"}`,
              boxShadow: submitted
                ? "0 0 40px -8px rgba(52,211,153,0.45)"
                : "0 0 40px -8px rgba(239,68,68,0.35)",
            }}
          >
            <svg viewBox="0 0 28 28" width="28" height="28" fill="none">
              {submitted ? (
                <motion.path
                  d="M7 14.5 L12 19.5 L21 9.5"
                  stroke={accent}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
                />
              ) : (
                <>
                  <motion.path
                    d="M9 9 L19 19"
                    stroke="var(--danger)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  />
                  <motion.path
                    d="M19 9 L9 19"
                    stroke="var(--danger)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                  />
                </>
              )}
            </svg>
          </motion.div>
        </div>

        <motion.h3
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-5 font-display text-2xl font-medium tracking-tight"
        >
          {title}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58, duration: 0.4 }}
          className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground"
        >
          {body}
        </motion.p>

        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.66, duration: 0.4 }}
            className="mt-5 flex w-full items-center justify-between rounded-xl border hairline bg-[var(--surface)] px-4 py-3 text-left"
          >
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Tx hash
              </div>
              <div className="mt-0.5 font-mono text-[12.5px] text-foreground">
                {hash.slice(0, 14)}…{hash.slice(-6)}
              </div>
            </div>
            <button
              disabled
              className="btn-lift inline-flex items-center gap-1 rounded-md border hairline px-2.5 py-1 text-[11.5px] text-muted-foreground"
            >
              Explorer <ArrowUpRight className="h-3 w-3" />
            </button>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.74, duration: 0.4 }}
          onClick={onReset}
          className="btn-lift mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--violet)] px-5 text-[14px] font-medium text-white"
          style={{ boxShadow: "0 12px 36px -12px rgba(139,92,246,0.55)" }}
        >
          <RotateCcw className="h-4 w-4" /> Run another scan
        </motion.button>
      </div>
    </div>
  );
}