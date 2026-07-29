/**
 * Yandex Cloud Vision OCR + YandexGPT wrapper.
 * When credentials are missing, runs in deterministic mock mode for local/MVP demos.
 */

export type SchemaFieldDef = {
  targetFieldName: string;
  dataType: "STRING" | "NUMBER" | "DATE" | "BOOLEAN";
  description?: string | null;
  promptHint?: string | null;
  required?: boolean;
};

export type OcrResult = {
  text: string;
  blocks: Array<{ text: string }>;
  mock: boolean;
};

export type ExtractionResult = {
  data: Record<string, unknown>;
  confidence: number;
  rawResponse: string;
  mock: boolean;
};

function hasYandexCredentials() {
  return Boolean(
    process.env.YANDEX_API_KEY ||
      (process.env.YANDEX_IAM_TOKEN && process.env.YANDEX_FOLDER_ID)
  );
}

function authHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (process.env.YANDEX_API_KEY) {
    headers.Authorization = `Api-Key ${process.env.YANDEX_API_KEY}`;
  } else if (process.env.YANDEX_IAM_TOKEN) {
    headers.Authorization = `Bearer ${process.env.YANDEX_IAM_TOKEN}`;
  }
  if (process.env.YANDEX_FOLDER_ID) {
    headers["x-folder-id"] = process.env.YANDEX_FOLDER_ID;
  }
  return headers;
}

function mimeToOcrModel(mimeType: string): string {
  if (mimeType === "application/pdf") return "page";
  return "page";
}

function buildMockOcrText(filename: string): string {
  return [
    "СЧЕТ-ФАКТУРА № 42 от 15.03.2026",
    "Продавец: ООО Ромашка",
    "ИНН продавца: 7707083893",
    "КПП: 770701001",
    "Покупатель: ООО Пример",
    "ИНН покупателя: 5024087886",
    "Сумма без НДС: 10000.00",
    "НДС 20%: 2000.00",
    "Итого: 12000.00",
    `Файл: ${filename}`,
  ].join("\n");
}

function buildMockExtraction(
  fields: SchemaFieldDef[],
  ocrText: string
): Record<string, unknown> {
  const lower = ocrText.toLowerCase();
  const data: Record<string, unknown> = {};

  for (const field of fields) {
    const name = field.targetFieldName.toLowerCase();
    if (name.includes("inn") && name.includes("seller")) {
      data[field.targetFieldName] = "7707083893";
    } else if (name.includes("inn") && name.includes("buyer")) {
      data[field.targetFieldName] = "5024087886";
    } else if (name.includes("inn")) {
      const match = ocrText.match(/\b\d{10}(\d{2})?\b/);
      data[field.targetFieldName] = match?.[0] ?? "7707083893";
    } else if (name.includes("vat") || name.includes("nds") || name.includes("ндс")) {
      data[field.targetFieldName] = field.dataType === "NUMBER" ? 2000 : "2000.00";
    } else if (name.includes("net") || name.includes("без") || name.includes("without")) {
      data[field.targetFieldName] = field.dataType === "NUMBER" ? 10000 : "10000.00";
    } else if (name.includes("total") || name.includes("итого")) {
      data[field.targetFieldName] =
        field.dataType === "NUMBER" ? 12000 : "12000.00";
    } else if (name.includes("amount")) {
      data[field.targetFieldName] =
        field.dataType === "NUMBER" ? 12000 : "12000.00";
    } else if (name.includes("date") || name.includes("дата")) {
      data[field.targetFieldName] = "2026-03-15";
    } else if (name.includes("number") || name.includes("номер")) {
      data[field.targetFieldName] = "42";
    } else if (name.includes("seller") || name.includes("продавец")) {
      data[field.targetFieldName] = "ООО Ромашка";
    } else if (name.includes("buyer") || name.includes("покупатель")) {
      data[field.targetFieldName] = "ООО Пример";
    } else if (field.dataType === "BOOLEAN") {
      data[field.targetFieldName] = lower.includes("true");
    } else if (field.dataType === "NUMBER") {
      data[field.targetFieldName] = 0;
    } else if (field.dataType === "DATE") {
      data[field.targetFieldName] = "2026-03-15";
    } else {
      data[field.targetFieldName] = null;
    }
  }

  return data;
}

