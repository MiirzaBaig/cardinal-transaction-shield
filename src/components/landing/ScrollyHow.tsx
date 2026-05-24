import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { ShieldX, Wallet, FileText, ScanLine, Send } from "lucide-react";
import { ease, dur } from "@/lib/motion";
import { RevealOnScroll } from "@/components/layout/RevealOnScroll";

type Step = {
  n: string;
  title: string;
  body: string;
  state: "connect" | "compose" | "scan" | "verdict";
};

const STEPS: Step[] = [
  {
    n: "01",
    title: "Connect — read-only.",
    body: "Link a wallet. Cardinal never holds keys or moves funds. We only read what you'd see in your wallet anyway.",
    state: "connect",
  },
  {
    n: "02",
    title: "Compose your transaction.",
    body: "Build a send, an approval, or a contract call — the same way you would in any wallet. Nothing leaves your hands.",
    state: "compose",
  },
  {
    n: "03",
    title: "Scan end-to-end.",
    body: "We check recipient reputation, permissions, simulation outcome, and network — in parallel, in under 200ms.",
    state: "scan",
  },
  {
    n: "04",
    title: "Decide with a clear verdict.",
    body: "Allow, Review, or Block — in plain English, with the signals laid out. You sign with full context, or you don't.",
    state: "verdict",
  },
];

export function ScrollyHow() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Map scroll progress to active step index (0..3)
  const activeFloat = useTransform(scrollYProgress, [0, 1], [0, STEPS.length - 0.001]);

  return (
    <section id="how" className="border-t hairline">
      <div className="mx-auto max-w-[1180px] px-6 pt-24 md:pt-28">
        <RevealOnScroll variant="rise">
          <div className="max-w-2xl">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
              How it works
            </span>
            <h2 className="mt-3 font-display text-[clamp(28px,3.8vw,42px)] font-medium leading-[1.05] tracking-[-0.02em]">
              Watch a transaction become a verdict.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              Four steps, every time. Scroll to see how a single transaction
              moves from intent to safety.
            </p>
          </div>
        </RevealOnScroll>
      </div>

      {/* Scrolly track — tall so each step gets ~1 viewport */}
      <div
        ref={sectionRef}
        className="relative mx-auto mt-12 max-w-[1180px] px-6"
        style={{ height: reduce ? "auto" : `${STEPS.length * 90}vh` }}
      >
        <div className="sticky top-24 grid items-start gap-10 md:grid-cols-2">
          {/* Left: pinned mock */}
          <div className="relative">
            <MockPanel activeFloat={activeFloat} reduce={!!reduce} />
          </div>

          {/* Right: stacked steps */}
          <div className={reduce ? "space-y-10" : "relative"}>
            {STEPS.map((s, i) => (
              <StepBlock key={s.n} step={s} index={i} activeFloat={activeFloat} reduce={!!reduce} />
            ))}
          </div>
        </div>
      </div>
      <div className="h-24 md:h-28" />
    </section>
  );
}

function StepBlock({
  step,
  index,
  activeFloat,
  reduce,
}: {
  step: Step;
  index: number;
  activeFloat: MotionValue<number>;
  reduce: boolean;
}) {
  // Each step is "active" when activeFloat is within ±0.5 of its index
  const opacity = useTransform(activeFloat, (v) => {
    if (reduce) return 1;
    const d = Math.abs(v - index);
    return Math.max(0.25, 1 - d * 0.7);
  });
  const y = useTransform(activeFloat, (v) => (reduce ? 0 : (v - index) * -20));

  return (
    <motion.div
      style={reduce ? undefined : { opacity, y }}
      className={reduce ? "" : "min-h-[80vh] flex flex-col justify-center"}
    >
      <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        Step {step.n}
      </div>
      <h3 className="mt-3 font-display text-[clamp(24px,3vw,34px)] font-medium leading-[1.1] tracking-[-0.02em]">
        {step.title}
      </h3>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
        {step.body}
      </p>
    </motion.div>
  );
}

function MockPanel({
  activeFloat,
  reduce,
}: {
  activeFloat: MotionValue<number>;
  reduce: boolean;
}) {
  // We render all four states and crossfade based on proximity.
  return (
    <div className="relative aspect-[5/6] w-full max-w-[460px]">
      <div className="surface-raise relative h-full overflow-hidden rounded-2xl">
        {STEPS.map((s, i) => (
          <StateLayer
            key={s.state}
            state={s.state}
            index={i}
            activeFloat={activeFloat}
            reduce={reduce}
          />
        ))}
      </div>
    </div>
  );
}

function StateLayer({
  state,
  index,
  activeFloat,
  reduce,
}: {
  state: Step["state"];
  index: number;
  activeFloat: MotionValue<number>;
  reduce: boolean;
}) {
  const opacity = useTransform(activeFloat, (v) => {
    if (reduce) return index === 0 ? 1 : 0;
    const d = Math.abs(v - index);
    return d < 0.5 ? 1 - d * 2 : 0;
  });
  const scale = useTransform(activeFloat, (v) => {
    if (reduce) return 1;
    const d = Math.abs(v - index);
    return 1 - Math.min(d, 1) * 0.04;
  });

  return (
    <motion.div
      className="absolute inset-0"
      style={{ opacity, scale }}
    >
      {state === "connect" && <ConnectMock />}
      {state === "compose" && <ComposeMock />}
      {state === "scan" && <ScanMock />}
      {state === "verdict" && <VerdictMock />}
    </motion.div>
  );
}

