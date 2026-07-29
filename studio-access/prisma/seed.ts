import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { TOOL_CATALOG } from "@/lib/tools";

async function main() {
  const email = "owner@studio.local";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Demo already seeded:", email, "/ owner123456");
    return;
  }

  const passwordHash = await hashPassword("owner123456");
  const workspace = await prisma.workspace.create({
    data: {
      name: "Demo Creative Studio",
      users: {
        create: [
          {
            email,
            name: "Studio Owner",
            passwordHash,
            role: "OWNER",
          },
        ],
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
    include: { users: true, toolConnections: true },
  });

  const freelancerHash = await hashPassword("freelancer123");
  const freelancer = await prisma.user.create({
    data: {
      email: "freelancer@studio.local",
      name: "Demo Freelancer",
      passwordHash: freelancerHash,
      role: "MEMBER",
      workspaceId: workspace.id,
      grants: {
        create: workspace.toolConnections.map((t) => ({
          toolConnectionId: t.id,
        })),
      },
    },
  });

  console.log("Seeded StudioGate demo");
  console.log("Owner:", email, "/ owner123456");
  console.log("Freelancer:", freelancer.email, "/ freelancer123");
  console.log("Workspace:", workspace.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
