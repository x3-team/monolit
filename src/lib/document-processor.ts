import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { yandexAiService } from "@/lib/yandex-ai.service";
import { maskPiiText } from "@/lib/pii";
import { validateExtractedData } from "@/lib/validation";
import { sendWebhook } from "@/lib/integrations";
import type { SchemaFieldDef } from "@/lib/yandex-ai.service";

const ALLOWED_MIME = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/tiff",
]);

export function getUploadDir() {
  return path.resolve(process.env.UPLOAD_DIR || "./storage/uploads");
}

export function getMaxUploadBytes() {
  return Number(process.env.MAX_UPLOAD_BYTES || 20 * 1024 * 1024);
}

export function assertAllowedUpload(mimeType: string, size: number) {
  if (!ALLOWED_MIME.has(mimeType)) {
    throw new Error("Unsupported file format. Allowed: PDF, PNG, JPG, TIFF");
  }
  if (size > getMaxUploadBytes()) {
    throw new Error("File exceeds max size of 20MB");
  }
}

export async function persistUpload(options: {
  buffer: Buffer;
  documentId: string;
  filename: string;
}) {
  const dir = path.join(getUploadDir(), options.documentId);
  await mkdir(dir, { recursive: true });
  const safeName = options.filename.replace(/[^\w.\-()+ ]+/g, "_");
  const storagePath = path.join(dir, safeName);
  await writeFile(storagePath, options.buffer);
  return storagePath;
}

export async function deleteTempFile(storagePath?: string | null) {
  if (!storagePath) return;
  try {
    await unlink(storagePath);
  } catch {
    // ignore missing files
  }
}

export async function processDocumentJob(documentId: string) {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: {
      pipeline: {
        include: {
          schemaFields: { orderBy: { sortOrder: "asc" } },
          webhooks: { where: { isActive: true } },
        },
      },
      organization: {
        include: {
          webhooks: {
            where: { isActive: true, pipelineId: null },
          },
        },
      },
    },
  });

  if (!document) {
    throw new Error(`Document ${documentId} not found`);
  }

  await prisma.document.update({
    where: { id: documentId },
    data: { status: "PROCESSING", errorMessage: null },
  });

  try {
    if (!document.storagePath) {
      throw new Error("Document storage path is missing");
    }

    const { readFile } = await import("fs/promises");
    const buffer = await readFile(document.storagePath);

    const ocr = await yandexAiService.recognizeText(
      buffer,
      document.mimeType,
      document.originalFilename
    );

    const ocrForLlm = document.pipeline.maskPii
      ? maskPiiText(ocr.text)
      : ocr.text;

    const fields: SchemaFieldDef[] = document.pipeline.schemaFields.map((f) => ({
      targetFieldName: f.targetFieldName,
      dataType: f.dataType,
      description: f.description,
      promptHint: f.promptHint,
      required: f.required,
    }));

    const extraction = await yandexAiService.extractEntities(ocrForLlm, fields);
    const { normalized, issues, needsReview } = validateExtractedData(
      extraction.data,
      fields,
      extraction.confidence
    );

    const status = needsReview ? "NEEDS_REVIEW" : "SUCCESS";

    const updated = await prisma.document.update({
      where: { id: documentId },
      data: {
        status,
        ocrText: ocr.text,
        extractedData: normalized as Prisma.InputJsonValue,
        editedData: normalized as Prisma.InputJsonValue,
        validationErrors: issues as Prisma.InputJsonValue,
        confidenceScore: extraction.confidence,
        processedAt: new Date(),
        errorMessage: null,
      },
    });

    // Privacy: remove temp file after processing
    await deleteTempFile(document.storagePath);
    await prisma.document.update({
      where: { id: documentId },
      data: { storagePath: null },
    });

    await prisma.auditLog.create({
      data: {
        organizationId: document.organizationId,
        action: "document.processed",
        entityType: "Document",
        entityId: documentId,
        metadata: {
          status,
          mockOcr: ocr.mock,
          mockLlm: extraction.mock,
          issueCount: issues.length,
        },
      },
    });

    if (status === "SUCCESS") {
      await exportDocument(documentId);
    }

    return updated;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Processing failed";
    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: "FAILED",
        errorMessage: message,
      },
    });
    await prisma.auditLog.create({
      data: {
        organizationId: document.organizationId,
        action: "document.failed",
        entityType: "Document",
        entityId: documentId,
        metadata: { message },
      },
    });
    throw error;
  }
}

export async function exportDocument(documentId: string) {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: {
      pipeline: {
        include: {
          webhooks: { where: { isActive: true } },
          schemaFields: true,
        },
      },
      organization: {
        include: {
          webhooks: { where: { isActive: true, pipelineId: null } },
        },
      },
    },
  });

  if (!document) throw new Error("Document not found");

  const data =
    (document.editedData as Record<string, unknown> | null) ??
    (document.extractedData as Record<string, unknown> | null) ??
    {};

  const targets = [
    ...document.pipeline.webhooks,
    ...document.organization.webhooks,
  ];

  const fieldTargets = Object.fromEntries(
    document.pipeline.schemaFields
      .filter((f) => f.systemFieldTarget)
      .map((f) => [f.targetFieldName, f.systemFieldTarget])
  );

  const results = [];
  for (const webhook of targets) {
    try {
      const result = await sendWebhook({
        url: webhook.url,
        secret: webhook.secret,
        integrationType: webhook.integrationType,
        payload: {
          documentId: document.id,
          pipelineId: document.pipelineId,
          status: document.status,
          data,
          metadata: {
            filename: document.originalFilename,
            confidence: document.confidenceScore,
            systemFieldTargets: fieldTargets,
          },
        },
      });
      results.push({ webhookId: webhook.id, ...result });
    } catch (error) {
      results.push({
        webhookId: webhook.id,
        ok: false,
        status: 0,
        body: error instanceof Error ? error.message : "Webhook failed",
      });
    }
  }

  await prisma.document.update({
    where: { id: documentId },
    data: {
      status: "SUCCESS",
      exportedAt: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      organizationId: document.organizationId,
      action: "document.exported",
      entityType: "Document",
      entityId: documentId,
      metadata: { results },
    },
  });

  return results;
}
