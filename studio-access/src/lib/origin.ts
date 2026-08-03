import { getAppUrl } from "@/lib/env";
import { AppError } from "@/lib/errors";

/**
 * Lightweight CSRF defense-in-depth for state-changing routes.
 *
 * The session cookie is already `httpOnly` + `SameSite=Lax`, which blocks
 * most cross-site form/fetch submissions on modern browsers. This adds a
 * second check: if the browser *did* send an Origin/Referer header, it must
 * match our configured APP_URL. Requests without either header (same-origin
 * fetches some browsers omit it for, and the Electron desktop app) are
 * allowed through — this is a belt-and-suspenders check, not the only line
 * of defense.
 */
export function assertTrustedOrigin(request: Request) {
  const appUrl = getAppUrl();
  if (!appUrl) return; // not configured — nothing to compare against

  const origin = request.headers.get("origin") || request.headers.get("referer");
  if (!origin) return;

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return;
  }

  let expectedHost: string;
  try {
    expectedHost = new URL(appUrl).host;
  } catch {
    return;
  }

  if (originHost !== expectedHost) {
    throw new AppError("Недоверенный источник запроса", 403);
  }
}
