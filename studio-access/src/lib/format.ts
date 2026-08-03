export function formatRub(n: number) {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: n >= 100 ? 0 : 2,
  }).format(n);
}

export function budgetBarTone(pct: number | null | undefined) {
  if (pct == null) return "bg-[var(--accent)]";
  if (pct >= 100) return "bg-[var(--danger)]";
  if (pct >= 80) return "bg-[var(--accent-2)]";
  return "bg-[var(--accent)]";
}

export function formatDateTime(value: string | Date) {
  return new Date(value).toLocaleString("ru-RU");
}
