"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  AccessLogEntry,
  CostReport,
  WorkspaceMember,
  WorkspaceProject,
  WorkspaceTool,
} from "@/lib/types";

declare global {
  interface Window {
    studioGate?: {
      connectTool: (payload: {
        toolId: string;
        loginUrl: string;
        kind: string;
      }) => Promise<{ ok: boolean; error?: string }>;
      openTool: (
        toolId: string,
        projectId?: string | null
      ) => Promise<{ ok: boolean; error?: string }>;
    };
  }
}

type CurrentUser = { name: string; email: string; role: string };

const TOAST_TIMEOUT_MS = 4500;

/**
 * All data fetching + mutations for the `/app` dashboard, split out of the
 * page component so each panel can stay a small, focused component.
 */
export function useWorkspace() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [workspace, setWorkspace] = useState<string>("");
  const [tools, setTools] = useState<WorkspaceTool[]>([]);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [logs, setLogs] = useState<AccessLogEntry[]>([]);
  const [projects, setProjects] = useState<WorkspaceProject[]>([]);
  const [costs, setCosts] = useState<CostReport | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.role === "OWNER" || user?.role === "ADMIN";
  const hasDesktop = typeof window !== "undefined" && Boolean(window.studioGate);

  // Toasts clear themselves so stale success/error text doesn't linger forever.
  useEffect(() => {
    if (!message && !error) return;
    const timer = setTimeout(() => {
      setMessage(null);
      setError(null);
    }, TOAST_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [message, error]);

  const refresh = useCallback(async () => {
    const me = await fetch("/api/auth/me").then((r) => r.json());
    if (me.error) {
      router.push("/login");
      return;
    }
    setUser(me.user);
    setWorkspace(me.workspace?.name || "");

    const [toolsRes, projectsRes] = await Promise.all([
      fetch("/api/tools").then((r) => r.json()),
      fetch("/api/projects").then((r) => r.json()),
    ]);
    setTools(toolsRes.tools || []);
    const nextProjects: WorkspaceProject[] = projectsRes.projects || [];
    setProjects(nextProjects);
    setSelectedProjectId((current) => current || nextProjects[0]?.id || "");

    if (me.user.role !== "MEMBER") {
      const [membersRes, logsRes, costsRes] = await Promise.all([
        fetch("/api/members").then((r) => r.json()),
        fetch("/api/logs").then((r) => r.json()),
        fetch("/api/costs").then((r) => r.json()),
      ]);
      setMembers(membersRes.members || []);
      setLogs(logsRes.logs || []);
      if (!costsRes.error) setCosts(costsRes);
    } else {
      const costsRes = await fetch("/api/costs").then((r) => r.json());
      if (!costsRes.error) setCosts(costsRes);
    }
  }, [router]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  async function connectTool(tool: WorkspaceTool) {
    setError(null);
    setMessage(null);
    if (!window.studioGate) {
      setError(
        "Для настоящего подключения нужен десктоп: npm run desktop. На сайте доступна только кнопка «Отметить подключённым» (демо)."
      );
      return;
    }
    const result = await window.studioGate.connectTool({
      toolId: tool.id,
      loginUrl: tool.loginUrl,
      kind: tool.kind,
    });
    if (!result.ok) {
      setError(result.error || "Не удалось подключить");
      return;
    }
    setMessage(`${tool.label} подключён`);
    await refresh();
  }

  async function mockConnect(tool: WorkspaceTool) {
    const res = await fetch(`/api/tools/${tool.id}/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cookies: [
          {
            name: "studiogate_demo",
            value: "connected",
            domain: tool.kind === "FIGMA" ? ".figma.com" : ".higgsfield.ai",
            path: "/",
          },
        ],
        note: "Демо-сессия — для боя подключите через десктоп",
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Ошибка");
      return;
    }
    setMessage(`${tool.label}: отмечен как подключённый (демо)`);
    await refresh();
  }

  async function openTool(tool: WorkspaceTool) {
    setError(null);
    setMessage(null);

    const projectId = tool.kind === "HIGGSFIELD" ? selectedProjectId || null : null;
    if (tool.kind === "HIGGSFIELD" && !projectId) {
      setError("Сначала создайте/выберите проект — иначе некуда списать кредиты");
      return;
    }

    if (!window.studioGate) {
      const qs = projectId ? `?projectId=${encodeURIComponent(projectId)}` : "";
      const res = await fetch(`/api/tools/${tool.id}/session${qs}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Не удалось открыть");
        return;
      }
      const projectLabel = projects.find((p) => p.id === projectId)?.name || data.projectName;
      setMessage(
        projectLabel
          ? `Веб-демо: ${tool.label} открыт на проект «${projectLabel}». Настоящее окно — в десктоп-приложении.`
          : `Веб-демо: доступ к ${tool.label} выдан.`
      );
      await refresh();
      return;
    }

    const result = await window.studioGate.openTool(tool.id, projectId);
    if (!result.ok) {
      setError(result.error || "Не удалось открыть");
    } else {
      const projectLabel = projects.find((p) => p.id === projectId)?.name;
      setMessage(projectLabel ? `Открыт ${tool.label} · ${projectLabel}` : `Открыт ${tool.label}`);
    }
    await refresh();
  }

  async function inviteMember(input: {
    name: string;
    email: string;
    password: string;
    tools: string[];
  }) {
    setError(null);
    const res = await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Не удалось пригласить");
      return false;
    }
    setMessage(`Приглашён ${data.member.email}`);
    await refresh();
    return true;
  }

  async function revokeMember(id: string) {
    await fetch(`/api/members/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ revoke: true }),
    });
    setMessage("Доступ отозван одним кликом");
    await refresh();
  }

  async function createProject(input: {
    name: string;
    clientName: string;
    budgetRub: string;
  }) {
    setError(null);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.name,
        clientName: input.clientName || null,
        budgetRub: input.budgetRub ? Number(input.budgetRub) : null,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Не удалось создать проект");
      return false;
    }
    setSelectedProjectId(data.project.id);
    setMessage(`Проект «${data.project.name}» создан`);
    await refresh();
    return true;
  }

  async function saveCostSettings(input: {
    creditPriceRub: string;
    syncMode: "demo" | "api";
    apiKey: string;
  }) {
    setError(null);
    const res = await fetch("/api/costs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creditPriceRub: Number(input.creditPriceRub),
        costSyncMode: input.syncMode,
        ...(input.apiKey.trim() ? { higgsfieldApiKey: input.apiKey.trim() } : {}),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Не удалось сохранить настройки");
      return false;
    }
    setMessage("Настройки затрат сохранены");
    await refresh();
    return true;
  }

  async function syncCosts() {
    setError(null);
    const res = await fetch("/api/costs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Не удалось обновить затраты");
      return;
    }
    setCosts(data.report);
    setMessage(
      data.sync?.warning
        ? `Обновлено (${data.sync.source === "demo" ? "демо" : data.sync.source}): ${data.sync.warning}`
        : `Обновлено записей: ${data.sync?.imported || 0} · режим ${
            data.sync?.source === "demo" ? "демо-оценка" : data.sync?.source
          }`
    );
  }

  return {
    user,
    workspace,
    tools,
    members,
    logs,
    projects,
    costs,
    selectedProjectId,
    setSelectedProjectId,
    message,
    error,
    isAdmin,
    hasDesktop,
    logout,
    connectTool,
    mockConnect,
    openTool,
    inviteMember,
    revokeMember,
    createProject,
    saveCostSettings,
    syncCosts,
  };
}

export type UseWorkspaceReturn = ReturnType<typeof useWorkspace>;
