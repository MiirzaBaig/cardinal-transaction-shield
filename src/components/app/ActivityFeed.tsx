import { RECENT_ACTIVITY } from "@/lib/mockData";

export function ActivityFeed() {
  return (
    <div className="surface-raise rounded-2xl">
      <div className="flex items-center justify-between px-5 py-3.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Recent activity
        </span>
        <button className="text-[11px] text-muted-foreground transition-colors hover:text-foreground">
          View all
        </button>
      </div>
      <ul>
        {RECENT_ACTIVITY.map((a) => {
          const color =
            a.verdict === "ALLOW"
              ? "var(--success)"
              : a.verdict === "REVIEW"
                ? "var(--warning)"
                : "var(--danger)";
          return (
            <li
              key={a.id}
              className="flex items-center gap-3 border-t hairline px-5 py-3 text-[13px]"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: color,
                  boxShadow: `0 0 0 3px color-mix(in oklab, ${color} 22%, transparent)`,
                }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-foreground/90">{a.label}</span>
                </div>
                <div className="truncate font-mono text-[11px] text-muted-foreground">
                  {a.recipient}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[12px] tabular-nums text-foreground/90">{a.amount}</div>
                <div className="text-[10.5px] text-muted-foreground">{a.time}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
