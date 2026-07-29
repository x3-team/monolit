"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Tool = {
  id: string;
  kind: "FIGMA" | "HIGGSFIELD";
  label: string;
  connected: boolean;
  homeUrl: string;
  loginUrl: string;
  sessionUpdatedAt?: string | null;
};

type Member = {
  id: string;
  email: string;
  name: string;
  role: string;
  revokedAt: string | null;
  tools: string[];
};

type Log = {
  id: string;
  action: string;
  createdAt: string;
  user?: { name: string; email: string } | null;
  toolConnection?: { kind: string; label: string } | null;
};

type Project = {
  id: string;
  name: string;
  clientName: string | null;
  budgetRub: number | null;
};

type CostReport = {
  creditPriceRub: number;
  costSyncMode: string;
  costSyncedAt?: string | null;
  projects: {
    id: string;
    name: string;
    clientName: string | null;
    budgetRub: number | null;
    netCredits: number;
    costRub: number;
    marginRub: number | null;
    eventCount: number;
  }[];
  unallocatedCredits: number;
  recent: {
    id: string;
    kind: string;
    credits: number;
    description: string | null;
    occurredAt: string;
    project: { id: string; name: string } | null;
    user: { name: string; email: string } | null;
  }[];
};

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

export default function AppPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [workspace, setWorkspace] = useState<string>("");
  const [tools, setTools] = useState<Tool[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [costs, setCosts] = useState<CostReport | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePassword, setInvitePassword] = useState("freelancer123");
  const [inviteTools, setInviteTools] = useState<string[]>(["FIGMA", "HIGGSFIELD"]);

  const [projectName, setProjectName] = useState("");
  const [projectClient, setProjectClient] = useState("");
  const [projectBudget, setProjectBudget] = useState("");
  const [creditPrice, setCreditPrice] = useState("2");
  const [syncMode, setSyncMode] = useState<"demo" | "api">("demo");
  const [apiKey, setApiKey] = useState("");

  const isAdmin = user?.role === "OWNER" || user?.role === "ADMIN";
  const hasDesktop = typeof window !== "undefined" && Boolean(window.studioGate);

  async function refresh() {
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
    const nextProjects: Project[] = projectsRes.projects || [];
    setProjects(nextProjects);
    if (!selectedProjectId && nextProjects[0]) {
      setSelectedProjectId(nextProjects[0].id);
    }

    if (me.user.role !== "MEMBER") {
      const [membersRes, logsRes, costsRes] = await Promise.all([
        fetch("/api/members").then((r) => r.json()),
        fetch("/api/logs").then((r) => r.json()),
        fetch("/api/costs").then((r) => r.json()),
      ]);
      setMembers(membersRes.members || []);
      setLogs(logsRes.logs || []);
      if (!costsRes.error) {
        setCosts(costsRes);
        setCreditPrice(String(costsRes.creditPriceRub ?? 2));
        setSyncMode(costsRes.costSyncMode === "api" ? "api" : "demo");
      }
    } else {
      const costsRes = await fetch("/api/costs").then((r) => r.json());
      if (!costsRes.error) setCosts(costsRes);
    }
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  async function connectTool(tool: Tool) {
    setError(null);
    setMessage(null);
    if (!window.studioGate) {
      setError(
        "Для реального Connect нужен desktop: npm run desktop. На сайте можно только Mark connected (demo)."
      );
      return;
    }
    const result = await window.studioGate.connectTool({
      toolId: tool.id,
      loginUrl: tool.loginUrl,
      kind: tool.kind,
    });
    if (!result.ok) {
      setError(result.error || "Connect failed");
      return;
    }
    setMessage(`${tool.label} connected`);
    await refresh();
  }

  async function mockConnect(tool: Tool) {
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
        note: "Demo mock session — replace via desktop Connect for real use",
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed");
      return;
    }
    setMessage(`${tool.label} marked connected (demo session)`);
    await refresh();
  }

  async function openTool(tool: Tool) {
    setError(null);
    setMessage(null);

    const projectId =
      tool.kind === "HIGGSFIELD" ? selectedProjectId || null : null;
    if (tool.kind === "HIGGSFIELD" && !projectId) {
      setError("Сначала создайте/выберите проект — иначе некуда списать кредиты");
      return;
    }

    if (!window.studioGate) {
      const qs = projectId ? `?projectId=${encodeURIComponent(projectId)}` : "";
      const res = await fetch(`/api/tools/${tool.id}/session${qs}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Open failed");
        return;
      }
      const projectLabel =
        projects.find((p) => p.id === projectId)?.name || data.projectName;
      setMessage(
        projectLabel
          ? `Web demo: ${tool.label} открыт на проект «${projectLabel}». Реальное окно — в desktop.`
          : `Web demo: доступ к ${tool.label} выдан.`
      );
      await refresh();
      return;
    }

    const result = await window.studioGate.openTool(tool.id, projectId);
    if (!result.ok) setError(result.error || "Open failed");
    else {
      const projectLabel = projects.find((p) => p.id === projectId)?.name;
      setMessage(
        projectLabel
          ? `Opened ${tool.label} · ${projectLabel}`
          : `Opened ${tool.label}`
      );
    }
    await refresh();
  }

  async function inviteMember(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: inviteName,
        email: inviteEmail,
        password: invitePassword,
        tools: inviteTools,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Invite failed");
      return;
    }
    setMessage(`Invited ${data.member.email}`);
    setInviteName("");
    setInviteEmail("");
    await refresh();
  }

  async function revokeMember(id: string) {
    await fetch(`/api/members/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ revoke: true }),
    });
    setMessage("Access revoked in one click");
    await refresh();
  }

  async function createProject(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: projectName,
        clientName: projectClient || null,
        budgetRub: projectBudget ? Number(projectBudget) : null,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Project create failed");
      return;
    }
    setProjectName("");
    setProjectClient("");
    setProjectBudget("");
    setSelectedProjectId(data.project.id);
    setMessage(`Project «${data.project.name}» created`);
    await refresh();
  }

  async function saveCostSettings(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/costs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creditPriceRub: Number(creditPrice),
        costSyncMode: syncMode,
        ...(apiKey.trim() ? { higgsfieldApiKey: apiKey.trim() } : {}),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Settings failed");
      return;
    }
    setApiKey("");
    setMessage("Cost settings saved");
    await refresh();
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
      setError(data.error || "Sync failed");
      return;
    }
    setCosts(data.report);
    setMessage(
      data.sync?.warning
        ? `Synced (${data.sync.source}): ${data.sync.warning}`
        : `Synced ${data.sync?.imported || 0} rows · mode ${data.sync?.source}`
    );
  }

  if (!user) {
    return <main className="p-8 text-[var(--muted)]">Loading workspace…</main>;
  }

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-2xl">
            Studio<span className="text-[var(--accent)]">Gate</span>
          </p>
          <p className="text-sm text-[var(--muted)]">
            {workspace} · {user.name} · {user.role}
            {hasDesktop ? " · Desktop connected" : " · Web demo mode"}
          </p>
        </div>
        <button
          onClick={logout}
          className="rounded-md border border-[var(--line)] px-3 py-2 text-sm"
        >
          Log out
        </button>
      </header>

      {message && (
        <p className="rounded-md border border-emerald-700/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-md border border-rose-700/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {error}
        </p>
      )}

      <section className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl">Active project</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Перед Open Higgsfield выберите проект — кредиты спишутся на него
              автоматически
            </p>
          </div>
          <select
            className="min-w-[220px] rounded-md border border-[var(--line)] bg-[var(--panel-2)] px-3 py-2"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            <option value="">Select project…</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
                {p.clientName ? ` · ${p.clientName}` : ""}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl">{tool.label}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {tool.connected ? "Connected" : "Not connected"}
                  {tool.sessionUpdatedAt
                    ? ` · ${new Date(tool.sessionUpdatedAt).toLocaleString()}`
                    : ""}
                </p>
                {tool.kind === "HIGGSFIELD" && (
                  <p className="mt-2 text-xs text-[var(--accent)]">
                    Open requires a project (cost tracking)
                  </p>
                )}
              </div>
              <span className="rounded-md bg-[var(--panel-2)] px-2 py-1 text-xs">
                {tool.kind}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => openTool(tool)}
                className="rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-[#042421]"
              >
                Open
              </button>
              {isAdmin && (
                <>
                  <button
                    onClick={() => connectTool(tool)}
                    className="rounded-md border border-[var(--line)] px-3 py-2 text-sm"
                  >
                    Connect team account
                  </button>
                  <button
                    onClick={() => mockConnect(tool)}
                    className="rounded-md border border-[var(--line)] px-3 py-2 text-sm text-[var(--muted)]"
                  >
                    Mark connected (demo)
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </section>

      {isAdmin && (
        <>
          <section className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
            <h2 className="font-display text-xl">Projects</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Ценник на генерацию: бюджет проекта vs фактические AI-кредиты
            </p>
            <form
              onSubmit={createProject}
              className="mt-4 grid gap-3 md:grid-cols-4"
            >
              <input
                placeholder="Project name"
                className="rounded-md border border-[var(--line)] bg-[var(--panel-2)] px-3 py-2 md:col-span-1"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
              <input
                placeholder="Client"
                className="rounded-md border border-[var(--line)] bg-[var(--panel-2)] px-3 py-2"
                value={projectClient}
                onChange={(e) => setProjectClient(e.target.value)}
              />
              <input
                placeholder="Budget ₽"
                type="number"
                min="0"
                className="rounded-md border border-[var(--line)] bg-[var(--panel-2)] px-3 py-2"
                value={projectBudget}
                onChange={(e) => setProjectBudget(e.target.value)}
              />
              <button className="rounded-md bg-[var(--accent-2)] px-3 py-2 font-semibold text-[#1d1400]">
                Add project
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
                      {p.budgetRub != null ? ` · budget ${p.budgetRub} ₽` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedProjectId(p.id)}
                    className="rounded-md border border-[var(--line)] px-3 py-1.5"
                  >
                    Use for Open
                  </button>
                </div>
              ))}
              {!projects.length && (
                <p className="text-sm text-[var(--muted)]">
                  No projects yet — create one before opening Higgsfield.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl">AI cost by project</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Автоматически: Open → сессия → sync кредитов → ₽ на проект
                  {costs?.costSyncedAt
                    ? ` · last sync ${new Date(costs.costSyncedAt).toLocaleString()}`
                    : ""}
                </p>
              </div>
              <button
                onClick={syncCosts}
                className="rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-[#042421]"
              >
                Sync costs
              </button>
            </div>

            <form
              onSubmit={saveCostSettings}
              className="mt-4 grid gap-3 rounded-xl border border-[var(--line)] bg-[var(--panel-2)] p-4 md:grid-cols-4"
            >
              <label className="text-sm">
                <span className="text-[var(--muted)]">₽ / credit</span>
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
                <span className="text-[var(--muted)]">Sync mode</span>
                <select
                  className="mt-1 w-full rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2"
                  value={syncMode}
                  onChange={(e) =>
                    setSyncMode(e.target.value === "api" ? "api" : "demo")
                  }
                >
                  <option value="demo">Demo estimate (Open time)</option>
                  <option value="api">Cloud API key</option>
                </select>
              </label>
              <label className="text-sm md:col-span-2">
                <span className="text-[var(--muted)]">
                  Higgsfield Cloud key (KEY_ID:KEY_SECRET)
                </span>
                <input
                  type="password"
                  placeholder="optional — for api mode"
                  className="mt-1 w-full rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </label>
              <button className="rounded-md border border-[var(--line)] px-3 py-2 text-sm md:col-span-4">
                Save cost settings
              </button>
            </form>

            <div className="mt-4 space-y-2">
              {(costs?.projects || []).map((p) => (
                <div
                  key={p.id}
                  className="grid gap-2 rounded-xl border border-[var(--line)] bg-[var(--panel-2)] px-4 py-3 text-sm md:grid-cols-5"
                >
                  <div className="md:col-span-2">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-[var(--muted)]">{p.clientName || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[var(--muted)]">Credits</p>
                    <p>{p.netCredits}</p>
                  </div>
                  <div>
                    <p className="text-[var(--muted)]">AI cost</p>
                    <p>{p.costRub} ₽</p>
                  </div>
                  <div>
                    <p className="text-[var(--muted)]">Margin</p>
                    <p>
                      {p.marginRub == null
                        ? "—"
                        : `${p.marginRub} ₽${p.budgetRub != null ? ` / ${p.budgetRub}` : ""}`}
                    </p>
                  </div>
                </div>
              ))}
              {!costs?.projects?.length && (
                <p className="text-sm text-[var(--muted)]">
                  No cost data yet — Open Higgsfield on a project, then Sync.
                </p>
              )}
              {(costs?.unallocatedCredits || 0) > 0 && (
                <p className="text-sm text-amber-200/90">
                  Unallocated: {costs?.unallocatedCredits} credits (spend outside
                  an Open session)
                </p>
              )}
            </div>

            {!!costs?.recent?.length && (
              <ul className="mt-4 space-y-1 text-sm text-[var(--muted)]">
                {costs.recent.slice(0, 12).map((e) => (
                  <li key={e.id}>
                    {new Date(e.occurredAt).toLocaleString()} · {e.kind} ·{" "}
                    {e.credits} cr
                    {e.project ? ` · ${e.project.name}` : " · unallocated"}
                    {e.user ? ` · ${e.user.email}` : ""}
                    {e.description ? ` · ${e.description}` : ""}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
            <h2 className="font-display text-xl">Invite freelancer</h2>
            <form
              onSubmit={inviteMember}
              className="mt-4 grid gap-3 md:grid-cols-2"
            >
              <input
                placeholder="Name"
                className="rounded-md border border-[var(--line)] bg-[var(--panel-2)] px-3 py-2"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                required
              />
              <input
                placeholder="Email"
                type="email"
                className="rounded-md border border-[var(--line)] bg-[var(--panel-2)] px-3 py-2"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
              <input
                placeholder="Temp password"
                className="rounded-md border border-[var(--line)] bg-[var(--panel-2)] px-3 py-2"
                value={invitePassword}
                onChange={(e) => setInvitePassword(e.target.value)}
                required
              />
              <div className="flex items-center gap-4 text-sm">
                {["FIGMA", "HIGGSFIELD"].map((t) => (
                  <label key={t} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={inviteTools.includes(t)}
                      onChange={(e) =>
                        setInviteTools((prev) =>
                          e.target.checked
                            ? [...prev, t]
                            : prev.filter((x) => x !== t)
                        )
                      }
                    />
                    {t}
                  </label>
                ))}
              </div>
              <button className="rounded-md bg-[var(--accent-2)] px-3 py-2 font-semibold text-[#1d1400] md:col-span-2">
                Create member access
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
            <h2 className="font-display text-xl">Team</h2>
            <div className="mt-4 space-y-3">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--line)] bg-[var(--panel-2)] px-4 py-3"
                >
                  <div>
                    <p className="font-medium">
                      {m.name}{" "}
                      <span className="text-xs text-[var(--muted)]">
                        {m.role}
                      </span>
                    </p>
                    <p className="text-sm text-[var(--muted)]">
                      {m.email} · {m.tools.join(", ") || "no tools"}
                      {m.revokedAt ? " · REVOKED" : ""}
                    </p>
                  </div>
                  {m.role !== "OWNER" && !m.revokedAt && (
                    <button
                      onClick={() => revokeMember(m.id)}
                      className="rounded-md border border-[var(--danger)] px-3 py-1.5 text-sm text-[var(--danger)]"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
            <h2 className="font-display text-xl">Audit log</h2>
            <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
              {logs.map((l) => (
                <li key={l.id}>
                  {new Date(l.createdAt).toLocaleString()} · {l.action}
                  {l.user ? ` · ${l.user.email}` : ""}
                  {l.toolConnection ? ` · ${l.toolConnection.label}` : ""}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {!isAdmin && costs && (
        <section className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
          <h2 className="font-display text-xl">Your project spend</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Кредиты, списанные пока вы работали через StudioGate
          </p>
          <div className="mt-4 space-y-2">
            {costs.projects
              .filter((p) => p.eventCount > 0)
              .map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-[var(--line)] bg-[var(--panel-2)] px-4 py-3 text-sm"
                >
                  {p.name}: {p.netCredits} credits · ~{p.costRub} ₽
                </div>
              ))}
          </div>
        </section>
      )}
    </main>
  );
}
