import type { ToolKind } from "@/lib/roles";

export const TOOL_CATALOG: Record<
  ToolKind,
  {
    kind: ToolKind;
    label: string;
    loginUrl: string;
    homeUrl: string;
    pitch: string;
  }
> = {
  FIGMA: {
    kind: "FIGMA",
    label: "Figma",
    loginUrl: "https://www.figma.com/login",
    homeUrl: "https://www.figma.com/files",
    pitch: "Design files for the whole crew without sharing the owner password.",
  },
  HIGGSFIELD: {
    kind: "HIGGSFIELD",
    label: "Higgsfield",
    loginUrl: "https://higgsfield.ai/",
    homeUrl: "https://higgsfield.ai/",
    pitch: "AI generation credits stay on the team account — freelancers never see billing.",
  },
};

export type StoredCookie = {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  expirationDate?: number;
};

export type ToolSessionPayload = {
  cookies: StoredCookie[];
  capturedAt: string;
  note?: string;
};
