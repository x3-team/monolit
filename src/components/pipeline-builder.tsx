"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";

type FieldDraft = {
  key: string;
  targetFieldName: string;
  dataType: "STRING" | "NUMBER" | "DATE" | "BOOLEAN";
  description: string;
  promptHint: string;
  required: boolean;
  systemFieldTarget: string;
};

const emptyField = (): FieldDraft => ({
  key: crypto.randomUUID(),
  targetFieldName: "",
  dataType: "STRING",
  description: "",
  promptHint: "",
  required: false,
  systemFieldTarget: "",
});

export function PipelineBuilder({
  initial,
}: {
  initial?: {
    id?: string;
    name: string;
    description?: string | null;
    maskPii?: boolean;
    fields: Array<{
      targetFieldName: string;
      dataType: "STRING" | "NUMBER" | "DATE" | "BOOLEAN";
      description?: string | null;
      promptHint?: string | null;
      required?: boolean;
      systemFieldTarget?: string | null;
    }>;
  };
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [maskPii, setMaskPii] = useState(initial?.maskPii ?? false);
  const [fields, setFields] = useState<FieldDraft[]>(
    initial?.fields?.length
      ? initial.fields.map((f) => ({
          key: crypto.randomUUID(),
          targetFieldName: f.targetFieldName,
          dataType: f.dataType,
          description: f.description ?? "",
          promptHint: f.promptHint ?? "",
          required: f.required ?? false,
          systemFieldTarget: f.systemFieldTarget ?? "",
        }))
      : [emptyField()]
  );
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    setError(null);
    try {
      const payload = {
        name,
        description,
        maskPii,
        fields: fields
          .filter((f) => f.targetFieldName.trim())
          .map((f, index) => ({
            targetFieldName: f.targetFieldName.trim(),
            dataType: f.dataType,
            description: f.description || null,
            promptHint: f.promptHint || null,
            required: f.required,
            systemFieldTarget: f.systemFieldTarget || null,
            sortOrder: index,
          })),
      };

      const res = await fetch(
        initial?.id ? `/api/pipelines/${initial.id}` : "/api/pipelines",
        {
          method: initial?.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push(`/pipelines/${data.pipeline.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Pipeline name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Supplier Invoices"
          />
        </div>
        <div className="flex items-end gap-2 pb-2">
          <input
            id="maskPii"
            type="checkbox"
            checked={maskPii}
            onChange={(e) => setMaskPii(e.target.checked)}
            className="h-4 w-4"
          />
          <Label htmlFor="maskPii">Mask PII before LLM call</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What documents does this pipeline process?"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg">JSON Schema Mapping</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setFields((prev) => [...prev, emptyField()])}
          >
            <Plus className="h-4 w-4" />
            Add field
          </Button>
        </div>

        {fields.map((field, index) => (
          <div
            key={field.key}
            className="grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 md:grid-cols-2"
          >
            <div className="space-y-2">
              <Label>Target field name</Label>
              <Input
                value={field.targetFieldName}
                onChange={(e) =>
                  setFields((prev) =>
                    prev.map((f, i) =>
                      i === index
                        ? { ...f, targetFieldName: e.target.value }
                        : f
                    )
                  )
                }
                placeholder="inn_seller"
              />
            </div>
            <div className="space-y-2">
              <Label>Data type</Label>
              <Select
                value={field.dataType}
                onChange={(e) =>
                  setFields((prev) =>
                    prev.map((f, i) =>
                      i === index
                        ? {
                            ...f,
                            dataType: e.target.value as FieldDraft["dataType"],
                          }
                        : f
                    )
                  )
                }
              >
                <option value="STRING">string</option>
                <option value="NUMBER">number</option>
                <option value="DATE">date</option>
                <option value="BOOLEAN">boolean</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description / prompt hint</Label>
              <Input
                value={field.promptHint || field.description}
                onChange={(e) =>
                  setFields((prev) =>
                    prev.map((f, i) =>
                      i === index
                        ? {
                            ...f,
                            promptHint: e.target.value,
                            description: e.target.value,
                          }
                        : f
                    )
                  )
                }
                placeholder="10 or 12 digit tax ID of the issuing company"
              />
            </div>
            <div className="space-y-2">
              <Label>System field target</Label>
              <Input
                value={field.systemFieldTarget}
                onChange={(e) =>
                  setFields((prev) =>
                    prev.map((f, i) =>
                      i === index
                        ? { ...f, systemFieldTarget: e.target.value }
                        : f
                    )
                  )
                }
                placeholder="AmoCRM 12345 / 1C Контрагент_ИНН"
              />
            </div>
            <div className="flex items-center justify-between md:col-span-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) =>
                    setFields((prev) =>
                      prev.map((f, i) =>
                        i === index ? { ...f, required: e.target.checked } : f
                      )
                    )
                  }
                />
                Required
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  setFields((prev) => prev.filter((_, i) => i !== index))
                }
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-rose-700">{error}</p>}

      <Button type="button" onClick={save} disabled={busy || !name.trim()}>
        {busy ? "Saving…" : initial?.id ? "Update pipeline" : "Create pipeline"}
      </Button>
    </div>
  );
}
