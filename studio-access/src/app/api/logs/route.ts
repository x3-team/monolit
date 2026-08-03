import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handleError, ok } from "@/lib/api";

export async function GET() {
  try {
    const session = await requireAdmin();
    const logs = await prisma.accessLog.findMany({
      where: { workspaceId: session.workspaceId },
      include: {
        user: { select: { name: true, email: true } },
        toolConnection: { select: { kind: true, label: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return ok({ logs });
  } catch (error) {
    return handleError(error);
  }
}
