"use client";

import { useCallback, useState } from "react";
import { Upload } from "lucide-react";
import { Select } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PipelineOption = { id: string; name: string };

export function UploadDropzone({
  pipelines,
  onUploaded,
}: {
  pipelines: PipelineOption[];
  onUploaded?: (documentId: string) => void;
}) {
  const [pipelineId, setPipelineId] = useState(pipelines[0]?.id ?? "");
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File) => {
      if (!pipelineId) {
        setError("Create a pipeline first");
        return;
      }
      setBusy(true);
      setError(null);
      setMessage(null);
      try {
        const form = new FormData();
        form.append("file", file);
        form.append("pipelineId", pipelineId);
        const res = await fetch("/api/v1/documents/upload", {
          method: "POST",
          body: form,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setMessage(`Queued ${file.name}`);
        onUploaded?.(data.document.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setBusy(false);
      }
    },
    [onUploaded, pipelineId]
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="text-sm font-medium">Pipeline</label>
        <Select
          value={pipelineId}
          onChange={(e) => setPipelineId(e.target.value)}
          className="sm:max-w-xs"
          disabled={!pipelines.length}
        >
          {pipelines.length === 0 ? (
            <option value="">No pipelines</option>
          ) : (
            pipelines.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))
          )}
        </Select>
      </div>

      <div
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-10 text-center transition-colors",
          dragging && "border-[var(--accent)] bg-[var(--accent-soft)]"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void upload(file);
        }}
      >
        <Upload className="mb-3 h-8 w-8 text-[var(--accent)]" />
        <p className="font-medium">Drag & drop a document</p>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          PDF, PNG, JPG, TIFF · max 20MB
        </p>
        <label className="mt-4 inline-flex h-10 cursor-pointer items-center justify-center rounded-md bg-[var(--primary)] px-4 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90">
          <input
            type="file"
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg,.tif,.tiff,application/pdf,image/*"
            disabled={busy || !pipelineId}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void upload(file);
              e.target.value = "";
            }}
          />
          {busy ? "Uploading…" : "Choose file"}
        </label>
      </div>

      {message && <p className="text-sm text-emerald-700">{message}</p>}
      {error && <p className="text-sm text-rose-700">{error}</p>}
    </div>
  );
}
