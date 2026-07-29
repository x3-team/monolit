import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateApiKey, requireSession } from "@/lib/auth";
import { jsonOk, jsonCreated, jsonError, handleRouteError } from "@/lib/api";

export async function GET() {
  try {
    const session = await requireSession();
    const apiKeys = await prisma.apiKey.findMany({
      where: { organizationId: session.organizationId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        lastUsedAt: true,
        revokedAt: true,
        createdAt: true,
      },
    });
    return jsonOk({ apiKeys });
  } catch (error) {
    return handleRouteError(error);
  }
}

const createSchema = z.object({
  name: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    if (session.role !== "ADMIN") {
      return jsonError("Only admins can create API keys", 403);
    }
    const body = createSchema.parse(await request.json());
    const generated = generateApiKey();

    const apiKey = await prisma.apiKey.create({
      data: {
        organizationId: session.organizationId,
        name: body.name,
        keyHash: generated.hash,
        keyPrefix: generated.prefix,
      },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        createdAt: true,
      },
    });

    return jsonCreated({
      apiKey,
      secret: generated.raw,
      warning: "Copy this key now. It will not be shown again.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonError("Invalid payload", 400, { details: error.issues });
    }
    return handleRouteError(error);
  }
}
