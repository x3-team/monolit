/**
 * Optional PII masking before LLM calls.
 * Hashes names / passport-like identifiers while preserving structure for extraction demos.
 */

import { createHash } from "crypto";

const PASSPORT_RE = /\b\d{4}\s?\d{6}\b/g;
const NAME_HINT_RE =
  /\b([А-ЯЁ][а-яё]+)\s+([А-ЯЁ][а-яё]+)(?:\s+([А-ЯЁ][а-яё]+))?\b/g;

function hashToken(value: string) {
  return `PII_${createHash("sha256").update(value).digest("hex").slice(0, 12)}`;
}

export function maskPiiText(input: string): string {
  let output = input.replace(PASSPORT_RE, (match) => hashToken(match));
  output = output.replace(NAME_HINT_RE, (match) => {
    // Keep short tokens / company-like uppercase lines alone
    if (match.length < 5) return match;
    return hashToken(match);
  });
  return output;
}
