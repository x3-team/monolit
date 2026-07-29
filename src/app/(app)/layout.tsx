import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const org = await prisma.organization.findUnique({
    where: { id: session.organizationId },
  });

  return (
    <DashboardShell
      userName={session.name}
      orgName={org?.name ?? "Organization"}
    >
      {children}
    </DashboardShell>
  );
}
