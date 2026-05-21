import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Vault,
  Workflow,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageBackground } from "@/components/layout/Background";
import { RevealOnScroll, riseChild } from "@/components/layout/RevealOnScroll";
import { VerdictHeader } from "@/components/app/VerdictHeader";
import { SignalRow } from "@/components/app/SignalRow";
import { ease, dur } from "@/lib/motion";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <PageBackground />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <TrustStrip />
        <Features />
        <HowItWorks />
        <Roadmap />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);

  // Mouse-reactive perspective (max 2°)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rxSpring = useSpring(my, { stiffness: 90, damping: 18 });
  const rySpring = useSpring(mx, { stiffness: 90, damping: 18 });
  const rotateX = useTransform(rxSpring, [-0.5, 0.5], [2, -2]);
  const rotateY = useTransform(rySpring, [-0.5, 0.5], [-2, 2]);
  // Preview card counter-tilts a touch more for depth illusion
  const cardRX = useTransform(rxSpring, [-0.5, 0.5], [-4, 4]);
  const cardRY = useTransform(rySpring, [-0.5, 0.5], [4, -4]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  const headline = ["Scan", "before", "you", "send."];

  return (
    <section
      ref={heroRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative pt-36 pb-20 md:pt-44 md:pb-28"
      style={{ perspective: 1200 }}
    >
      {/* Drifting violet bloom behind headline */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[28%] h-[420px] w-[820px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(139,92,246,0.22), transparent 70%)",
        }}
        animate={
          reduce
            ? undefined
            : { x: [-30, 30, -30], opacity: [0.35, 0.55, 0.35] }
        }
        transition={
          reduce ? undefined : { duration: 22, ease: "easeInOut", repeat: Infinity }
        }
      />
      <div className="mx-auto max-w-[1180px] px-6">
        <motion.div
          className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]"
          style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } } }}
          >
            <motion.div
              variants={riseChild}
              className="inline-flex items-center gap-2 rounded-full border hairline bg-[var(--surface)] px-3 py-1.5 text-[11.5px] text-muted-foreground"
            >
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-[var(--violet)]"
                animate={reduce ? undefined : { opacity: [1, 0.4, 1] }}
                transition={reduce ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="font-mono uppercase tracking-[0.18em]">Phase 1 · Preview</span>
            </motion.div>
            <h1 className="mt-6 font-display text-[clamp(44px,7vw,76px)] font-medium leading-[1.02] tracking-[-0.025em] text-foreground">
              {headline.map((word, i) => (
                <motion.span
                  key={i}
                  className="mr-[0.22em] inline-block"
                  initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: dur.lg,
                    ease: ease.outExpo,
                    delay: 0.15 + i * 0.06,
                  }}
                >
                  {word}
                  {i === 1 && <br />}
                </motion.span>
              ))}
            </h1>
            <motion.p
              variants={riseChild}
              className="mt-6 max-w-xl text-[16px] leading-relaxed text-muted-foreground"
            >
              Cardinal is a transaction firewall for Web3. We inspect every
              transaction before you sign — and tell you, in plain English,
              whether to{" "}
              <span className="text-[var(--success)]">allow</span>,{" "}
              <span className="text-[var(--warning)]">review</span>, or{" "}
              <span className="text-[var(--danger)]">block</span>.
            </motion.p>
            <motion.div variants={riseChild} className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/app"
                className="group btn-lift shimmer-cta relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-xl bg-[var(--violet)] px-5 text-[14px] font-medium text-white"
                style={{ boxShadow: "0 16px 40px -12px rgba(139,92,246,0.6)" }}
              >
                <span className="relative z-10">Launch App</span>
                <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#how"
                className="btn-lift inline-flex h-11 items-center gap-2 rounded-xl border hairline-strong bg-[var(--surface)] px-5 text-[14px] text-foreground transition-colors hover:bg-[var(--surface-2)]"
              >
                How it works
              </a>
            </motion.div>
            <motion.div variants={riseChild} className="mt-10 flex flex-wrap items-center gap-6 text-[12.5px] text-muted-foreground">
              <Trust icon={<Lock className="h-3.5 w-3.5" />}>Non-custodial</Trust>
              <Trust icon={<ShieldCheck className="h-3.5 w-3.5" />}>Read-only scanning</Trust>
              <Trust icon={<Sparkles className="h-3.5 w-3.5" />}>Plain-English signals</Trust>
            </motion.div>
          </motion.div>

          {/* Mock preview card */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: ease.outExpo, delay: 0.25 }}
            style={reduce ? undefined : { rotateX: cardRX, rotateY: cardRY, transformStyle: "preserve-3d" }}
          >
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -inset-8 -z-10 rounded-[40px]"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(139,92,246,0.22), transparent 70%)",
              }}
              animate={reduce ? undefined : { opacity: [0.45, 0.75, 0.45] }}
              transition={reduce ? undefined : { duration: 6, ease: "easeInOut", repeat: Infinity }}
            />
            <motion.div
              className="surface-raise overflow-hidden rounded-2xl"
              animate={reduce ? undefined : { y: [0, -4, 0] }}
              transition={reduce ? undefined : { duration: 8, ease: "easeInOut", repeat: Infinity }}
              whileHover={reduce ? undefined : { y: -2 }}
            >
              <VerdictHeader
                verdict="REVIEW"
                score={58}
                summary="Review carefully before you sign — a few signals need your attention."
                compact
              />
              <div className="border-t hairline">
                {[
                  {
                    group: "Permissions" as const,
                    label: "Unlimited spending approval",
                    detail:
                      "This grants the spender permission to move any amount of your USDT, indefinitely.",
                    severity: "warn" as const,
                  },
                  {
                    group: "Recipient" as const,
                    label: "New counterparty",
                    detail:
                      "You haven't interacted with this address before. Contract deployed 6 days ago.",
                    severity: "warn" as const,
                  },
                  {
                    group: "Simulation" as const,
                    label: "Simulation succeeded",
                    detail:
                      "The approval executes successfully on the simulated chain state.",
                    severity: "info" as const,
                  },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: dur.md, ease: ease.outExpo, delay: 0.7 + i * 0.08 }}
                  >
                    <SignalRow signal={s} />
                  </motion.div>
                ))}
              </div>
              <div className="border-t hairline px-5 py-3.5 text-[11px] text-muted-foreground">
                Live preview · Risky approval demo
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Trust({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-[var(--violet)]">{icon}</span>
      {children}
    </span>
  );
}

