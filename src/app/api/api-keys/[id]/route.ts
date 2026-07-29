import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { jsonOk, jsonError, handleRouteError } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const session = await requireSession();
    if (session.role !== "ADMIN") {
      return jsonError("Only admins can revoke API keys", 403);
    }
    const { id } = await params;
    const existing = await prisma.apiKey.findFirst({
      where: { id, organizationId: session.organizationId },
    });
    if (!existing) return jsonError("API key not found", 404);

    await prisma.apiKey.update({
      where: { id },
      data: { revokedAt: new Date() },
    });

    return jsonOk({ ok: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
