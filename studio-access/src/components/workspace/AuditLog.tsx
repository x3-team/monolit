import { actionLabel } from "@/lib/i18n";
import { formatDateTime } from "@/lib/format";
import type { AccessLogEntry } from "@/lib/types";

export function AuditLog({ logs }: { logs: AccessLogEntry[] }) {
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
      <h2 className="font-display text-xl">Журнал действий</h2>
      <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
        {logs.map((l) => (
          <li key={l.id}>
            {formatDateTime(l.createdAt)} · {actionLabel(l.action)}
            {l.user ? ` · ${l.user.email}` : ""}
            {l.toolConnection ? ` · ${l.toolConnection.label}` : ""}
          </li>
        ))}
      </ul>
    </section>
  );
}
