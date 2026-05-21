import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const LOG_LINES = [
  "Resolving network metadata…",
  "Recipient lookup: 14 prior interactions in 90d",
  "Token approval check: scope = transferFrom",
  "Simulating transaction on chain state…",
  "Counterparty risk feeds: 3 sources scanned",
  "Aggregating signal weights…",
  "Verdict ready.",
];

export function SignalsLog({ scanning }: { scanning: boolean }) {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    if (!scanning) {
      setLines([]);
      return;
    }
    let i = 0;
    const tick = () => {
      if (i < LOG_LINES.length) {
        setLines((prev) => [...prev, LOG_LINES[i]]);
        i += 1;
      }
    };
    tick();
    const id = setInterval(tick, 320);
    return () => clearInterval(id);
  }, [scanning]);

  return (
    <div className="surface-raise rounded-2xl">
      <div className="flex items-center justify-between px-5 py-3.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Signal log
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span
            className={
              scanning
                ? "h-1.5 w-1.5 animate-pulse-soft rounded-full bg-[var(--violet)]"
                : "h-1.5 w-1.5 rounded-full bg-white/15"
            }
          />
          {scanning ? "Streaming" : "Idle"}
        </span>
      </div>
      <div className="border-t hairline">
        {lines.length === 0 ? (
          <p className="px-5 py-6 text-[12.5px] text-muted-foreground">
            Run a scan to see live signals here.
          </p>
        ) : (
          <ul className="px-5 py-4 font-mono text-[11.5px] leading-[1.65] text-muted-foreground">
            {lines.map((l, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-2"
              >
                <span className="text-muted-foreground/50">›</span>
                <span>{l}</span>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
