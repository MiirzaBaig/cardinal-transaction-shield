import { motion, useReducedMotion } from "framer-motion";

type Item = {
  addr: string;
  kind: string;
  verdict: "BLOCK" | "REVIEW" | "ALLOW";
  ago: string;
};

const ITEMS: Item[] = [
  { addr: "0x7a3…f2c", kind: "drainer signature", verdict: "BLOCK", ago: "2s" },
  { addr: "0x91b…04e", kind: "unlimited approval", verdict: "REVIEW", ago: "6s" },
  { addr: "0xc12…aa1", kind: "verified transfer", verdict: "ALLOW", ago: "9s" },
  { addr: "0xdead…beef", kind: "obfuscated calldata", verdict: "BLOCK", ago: "14s" },
  { addr: "0x4f1…be7", kind: "new counterparty", verdict: "REVIEW", ago: "21s" },
  { addr: "0x88e…712", kind: "simulated cleanly", verdict: "ALLOW", ago: "27s" },
  { addr: "0x33b…0c9", kind: "hidden transfer", verdict: "BLOCK", ago: "34s" },
  { addr: "0x6ad…f80", kind: "fresh contract · 2d", verdict: "REVIEW", ago: "41s" },
  { addr: "0xb02…e44", kind: "recipient seen 12×", verdict: "ALLOW", ago: "48s" },
  { addr: "0xfee…cab", kind: "spoofed token name", verdict: "BLOCK", ago: "56s" },
];

const color: Record<Item["verdict"], string> = {
  BLOCK: "var(--danger)",
  REVIEW: "var(--warning)",
  ALLOW: "var(--success)",
};

export function ThreatFeed() {
  const reduce = useReducedMotion();
  const loop = [...ITEMS, ...ITEMS];
  return (
    <section
      aria-label="Live threat feed"
      className="relative overflow-hidden border-y hairline bg-[rgba(10,10,16,0.6)]"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[var(--background)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[var(--background)] to-transparent" />
      <div className="flex items-center">
        <div className="z-10 hidden shrink-0 items-center gap-2 border-r hairline bg-[var(--background)] px-5 py-3 md:flex">
          <span
            className="h-1.5 w-1.5 rounded-full bg-[var(--danger)]"
            style={{ boxShadow: "0 0 0 3px color-mix(in oklab, var(--danger) 22%, transparent)" }}
          />
          <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            Live feed
          </span>
        </div>
        <div className="relative flex-1 overflow-hidden py-3">
          <motion.div
            className="flex w-max items-center gap-3"
            animate={reduce ? undefined : { x: ["0%", "-50%"] }}
            transition={
              reduce ? undefined : { duration: 55, ease: "linear", repeat: Infinity }
            }
          >
            {loop.map((it, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 rounded-full border hairline bg-[var(--surface)] px-3 py-1.5 text-[11.5px] text-foreground/80"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: color[it.verdict],
                    boxShadow: `0 0 0 3px color-mix(in oklab, ${color[it.verdict]} 22%, transparent)`,
                  }}
                />
                <span className="font-mono text-[11px] text-foreground/90">{it.addr}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{it.kind}</span>
                <span
                  className="font-mono text-[10px] font-medium uppercase tracking-[0.16em]"
                  style={{ color: color[it.verdict] }}
                >
                  {it.verdict}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="font-mono text-[10.5px] text-muted-foreground">{it.ago} ago</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}