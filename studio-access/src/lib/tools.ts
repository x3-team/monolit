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
    pitch:
      "Файлы дизайна для всей команды — без передачи пароля владельца.",
  },
  HIGGSFIELD: {
    kind: "HIGGSFIELD",
    label: "Higgsfield",
    loginUrl: "https://higgsfield.ai/",
    homeUrl: "https://higgsfield.ai/",
    pitch:
      "Кредиты генераций остаются на командном аккаунте — фрилансер не видит биллинг.",
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
  localStorage?: Record<string, string | null>;
};
