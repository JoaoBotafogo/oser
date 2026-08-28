import type { LucideIcon } from "lucide-react";

export type Stat = {
  label: string;
  value: string;
  hint?: string | undefined;
  icon?: LucideIcon | undefined;
};

export function StatCards({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ label, value, hint, icon: Icon }) => (
        <div key={label} className="bg-surface p-6">
          {Icon ? <Icon className="size-5 text-primary" /> : null}
          <p className={`font-display text-2xl ${Icon ? "mt-3" : ""}`}>{value}</p>
          <p className="mt-1 text-xs tracking-[0.16em] uppercase text-muted-foreground">{label}</p>
          {hint ? <p className="mt-2 text-xs text-muted-foreground/80">{hint}</p> : null}
        </div>
      ))}
    </div>
  );
}
