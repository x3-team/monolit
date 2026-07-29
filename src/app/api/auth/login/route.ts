import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createToken, setAuthCookie, verifyPassword } from "@/lib/auth";
import { jsonOk, jsonError, handleRouteError } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await request.json());
    const user = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
    });
    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      return jsonError("Invalid email or password", 401);
    }

    const session = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId,
    };
    const token = await createToken(session);
    await setAuthCookie(token);

    return jsonOk({ user: session });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonError("Invalid payload", 400, { details: error.issues });
    }
    return handleRouteError(error);
  }
}
