import type { Tone } from "@/lib/system";

const tones: Record<Tone, string> = {
  neutral: "border-border text-muted-foreground",
  positive: "border-emerald-500/40 text-emerald-400",
  warning: "border-amber-500/40 text-amber-400",
  danger: "border-red-500/40 text-red-400",
  info: "border-primary/40 text-primary",
};

export function StatusBadge({
  value,
  map,
}: {
  value: unknown;
  map: Record<string, { label: string; tone: Tone }>;
}) {
  const key = String(value ?? "");
  const meta = map[key];
  if (!meta) return <span className="text-muted-foreground">—</span>;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] tracking-[0.1em] uppercase ${tones[meta.tone]}`}
    >
      {meta.label}
    </span>
  );
}
