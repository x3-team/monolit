import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/ui/status-badge";

export default async function DocumentsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const documents = await prisma.document.findMany({
    where: { organizationId: session.organizationId },
    include: { pipeline: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Documents</h1>
        <p className="mt-1 text-[var(--muted-foreground)]">
          Processing history with review and export controls.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="min-w-full text-sm">
          <thead className="bg-[var(--muted)] text-left text-[var(--muted-foreground)]">
            <tr>
              <th className="px-4 py-3 font-medium">File</th>
              <th className="px-4 py-3 font-medium">Pipeline</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-[var(--muted-foreground)]"
                >
                  No documents yet.
                </td>
              </tr>
            )}
            {documents.map((doc) => (
              <tr key={doc.id} className="border-t border-[var(--border)]">
                <td className="px-4 py-3">
                  <Link
                    href={`/documents/${doc.id}`}
                    className="font-medium text-[var(--accent)] hover:underline"
                  >
                    {doc.originalFilename}
                  </Link>
                </td>
                <td className="px-4 py-3">{doc.pipeline.name}</td>
                <td className="px-4 py-3 text-[var(--muted-foreground)]">
                  {doc.source}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={doc.status} />
                </td>
                <td className="px-4 py-3 text-[var(--muted-foreground)]">
                  {doc.createdAt.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
