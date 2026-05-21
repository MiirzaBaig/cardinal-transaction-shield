import { CardinalWordmark } from "@/components/brand/Logo";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="relative z-10 border-t hairline">
      <div className="mx-auto max-w-[1180px] px-6 py-14">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <CardinalWordmark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A transaction firewall for Web3. Allow, review, or block — before you sign.
            </p>
          </div>
          <FooterCol title="Product" items={[
            { label: "Risk Scan", href: "/#features" },
            { label: "SafeSend", href: "/#features" },
            { label: "Escrow Vault", href: "/#features" },
            { label: "Launch App", href: "/app" },
          ]} />
          <FooterCol title="Company" items={[
            { label: "About", href: "/about" },
            { label: "Roadmap", href: "/#roadmap" },
            { label: "Security", href: "/about" },
          ]} />
          <FooterCol title="Resources" items={[
            { label: "Documentation", href: "#" },
            { label: "API Reference", href: "#" },
            { label: "Contact", href: "#" },
          ]} />
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t hairline pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} Cardinal Labs. All rights reserved.</span>
          <span className="font-mono uppercase tracking-[0.18em]">Protection from every direction</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{title}</h4>
      <ul className="mt-4 space-y-2.5 text-sm">
        {items.map((it) => (
          <li key={it.label}>
            {it.href.startsWith("/") && !it.href.includes("#") ? (
              <Link to={it.href} className="text-foreground/85 transition-colors hover:text-foreground">{it.label}</Link>
            ) : (
              <a href={it.href} className="text-foreground/85 transition-colors hover:text-foreground">{it.label}</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
