import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { err, ok } from "@/lib/api";

export async function GET() {
  const session = await getSession();
  if (!session) return err("Нужна авторизация", 401);
  const workspace = await prisma.workspace.findUnique({
    where: { id: session.workspaceId },
  });
  return ok({ user: session, workspace });
}
