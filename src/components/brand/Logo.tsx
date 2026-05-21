import { cn } from "@/lib/utils";

export function CardinalMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-7 w-7", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#A78BFA" />
          <stop offset="1" stopColor="#6366F1" />
        </linearGradient>
      </defs>
      <path
        d="M16 2.5 4 7v9c0 7.2 5 12 12 13.5 7-1.5 12-6.3 12-13.5V7L16 2.5Z"
        stroke="url(#cg)"
        strokeWidth="1.6"
      />
      <path
        d="M16 9.5 9 12.4v5c0 3.7 3 6.4 7 7.6 4-1.2 7-3.9 7-7.6v-5L16 9.5Z"
        fill="url(#cg)"
        fillOpacity="0.18"
        stroke="url(#cg)"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export function CardinalWordmark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <CardinalMark />
      <span className="font-display text-[17px] font-medium tracking-tight text-foreground">
        Cardinal
      </span>
    </div>
  );
}