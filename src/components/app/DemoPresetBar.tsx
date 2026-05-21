import { Sparkles } from "lucide-react";
import { PRESETS } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export function DemoPresetBar({
  active,
  onPick,
}: {
  active?: string;
  onPick: (id: "safe" | "review" | "block") => void;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border hairline bg-[var(--surface)] p-2 sm:flex-row sm:items-center">
      <div className="flex items-center gap-2 px-2 sm:pl-1">
        <Sparkles className="h-3.5 w-3.5 text-[var(--violet)]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Try a demo
        </span>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-1.5">
        {PRESETS.map((p) => {
          const isActive = active === p.id;
          const accent =
            p.id === "safe" ? "var(--success)" : p.id === "review" ? "var(--warning)" : "var(--danger)";
          return (
            <button
              key={p.id}
              onClick={() => onPick(p.id)}
              className={cn(
                "group flex items-center gap-2 rounded-lg px-3 py-2 text-left text-[12.5px] transition-colors",
                isActive ? "bg-[var(--surface-3)]" : "hover:bg-white/[0.03]",
              )}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: accent, boxShadow: `0 0 0 3px color-mix(in oklab, ${accent} 22%, transparent)` }}
              />
              <div className="min-w-0">
                <div className="truncate font-medium text-foreground">{p.label}</div>
                <div className="truncate text-[11px] text-muted-foreground">{p.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
