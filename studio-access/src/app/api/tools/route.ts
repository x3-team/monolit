import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { TOOL_CATALOG } from "@/lib/tools";
import type { ToolKind } from "@/lib/roles";
import { handleError, ok } from "@/lib/api";

export async function GET() {
  try {
    const session = await requireSession();
    const connections = await prisma.toolConnection.findMany({
      where: { workspaceId: session.workspaceId },
      orderBy: { kind: "asc" },
    });

    let allowedKinds: string[] | null = null;
    if (session.role === "MEMBER") {
      const grants = await prisma.toolGrant.findMany({
        where: { userId: session.id },
        include: { toolConnection: true },
      });
      allowedKinds = grants.map((g) => g.toolConnection.kind);
    }

    const tools = connections
      .filter((c) => !allowedKinds || allowedKinds.includes(c.kind))
      .map((c) => ({
        id: c.id,
        kind: c.kind,
        label: c.label,
        loginUrl: c.loginUrl,
        homeUrl: TOOL_CATALOG[c.kind as ToolKind].homeUrl,
        pitch: TOOL_CATALOG[c.kind as ToolKind].pitch,
        connected: Boolean(c.encryptedSession),
        sessionUpdatedAt: c.sessionUpdatedAt,
        isActive: c.isActive,
      }));

    return ok({ tools });
  } catch (error) {
    return handleError(error);
  }
}
