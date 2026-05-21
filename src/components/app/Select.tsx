import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type SelectOption = {
  value: string;
  label: string;
  hint?: string;
  dot?: string;
};

export function Select({
  value,
  onChange,
  options,
  label,
  leading,
  className,
  menuClassName,
  align = "start",
}: {
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  label?: string;
  leading?: React.ReactNode;
  className?: string;
  menuClassName?: string;
  align?: "start" | "end" | "center";
}) {
  const current = options.find((o) => o.value === value) ?? options[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "group inline-flex h-9 items-center gap-2 rounded-lg border border-white/[0.07] bg-[var(--surface)] px-2.5 text-[12.5px] text-foreground transition-colors hover:border-white/[0.14] data-[state=open]:border-white/[0.18] data-[state=open]:bg-[var(--surface-2)]",
            className,
          )}
        >
          {leading}
          {label && (
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {label}
            </span>
          )}
          <span className="truncate text-foreground">{current?.label}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        sideOffset={8}
        className={cn(
          "min-w-[200px] rounded-xl border border-white/[0.08] bg-[rgba(14,14,22,0.94)] p-1.5 text-foreground shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)] backdrop-blur-xl",
          menuClassName,
        )}
      >
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <DropdownMenuItem
              key={opt.value}
              onSelect={() => onChange(opt.value)}
              className={cn(
                "relative h-9 cursor-pointer rounded-lg px-2.5 text-[13px] text-muted-foreground focus:bg-white/[0.04] focus:text-foreground data-[highlighted]:bg-white/[0.04]",
                active && "text-foreground",
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-[var(--violet)]" />
              )}
              {opt.dot && (
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: opt.dot }}
                />
              )}
              <span className="flex-1 truncate">{opt.label}</span>
              {opt.hint && (
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
                  {opt.hint}
                </span>
              )}
              {active && <Check className="h-3.5 w-3.5 text-[var(--violet)]" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}