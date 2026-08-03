import type { WorkspaceTool } from "@/lib/types";
import { formatDateTime } from "@/lib/format";

export function ToolsGrid({
  tools,
  isAdmin,
  onOpen,
  onConnect,
  onMockConnect,
}: {
  tools: WorkspaceTool[];
  isAdmin: boolean;
  onOpen: (tool: WorkspaceTool) => void;
  onConnect: (tool: WorkspaceTool) => void;
  onMockConnect: (tool: WorkspaceTool) => void;
}) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {tools.map((tool) => (
        <div key={tool.id} className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl">{tool.label}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {tool.connected ? "Подключён" : "Не подключён"}
                {tool.sessionUpdatedAt ? ` · ${formatDateTime(tool.sessionUpdatedAt)}` : ""}
              </p>
              {tool.kind === "HIGGSFIELD" && (
                <p className="mt-2 text-xs text-[var(--accent)]">
                  Для открытия нужен проект (учёт затрат)
                </p>
              )}
            </div>
            <span className="rounded-md bg-[var(--panel-2)] px-2 py-1 text-xs">{tool.kind}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => onOpen(tool)}
              className="rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-[#042421]"
            >
              Открыть
            </button>
            {isAdmin && (
              <>
                <button
                  onClick={() => onConnect(tool)}
                  className="rounded-md border border-[var(--line)] px-3 py-2 text-sm"
                >
                  Подключить командный аккаунт
                </button>
                <button
                  onClick={() => onMockConnect(tool)}
                  className="rounded-md border border-[var(--line)] px-3 py-2 text-sm text-[var(--muted)]"
                >
                  Отметить подключённым (демо)
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