function TrustStrip() {
  return (
    <section className="border-y hairline bg-[rgba(14,14,22,0.55)]">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-6 px-6 py-6">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          Built for institutional-grade safety
        </span>
        <div className="flex flex-wrap items-center gap-x-9 gap-y-3 text-[12.5px] text-muted-foreground">
          <span>Ethereum</span>
          <span>Base</span>
          <span>Arbitrum</span>
          <span>Polygon</span>
          <span>Optimism — soon</span>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      icon: <ShieldAlert className="h-5 w-5" />,
      title: "Risk Scan",
      tagline: "See every signal before you sign.",
      bullets: [
        "Recipient reputation & history",
        "Permission and approval analysis",
        "Simulation-based outcome preview",
      ],
    },
    {
      icon: <Workflow className="h-5 w-5" />,
      title: "SafeSend",
      tagline: "Protected transfers, with a moment to think.",
      bullets: [
        "Configurable cool-down windows",
        "Counterparty allow-lists",
        "Reviewable, cancellable transfers",
      ],
    },
    {
      icon: <Vault className="h-5 w-5" />,
      title: "Escrow Vault",
      tagline: "Multi-party safety for high-stakes flows.",
      bullets: [
        "Milestone-based release",
        "Co-signer approvals",
        "Dispute and recovery tools",
      ],
    },
  ];
  return (
    <section id="features" className="py-24 md:py-28">
      <div className="mx-auto max-w-[1180px] px-6">
        <SectionHeading
          eyebrow="What Cardinal does"
          title="Three layers of protection."
          subtitle="Each layer works on its own, and snaps together when you need depth."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.title}
              className="surface-raise group rounded-2xl p-6 transition-transform hover:-translate-y-0.5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-3)] text-[var(--violet)]">
                {it.icon}
              </div>
              <h3 className="mt-5 font-display text-[22px] font-medium tracking-tight">
                {it.title}
              </h3>
              <p className="mt-2 text-[14px] text-muted-foreground">{it.tagline}</p>
              <ul className="mt-5 space-y-2.5 border-t hairline pt-5">
                {it.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[13.5px] text-foreground/85">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--success)]" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Connect", desc: "Link a wallet. Cardinal stays read-only." },
    { n: "02", title: "Compose", desc: "Build the transaction you want to send." },
    { n: "03", title: "Scan", desc: "Cardinal inspects the transaction end-to-end." },
    { n: "04", title: "Verdict", desc: "A clear Allow, Review, or Block result." },
    { n: "05", title: "Decide", desc: "Proceed safely, or stop the transaction cold." },
  ];
  return (
    <section id="how" className="border-t hairline py-24 md:py-28">
      <div className="mx-auto max-w-[1180px] px-6">
        <SectionHeading
          eyebrow="How it works"
          title="A clear path from intent to safety."
          subtitle="Five steps, every time. No surprises, no jargon."
        />
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border hairline bg-[var(--hairline)] md:grid-cols-5">
          {steps.map((s) => (
            <div key={s.n} className="bg-[var(--surface)] p-6">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Step {s.n}
              </div>
              <h4 className="mt-3 font-display text-[19px] font-medium tracking-tight">
                {s.title}
              </h4>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Roadmap() {
  const items = [
    { q: "Q2 2026", status: "Live", title: "Risk Scan v1", desc: "Recipient, permissions, simulation, network." },
    { q: "Q3 2026", status: "In progress", title: "SafeSend", desc: "Protected transfers with reviewable windows." },
    { q: "Q4 2026", status: "Planned", title: "Escrow Vault", desc: "Multi-party, milestone-based escrow." },
    { q: "2027", status: "Planned", title: "Open signal network", desc: "Community-contributed risk signals." },
  ];
  return (
    <section id="roadmap" className="border-t hairline py-24 md:py-28">
      <div className="mx-auto max-w-[1180px] px-6">
        <SectionHeading
          eyebrow="Roadmap"
          title="What we're building next."
          subtitle="A focused path. Each quarter, one meaningful layer of safety."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-4">
          {items.map((r) => (
            <div key={r.title} className="surface-raise rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                  {r.q}
                </span>
                <StatusPill status={r.status} />
              </div>
              <h4 className="mt-4 font-display text-[18px] font-medium tracking-tight">
                {r.title}
              </h4>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { color: string; bg: string; border: string }> = {
    Live: { color: "#34d399", bg: "rgba(52,211,153,0.10)", border: "rgba(52,211,153,0.30)" },
    "In progress": { color: "#a78bfa", bg: "rgba(139,92,246,0.10)", border: "rgba(139,92,246,0.30)" },
    Planned: { color: "#9696a8", bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.10)" },
  };
  const s = map[status] ?? map.Planned;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-[0.14em]"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
    >
      <span className="h-1 w-1 rounded-full" style={{ background: s.color }} />
      {status}
    </span>
  );
}

function CtaBanner() {
  return (
    <section className="relative border-t hairline py-24">
      <div className="mx-auto max-w-[1180px] px-6">
        <div className="relative overflow-hidden rounded-3xl border hairline-strong bg-[var(--surface)] p-10 md:p-14">
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[860px] -translate-x-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(139,92,246,0.22), transparent 70%)",
            }}
          />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_auto]">
            <div>
              <h2 className="font-display text-[clamp(30px,4.5vw,48px)] font-medium leading-[1.05] tracking-[-0.02em]">
                Protection from every direction.
              </h2>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                Try the Cardinal control center with three live demo scenarios. No
                wallet required.
              </p>
            </div>
            <Link
              to="/app"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-[var(--violet)] px-6 text-[14px] font-medium text-white transition-transform hover:-translate-y-px"
              style={{ boxShadow: "0 18px 50px -12px rgba(139,92,246,0.65)" }}
            >
              Open the app
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-2xl">
      <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
        {eyebrow}
      </span>
      <h2 className="mt-3 font-display text-[clamp(28px,3.8vw,42px)] font-medium leading-[1.05] tracking-[-0.02em]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
