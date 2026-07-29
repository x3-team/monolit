import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export default async function PipelinesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const pipelines = await prisma.pipeline.findMany({
    where: { organizationId: session.organizationId },
    include: {
      schemaFields: true,
      _count: { select: { documents: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Pipelines</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">
            Define document types and JSON schema mappings.
          </p>
        </div>
        <Link href="/pipelines/new">
          <Button>Create pipeline</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {pipelines.length === 0 && (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 text-center text-[var(--muted-foreground)]">
            No pipelines yet. Create your first document processing pipeline.
          </div>
        )}
        {pipelines.map((pipeline) => (
          <Link
            key={pipeline.id}
            href={`/pipelines/${pipeline.id}`}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl">{pipeline.name}</h2>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {pipeline.description || "No description"}
                </p>
              </div>
              <div className="text-right text-sm text-[var(--muted-foreground)]">
                <p>{pipeline.schemaFields.length} fields</p>
                <p>{pipeline._count.documents} documents</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
