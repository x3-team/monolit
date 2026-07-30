import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createToken, setAuthCookie, verifyPassword } from "@/lib/auth";
import { err, handleError, ok } from "@/lib/api";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const user = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
    });
    if (!user || user.revokedAt || !(await verifyPassword(body.password, user.passwordHash))) {
      return err("Неверный email или пароль", 401);
    }
    const session = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "OWNER" | "ADMIN" | "MEMBER",
      workspaceId: user.workspaceId,
    };
    await setAuthCookie(await createToken(session));
    return ok({ user: session });
  } catch (error) {
    if (error instanceof z.ZodError) return err("Некорректные данные", 400);
    return handleError(error);
  }
}
