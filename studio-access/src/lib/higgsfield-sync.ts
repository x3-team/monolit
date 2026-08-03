import { encryptJson, decryptJson } from "@/lib/crypto";
import { attributeCredits, estimateDemoSpendForSessions, type ImportedTx } from "@/lib/costs";
import { prisma } from "@/lib/prisma";

type ApiKeyPayload = { key: string };

/**
 * Store Cloud API credentials (KEY_ID:KEY_SECRET) encrypted on the workspace.
 * Web UI "unlimited" plans may not appear here — Cloud API is credit-metered.
 */
export function encryptApiKey(key: string) {
  return encryptJson({ key: key.trim() } satisfies ApiKeyPayload);
}

export function decryptApiKey(enc: string | null | undefined): string | null {
  if (!enc) return null;
  try {
    return decryptJson<ApiKeyPayload>(enc).key || null;
  } catch {
    return null;
  }
}

/**
 * Try Higgsfield Cloud account endpoints. Shape may evolve — we normalize loosely.
 * Falls back gracefully so demo mode still works.
 */
export async function fetchCloudTransactions(apiKey: string): Promise<ImportedTx[]> {
  const headers = {
    Authorization: `Key ${apiKey}`,
    "User-Agent": "studiogate-server/0.1",
    Accept: "application/json",
  };

  const candidates = [
    "https://api.higgsfield.ai/v1/account/transactions?size=100",
    "https://cloud.higgsfield.ai/api/v1/account/transactions?size=100",
    "https://platform.higgsfield.ai/v1/billing/transactions?limit=100",
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url, { headers, cache: "no-store" });
      if (!res.ok) continue;
      const data = (await res.json()) as unknown;
      const rows = extractTxRows(data);
      if (rows.length) return rows;
    } catch {
      // try next
    }
  }
  return [];
}

function extractTxRows(data: unknown): ImportedTx[] {
  const root = data as Record<string, unknown>;
  const list = (Array.isArray(data)
    ? data
    : Array.isArray(root?.transactions)
      ? root.transactions
      : Array.isArray(root?.items)
        ? root.items
        : Array.isArray(root?.data)
          ? root.data
          : []) as Record<string, unknown>[];

  return list
    .map((row, i) => {
      const id = String(
        row.id || row.transaction_id || row.uuid || row.cursor || `row-${i}`
      );
      const credits = Number(
        row.credits ?? row.amount ?? row.delta ?? row.credit_delta ?? 0
      );
      const kind = String(row.kind || row.type || row.direction || "spend");
      const occurredAt = String(
        row.occurred_at ||
          row.created_at ||
          row.timestamp ||
          row.date ||
          new Date().toISOString()
      );
      const description = String(
        row.description || row.title || row.model || row.reason || ""
      );
      return {
        id,
        kind: credits < 0 ? "spend" : kind,
        credits: Math.abs(credits),
        description,
        occurredAt,
        raw: row,
      } satisfies ImportedTx;
    })
    .filter((r) => r.id && r.credits > 0);
}

export async function syncWorkspaceCosts(workspaceId: string, opts?: {
  transactions?: ImportedTx[];
}) {
  const workspace = await prisma.workspace.findUniqueOrThrow({
    where: { id: workspaceId },
  });
  const tool = await prisma.toolConnection.findFirst({
    where: { workspaceId, kind: "HIGGSFIELD" },
  });
  if (!tool) {
    return { ok: false as const, error: "Инструмент Higgsfield не настроен" };
  }

  let imported = 0;
  let source: "api" | "import" | "demo" = "demo";

  if (opts?.transactions?.length) {
    source = "import";
    for (const tx of opts.transactions) {
      const r = await attributeCredits({
        workspaceId,
        toolConnectionId: tool.id,
        tx,
      });
      imported += r.created;
    }
  } else if (workspace.costSyncMode === "api") {
    const key = decryptApiKey(workspace.higgsfieldApiKeyEnc);
    if (!key) {
      return {
        ok: false as const,
        error: "Нет ключа облачного API — сохраните KEY_ID:KEY_SECRET в настройках затрат",
      };
    }
    const txs = await fetchCloudTransactions(key);
    if (!txs.length) {
      // API unreachable or empty — still refresh demo estimates so UI isn't blank
      const demo = await estimateDemoSpendForSessions(workspaceId);
      source = "demo";
      imported = demo.estimated;
      await prisma.workspace.update({
        where: { id: workspaceId },
        data: { costSyncedAt: new Date() },
      });
      return {
        ok: true as const,
        source,
        imported,
        warning:
          "Облачный API не вернул транзакции — показаны оценки по сессиям. Можно вставить JSON-экспорт позже.",
      };
    }
    source = "api";
    for (const tx of txs) {
      const r = await attributeCredits({
        workspaceId,
        toolConnectionId: tool.id,
        tx,
      });
      imported += r.created;
    }
  } else {
    const demo = await estimateDemoSpendForSessions(workspaceId);
    imported = demo.estimated;
    source = "demo";
  }

  await prisma.workspace.update({
    where: { id: workspaceId },
    data: { costSyncedAt: new Date() },
  });

  await prisma.accessLog.create({
    data: {
      workspaceId,
      action: "costs.synced",
      metadata: JSON.stringify({ source, imported }),
    },
  });

  return { ok: true as const, source, imported };
}
