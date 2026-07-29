import { z } from "zod";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { jsonOk, jsonCreated, jsonError, handleRouteError } from "@/lib/api";
import { INTEGRATION_TEMPLATES } from "@/lib/integrations";

export async function GET() {
  try {
    const session = await requireSession();
    const webhooks = await prisma.outgoingWebhook.findMany({
      where: { organizationId: session.organizationId },
      orderBy: { createdAt: "desc" },
    });
    return jsonOk({ webhooks, templates: INTEGRATION_TEMPLATES });
  } catch (error) {
    return handleRouteError(error);
  }
}

const createSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  pipelineId: z.string().optional().nullable(),
  integrationType: z
    .enum(["WEBHOOK", "AMOCRM", "BITRIX24", "ONE_C"])
    .default("WEBHOOK"),
  generateSecret: z.boolean().optional().default(true),
});

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const body = createSchema.parse(await request.json());

    if (body.pipelineId) {
      const pipeline = await prisma.pipeline.findFirst({
        where: {
          id: body.pipelineId,
          organizationId: session.organizationId,
        },
      });
      if (!pipeline) return jsonError("Pipeline not found", 404);
    }

    const secret = body.generateSecret
      ? randomBytes(24).toString("hex")
      : null;

    const webhook = await prisma.outgoingWebhook.create({
      data: {
        organizationId: session.organizationId,
        name: body.name,
        url: body.url,
        pipelineId: body.pipelineId || null,
        integrationType: body.integrationType,
        secret,
      },
    });

    return jsonCreated({ webhook });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonError("Invalid payload", 400, { details: error.issues });
    }
    return handleRouteError(error);
  }
}
