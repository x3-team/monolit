import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { jsonOk, jsonError, handleRouteError } from "@/lib/api";

const fieldSchema = z.object({
  id: z.string().optional(),
  targetFieldName: z.string().min(1),
  dataType: z.enum(["STRING", "NUMBER", "DATE", "BOOLEAN"]).default("STRING"),
  description: z.string().optional().nullable(),
  promptHint: z.string().optional().nullable(),
  required: z.boolean().optional().default(false),
  systemFieldTarget: z.string().optional().nullable(),
  sortOrder: z.number().int().optional().default(0),
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  maskPii: z.boolean().optional(),
  isActive: z.boolean().optional(),
  fields: z.array(fieldSchema).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const session = await requireSession();
    const { id } = await params;
    const pipeline = await prisma.pipeline.findFirst({
      where: { id, organizationId: session.organizationId },
      include: { schemaFields: { orderBy: { sortOrder: "asc" } } },
    });
    if (!pipeline) return jsonError("Pipeline not found", 404);
    return jsonOk({ pipeline });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await requireSession();
    const { id } = await params;
    const body = updateSchema.parse(await request.json());

    const existing = await prisma.pipeline.findFirst({
      where: { id, organizationId: session.organizationId },
    });
    if (!existing) return jsonError("Pipeline not found", 404);

    const pipeline = await prisma.$transaction(async (tx) => {
      if (body.fields) {
        await tx.documentSchemaField.deleteMany({ where: { pipelineId: id } });
        await tx.documentSchemaField.createMany({
          data: body.fields.map((f, index) => ({
            pipelineId: id,
            targetFieldName: f.targetFieldName,
            dataType: f.dataType,
            description: f.description,
            promptHint: f.promptHint,
            required: f.required ?? false,
            systemFieldTarget: f.systemFieldTarget,
            sortOrder: f.sortOrder ?? index,
          })),
        });
      }

      return tx.pipeline.update({
        where: { id },
        data: {
          name: body.name,
          description: body.description,
          maskPii: body.maskPii,
          isActive: body.isActive,
        },
        include: { schemaFields: { orderBy: { sortOrder: "asc" } } },
      });
    });

    return jsonOk({ pipeline });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonError("Invalid payload", 400, { details: error.issues });
    }
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const session = await requireSession();
    const { id } = await params;
    const existing = await prisma.pipeline.findFirst({
      where: { id, organizationId: session.organizationId },
    });
    if (!existing) return jsonError("Pipeline not found", 404);
    await prisma.pipeline.delete({ where: { id } });
    return jsonOk({ ok: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
