import type { SchemaFieldDef } from "@/lib/yandex-ai.service";

export type ValidationIssue = {
  field?: string;
  code: string;
  message: string;
};

/** Russian INN checksum validation for 10-digit (org) and 12-digit (person). */
export function validateInn(inn: string): boolean {
  const digits = inn.replace(/\D/g, "");
  if (!/^\d{10}$|^\d{12}$/.test(digits)) return false;

  const n = digits.split("").map(Number);
  if (digits.length === 10) {
    const coeffs = [2, 4, 10, 3, 5, 9, 4, 6, 8];
    const sum = coeffs.reduce((acc, c, i) => acc + c * n[i], 0);
    const check = (sum % 11) % 10;
    return check === n[9];
  }

  const coeffs11 = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
  const coeffs12 = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
  const check11 = (coeffs11.reduce((acc, c, i) => acc + c * n[i], 0) % 11) % 10;
  const check12 = (coeffs12.reduce((acc, c, i) => acc + c * n[i], 0) % 11) % 10;
  return check11 === n[10] && check12 === n[11];
}

function coerceValue(
  value: unknown,
  dataType: SchemaFieldDef["dataType"]
): { ok: boolean; value: unknown; message?: string } {
  if (value === null || value === undefined || value === "") {
    return { ok: true, value: null };
  }

  switch (dataType) {
    case "STRING":
      return { ok: true, value: String(value) };
    case "NUMBER": {
      const num =
        typeof value === "number"
          ? value
          : Number(String(value).replace(/\s/g, "").replace(",", "."));
      if (Number.isNaN(num)) {
        return { ok: false, value, message: "Expected a number" };
      }
      return { ok: true, value: num };
    }
    case "DATE": {
      const str = String(value);
      const parsed = Date.parse(str);
      if (Number.isNaN(parsed)) {
        // Try DD.MM.YYYY
        const m = str.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
        if (m) {
          return { ok: true, value: `${m[3]}-${m[2]}-${m[1]}` };
        }
        return { ok: false, value, message: "Expected a date" };
      }
      return { ok: true, value: new Date(parsed).toISOString().slice(0, 10) };
    }
    case "BOOLEAN": {
      if (typeof value === "boolean") return { ok: true, value };
      const s = String(value).toLowerCase();
      if (["true", "1", "yes", "да"].includes(s)) return { ok: true, value: true };
      if (["false", "0", "no", "нет"].includes(s)) return { ok: true, value: false };
      return { ok: false, value, message: "Expected a boolean" };
    }
    default:
      return { ok: true, value };
  }
}

export function validateExtractedData(
  data: Record<string, unknown>,
  fields: SchemaFieldDef[],
  confidence: number
): {
  normalized: Record<string, unknown>;
  issues: ValidationIssue[];
  needsReview: boolean;
} {
  const normalized: Record<string, unknown> = { ...data };
  const issues: ValidationIssue[] = [];

  for (const field of fields) {
    const raw = data[field.targetFieldName];
    if (
      (raw === null || raw === undefined || raw === "") &&
      field.required
    ) {
      issues.push({
        field: field.targetFieldName,
        code: "REQUIRED",
        message: `Field ${field.targetFieldName} is required`,
      });
      continue;
    }

    const coerced = coerceValue(raw, field.dataType);
    if (!coerced.ok) {
      issues.push({
        field: field.targetFieldName,
        code: "TYPE",
        message: coerced.message ?? "Invalid type",
      });
    } else {
      normalized[field.targetFieldName] = coerced.value;
    }

    const name = field.targetFieldName.toLowerCase();
    if (name.includes("inn") && typeof coerced.value === "string" && coerced.value) {
      if (!validateInn(coerced.value)) {
        issues.push({
          field: field.targetFieldName,
          code: "INN_CHECKSUM",
          message: `INN checksum failed for ${field.targetFieldName}`,
        });
      }
    }
  }

  const numberMap = new Map<string, number>();
  for (const [key, value] of Object.entries(normalized)) {
    if (typeof value === "number") numberMap.set(key.toLowerCase(), value);
  }

  const total =
    numberMap.get("total_amount") ??
    numberMap.get("total") ??
    numberMap.get("итого");
  const net =
    numberMap.get("net_amount") ??
    numberMap.get("net") ??
    numberMap.get("amount_without_vat");
  const vat =
    numberMap.get("vat_amount") ??
    numberMap.get("vat") ??
    numberMap.get("nds");

  if (
    typeof total === "number" &&
    typeof net === "number" &&
    typeof vat === "number"
  ) {
    const expected = Math.round((net + vat) * 100) / 100;
    if (Math.abs(expected - total) > 0.05) {
      issues.push({
        code: "AMOUNT_MISMATCH",
        message: `Total_Amount (${total}) != Net (${net}) + VAT (${vat})`,
      });
    }
  }

  if (confidence < 0.7) {
    issues.push({
      code: "LOW_CONFIDENCE",
      message: `Extraction confidence is low (${confidence.toFixed(2)})`,
    });
  }

  const needsReview = issues.length > 0;
  return { normalized, issues, needsReview };
}