function PanelHeader({ icon, label, accent }: { icon: React.ReactNode; label: string; accent?: string }) {
  return (
    <div className="flex items-center gap-2 border-b hairline px-5 py-3">
      <span
        className="flex h-6 w-6 items-center justify-center rounded-md"
        style={{
          background: `color-mix(in oklab, ${accent ?? "var(--violet)"} 14%, transparent)`,
          color: accent ?? "var(--violet)",
        }}
      >
        {icon}
      </span>
      <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function ConnectMock() {
  return (
    <div className="flex h-full flex-col">
      <PanelHeader icon={<Wallet className="h-3.5 w-3.5" />} label="Connect wallet" />
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
        <motion.div
          className="flex h-16 w-16 items-center justify-center rounded-2xl border hairline bg-[var(--surface-2)]"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Wallet className="h-7 w-7 text-[var(--violet)]" />
        </motion.div>
        <div className="text-center">
          <div className="font-display text-[16px]">Read-only access</div>
          <div className="mt-1 text-[12px] text-muted-foreground">No signing. No custody.</div>
        </div>
        <div className="mt-2 inline-flex h-8 items-center rounded-lg bg-foreground px-3 text-[12px] font-medium text-background">
          Connect
        </div>
      </div>
    </div>
  );
}

function ComposeMock() {
  return (
    <div className="flex h-full flex-col">
      <PanelHeader icon={<FileText className="h-3.5 w-3.5" />} label="Compose" />
      <div className="space-y-3 px-5 py-5">
        {[
          { l: "To", v: "0x4f1…be7" },
          { l: "Token", v: "USDT" },
          { l: "Amount", v: "Unlimited" },
          { l: "Chain", v: "Ethereum" },
        ].map((f, i) => (
          <motion.div
            key={f.l}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur.md, ease: ease.outExpo, delay: i * 0.06 }}
            className="flex items-center justify-between rounded-lg border hairline bg-[var(--surface-2)] px-3.5 py-2.5"
          >
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
              {f.l}
            </span>
            <span className="font-mono text-[12px] text-foreground/85">{f.v}</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-end border-t hairline px-5 py-3">
        <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-foreground px-3 text-[12px] font-medium text-background">
          <ScanLine className="h-3.5 w-3.5" /> Scan
        </span>
      </div>
    </div>
  );
}

function ScanMock() {
  const steps = ["Checking network", "Resolving recipient", "Reviewing permissions", "Running simulation", "Scoring risk"];
  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <PanelHeader icon={<ScanLine className="h-3.5 w-3.5" />} label="Scanning" />
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-12 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.7), transparent)" }}
        animate={{ y: [0, 320, 0] }}
        transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
      />
      <div className="space-y-3 px-5 py-5">
        {steps.map((l, i) => (
          <motion.div
            key={l}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: dur.md, ease: ease.outExpo, delay: i * 0.1 }}
            className="flex items-center gap-3"
          >
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-[var(--violet)]"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
            />
            <span className="text-[12.5px] text-foreground/80">{l}</span>
            <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              ok
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function VerdictMock() {
  return (
    <div className="flex h-full flex-col">
      <PanelHeader icon={<ShieldX className="h-3.5 w-3.5" />} label="Verdict" accent="var(--danger)" />
      <div className="flex flex-1 flex-col px-5 py-5">
        <div className="flex items-start gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ background: "color-mix(in oklab, var(--danger) 14%, transparent)", color: "var(--danger)" }}
          >
            <ShieldX className="h-4 w-4" />
          </span>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[22px] font-medium leading-none tracking-tight text-[var(--danger)]">
                Block
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                risk 96
              </span>
            </div>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-foreground/80">
              Drainer signature and hidden transfer detected.
            </p>
          </div>
        </div>
        <motion.div
          className="mt-3 h-px origin-left"
          style={{ background: "linear-gradient(90deg, var(--danger), transparent)" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, ease: ease.outExpo }}
        />
        <div className="mt-3 space-y-2">
          {[
            "Flagged in 3 threat feeds",
            "Hidden transfer detected",
            "Obfuscated call data",
          ].map((l) => (
            <div key={l} className="flex items-center gap-3">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: "var(--danger)",
                  boxShadow: "0 0 0 3px color-mix(in oklab, var(--danger) 22%, transparent)",
                }}
              />
              <span className="text-[12.5px] text-foreground/85">{l}</span>
            </div>
          ))}
        </div>
        <div className="mt-auto flex items-center gap-2 pt-4">
          <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[var(--danger)] px-3 text-[12px] font-medium text-white">
            <ShieldX className="h-3.5 w-3.5" /> Don't sign
          </span>
          <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border hairline bg-[var(--surface-2)] px-3 text-[12px] text-foreground/80">
            <Send className="h-3.5 w-3.5" /> Override
          </span>
        </div>
      </div>
    </div>
  );
}