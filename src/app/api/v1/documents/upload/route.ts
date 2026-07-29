import { prisma } from "@/lib/prisma";
import { getSession, authenticateApiKey } from "@/lib/auth";
import { jsonCreated, jsonError, handleRouteError } from "@/lib/api";
import {
  assertAllowedUpload,
  persistUpload,
} from "@/lib/document-processor";
import { enqueueDocumentProcessing } from "@/lib/queue";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const apiKey = session
      ? null
      : await authenticateApiKey(request.headers.get("authorization"));

    if (!session && !apiKey) {
      return jsonError("Unauthorized", 401);
    }

    const organizationId = session?.organizationId ?? apiKey!.organizationId;
    const form = await request.formData();
    const file = form.get("file");
    const pipelineId = String(form.get("pipelineId") || "");

    if (!pipelineId) return jsonError("pipelineId is required");
    if (!(file instanceof File)) return jsonError("file is required");

    const pipeline = await prisma.pipeline.findFirst({
      where: {
        id: pipelineId,
        organizationId,
        isActive: true,
      },
    });
    if (!pipeline) return jsonError("Pipeline not found", 404);

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || "application/octet-stream";
    assertAllowedUpload(mimeType, buffer.byteLength);

    const document = await prisma.document.create({
      data: {
        organizationId,
        pipelineId,
        uploadedById: session?.id,
        originalFilename: file.name,
        mimeType,
        fileSizeBytes: buffer.byteLength,
        status: "PENDING",
        source: session ? "web_upload" : "api_upload",
      },
    });

    const storagePath = await persistUpload({
      buffer,
      documentId: document.id,
      filename: file.name,
    });

    await prisma.document.update({
      where: { id: document.id },
      data: { storagePath },
    });

    await enqueueDocumentProcessing(document.id);

    await prisma.auditLog.create({
      data: {
        organizationId,
        userId: session?.id,
        action: "document.uploaded",
        entityType: "Document",
        entityId: document.id,
        metadata: { filename: file.name, pipelineId },
      },
    });

    return jsonCreated({
      document: {
        id: document.id,
        status: "PENDING",
        pipelineId,
        originalFilename: file.name,
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
