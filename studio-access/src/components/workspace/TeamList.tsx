import { roleLabel } from "@/lib/i18n";
import type { WorkspaceMember } from "@/lib/types";

export function TeamList({
  members,
  onRevoke,
}: {
  members: WorkspaceMember[];
  onRevoke: (id: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
      <h2 className="font-display text-xl">Команда</h2>
      <div className="mt-4 space-y-3">
        {members.map((m) => (
          <div
            key={m.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--line)] bg-[var(--panel-2)] px-4 py-3"
          >
            <div>
              <p className="font-medium">
                {m.name} <span className="text-xs text-[var(--muted)]">{roleLabel(m.role)}</span>
              </p>
              <p className="text-sm text-[var(--muted)]">
                {m.email} · {m.tools.join(", ") || "нет инструментов"}
                {m.revokedAt ? " · ОТОЗВАН" : ""}
              </p>
            </div>
            {m.role !== "OWNER" && !m.revokedAt && (
              <button
                onClick={() => onRevoke(m.id)}
                className="rounded-md border border-[var(--danger)] px-3 py-1.5 text-sm text-[var(--danger)]"
              >
                Отозвать
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
