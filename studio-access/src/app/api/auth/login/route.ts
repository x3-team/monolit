import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createToken, setAuthCookie, verifyPassword } from "@/lib/auth";
import { err, handleError, ok } from "@/lib/api";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const MAX_ATTEMPTS = 10;
const WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());

    const rateLimitKey = `login:${clientIp(request)}:${body.email.toLowerCase()}`;
    const { allowed } = checkRateLimit(rateLimitKey, MAX_ATTEMPTS, WINDOW_MS);
    if (!allowed) {
      return err("Слишком много попыток входа. Подождите несколько минут.", 429);
    }

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
