import type { WorkspaceProject } from "@/lib/types";

export function ActiveProjectPicker({
  projects,
  selectedProjectId,
  onChange,
}: {
  projects: WorkspaceProject[];
  selectedProjectId: string;
  onChange: (id: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl">Активный проект</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Перед открытием Higgsfield выберите проект — кредиты спишутся на него автоматически
          </p>
        </div>
        <select
          className="min-w-[220px] rounded-md border border-[var(--line)] bg-[var(--panel-2)] px-3 py-2"
          value={selectedProjectId}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Выберите проект…</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
              {p.clientName ? ` · ${p.clientName}` : ""}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
