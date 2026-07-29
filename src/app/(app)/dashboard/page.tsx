import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { UploadDropzone } from "@/components/upload-dropzone";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [pipelines, documents, counts] = await Promise.all([
    prisma.pipeline.findMany({
      where: { organizationId: session.organizationId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.document.findMany({
      where: { organizationId: session.organizationId },
      include: { pipeline: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.document.groupBy({
      by: ["status"],
      where: { organizationId: session.organizationId },
      _count: { _all: true },
    }),
  ]);

  const countMap = Object.fromEntries(
    counts.map((c) => [c.status, c._count._all])
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Overview</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">
            Upload documents, review extractions, push to CRM/ERP.
          </p>
        </div>
        <Link href="/pipelines/new">
          <Button>New pipeline</Button>
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {["PENDING", "PROCESSING", "SUCCESS", "NEEDS_REVIEW", "FAILED"].map(
          (status) => (
            <div
              key={status}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <StatusBadge status={status} />
              <p className="mt-3 font-display text-3xl">
                {countMap[status] ?? 0}
              </p>
            </div>
          )
        )}
      </div>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="mb-4 font-display text-xl">Upload</h2>
        <UploadDropzone
          pipelines={pipelines.map((p) => ({ id: p.id, name: p.name }))}
        />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl">Recent documents</h2>
          <Link
            href="/documents"
            className="text-sm text-[var(--accent)] underline"
          >
            View all
          </Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <table className="min-w-full text-sm">
            <thead className="bg-[var(--muted)] text-left text-[var(--muted-foreground)]">
              <tr>
                <th className="px-4 py-3 font-medium">File</th>
                <th className="px-4 py-3 font-medium">Pipeline</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-[var(--muted-foreground)]"
                  >
                    No documents yet. Upload one above.
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
      </section>
    </div>
  );
}
