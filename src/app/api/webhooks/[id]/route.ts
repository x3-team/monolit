import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { jsonOk, jsonError, handleRouteError } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const session = await requireSession();
    const { id } = await params;
    const existing = await prisma.outgoingWebhook.findFirst({
      where: { id, organizationId: session.organizationId },
    });
    if (!existing) return jsonError("Webhook not found", 404);
    await prisma.outgoingWebhook.delete({ where: { id } });
    return jsonOk({ ok: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
