import { cn } from "@/lib/utils";

export type Stage = "compose" | "scanning" | "verdict";

const STEPS: { id: Stage; label: string; n: string }[] = [
  { id: "compose", n: "01", label: "Compose" },
  { id: "scanning", n: "02", label: "Scan" },
  { id: "verdict", n: "03", label: "Decide" },
];

export function Stepper({ stage }: { stage: Stage }) {
  const activeIndex = STEPS.findIndex((s) => s.id === stage);
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((s, i) => {
        const state = i < activeIndex ? "done" : i === activeIndex ? "active" : "idle";
        return (
          <div key={s.id} className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-2 rounded-full px-2.5 py-1 text-[11.5px] transition-colors",
                state === "active"
                  ? "bg-[rgba(139,92,246,0.12)] text-foreground"
                  : state === "done"
                    ? "text-foreground/80"
                    : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "font-mono text-[10px] uppercase tracking-[0.14em]",
                  state === "active" ? "text-[var(--violet)]" : "text-muted-foreground",
                )}
              >
                {s.n}
              </span>
              <span className="font-medium">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <span className="h-px w-6 bg-white/10" />
            )}
          </div>
        );
      })}
    </div>
  );
}