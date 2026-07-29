import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { jsonOk, handleRouteError } from "@/lib/api";

export async function GET(request: Request) {
  try {
    const session = await requireSession();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const pipelineId = searchParams.get("pipelineId");

    const documents = await prisma.document.findMany({
      where: {
        organizationId: session.organizationId,
        ...(status ? { status: status as never } : {}),
        ...(pipelineId ? { pipelineId } : {}),
      },
      include: {
        pipeline: { select: { id: true, name: true } },
        uploadedBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return jsonOk({ documents });
  } catch (error) {
    return handleRouteError(error);
  }
}
