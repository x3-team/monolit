import { prisma } from "@/lib/prisma";

export type ImportedTx = {
  id: string;
  kind: string;
  credits: number;
  description?: string | null;
  occurredAt: string | Date;
  raw?: unknown;
};

/** Sessions that cover a timestamp for a given tool (shared account → may be several). */
export async function findOverlappingSessions(opts: {
  workspaceId: string;
  toolConnectionId: string;
  at: Date;
}) {
  return prisma.usageSession.findMany({
    where: {
      workspaceId: opts.workspaceId,
      toolConnectionId: opts.toolConnectionId,
      startedAt: { lte: opts.at },
      OR: [{ endedAt: null }, { endedAt: { gte: opts.at } }],
    },
  });
}

/**
 * Attribute a credit delta across overlapping Open sessions.
 * Concurrent designers on one shared Higgsfield login → split equally.
 */
export async function attributeCredits(opts: {
  workspaceId: string;
  toolConnectionId: string;
  provider?: string;
  tx: ImportedTx;
}) {
  const provider = opts.provider || "HIGGSFIELD";
  const occurredAt = new Date(opts.tx.occurredAt);
  const kind = normalizeKind(opts.tx.kind);
  const credits = Number(opts.tx.credits) || 0;
  if (!credits && kind !== "grant") return { created: 0 };

  const sessions = await findOverlappingSessions({
    workspaceId: opts.workspaceId,
    toolConnectionId: opts.toolConnectionId,
    at: occurredAt,
  });

  if (!sessions.length) {
    await upsertSpend({
      workspaceId: opts.workspaceId,
      projectId: null,
      userId: null,
      usageSessionId: null,
      provider,
      externalId: opts.tx.id,
      kind,
      credits,
      description: opts.tx.description || "Unallocated (no Open session)",
      occurredAt,
      rawJson: opts.tx.raw ? JSON.stringify(opts.tx.raw) : null,
    });
    return { created: 1, allocated: false };
  }

  const share = credits / sessions.length;
  let created = 0;
  for (const [i, session] of sessions.entries()) {
    const externalId =
      sessions.length === 1 ? opts.tx.id : `${opts.tx.id}#${i}`;
    await upsertSpend({
      workspaceId: opts.workspaceId,
      projectId: session.projectId,
      userId: session.userId,
      usageSessionId: session.id,
      provider,
      externalId,
      kind,
      credits: share,
      description: opts.tx.description || null,
      occurredAt,
      rawJson: opts.tx.raw ? JSON.stringify(opts.tx.raw) : null,
    });
    created += 1;
  }
  return { created, allocated: true };
}

async function upsertSpend(data: {
  workspaceId: string;
  projectId: string | null;
  userId: string | null;
  usageSessionId: string | null;
  provider: string;
  externalId: string;
  kind: string;
  credits: number;
  description: string | null;
  occurredAt: Date;
  rawJson: string | null;
}) {
  await prisma.spendEvent.upsert({
    where: {
      workspaceId_provider_externalId: {
        workspaceId: data.workspaceId,
        provider: data.provider,
        externalId: data.externalId,
      },
    },
    create: data,
    update: {
      projectId: data.projectId,
      userId: data.userId,
      usageSessionId: data.usageSessionId,
      kind: data.kind,
      credits: data.credits,
      description: data.description,
      occurredAt: data.occurredAt,
      rawJson: data.rawJson,
    },
  });
}

function normalizeKind(kind: string) {
  const k = String(kind || "spend").toLowerCase();
  if (["spend", "refund", "grant", "deduct", "estimate"].includes(k)) return k;
  if (k.includes("refund")) return "refund";
  if (k.includes("grant") || k.includes("top")) return "grant";
  if (k.includes("deduct")) return "deduct";
  return "spend";
}

/** Demo estimate: ~0.4 credits/min while Higgsfield is Open on a project. */
export async function estimateDemoSpendForSessions(workspaceId: string) {
  const tool = await prisma.toolConnection.findFirst({
    where: { workspaceId, kind: "HIGGSFIELD" },
  });
  if (!tool) return { estimated: 0 };

  const sessions = await prisma.usageSession.findMany({
    where: { workspaceId, toolConnectionId: tool.id },
  });

  let estimated = 0;
  const now = Date.now();
  for (const session of sessions) {
    const end = session.endedAt ? session.endedAt.getTime() : now;
    const minutes = Math.max(1, Math.round((end - session.startedAt.getTime()) / 60000));
    const credits = Math.round(minutes * 0.4 * 10) / 10;
    const externalId = `demo-estimate:${session.id}`;
    await upsertSpend({
      workspaceId,
      projectId: session.projectId,
      userId: session.userId,
      usageSessionId: session.id,
      provider: "HIGGSFIELD",
      externalId,
      kind: "estimate",
      credits,
      description: `Auto estimate · ${minutes} min Open`,
      occurredAt: session.endedAt || new Date(),
      rawJson: null,
    });
    estimated += 1;
  }
  return { estimated };
}

