import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DocumentReview } from "@/components/document-review";

type Params = { params: Promise<{ id: string }> };

export default async function DocumentDetailPage({ params }: Params) {
  const session = await getSession();
  if (!session) redirect("/login");
  const { id } = await params;

  const document = await prisma.document.findFirst({
    where: { id, organizationId: session.organizationId },
    include: {
      pipeline: {
        include: { schemaFields: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });
  if (!document) notFound();

  return (
    <DocumentReview
      document={{
        id: document.id,
        status: document.status,
        originalFilename: document.originalFilename,
        mimeType: document.mimeType,
        ocrText: document.ocrText,
        extractedData: document.extractedData as Record<string, unknown> | null,
        editedData: document.editedData as Record<string, unknown> | null,
        validationErrors: document.validationErrors as
          | Array<{ field?: string; message: string }>
          | null,
        confidenceScore: document.confidenceScore,
        pipeline: document.pipeline,
      }}
    />
  );
}
