import { periodOptions, type PeriodKey } from "@/lib/system";

export function PeriodFilter({
  value,
  onChange,
}: {
  value: PeriodKey;
  onChange: (value: PeriodKey) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs tracking-[0.14em] uppercase text-muted-foreground">
      Período
      <select
        aria-label="Período"
        className="h-9 rounded-sm border border-input bg-background px-3 text-xs tracking-normal normal-case text-foreground"
        value={value}
        onChange={(event) => onChange(event.target.value as PeriodKey)}
      >
        {periodOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
