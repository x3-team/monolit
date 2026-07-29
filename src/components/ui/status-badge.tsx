import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-900",
  PROCESSING: "bg-sky-100 text-sky-900",
  SUCCESS: "bg-emerald-100 text-emerald-900",
  FAILED: "bg-rose-100 text-rose-900",
  NEEDS_REVIEW: "bg-orange-100 text-orange-900",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold tracking-wide",
        styles[status] ?? "bg-slate-100 text-slate-800"
      )}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
