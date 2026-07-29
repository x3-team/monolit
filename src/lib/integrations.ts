import { createHmac, timingSafeEqual } from "crypto";

export type IntegrationPayload = {
  documentId: string;
  pipelineId: string;
  status: string;
  data: Record<string, unknown>;
  metadata?: Record<string, unknown>;
};

export function signPayload(body: string, secret: string) {
  return createHmac("sha256", secret).update(body).digest("hex");
}

export function verifySignature(
  body: string,
  secret: string,
  signature: string | null | undefined
) {
  if (!signature) return false;
  const expected = signPayload(body, secret);
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function sendWebhook(options: {
  url: string;
  secret?: string | null;
  payload: IntegrationPayload;
  integrationType?: string;
}) {
  const bodyObject =
    options.integrationType === "AMOCRM"
      ? {
          leads: {
            update: [
              {
                id: options.payload.metadata?.leadId,
                custom_fields_values: Object.entries(options.payload.data).map(
                  ([field, value]) => ({
                    field_code: field,
                    values: [{ value }],
                  })
                ),
              },
            ],
          },
        }
      : options.integrationType === "BITRIX24"
        ? {
            fields: options.payload.data,
            documentId: options.payload.documentId,
          }
        : options.payload;

  const body = JSON.stringify(bodyObject);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-SmartDoc-Event": "document.processed",
    "User-Agent": "SmartDoc-AI/1.0",
  };

  if (options.secret) {
    headers["X-SmartDoc-Signature"] = signPayload(body, options.secret);
  }

  const response = await fetch(options.url, {
    method: "POST",
    headers,
    body,
  });

  return {
    ok: response.ok,
    status: response.status,
    body: await response.text(),
  };
}

export const INTEGRATION_TEMPLATES = [
  {
    type: "AMOCRM" as const,
    name: "AmoCRM",
    description: "Create/update lead custom fields via AmoCRM API webhook.",
  },
  {
    type: "BITRIX24" as const,
    name: "Bitrix24",
    description: "Trigger Bitrix24 REST inbound webhook with extracted fields.",
  },
  {
    type: "ONE_C" as const,
    name: "1C HTTP",
    description: "POST JSON to a universal 1C HTTP service endpoint.",
  },
  {
    type: "WEBHOOK" as const,
    name: "Generic Webhook",
    description: "Signed JSON webhook for Make, n8n, or custom middleware.",
  },
];
