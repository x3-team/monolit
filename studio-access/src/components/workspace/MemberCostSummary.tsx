import { formatRub, budgetBarTone } from "@/lib/format";
import type { CostReport } from "@/lib/types";

export function MemberCostSummary({ costs }: { costs: CostReport }) {
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
      <h2 className="font-display text-xl">Ваши генерации</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Кредиты по проектам, пока вы работали через StudioGate
      </p>
      <p className="font-display mt-4 text-4xl">
        {formatRub(costs.month?.costRub ?? 0)}{" "}
        <span className="text-lg text-[var(--muted)]">₽ в этом месяце</span>
      </p>
      <div className="mt-4 space-y-3">
        {costs.projects
          .filter((p) => p.eventCount > 0)
          .map((p) => (
            <div key={p.id} className="rounded-xl border border-[var(--line)] bg-[var(--panel-2)] px-4 py-3">
              <div className="flex justify-between gap-3 text-sm">
                <span>{p.name}</span>
                <span className="font-medium">
                  {formatRub(p.costRub)} ₽ · {p.netCredits} кр.
                </span>
              </div>
              {p.budgetRub != null && (
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/30">
                  <div
                    className={`h-full rounded-full ${budgetBarTone(p.budgetUsedPct)}`}
                    style={{ width: `${Math.min(100, p.budgetUsedPct || 0)}%` }}
                  />
                </div>
              )}
            </div>
          ))}
      </div>
    </section>
  );
}
