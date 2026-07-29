"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";

type SchemaField = {
  targetFieldName: string;
  dataType: string;
  description?: string | null;
};

type DocumentView = {
  id: string;
  status: string;
  originalFilename: string;
  mimeType: string;
  ocrText?: string | null;
  extractedData?: Record<string, unknown> | null;
  editedData?: Record<string, unknown> | null;
  validationErrors?: Array<{ field?: string; message: string }> | null;
  confidenceScore?: number | null;
  pipeline: {
    name: string;
    schemaFields: SchemaField[];
  };
};

export function DocumentReview({ document }: { document: DocumentView }) {
  const router = useRouter();
  const initial = useMemo(
    () =>
      (document.editedData as Record<string, unknown> | null) ??
      (document.extractedData as Record<string, unknown> | null) ??
      {},
    [document.editedData, document.extractedData]
  );
  const [form, setForm] = useState<Record<string, string>>(() => {
    const next: Record<string, string> = {};
    for (const field of document.pipeline.schemaFields) {
      const value = initial[field.targetFieldName];
      next[field.targetFieldName] =
        value === null || value === undefined ? "" : String(value);
    }
    return next;
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function save(confirmAndSend: boolean) {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const editedData: Record<string, unknown> = {};
      for (const field of document.pipeline.schemaFields) {
        const raw = form[field.targetFieldName] ?? "";
        if (raw === "") {
          editedData[field.targetFieldName] = null;
        } else if (field.dataType === "NUMBER") {
          editedData[field.targetFieldName] = Number(raw);
        } else if (field.dataType === "BOOLEAN") {
          editedData[field.targetFieldName] = raw === "true";
        } else {
          editedData[field.targetFieldName] = raw;
        }
      }

      const res = await fetch(`/api/documents/${document.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ editedData, confirmAndSend }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setMessage(
        confirmAndSend
          ? "Confirmed and sent to CRM/ERP webhooks"
          : "Changes saved"
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl">{document.originalFilename}</h1>
        <StatusBadge status={document.status} />
        {typeof document.confidenceScore === "number" && (
          <span className="text-sm text-[var(--muted-foreground)]">
            confidence {(document.confidenceScore * 100).toFixed(0)}%
          </span>
        )}
      </div>
      <p className="text-sm text-[var(--muted-foreground)]">
        Pipeline: {document.pipeline.name}
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h2 className="mb-3 font-display text-lg">Document / OCR preview</h2>
          <pre className="max-h-[560px] overflow-auto whitespace-pre-wrap rounded-lg bg-[var(--muted)] p-3 text-xs leading-relaxed">
            {document.ocrText || "OCR text will appear after processing."}
          </pre>
        </section>

        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h2 className="mb-3 font-display text-lg">Extracted fields</h2>
          <div className="space-y-3">
            {document.pipeline.schemaFields.map((field) => (
              <div key={field.targetFieldName} className="space-y-1">
                <Label htmlFor={field.targetFieldName}>
                  {field.targetFieldName}
                  <span className="ml-2 text-xs text-[var(--muted-foreground)]">
                    {field.dataType.toLowerCase()}
                  </span>
                </Label>
                <Input
                  id={field.targetFieldName}
                  value={form[field.targetFieldName] ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      [field.targetFieldName]: e.target.value,
                    }))
                  }
                />
              </div>
            ))}
          </div>

          {Array.isArray(document.validationErrors) &&
            document.validationErrors.length > 0 && (
              <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-orange-900">
                <p className="mb-1 font-medium">Validation issues</p>
                <ul className="list-disc space-y-1 pl-5">
                  {document.validationErrors.map((issue, i) => (
                    <li key={`${issue.field}-${i}`}>
                      {issue.field ? `${issue.field}: ` : ""}
                      {issue.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={busy}
              onClick={() => save(false)}
            >
              Save edits
            </Button>
            <Button type="button" disabled={busy} onClick={() => save(true)}>
              Confirm & Send to 1C/CRM
            </Button>
          </div>
          {message && <p className="mt-3 text-sm text-emerald-700">{message}</p>}
          {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}
        </section>
      </div>
    </div>
  );
}
