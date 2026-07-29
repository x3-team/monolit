import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { jsonOk, jsonError, handleRouteError } from "@/lib/api";
import { exportDocument } from "@/lib/document-processor";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const session = await requireSession();
    const { id } = await params;
    const document = await prisma.document.findFirst({
      where: { id, organizationId: session.organizationId },
      include: {
        pipeline: {
          include: { schemaFields: { orderBy: { sortOrder: "asc" } } },
        },
        uploadedBy: { select: { id: true, name: true, email: true } },
      },
    });
    if (!document) return jsonError("Document not found", 404);
    return jsonOk({ document });
  } catch (error) {
    return handleRouteError(error);
  }
}

const patchSchema = z.object({
  editedData: z.record(z.string(), z.unknown()).optional(),
  confirmAndSend: z.boolean().optional(),
});

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await requireSession();
    const { id } = await params;
    const body = patchSchema.parse(await request.json());

    const existing = await prisma.document.findFirst({
      where: { id, organizationId: session.organizationId },
    });
    if (!existing) return jsonError("Document not found", 404);

    const document = await prisma.document.update({
      where: { id },
      data: {
        editedData: body.editedData as Prisma.InputJsonValue | undefined,
        ...(body.confirmAndSend
          ? { status: "SUCCESS" as const, validationErrors: [] }
          : {}),
      },
      include: {
        pipeline: {
          include: { schemaFields: { orderBy: { sortOrder: "asc" } } },
        },
      },
    });

    if (body.confirmAndSend) {
      await exportDocument(id);
      await prisma.auditLog.create({
        data: {
          organizationId: session.organizationId,
          userId: session.id,
          action: "document.confirmed",
          entityType: "Document",
          entityId: id,
        },
      });
    }

    return jsonOk({ document });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonError("Invalid payload", 400, { details: error.issues });
    }
    return handleRouteError(error);
  }
}