function extractJsonObject(text: string): Record<string, unknown> {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1]?.trim() ?? trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("YandexGPT response did not contain a JSON object");
  }
  return JSON.parse(candidate.slice(start, end + 1)) as Record<string, unknown>;
}

export class YandexAiService {
  async recognizeText(
    fileBuffer: Buffer,
    mimeType: string,
    filename: string
  ): Promise<OcrResult> {
    if (!hasYandexCredentials()) {
      const text = buildMockOcrText(filename);
      return {
        text,
        blocks: text.split("\n").map((line) => ({ text: line })),
        mock: true,
      };
    }

    const url = process.env.YANDEX_OCR_URL!;
    const body = {
      mimeType,
      languageCodes: ["ru", "en"],
      model: mimeToOcrModel(mimeType),
      content: fileBuffer.toString("base64"),
    };

    const response = await fetch(url, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Yandex OCR failed (${response.status}): ${errText}`);
    }

    const payload = (await response.json()) as {
      result?: {
        textAnnotation?: {
          fullText?: string;
          blocks?: Array<{ lines?: Array<{ text?: string }> }>;
        };
      };
    };

    const annotation = payload.result?.textAnnotation;
    const blocks =
      annotation?.blocks?.flatMap((block) =>
        (block.lines ?? []).map((line) => ({ text: line.text ?? "" }))
      ) ?? [];
    const text =
      annotation?.fullText ||
      blocks.map((b) => b.text).filter(Boolean).join("\n");

    return { text, blocks, mock: false };
  }

  async extractEntities(
    ocrText: string,
    fields: SchemaFieldDef[]
  ): Promise<ExtractionResult> {
    if (!hasYandexCredentials()) {
      const data = buildMockExtraction(fields, ocrText);
      return {
        data,
        confidence: 0.82,
        rawResponse: JSON.stringify(data, null, 2),
        mock: true,
      };
    }

    const folderId = process.env.YANDEX_FOLDER_ID;
    const modelName = process.env.YANDEX_GPT_MODEL || "yandexgpt-lite";
    const modelUri = folderId
      ? `gpt://${folderId}/${modelName}`
      : modelName;

    const schemaDescription = fields
      .map((f) => {
        const bits = [
          `- ${f.targetFieldName} (${f.dataType.toLowerCase()})`,
          f.required ? "required" : "optional",
          f.description ? `desc: ${f.description}` : null,
          f.promptHint ? `hint: ${f.promptHint}` : null,
        ].filter(Boolean);
        return bits.join(" | ");
      })
      .join("\n");

    const systemPrompt = [
      "You are a document information extraction engine.",
      "Extract entities into valid JSON according to the schema provided.",
      "Do not hallucinate. If a value is missing, use null.",
      "Output ONLY JSON. No markdown. No commentary.",
    ].join(" ");

    const userPrompt = [
      "Target schema fields:",
      schemaDescription,
      "",
      "OCR text:",
      ocrText.slice(0, 24000),
    ].join("\n");

    const response = await fetch(process.env.YANDEX_GPT_URL!, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        modelUri,
        completionOptions: {
          stream: false,
          temperature: 0.1,
          maxTokens: 2000,
        },
        messages: [
          { role: "system", text: systemPrompt },
          { role: "user", text: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`YandexGPT failed (${response.status}): ${errText}`);
    }

    const payload = (await response.json()) as {
      result?: {
        alternatives?: Array<{ message?: { text?: string } }>;
      };
    };

    const rawResponse =
      payload.result?.alternatives?.[0]?.message?.text?.trim() ?? "";
    const data = extractJsonObject(rawResponse);

    return {
      data,
      confidence: 0.9,
      rawResponse,
      mock: false,
    };
  }
}

export const yandexAiService = new YandexAiService();
