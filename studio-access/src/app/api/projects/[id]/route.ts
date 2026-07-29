import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { err, handleError, ok } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  clientName: z.string().max(120).optional().nullable(),
  budgetRub: z.number().nonnegative().optional().nullable(),
  isArchived: z.boolean().optional(),
});

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await requireAdmin();
    const { id } = await params;
    const body = patchSchema.parse(await request.json());
    const existing = await prisma.project.findFirst({
      where: { id, workspaceId: session.workspaceId },
    });
    if (!existing) return err("Project not found", 404);

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: body.name.trim() } : {}),
        ...(body.clientName !== undefined
          ? { clientName: body.clientName?.trim() || null }
          : {}),
        ...(body.budgetRub !== undefined ? { budgetRub: body.budgetRub } : {}),
        ...(body.isArchived !== undefined ? { isArchived: body.isArchived } : {}),
      },
    });
    return ok({ project });
  } catch (error) {
    if (error instanceof z.ZodError) return err("Invalid payload", 400);
    return handleError(error);
  }
}
