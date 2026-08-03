/**
 * Central place for reading + validating security-sensitive env vars.
 *
 * In production we refuse to boot with the placeholder secrets that ship in
 * `.env.example` / `Dockerfile` — those are public in the repo, so leaving
 * them in place would let anyone forge session tokens or decrypt stored
 * Figma/Higgsfield cookies. In development we fall back to a fixed value so
 * `npm run dev` keeps working without any setup.
 */

const isProd = process.env.NODE_ENV === "production";

const KNOWN_PLACEHOLDERS = new Set([
  "change-me",
  "change-me-in-production",
  "change-me-session-secret-32b",
  "change-me-to-a-long-random-string",
  "studiogate-dev-secret-change-me",
  "studiogate-session-secret-32chars!!",
]);

function readSecret(envVar: string, devFallback: string, minLength: number): string {
  const value = process.env[envVar];

  if (!isProd) {
    return value && value.length >= minLength ? value : devFallback;
  }

  if (!value || value.trim().length === 0) {
    throw new Error(
      `[env] ${envVar} is not set. Add a random ${minLength}+ character value to your production .env before starting StudioGate.`
    );
  }
  if (KNOWN_PLACEHOLDERS.has(value)) {
    throw new Error(
      `[env] ${envVar} is still set to the sample placeholder value. Generate a real secret (e.g. \`openssl rand -hex 32\`) and put it in .env before starting StudioGate.`
    );
  }
  if (value.length < minLength) {
    throw new Error(
      `[env] ${envVar} is too short (${value.length} chars). Use at least ${minLength} random characters.`
    );
  }
  return value;
}

let jwtSecretCache: string | null = null;
let sessionSecretCache: string | null = null;

export function getJwtSecretRaw(): string {
  if (!jwtSecretCache) {
    jwtSecretCache = readSecret("JWT_SECRET", "studiogate-dev-secret-change-me", 32);
  }
  return jwtSecretCache;
}

export function getSessionSecretRaw(): string {
  if (!sessionSecretCache) {
    sessionSecretCache = readSecret(
      "SESSION_SECRET",
      "studiogate-session-secret-32chars!!",
      32
    );
  }
  return sessionSecretCache;
}

/** Trusted origin for lightweight CSRF checks — same value used by cookies/links. */
export function getAppUrl(): string {
  return (process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "").replace(/\/$/, "");
}
