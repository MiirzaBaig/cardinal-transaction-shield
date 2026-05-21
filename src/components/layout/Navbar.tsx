import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CardinalWordmark } from "@/components/brand/Logo";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-200",
        scrolled
          ? "border-b border-white/[0.06] bg-[rgba(8,8,15,0.78)] backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-[rgba(8,8,15,0.45)] backdrop-blur-md",
      )}
      style={{ boxShadow: scrolled ? "inset 0 1px 0 rgba(255,255,255,0.04)" : undefined }}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center px-6">
        <Link to="/" className="flex items-center" aria-label="Cardinal home">
          <CardinalWordmark />
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          <NavLink to="/" exact>Product</NavLink>
          <NavAnchor href="/#how">How it works</NavAnchor>
          <NavLink to="/about">About</NavLink>
          <NavAnchor href="/#roadmap">Roadmap</NavAnchor>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <a
            href="#"
            className="hidden h-9 items-center rounded-lg px-3 text-[13px] text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Sign in
          </a>
          <Link
            to="/app"
            className="group inline-flex h-9 items-center gap-1.5 rounded-lg bg-foreground px-3.5 text-[13px] font-medium text-background transition-transform hover:-translate-y-px"
          >
            Launch App
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  to,
  exact,
  children,
}: {
  to: string;
  exact?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      activeOptions={exact ? { exact: true } : undefined}
      className="relative rounded-md px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
      activeProps={{
        className:
          "relative rounded-md px-3 py-1.5 text-[13px] text-foreground after:absolute after:bottom-0 after:left-3 after:right-3 after:h-px after:bg-[var(--violet)]",
      }}
    >
      {children}
    </Link>
  );
}

function NavAnchor({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="rounded-md px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </a>
  );
}
