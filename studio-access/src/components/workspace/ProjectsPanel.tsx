"use client";

import { FormEvent, useState } from "react";
import type { WorkspaceProject } from "@/lib/types";

export function ProjectsPanel({
  projects,
  onCreate,
  onSelect,
}: {
  projects: WorkspaceProject[];
  onCreate: (input: { name: string; clientName: string; budgetRub: string }) => Promise<boolean>;
  onSelect: (id: string) => void;
}) {
  const [name, setName] = useState("");
  const [clientName, setClientName] = useState("");
  const [budgetRub, setBudgetRub] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const ok = await onCreate({ name, clientName, budgetRub });
    if (ok) {
      setName("");
      setClientName("");
      setBudgetRub("");
    }
  }

  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
      <h2 className="font-display text-xl">Проекты</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Ценник на генерацию: бюджет проекта vs фактические AI-кредиты
      </p>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-4">
        <input
          placeholder="Название проекта"
          className="rounded-md border border-[var(--line)] bg-[var(--panel-2)] px-3 py-2 md:col-span-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Клиент"
          className="rounded-md border border-[var(--line)] bg-[var(--panel-2)] px-3 py-2"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />
        <input
          placeholder="Бюджет ₽"
          type="number"
          min="0"
          className="rounded-md border border-[var(--line)] bg-[var(--panel-2)] px-3 py-2"
          value={budgetRub}
          onChange={(e) => setBudgetRub(e.target.value)}
        />
        <button className="rounded-md bg-[var(--accent-2)] px-3 py-2 font-semibold text-[#1d1400]">
          Добавить проект
        </button>
      </form>
      <div className="mt-4 space-y-2">
        {projects.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--line)] bg-[var(--panel-2)] px-4 py-3 text-sm"
          >
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-[var(--muted)]">
                {p.clientName || "—"}
                {p.budgetRub != null ? ` · бюджет ${p.budgetRub} ₽` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelect(p.id)}
              className="rounded-md border border-[var(--line)] px-3 py-1.5"
            >
              Выбрать для открытия
            </button>
          </div>
        ))}
        {!projects.length && (
          <p className="text-sm text-[var(--muted)]">
            Пока нет проектов — создайте перед открытием Higgsfield.
          </p>
        )}
      </div>
    </section>
  );
}
