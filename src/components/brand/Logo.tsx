import { cn } from "@/lib/utils";

export function CardinalMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-8 w-8 items-center justify-center rounded-[10px] border border-white/10 bg-[rgba(139,92,246,0.08)]",
        className,
      )}
      aria-hidden="true"
    >
      <span
        className="pointer-events-none absolute inset-0 rounded-[10px]"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -8px 16px -8px rgba(139,92,246,0.25)",
        }}
      />
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="cmark" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#C4B5FD" />
            <stop offset="1" stopColor="#6366F1" />
          </linearGradient>
        </defs>
        {/* Outer arc */}
        <path
          d="M19 7.5A8 8 0 1 0 19 16.5"
          stroke="url(#cmark)"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        {/* Inner arc with scan notch */}
        <path
          d="M16 9.5A4.5 4.5 0 1 0 16 14.5"
          stroke="url(#cmark)"
          strokeWidth="1.75"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* Scan dot */}
        <circle cx="12" cy="12" r="1.1" fill="url(#cmark)" />
      </svg>
    </span>
  );
}

export function CardinalWordmark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <CardinalMark />
      <span className="font-display text-[16.5px] font-medium tracking-[-0.01em] text-foreground">
        Cardinal
      </span>
    </div>
  );
}