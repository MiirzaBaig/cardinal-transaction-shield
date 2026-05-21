import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Lock, Eye, MessageSquare, GitBranch } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageBackground } from "@/components/layout/Background";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [{ title: "About — Cardinal" }],
  }),
});

function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <PageBackground />
      <Navbar />
      <main className="relative z-10 pt-36 pb-20">
        <section className="mx-auto max-w-[1180px] px-6">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            About Cardinal
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-[clamp(40px,6vw,68px)] font-medium leading-[1.05] tracking-[-0.025em]">
            Web3 should feel safe to use — not like signing in the dark.
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
            Cardinal is a transaction firewall. We read every transaction before
            it's signed, surface the signals that matter, and tell you — in plain
            English — whether to proceed.
          </p>
        </section>

        <section className="mx-auto mt-24 max-w-[1180px] px-6">
          <div className="grid gap-12 md:grid-cols-[1fr_1.2fr]">
            <div>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
                Why Cardinal exists
              </span>
              <h2 className="mt-3 font-display text-[clamp(26px,3.4vw,38px)] font-medium leading-[1.1] tracking-[-0.02em]">
                Most losses in Web3 aren't hacks. They're signatures.
              </h2>
            </div>
            <div className="space-y-5 text-[15.5px] leading-relaxed text-muted-foreground">
              <p>
                Most users lose funds not because a smart contract was broken,
                but because they signed something they didn't fully understand.
                Unlimited approvals. Spoofed recipients. Hidden transfers buried
                in calldata.
              </p>
              <p>
                Cardinal sits in front of every transaction and asks the
                questions a careful security engineer would: who is the
                recipient, what permissions are being granted, what does the
                simulation actually do, and does anything here look wrong?
              </p>
              <p className="text-foreground/90">
                If something does, we say so — clearly, before you sign.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-[1180px] px-6">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            Principles
          </span>
          <h2 className="mt-3 font-display text-[clamp(26px,3.4vw,38px)] font-medium leading-[1.1] tracking-[-0.02em]">
            Security-first, by design.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Lock className="h-4 w-4" />,
                title: "Non-custodial",
                desc: "We never hold keys, balances, or funds. Cardinal is read-only by default.",
              },
              {
                icon: <Eye className="h-4 w-4" />,
                title: "Deterministic",
                desc: "Same inputs, same verdict. No surprises, no opaque scoring.",
              },
              {
                icon: <MessageSquare className="h-4 w-4" />,
                title: "Plain English",
                desc: "Every signal is explained without jargon. Detail is there if you want it.",
              },
              {
                icon: <GitBranch className="h-4 w-4" />,
                title: "Open by design",
                desc: "Signal sources are inspectable. No closed-box risk scoring.",
              },
            ].map((p) => (
              <div key={p.title} className="surface-raise rounded-2xl p-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--surface-3)] text-[var(--violet)]">
                  {p.icon}
                </div>
                <h3 className="mt-4 font-display text-[17px] font-medium tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-[1180px] px-6">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            Architecture
          </span>
          <h2 className="mt-3 font-display text-[clamp(26px,3.4vw,38px)] font-medium leading-[1.1] tracking-[-0.02em]">
            How a scan flows through Cardinal.
          </h2>

          <div className="surface-raise mt-10 grid gap-px overflow-hidden rounded-2xl bg-[var(--hairline)] md:grid-cols-4">
            {[
              { tag: "Step 01", title: "Client", desc: "Your wallet composes a transaction. Cardinal observes — never modifies." },
              { tag: "Step 02", title: "Scan Engine", desc: "We extract intent, decode calldata, and simulate the transaction." },
              { tag: "Step 03", title: "Signal Sources", desc: "Recipient history, threat feeds, contract registries, simulation results." },
              { tag: "Step 04", title: "Verdict", desc: "Aggregated, deterministic Allow / Review / Block, with reasons." },
            ].map((s) => (
              <div key={s.title} className="bg-[var(--surface)] p-6">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                  {s.tag}
                </span>
                <h4 className="mt-3 font-display text-[18px] font-medium tracking-tight">
                  {s.title}
                </h4>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-[1180px] px-6">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            Team
          </span>
          <h2 className="mt-3 font-display text-[clamp(26px,3.4vw,38px)] font-medium leading-[1.1] tracking-[-0.02em]">
            Built by a small team of security-minded engineers.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {[
              { initials: "AK", role: "Engineering" },
              { initials: "MR", role: "Security Research" },
              { initials: "JT", role: "Product Design" },
              { initials: "SN", role: "Protocol" },
            ].map((m) => (
              <div key={m.initials} className="surface-raise rounded-2xl p-5">
                <div
                  className="h-12 w-12 rounded-xl"
                  style={{
                    background:
                      "conic-gradient(from 220deg, #8b5cf6, #6366f1, #06b6d4, #8b5cf6)",
                    filter: "blur(0.4px)",
                  }}
                />
                <div className="mt-4">
                  <div className="font-display text-[15px] font-medium tracking-tight text-foreground">
                    Team member · {m.initials}
                  </div>
                  <div className="mt-1 text-[12.5px] text-muted-foreground">{m.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-[1180px] px-6">
          <div className="surface-raise rounded-2xl p-8 md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <h3 className="font-display text-[24px] font-medium tracking-tight">
                  See it in action.
                </h3>
                <p className="mt-2 text-[14px] text-muted-foreground">
                  Try three live demos in the Cardinal control center.
                </p>
              </div>
              <Link
                to="/app"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--violet)] px-5 text-[14px] font-medium text-white transition-transform hover:-translate-y-px"
                style={{ boxShadow: "0 14px 40px -12px rgba(139,92,246,0.6)" }}
              >
                Open the app <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}