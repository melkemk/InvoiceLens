"use client";

function tier(value: number): { label: string; dot: string; text: string } {
  if (value >= 0.9) return { label: "High", dot: "bg-emerald-500", text: "text-emerald-700" };
  if (value >= 0.7) return { label: "Medium", dot: "bg-amber-500", text: "text-amber-700" };
  return { label: "Low", dot: "bg-rose-500", text: "text-rose-700" };
}

export function ConfidenceDot({ value }: { value: number }) {
  const t = tier(value);
  return (
    <span
      className="inline-flex items-center gap-1"
      title={`${t.label} confidence (${Math.round(value * 100)}%)`}
    >
      <span className={`h-2 w-2 rounded-full ${t.dot}`} />
      <span className={`text-[10px] font-medium tabular-nums ${t.text}`}>
        {Math.round(value * 100)}%
      </span>
    </span>
  );
}
