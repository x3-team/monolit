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

declare global {
  interface Window {
    studioGate?: {
      connectTool: (payload: {
        toolId: string;
        loginUrl: string;
        kind: string;
      }) => Promise<{ ok: boolean; error?: string }>;
      openTool: (toolId: string) => Promise<{ ok: boolean; error?: string }>;
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
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePassword, setInvitePassword] = useState("freelancer123");
  const [inviteTools, setInviteTools] = useState<string[]>(["FIGMA", "HIGGSFIELD"]);

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

    const toolsRes = await fetch("/api/tools").then((r) => r.json());
    setTools(toolsRes.tools || []);

    if (me.user.role !== "MEMBER") {
      const [membersRes, logsRes] = await Promise.all([
        fetch("/api/members").then((r) => r.json()),
        fetch("/api/logs").then((r) => r.json()),
      ]);
      setMembers(membersRes.members || []);
      setLogs(logsRes.logs || []);
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
    // Sales/demo fallback without Electron: store empty-ish mock cookies marker
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
    if (!window.studioGate) {
      setMessage(
        `Web demo: доступ к ${tool.label} выдан. Реальное окно открывается в desktop app.`
      );
      await fetch(`/api/tools/${tool.id}/session`);
      await refresh();
      return;
    }
    const result = await window.studioGate.openTool(tool.id);
    if (!result.ok) setError(result.error || "Open failed");
    else setMessage(`Opened ${tool.label}`);
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
    </main>
  );
}
