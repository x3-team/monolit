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
    if (!tool) return err("Tool not found", 404);

    const payload: ToolSessionPayload = {
      cookies: body.cookies,
      capturedAt: new Date().toISOString(),
      note: body.note,
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
    if (error instanceof z.ZodError) return err("Invalid payload", 400);
    return handleError(error);
  }
}

/** Freelancer/desktop asks for launch payload */
export async function GET(_request: Request, { params }: Params) {
  try {
    const session = await requireSession();
    const { id } = await params;

    const tool = await prisma.toolConnection.findFirst({
      where: { id, workspaceId: session.workspaceId, isActive: true },
    });
    if (!tool) return err("Tool not found", 404);

    if (session.role === "MEMBER") {
      const grant = await prisma.toolGrant.findFirst({
        where: { userId: session.id, toolConnectionId: id },
      });
      if (!grant) return err("No access to this tool", 403);
    }

    const user = await prisma.user.findUnique({ where: { id: session.id } });
    if (!user || user.revokedAt) return err("Account revoked", 403);

    if (!tool.encryptedSession) {
      return err("Owner has not connected this tool yet", 409);
    }

    const payload = decryptJson<ToolSessionPayload>(tool.encryptedSession);

    await prisma.accessLog.create({
      data: {
        workspaceId: session.workspaceId,
        userId: session.id,
        toolConnectionId: id,
        action: "tool.opened",
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
    if (!tool) return err("Tool not found", 404);

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
