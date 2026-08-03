"use client";

import { FormEvent, useEffect, useState } from "react";
import { formatRub, budgetBarTone, formatDateTime } from "@/lib/format";
import { spendKindLabel } from "@/lib/i18n";
import type { CostReport } from "@/lib/types";

export function CostsPanel({
  costs,
  onSync,
  onSaveSettings,
}: {
  costs: CostReport | null;
  onSync: () => Promise<void>;
  onSaveSettings: (input: {
    creditPriceRub: string;
    syncMode: "demo" | "api";
    apiKey: string;
  }) => Promise<boolean>;
}) {
  const [creditPrice, setCreditPrice] = useState(String(costs?.creditPriceRub ?? 2));
  const [syncMode, setSyncMode] = useState<"demo" | "api">(
    costs?.costSyncMode === "api" ? "api" : "demo"
  );
  const [apiKey, setApiKey] = useState("");

  // Keep the settings form in sync with whatever the server last reported
  // (e.g. after a sync or a refresh triggered elsewhere on the page).
  useEffect(() => {
    if (!costs) return;
    setCreditPrice(String(costs.creditPriceRub ?? 2));
    setSyncMode(costs.costSyncMode === "api" ? "api" : "demo");
  }, [costs]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const ok = await onSaveSettings({ creditPriceRub: creditPrice, syncMode, apiKey });
    if (ok) setApiKey("");
  }

  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl">Затраты на генерации</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Сколько AI съел по проектам — без Excel
            {costs?.costSyncedAt ? ` · обновлено ${formatDateTime(costs.costSyncedAt)}` : ""}
          </p>
        </div>
        <button
          onClick={onSync}
          className="rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-[#042421]"
        >
          Обновить
        </button>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel-2)] p-6">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-[var(--accent)]/10 blur-2xl"
          />
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Потрачено на AI · {costs?.month?.label || "этот месяц"}
          </p>
          <p className="font-display mt-3 text-5xl tracking-tight sm:text-6xl">
            {formatRub(costs?.month?.costRub ?? 0)}
            <span className="ml-2 text-2xl text-[var(--muted)]">₽</span>
          </p>
          <p className="mt-3 text-sm text-[var(--muted)]">
            {costs?.month?.credits ?? 0} кредитов · курс {costs?.creditPriceRub ?? creditPrice} ₽/cr
            {costs?.costSyncMode === "demo" ? " · демо-оценка по времени открытия" : " · облачный API"}
          </p>
          {costs?.totals?.budgetRub ? (
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-xs text-[var(--muted)]">
                <span>От бюджетов всех проектов</span>
                <span>
                  {formatRub(costs.totals.costRub)} / {formatRub(costs.totals.budgetRub)} ₽
                  {costs.totals.budgetUsedPct != null ? ` · ${costs.totals.budgetUsedPct}%` : ""}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-black/30">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${budgetBarTone(costs.totals.budgetUsedPct)}`}
                  style={{ width: `${Math.min(100, costs.totals.budgetUsedPct || 0)}%` }}
                />
              </div>
            </div>
          ) : null}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid content-start gap-3 rounded-2xl border border-[var(--line)] bg-[var(--panel-2)] p-4"
        >
          <p className="text-sm font-medium">Настройки курса</p>
          <label className="text-sm">
            <span className="text-[var(--muted)]">₽ за 1 кредит</span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              className="mt-1 w-full rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2"
              value={creditPrice}
              onChange={(e) => setCreditPrice(e.target.value)}
            />
          </label>
          <label className="text-sm">
            <span className="text-[var(--muted)]">Источник данных</span>
            <select
              className="mt-1 w-full rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2"
              value={syncMode}
              onChange={(e) => setSyncMode(e.target.value === "api" ? "api" : "demo")}
            >
              <option value="demo">Демо · оценка по времени открытия</option>
              <option value="api">Ключ облачного API</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="text-[var(--muted)]">Ключ KEY_ID:KEY_SECRET (для API)</span>
            <input
              type="password"
              placeholder="необязательно"
              className="mt-1 w-full rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </label>
          <button className="rounded-md border border-[var(--line)] px-3 py-2 text-sm">Сохранить</button>
        </form>
      </div>

      <div className="mt-6 space-y-3">
        <p className="text-sm font-medium">Бюджет по проектам</p>
        {(costs?.projects || []).map((p) => {
          const pct = p.budgetUsedPct ?? null;
          const barWidth = pct == null ? 0 : Math.min(100, pct);
          return (
            <div key={p.id} className="rounded-xl border border-[var(--line)] bg-[var(--panel-2)] px-4 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-[var(--muted)]">
                    {p.clientName || "Без клиента"}
                    {p.monthCostRub ? ` · этот месяц ${formatRub(p.monthCostRub)} ₽` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl">{formatRub(p.costRub)} ₽</p>
                  <p className="text-xs text-[var(--muted)]">
                    {p.netCredits} кр.
                    {p.budgetRub != null ? ` · бюджет ${formatRub(p.budgetRub)} ₽` : " · бюджет не задан"}
                  </p>
                </div>
              </div>
              {p.budgetRub != null ? (
                <div className="mt-3">
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span
                      className={
                        pct != null && pct >= 80 ? "text-[var(--accent-2)]" : "text-[var(--muted)]"
                      }
                    >
                      {pct != null && pct >= 100
                        ? "Бюджет превышен"
                        : pct != null && pct >= 80
                          ? "Близко к лимиту"
                          : "Использование бюджета AI"}
                    </span>
                    <span className="text-[var(--muted)]">
                      {pct ?? 0}%
                      {p.marginRub != null ? ` · остаток ${formatRub(p.marginRub)} ₽` : ""}
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-black/35">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${budgetBarTone(pct)}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-xs text-[var(--muted)]">
                  Задайте бюджет проекту — появится прогресс-бар
                </p>
              )}
            </div>
          );
        })}
        {!costs?.projects?.length && (
          <p className="text-sm text-[var(--muted)]">
            Нет проектов — создайте выше, откройте Higgsfield, нажмите «Обновить».
          </p>
        )}
        {(costs?.unallocatedCredits || 0) > 0 && (
          <p className="text-sm text-amber-200/90">
            Вне проектов: {costs?.unallocatedCredits} кр. (открытие без выбранного проекта)
          </p>
        )}
      </div>

      {!!costs?.recent?.length && (
        <details className="mt-5">
          <summary className="cursor-pointer text-sm text-[var(--muted)]">История списаний</summary>
          <ul className="mt-3 space-y-1 text-sm text-[var(--muted)]">
            {costs.recent.slice(0, 12).map((e) => (
              <li key={e.id}>
                {formatDateTime(e.occurredAt)} · {spendKindLabel(e.kind)} · {e.credits} кр.
                {e.project ? ` · ${e.project.name}` : " · вне проекта"}
                {e.user ? ` · ${e.user.email}` : ""}
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
