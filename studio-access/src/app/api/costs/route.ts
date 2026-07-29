import { z } from "zod";
import { requireAdmin, requireSession } from "@/lib/auth";
import { projectCostReport } from "@/lib/costs";
import { encryptApiKey, syncWorkspaceCosts } from "@/lib/higgsfield-sync";
import { prisma } from "@/lib/prisma";
import { err, handleError, ok } from "@/lib/api";

export async function GET() {
  try {
    const session = await requireSession();
    if (session.role === "MEMBER") {
      // Freelancers see only their attributed rows via a slim report
      const full = await projectCostReport(session.workspaceId);
      return ok({
        ...full,
        projects: full.projects,
        recent: full.recent.filter((r) => r.user?.email),
        memberView: true,
      });
    }
    const report = await projectCostReport(session.workspaceId);
    return ok({ ...report, memberView: false });
  } catch (error) {
    return handleError(error);
  }
}

const syncSchema = z.object({
  transactions: z
    .array(
      z.object({
        id: z.string(),
        kind: z.string().default("spend"),
        credits: z.number(),
        description: z.string().optional().nullable(),
        occurredAt: z.string(),
      })
    )
    .optional(),
});

/** Pull / estimate / import Higgsfield spend and attribute to Open→project sessions. */
export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    const body = syncSchema.parse(await request.json().catch(() => ({})));
    const result = await syncWorkspaceCosts(session.workspaceId, {
      transactions: body.transactions,
    });
    if (!result.ok) return err(result.error, 400);
    const report = await projectCostReport(session.workspaceId);
    return ok({ sync: result, report });
  } catch (error) {
    if (error instanceof z.ZodError) return err("Invalid sync payload", 400);
    return handleError(error);
  }
}

const settingsSchema = z.object({
  creditPriceRub: z.number().positive().max(10000).optional(),
  costSyncMode: z.enum(["demo", "api"]).optional(),
  higgsfieldApiKey: z.string().min(8).optional().nullable(),
});

export async function PATCH(request: Request) {
  try {
    const session = await requireAdmin();
    const body = settingsSchema.parse(await request.json());
    const data: {
      creditPriceRub?: number;
      costSyncMode?: string;
      higgsfieldApiKeyEnc?: string | null;
    } = {};
    if (body.creditPriceRub !== undefined) data.creditPriceRub = body.creditPriceRub;
    if (body.costSyncMode !== undefined) data.costSyncMode = body.costSyncMode;
    if (body.higgsfieldApiKey !== undefined) {
      data.higgsfieldApiKeyEnc = body.higgsfieldApiKey
        ? encryptApiKey(body.higgsfieldApiKey)
        : null;
    }
    const workspace = await prisma.workspace.update({
      where: { id: session.workspaceId },
      data,
      select: {
        creditPriceRub: true,
        costSyncMode: true,
        costSyncedAt: true,
        higgsfieldApiKeyEnc: true,
      },
    });
    return ok({
      settings: {
        creditPriceRub: workspace.creditPriceRub,
        costSyncMode: workspace.costSyncMode,
        costSyncedAt: workspace.costSyncedAt,
        hasApiKey: Boolean(workspace.higgsfieldApiKeyEnc),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) return err("Invalid settings", 400);
    return handleError(error);
  }
}
