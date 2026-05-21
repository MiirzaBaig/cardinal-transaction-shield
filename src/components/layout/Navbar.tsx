import { Link } from "@tanstack/react-router";
import { CardinalWordmark } from "@/components/brand/Logo";
import { ArrowUpRight } from "lucide-react";

export function Navbar() {
  return (
    <header className="fixed left-1/2 top-4 z-50 w-[min(1180px,calc(100%-2rem))] -translate-x-1/2">
      <div
        className="flex h-14 items-center justify-between rounded-2xl border border-white/10 bg-[rgba(14,14,22,0.72)] px-4 backdrop-blur-xl"
        style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.05), 0 12px 40px -16px rgba(0,0,0,0.6)" }}
      >
        <Link to="/" className="flex items-center">
          <CardinalWordmark />
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <Link to="/" className="transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }} activeOptions={{ exact: true }}>
            Product
          </Link>
          <a href="/#how" className="transition-colors hover:text-foreground">How it works</a>
          <Link to="/about" className="transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>
            About
          </Link>
          <a href="/#roadmap" className="transition-colors hover:text-foreground">Roadmap</a>
        </nav>
        <Link
          to="/app"
          className="group inline-flex h-9 items-center gap-1.5 rounded-lg bg-foreground px-3.5 text-[13px] font-medium text-background transition-transform hover:-translate-y-px"
        >
          Launch App
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </header>
  );
}
