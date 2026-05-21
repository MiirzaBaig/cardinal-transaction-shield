import { Link } from "@tanstack/react-router";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { CardinalWordmark } from "@/components/brand/Logo";
import { ArrowUpRight } from "lucide-react";

export function Navbar() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  // Spring-smooth the scroll value so every interpolation feels physics-based.
  const ySmooth = useSpring(scrollY, { stiffness: 180, damping: 28, mass: 0.6 });

  // Interpolations across 0 → 120px of scroll.
  const topOffset = useTransform(ySmooth, [0, 120], [0, 14]);
  const maxWidth = useTransform(ySmooth, [0, 120], [1200, 900]);
  const height = useTransform(ySmooth, [0, 120], [64, 56]);
  const radius = useTransform(ySmooth, [0, 120], [0, 18]);
  const padX = useTransform(ySmooth, [0, 120], [24, 22]);
  const bgAlpha = useTransform(ySmooth, [0, 120], [0.45, 0.78]);
  const blurPx = useTransform(ySmooth, [0, 120], [8, 22]);
  const satPct = useTransform(ySmooth, [0, 120], [100, 160]);
  const borderAlpha = useTransform(ySmooth, [0, 120], [0, 0.08]);
  const shadowAlpha = useTransform(ySmooth, [0, 120], [0, 0.45]);

  const bg = useMotionTemplate`rgba(8, 8, 15, ${bgAlpha})`;
  const backdrop = useMotionTemplate`saturate(${satPct}%) blur(${blurPx}px)`;
  const borderColor = useMotionTemplate`rgba(255, 255, 255, ${borderAlpha})`;
  const boxShadow = useMotionTemplate`0 18px 50px -28px rgba(0, 0, 0, ${shadowAlpha}), inset 0 1px 0 rgba(255, 255, 255, ${borderAlpha})`;

  const staticStyle = reduce
    ? {
        top: 0,
        maxWidth: 1200,
        height: 64,
        borderRadius: 0,
        background: "rgba(8,8,15,0.6)",
      }
    : undefined;

  return (
    <motion.header
      className="fixed inset-x-0 z-50 mx-auto flex items-center border"
      style={
        reduce
          ? { ...staticStyle, paddingLeft: 24, paddingRight: 24 }
          : {
              top: topOffset,
              maxWidth,
              height,
              borderRadius: radius,
              paddingLeft: padX,
              paddingRight: padX,
              background: bg,
              backdropFilter: backdrop,
              WebkitBackdropFilter: backdrop,
              borderColor,
              boxShadow,
            }
      }
    >
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
            className="group btn-lift inline-flex h-9 items-center gap-1.5 rounded-lg bg-foreground px-3.5 text-[13px] font-medium text-background"
          >
            Launch App
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
      </div>
    </motion.header>
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
