import { useState } from "react";
import { ArrowRight, RotateCcw, X } from "lucide-react";
import type { ScanResult } from "@/lib/mockScan";
import { VerdictHeader } from "./VerdictHeader";
import { SignalRow } from "./SignalRow";
import { cn } from "@/lib/utils";

export function ResultPanel({
  result,
  onReset,
  onDetails,
}: {
  result: ScanResult;
  onReset: () => void;
  onDetails: () => void;
}) {
  const [ack, setAck] = useState(false);

  const v = result.verdict;
  const accent =
    v === "ALLOW" ? "var(--success)" : v === "REVIEW" ? "var(--warning)" : "var(--danger)";

  return (
    <div>
      <VerdictHeader verdict={v} score={result.score} summary={result.summary} />
      <div className="border-t hairline">
        <div className="px-6 py-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Signals · {result.signals.length}
          </span>
        </div>
        <div className="border-t hairline">
          {result.signals.map((s, i) => (
            <SignalRow key={i} signal={s} />
          ))}
        </div>
      </div>

      {/* Footer actions */}
      <div className="border-t hairline p-6">
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
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--success)] px-5 text-[14px] font-medium text-[#062014] transition-transform hover:-translate-y-px"
              style={{ boxShadow: "0 12px 36px -12px rgba(52,211,153,0.55)" }}
            >
              Proceed <ArrowRight className="h-4 w-4" />
            </button>
          )}
          {v === "REVIEW" && (
            <button
              disabled={!ack}
              className={cn(
                "inline-flex h-11 items-center gap-2 rounded-xl px-5 text-[14px] font-medium transition-all",
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
              <button className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--danger)] px-5 text-[14px] font-medium text-white">
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
            className="inline-flex h-11 items-center gap-2 rounded-xl border hairline px-4 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
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
      </div>
    </div>
  );
}
