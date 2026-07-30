import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { err, handleError, ok } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  revoke: z.boolean().optional(),
  restore: z.boolean().optional(),
  tools: z.array(z.enum(["FIGMA", "HIGGSFIELD"])).optional(),
});

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await requireAdmin();
    const { id } = await params;
    const body = patchSchema.parse(await request.json());

    const member = await prisma.user.findFirst({
      where: { id, workspaceId: session.workspaceId },
    });
    if (!member) return err("Участник не найден", 404);
    if (member.role === "OWNER") return err("Владельца так изменить нельзя", 400);

    if (body.revoke) {
      await prisma.user.update({
        where: { id },
        data: { revokedAt: new Date() },
      });
      await prisma.accessLog.create({
        data: {
          workspaceId: session.workspaceId,
          userId: session.id,
          action: "member.revoked",
          metadata: JSON.stringify({ memberId: id }),
        },
      });
    }

    if (body.restore) {
      await prisma.user.update({
        where: { id },
        data: { revokedAt: null },
      });
    }

    if (body.tools) {
      const connections = await prisma.toolConnection.findMany({
        where: { workspaceId: session.workspaceId, kind: { in: body.tools } },
      });
      await prisma.toolGrant.deleteMany({ where: { userId: id } });
      await prisma.toolGrant.createMany({
        data: connections.map((c) => ({
          userId: id,
          toolConnectionId: c.id,
        })),
      });
    }

    const updated = await prisma.user.findUnique({
      where: { id },
      include: { grants: { include: { toolConnection: true } } },
    });

    return ok({
      member: {
        id: updated!.id,
        email: updated!.email,
        name: updated!.name,
        role: updated!.role,
        revokedAt: updated!.revokedAt,
        tools: updated!.grants.map((g) => g.toolConnection.kind),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) return err("Некорректные данные", 400);
    return handleError(error);
  }
}
