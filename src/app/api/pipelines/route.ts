import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { jsonOk, jsonCreated, jsonError, handleRouteError } from "@/lib/api";

const fieldSchema = z.object({
  targetFieldName: z.string().min(1),
  dataType: z.enum(["STRING", "NUMBER", "DATE", "BOOLEAN"]).default("STRING"),
  description: z.string().optional().nullable(),
  promptHint: z.string().optional().nullable(),
  required: z.boolean().optional().default(false),
  systemFieldTarget: z.string().optional().nullable(),
  sortOrder: z.number().int().optional().default(0),
});

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  maskPii: z.boolean().optional().default(false),
  fields: z.array(fieldSchema).default([]),
});

export async function GET() {
  try {
    const session = await requireSession();
    const pipelines = await prisma.pipeline.findMany({
      where: { organizationId: session.organizationId },
      include: {
        schemaFields: { orderBy: { sortOrder: "asc" } },
        _count: { select: { documents: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return jsonOk({ pipelines });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const body = createSchema.parse(await request.json());

    const pipeline = await prisma.pipeline.create({
      data: {
        name: body.name,
        description: body.description,
        maskPii: body.maskPii,
        organizationId: session.organizationId,
        schemaFields: {
          create: body.fields.map((f, index) => ({
            targetFieldName: f.targetFieldName,
            dataType: f.dataType,
            description: f.description,
            promptHint: f.promptHint,
            required: f.required,
            systemFieldTarget: f.systemFieldTarget,
            sortOrder: f.sortOrder ?? index,
          })),
        },
      },
      include: { schemaFields: { orderBy: { sortOrder: "asc" } } },
    });

    await prisma.auditLog.create({
      data: {
        organizationId: session.organizationId,
        userId: session.id,
        action: "pipeline.created",
        entityType: "Pipeline",
        entityId: pipeline.id,
      },
    });

    return jsonCreated({ pipeline });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonError("Invalid payload", 400, { details: error.issues });
    }
    return handleRouteError(error);
  }
}
