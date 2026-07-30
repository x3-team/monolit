import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireSession } from "@/lib/auth";
import { encryptJson, decryptJson } from "@/lib/crypto";
import type { ToolSessionPayload } from "@/lib/tools";
import { TOOL_CATALOG } from "@/lib/tools";
import type { ToolKind } from "@/lib/roles";
import { err, handleError, ok } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

const saveSchema = z.object({
  cookies: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
      domain: z.string().optional(),
      path: z.string().optional(),
      secure: z.boolean().optional(),
      httpOnly: z.boolean().optional(),
      expirationDate: z.number().optional(),
    })
  ),
  localStorage: z.record(z.string(), z.string().nullable()).optional(),
  note: z.string().optional(),
});

export async function POST(request: Request, { params }: Params) {
  try {
    const session = await requireAdmin();
    const { id } = await params;
    const body = saveSchema.parse(await request.json());

    const tool = await prisma.toolConnection.findFirst({
      where: { id, workspaceId: session.workspaceId },
    });
    if (!tool) return err("Инструмент не найден", 404);

    const payload: ToolSessionPayload = {
      cookies: body.cookies,
      capturedAt: new Date().toISOString(),
      note: body.note,
      localStorage: body.localStorage,
    };

    const updated = await prisma.toolConnection.update({
      where: { id },
      data: {
        encryptedSession: encryptJson(payload),
        sessionUpdatedAt: new Date(),
        isActive: true,
      },
    });

    await prisma.accessLog.create({
      data: {
        workspaceId: session.workspaceId,
        userId: session.id,
        toolConnectionId: id,
        action: "tool.session_saved",
      },
    });

    return ok({
      tool: {
        id: updated.id,
        kind: updated.kind,
        connected: true,
        sessionUpdatedAt: updated.sessionUpdatedAt,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) return err("Некорректные данные", 400);
    return handleError(error);
  }
}

/** Freelancer/desktop asks for launch payload. Higgsfield requires ?projectId= for cost attribution. */
export async function GET(request: Request, { params }: Params) {
  try {
    const session = await requireSession();
    const { id } = await params;
    const url = new URL(request.url);
    const projectId = url.searchParams.get("projectId");

    const tool = await prisma.toolConnection.findFirst({
      where: { id, workspaceId: session.workspaceId, isActive: true },
    });
    if (!tool) return err("Инструмент не найден", 404);

    if (session.role === "MEMBER") {
      const grant = await prisma.toolGrant.findFirst({
        where: { userId: session.id, toolConnectionId: id },
      });
      if (!grant) return err("Нет доступа к этому инструменту", 403);
    }

    const user = await prisma.user.findUnique({ where: { id: session.id } });
    if (!user || user.revokedAt) return err("Аккаунт отозван", 403);

    if (!tool.encryptedSession) {
      return err("Владелец ещё не подключил этот инструмент", 409);
    }

    let usageSessionId: string | null = null;
    let projectName: string | null = null;

    if (tool.kind === "HIGGSFIELD") {
      if (!projectId) {
        return err("Перед открытием Higgsfield выберите проект", 400);
      }
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          workspaceId: session.workspaceId,
          isArchived: false,
        },
      });
      if (!project) return err("Проект не найден", 404);

      // Close previous open sessions for this user+tool (one active window per person)
      await prisma.usageSession.updateMany({
        where: {
          workspaceId: session.workspaceId,
          userId: session.id,
          toolConnectionId: id,
          endedAt: null,
        },
        data: { endedAt: new Date() },
      });

      const usage = await prisma.usageSession.create({
        data: {
          workspaceId: session.workspaceId,
          projectId: project.id,
          userId: session.id,
          toolConnectionId: id,
        },
      });
      usageSessionId = usage.id;
      projectName = project.name;
    }

    const payload = decryptJson<ToolSessionPayload>(tool.encryptedSession);

    await prisma.accessLog.create({
      data: {
        workspaceId: session.workspaceId,
        userId: session.id,
        toolConnectionId: id,
        action: "tool.opened",
        metadata: projectId
          ? JSON.stringify({ projectId, usageSessionId })
          : null,
      },
    });

    return ok({
      tool: {
        id: tool.id,
        kind: tool.kind,
        label: tool.label,
        homeUrl: TOOL_CATALOG[tool.kind as ToolKind].homeUrl,
        loginUrl: tool.loginUrl,
      },
      session: payload,
      partition: `studiogate:${session.workspaceId}:${tool.kind}:${session.id}`,
      usageSessionId,
      projectId: projectId || null,
      projectName,
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const session = await requireAdmin();
    const { id } = await params;
    const tool = await prisma.toolConnection.findFirst({
      where: { id, workspaceId: session.workspaceId },
    });
    if (!tool) return err("Инструмент не найден", 404);

    await prisma.toolConnection.update({
      where: { id },
      data: {
        encryptedSession: null,
        sessionUpdatedAt: null,
      },
    });

    await prisma.accessLog.create({
      data: {
        workspaceId: session.workspaceId,
        userId: session.id,
        toolConnectionId: id,
        action: "tool.session_cleared",
      },
    });

    return ok({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
