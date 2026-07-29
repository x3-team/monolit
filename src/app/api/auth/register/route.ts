import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  createToken,
  hashPassword,
  setAuthCookie,
} from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { jsonCreated, jsonError, handleRouteError } from "@/lib/api";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  organizationName: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = registerSchema.parse(await request.json());
    const existing = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
    });
    if (existing) {
      return jsonError("Email already registered", 409);
    }

    const baseSlug = slugify(body.organizationName) || "org";
    let slug = baseSlug;
    let i = 1;
    while (await prisma.organization.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${i++}`;
    }

    const passwordHash = await hashPassword(body.password);
    const organization = await prisma.organization.create({
      data: {
        name: body.organizationName,
        slug,
        users: {
          create: {
            email: body.email.toLowerCase(),
            name: body.name,
            passwordHash,
            role: "ADMIN",
          },
        },
      },
      include: { users: true },
    });

    const user = organization.users[0];
    const session = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: organization.id,
    };
    const token = await createToken(session);
    await setAuthCookie(token);

    await prisma.auditLog.create({
      data: {
        organizationId: organization.id,
        userId: user.id,
        action: "auth.register",
        entityType: "User",
        entityId: user.id,
      },
    });

    return jsonCreated({
      user: session,
      organization: { id: organization.id, name: organization.name, slug },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonError("Invalid payload", 400, { details: error.issues });
    }
    return handleRouteError(error);
  }
}
