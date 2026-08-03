/**
 * Client-facing shapes for the data our API routes return as JSON (Dates
 * become ISO strings once serialized). Kept free of any runtime imports
 * (Prisma, etc.) so it is safe to import from "use client" components as
 * `import type`.
 */

import type { Role, ToolKind } from "@/lib/roles";
export type { Role, ToolKind };

export type WorkspaceTool = {
  id: string;
  kind: ToolKind;
  label: string;
  connected: boolean;
  homeUrl: string;
  loginUrl: string;
  sessionUpdatedAt?: string | null;
};

export type WorkspaceMember = {
  id: string;
  email: string;
  name: string;
  role: string;
  revokedAt: string | null;
  tools: string[];
};

export type AccessLogEntry = {
  id: string;
  action: string;
  createdAt: string;
  user?: { name: string; email: string } | null;
  toolConnection?: { kind: string; label: string } | null;
};

export type WorkspaceProject = {
  id: string;
  name: string;
  clientName: string | null;
  budgetRub: number | null;
};

export type CostReportProject = {
  id: string;
  name: string;
  clientName: string | null;
  budgetRub: number | null;
  netCredits: number;
  monthCredits?: number;
  costRub: number;
  monthCostRub?: number;
  marginRub: number | null;
  budgetUsedPct?: number | null;
  eventCount: number;
};

export type CostReportEvent = {
  id: string;
  kind: string;
  credits: number;
  description: string | null;
  occurredAt: string;
  project: { id: string; name: string } | null;
  user: { name: string; email: string } | null;
};

export type CostReport = {
  creditPriceRub: number;
  costSyncMode: string;
  costSyncedAt?: string | null;
  month?: {
    label: string;
    credits: number;
    costRub: number;
  };
  totals?: {
    costRub: number;
    budgetRub: number | null;
    budgetUsedPct: number | null;
  };
  projects: CostReportProject[];
  unallocatedCredits: number;
  recent: CostReportEvent[];
};
