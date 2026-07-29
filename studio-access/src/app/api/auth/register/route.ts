import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  createToken,
  hashPassword,
  setAuthCookie,
} from "@/lib/auth";
import { TOOL_CATALOG } from "@/lib/tools";
import { err, handleError, ok } from "@/lib/api";

const registerSchema = z.object({
  studioName: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const body = registerSchema.parse(await request.json());
    const email = body.email.toLowerCase();
    if (await prisma.user.findUnique({ where: { email } })) {
      return err("Email already registered", 409);
    }

    const passwordHash = await hashPassword(body.password);
    const workspace = await prisma.workspace.create({
      data: {
        name: body.studioName,
        users: {
          create: {
            email,
            name: body.name,
            passwordHash,
            role: "OWNER",
          },
        },
        toolConnections: {
          create: [
            {
              kind: "FIGMA",
              label: TOOL_CATALOG.FIGMA.label,
              loginUrl: TOOL_CATALOG.FIGMA.loginUrl,
            },
            {
              kind: "HIGGSFIELD",
              label: TOOL_CATALOG.HIGGSFIELD.label,
              loginUrl: TOOL_CATALOG.HIGGSFIELD.loginUrl,
            },
          ],
        },
      },
      include: { users: true },
    });

    const user = workspace.users[0];
    const session = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "OWNER" | "ADMIN" | "MEMBER",
      workspaceId: workspace.id,
    };
    await setAuthCookie(await createToken(session));

    await prisma.accessLog.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        action: "workspace.created",
      },
    });

    return ok({ user: session, workspace: { id: workspace.id, name: workspace.name } }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) return err("Invalid payload", 400);
    return handleError(error);
  }
}
