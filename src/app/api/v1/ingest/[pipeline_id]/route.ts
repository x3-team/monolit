import { prisma } from "@/lib/prisma";
import { authenticateApiKey, getSession } from "@/lib/auth";
import { jsonCreated, jsonError, handleRouteError } from "@/lib/api";
import {
  assertAllowedUpload,
  persistUpload,
} from "@/lib/document-processor";
import { enqueueDocumentProcessing } from "@/lib/queue";

type Params = { params: Promise<{ pipeline_id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const { pipeline_id: pipelineId } = await params;
    const session = await getSession();
    const apiKey = session
      ? null
      : await authenticateApiKey(request.headers.get("authorization"));

    if (!session && !apiKey) {
      return jsonError("Unauthorized — provide session cookie or API key", 401);
    }

    const organizationId = session?.organizationId ?? apiKey!.organizationId;

    const pipeline = await prisma.pipeline.findFirst({
      where: { id: pipelineId, organizationId, isActive: true },
    });
    if (!pipeline) return jsonError("Pipeline not found", 404);

    const contentType = request.headers.get("content-type") || "";
    let buffer: Buffer;
    let filename = "ingest.bin";
    let mimeType = "application/octet-stream";

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file");
      if (!(file instanceof File)) return jsonError("file is required");
      buffer = Buffer.from(await file.arrayBuffer());
      filename = file.name;
      mimeType = file.type || mimeType;
    } else {
      const raw = Buffer.from(await request.arrayBuffer());
      buffer = raw;
      filename = request.headers.get("x-filename") || filename;
      mimeType = contentType.split(";")[0] || mimeType;
    }

    assertAllowedUpload(mimeType, buffer.byteLength);

    const document = await prisma.document.create({
      data: {
        organizationId,
        pipelineId,
        uploadedById: session?.id,
        originalFilename: filename,
        mimeType,
        fileSizeBytes: buffer.byteLength,
        status: "PENDING",
        source: "webhook_ingest",
      },
    });

    const storagePath = await persistUpload({
      buffer,
      documentId: document.id,
      filename,
    });

    await prisma.document.update({
      where: { id: document.id },
      data: { storagePath },
    });

    await enqueueDocumentProcessing(document.id);

    return jsonCreated({
      documentId: document.id,
      status: "PENDING",
      pipelineId,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
