import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, RotateCcw, XCircle } from "lucide-react";

export function SubmittedPanel({
  kind,
  onReset,
}: {
  kind: "submitted" | "cancelled";
  onReset: () => void;
}) {
  const submitted = kind === "submitted";
  const accent = submitted ? "var(--success)" : "var(--muted-foreground)";
  const Icon = submitted ? CheckCircle2 : XCircle;
  const title = submitted ? "Transaction submitted" : "Transaction cancelled";
  const body = submitted
    ? "Your transaction has been broadcast. In production, Cardinal would monitor inclusion and notify on settlement."
    : "No transaction was sent. You can compose a new one or pick another scenario.";

  const hash = "0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e";

  return (
    <div className="px-7 py-14">
      <div className="mx-auto flex max-w-[420px] flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{
            background: submitted
              ? "rgba(52,211,153,0.10)"
              : "rgba(255,255,255,0.04)",
            border: `1px solid ${submitted ? "rgba(52,211,153,0.35)" : "rgba(255,255,255,0.10)"}`,
          }}
        >
          <Icon className="h-7 w-7" style={{ color: accent }} />
        </motion.div>

        <h3 className="mt-5 font-display text-2xl font-medium tracking-tight">{title}</h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{body}</p>

        {submitted && (
          <div className="mt-5 flex w-full items-center justify-between rounded-xl border hairline bg-[var(--surface)] px-4 py-3 text-left">
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
              className="inline-flex items-center gap-1 rounded-md border hairline px-2.5 py-1 text-[11.5px] text-muted-foreground"
            >
              Explorer <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        )}

        <button
          onClick={onReset}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--violet)] px-5 text-[14px] font-medium text-white"
          style={{ boxShadow: "0 12px 36px -12px rgba(139,92,246,0.55)" }}
        >
          <RotateCcw className="h-4 w-4" /> Run another scan
        </button>
      </div>
    </div>
  );
}