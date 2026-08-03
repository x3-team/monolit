import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireSession } from "@/lib/auth";
import { err, handleError, ok } from "@/lib/api";
import { assertTrustedOrigin } from "@/lib/origin";

const createSchema = z.object({
  name: z.string().min(1).max(120),
  clientName: z.string().max(120).optional().nullable(),
  budgetRub: z.number().nonnegative().optional().nullable(),
});

export async function GET() {
  try {
    const session = await requireSession();
    const projects = await prisma.project.findMany({
      where: { workspaceId: session.workspaceId, isArchived: false },
      orderBy: { updatedAt: "desc" },
    });
    return ok({ projects });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    assertTrustedOrigin(request);
    const session = await requireAdmin();
    const body = createSchema.parse(await request.json());
    const project = await prisma.project.create({
      data: {
        workspaceId: session.workspaceId,
        name: body.name.trim(),
        clientName: body.clientName?.trim() || null,
        budgetRub: body.budgetRub ?? null,
      },
    });
    await prisma.accessLog.create({
      data: {
        workspaceId: session.workspaceId,
        userId: session.id,
        action: "project.created",
        metadata: JSON.stringify({ projectId: project.id, name: project.name }),
      },
    });
    return ok({ project }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) return err("Некорректные данные проекта", 400);
    return handleError(error);
  }
}
