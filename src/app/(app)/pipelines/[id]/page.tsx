import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PipelineBuilder } from "@/components/pipeline-builder";
import { Button } from "@/components/ui/button";

type Params = { params: Promise<{ id: string }> };

export default async function PipelineDetailPage({ params }: Params) {
  const session = await getSession();
  if (!session) redirect("/login");
  const { id } = await params;

  const pipeline = await prisma.pipeline.findFirst({
    where: { id, organizationId: session.organizationId },
    include: { schemaFields: { orderBy: { sortOrder: "asc" } } },
  });
  if (!pipeline) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">{pipeline.name}</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Ingest endpoint:{" "}
            <code className="rounded bg-[var(--muted)] px-1.5 py-0.5">
              POST /api/v1/ingest/{pipeline.id}
            </code>
          </p>
        </div>
        <Link href="/documents">
          <Button variant="outline">View documents</Button>
        </Link>
      </div>
      <PipelineBuilder
        initial={{
          id: pipeline.id,
          name: pipeline.name,
          description: pipeline.description,
          maskPii: pipeline.maskPii,
          fields: pipeline.schemaFields,
        }}
      />
    </div>
  );
}
