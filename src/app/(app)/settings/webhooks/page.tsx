"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";

type WebhookRow = {
  id: string;
  name: string;
  url: string;
  integrationType: string;
  pipelineId: string | null;
  isActive: boolean;
  secret: string | null;
};

type Template = { type: string; name: string; description: string };
type Pipeline = { id: string; name: string };

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookRow[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [name, setName] = useState("CRM export");
  const [url, setUrl] = useState("https://example.com/hooks/smartdoc");
  const [integrationType, setIntegrationType] = useState("WEBHOOK");
  const [pipelineId, setPipelineId] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const [wh, pl] = await Promise.all([
      fetch("/api/webhooks").then((r) => r.json()),
      fetch("/api/pipelines").then((r) => r.json()),
    ]);
    if (wh.webhooks) setWebhooks(wh.webhooks);
    if (wh.templates) setTemplates(wh.templates);
    if (pl.pipelines) setPipelines(pl.pipelines);
  }

  useEffect(() => {
    void load();
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/webhooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        url,
        integrationType,
        pipelineId: pipelineId || null,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed");
      return;
    }
    await load();
  }

  async function remove(id: string) {
    await fetch(`/api/webhooks/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl">Webhooks & Integrations</h1>
        <p className="mt-1 text-[var(--muted-foreground)]">
          Signed outgoing webhooks for AmoCRM, Bitrix24, 1C and generic HTTP.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {templates.map((t) => (
          <button
            key={t.type}
            type="button"
            onClick={() => setIntegrationType(t.type)}
            className={`rounded-xl border p-4 text-left transition ${
              integrationType === t.type
                ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                : "border-[var(--border)] bg-[var(--surface)]"
            }`}
          >
            <p className="font-medium">{t.name}</p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {t.description}
            </p>
          </button>
        ))}
      </div>

      <form
        onSubmit={onCreate}
        className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="url">Endpoint URL</Label>
          <Input
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pipeline">Pipeline scope (optional)</Label>
          <Select
            id="pipeline"
            value={pipelineId}
            onChange={(e) => setPipelineId(e.target.value)}
          >
            <option value="">All pipelines</option>
            {pipelines.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </div>
        {error && <p className="text-sm text-rose-700">{error}</p>}
        <Button type="submit">Add webhook</Button>
      </form>

      <div className="space-y-3">
        {webhooks.map((wh) => (
          <div
            key={wh.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">
                  {wh.name} · {wh.integrationType}
                </p>
                <p className="mt-1 break-all text-sm text-[var(--muted-foreground)]">
                  {wh.url}
                </p>
                {wh.secret && (
                  <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                    Signature header: X-SmartDoc-Signature
                  </p>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => remove(wh.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