function netSpendCredits(
  rows: { kind: string; credits: number }[]
): number {
  const spent = rows
    .filter((e) => e.kind === "spend" || e.kind === "estimate" || e.kind === "deduct")
    .reduce((s, e) => s + e.credits, 0);
  const refund = rows
    .filter((e) => e.kind === "refund")
    .reduce((s, e) => s + e.credits, 0);
  return Math.max(0, spent - refund);
}

export async function projectCostReport(workspaceId: string) {
  const workspace = await prisma.workspace.findUniqueOrThrow({
    where: { id: workspaceId },
  });
  const projects = await prisma.project.findMany({
    where: { workspaceId, isArchived: false },
    orderBy: { updatedAt: "desc" },
  });
  const events = await prisma.spendEvent.findMany({
    where: { workspaceId, provider: "HIGGSFIELD" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      project: { select: { id: true, name: true } },
    },
    orderBy: { occurredAt: "desc" },
    take: 500,
  });

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthLabel = monthStart.toLocaleDateString("ru-RU", {
    month: "long",
    year: "numeric",
  });
  const monthEvents = events.filter((e) => e.occurredAt >= monthStart);
  const monthCredits = netSpendCredits(monthEvents);
  const monthCostRub =
    Math.round(monthCredits * workspace.creditPriceRub * 100) / 100;

  const byProject = projects.map((p) => {
    const rows = events.filter((e) => e.projectId === p.id);
    const monthRows = monthEvents.filter((e) => e.projectId === p.id);
    const netCredits = netSpendCredits(rows);
    const monthNetCredits = netSpendCredits(monthRows);
    const costRub = netCredits * workspace.creditPriceRub;
    const monthCostRubProject = monthNetCredits * workspace.creditPriceRub;
    const marginRub =
      p.budgetRub != null ? Math.round((p.budgetRub - costRub) * 100) / 100 : null;
    const budgetUsedPct =
      p.budgetRub && p.budgetRub > 0
        ? Math.round((costRub / p.budgetRub) * 1000) / 10
        : null;
    return {
      id: p.id,
      name: p.name,
      clientName: p.clientName,
      budgetRub: p.budgetRub,
      netCredits: Math.round(netCredits * 100) / 100,
      monthCredits: Math.round(monthNetCredits * 100) / 100,
      costRub: Math.round(costRub * 100) / 100,
      monthCostRub: Math.round(monthCostRubProject * 100) / 100,
      marginRub,
      budgetUsedPct,
      eventCount: rows.length,
    };
  });

  const unallocated = events.filter((e) => !e.projectId);
  const unallocatedCredits = netSpendCredits(unallocated);
  const totalBudgetRub = projects.reduce(
    (s, p) => s + (p.budgetRub || 0),
    0
  );
  const totalCostRub = byProject.reduce((s, p) => s + p.costRub, 0);

  return {
    creditPriceRub: workspace.creditPriceRub,
    costSyncMode: workspace.costSyncMode,
    costSyncedAt: workspace.costSyncedAt,
    month: {
      label: monthLabel,
      credits: Math.round(monthCredits * 100) / 100,
      costRub: monthCostRub,
    },
    totals: {
      costRub: Math.round(totalCostRub * 100) / 100,
      budgetRub: totalBudgetRub || null,
      budgetUsedPct:
        totalBudgetRub > 0
          ? Math.round((totalCostRub / totalBudgetRub) * 1000) / 10
          : null,
    },
    projects: byProject,
    unallocatedCredits: Math.round(unallocatedCredits * 100) / 100,
    recent: events.slice(0, 40).map((e) => ({
      id: e.id,
      kind: e.kind,
      credits: e.credits,
      description: e.description,
      occurredAt: e.occurredAt,
      project: e.project,
      user: e.user,
    })),
  };
}
