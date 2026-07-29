import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { TOOL_CATALOG } from "@/lib/tools";

async function main() {
  const email = "owner@studio.local";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // Ensure demo projects exist even on re-seed
    const count = await prisma.project.count({
      where: { workspaceId: existing.workspaceId },
    });
    if (count === 0) {
      await prisma.project.createMany({
        data: [
          {
            workspaceId: existing.workspaceId,
            name: "Nike spring cutdowns",
            clientName: "Nike",
            budgetRub: 120000,
          },
          {
            workspaceId: existing.workspaceId,
            name: "Bank app motion pack",
            clientName: "Fintech",
            budgetRub: 80000,
          },
        ],
      });
      console.log("Added demo projects to existing workspace");
    }
    console.log("Demo already seeded:", email, "/ owner123456");
    return;
  }

  const passwordHash = await hashPassword("owner123456");
  const workspace = await prisma.workspace.create({
    data: {
      name: "Demo Creative Studio",
      creditPriceRub: 2,
      costSyncMode: "demo",
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
      projects: {
        create: [
          {
            name: "Nike spring cutdowns",
            clientName: "Nike",
            budgetRub: 120000,
          },
          {
            name: "Bank app motion pack",
            clientName: "Fintech",
            budgetRub: 80000,
          },
        ],
      },
    },
    include: { users: true, toolConnections: true, projects: true },
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
  console.log(
    "Projects:",
    workspace.projects.map((p) => p.name).join(", ")
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
