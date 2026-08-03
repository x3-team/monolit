"use client";

import { useWorkspace } from "@/hooks/useWorkspace";
import { roleLabel } from "@/lib/i18n";
import { Banner } from "@/components/workspace/Banner";
import { ActiveProjectPicker } from "@/components/workspace/ActiveProjectPicker";
import { ToolsGrid } from "@/components/workspace/ToolsGrid";
import { ProjectsPanel } from "@/components/workspace/ProjectsPanel";
import { CostsPanel } from "@/components/workspace/CostsPanel";
import { InviteForm } from "@/components/workspace/InviteForm";
import { TeamList } from "@/components/workspace/TeamList";
import { AuditLog } from "@/components/workspace/AuditLog";
import { MemberCostSummary } from "@/components/workspace/MemberCostSummary";

export default function AppPage() {
  const workspace = useWorkspace();
  const { user, isAdmin, hasDesktop } = workspace;

  if (!user) {
    return <main className="p-8 text-[var(--muted)]">Загрузка студии…</main>;
  }

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-2xl">
            Studio<span className="text-[var(--accent)]">Gate</span>
          </p>
          <p className="text-sm text-[var(--muted)]">
            {workspace.workspace} · {user.name} · {roleLabel(user.role)}
            {hasDesktop ? " · десктоп подключён" : " · веб-демо"}
          </p>
        </div>
        <button
          onClick={workspace.logout}
          className="rounded-md border border-[var(--line)] px-3 py-2 text-sm"
        >
          Выйти
        </button>
      </header>

      <Banner message={workspace.message} error={workspace.error} />

      <ActiveProjectPicker
        projects={workspace.projects}
        selectedProjectId={workspace.selectedProjectId}
        onChange={workspace.setSelectedProjectId}
      />

      <ToolsGrid
        tools={workspace.tools}
        isAdmin={isAdmin}
        onOpen={workspace.openTool}
        onConnect={workspace.connectTool}
        onMockConnect={workspace.mockConnect}
      />

      {isAdmin && (
        <>
          <ProjectsPanel
            projects={workspace.projects}
            onCreate={workspace.createProject}
            onSelect={workspace.setSelectedProjectId}
          />

          <CostsPanel
            costs={workspace.costs}
            onSync={workspace.syncCosts}
            onSaveSettings={workspace.saveCostSettings}
          />

          <InviteForm onInvite={workspace.inviteMember} />

          <TeamList members={workspace.members} onRevoke={workspace.revokeMember} />

          <AuditLog logs={workspace.logs} />
        </>
      )}

      {!isAdmin && workspace.costs && <MemberCostSummary costs={workspace.costs} />}
    </main>
  );
}
