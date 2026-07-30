import { randomBytes } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireSession } from "@/lib/auth";
import { err, handleError, ok } from "@/lib/api";

export async function GET() {
  try {
    const session = await requireSession();
    const members = await prisma.user.findMany({
      where: { workspaceId: session.workspaceId },
      include: {
        grants: { include: { toolConnection: true } },
      },
      orderBy: { createdAt: "asc" },
    });
    return ok({
      members: members.map((m) => ({
        id: m.id,
        email: m.email,
        name: m.name,
        role: m.role,
        revokedAt: m.revokedAt,
        tools: m.grants.map((g) => g.toolConnection.kind),
      })),
    });
  } catch (error) {
    return handleError(error);
  }
}

const inviteSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
  role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
  tools: z.array(z.enum(["FIGMA", "HIGGSFIELD"])).default([]),
});

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    const body = inviteSchema.parse(await request.json());
    const email = body.email.toLowerCase();

    if (await prisma.user.findUnique({ where: { email } })) {
      return err("Пользователь уже существует", 409);
    }

    const { hashPassword } = await import("@/lib/auth");
    const passwordHash = await hashPassword(body.password);

    const tools = await prisma.toolConnection.findMany({
      where: {
        workspaceId: session.workspaceId,
        kind: { in: body.tools },
      },
    });

    const user = await prisma.user.create({
      data: {
        email,
        name: body.name,
        passwordHash,
        role: body.role,
        workspaceId: session.workspaceId,
        grants: {
          create: tools.map((t) => ({ toolConnectionId: t.id })),
        },
      },
      include: { grants: { include: { toolConnection: true } } },
    });

    await prisma.accessLog.create({
      data: {
        workspaceId: session.workspaceId,
        userId: session.id,
        action: "member.invited",
        metadata: JSON.stringify({ email, tools: body.tools }),
      },
    });

    // Also store invite token for shareable onboarding link
    const token = randomBytes(16).toString("hex");
    await prisma.invite.create({
      data: {
        workspaceId: session.workspaceId,
        email,
        role: body.role,
        token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
        acceptedAt: new Date(),
      },
    });

    return ok(
      {
        member: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tools: user.grants.map((g) => g.toolConnection.kind),
        },
        temporaryPassword: body.password,
      },
      201
    );
  } catch (error) {
    if (error instanceof z.ZodError) return err("Некорректные данные", 400);
    return handleError(error);
  }
}
