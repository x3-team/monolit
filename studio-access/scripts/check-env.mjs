#!/usr/bin/env node
/**
 * Runs before `next start` (via the npm "prestart" hook and in the Docker
 * CMD). Only acts when NODE_ENV=production — dev/test keep working with the
 * built-in fallbacks from src/lib/env.ts.
 *
 * Fails fast with a clear message instead of letting the server boot with
 * the sample secrets from .env.example / Dockerfile, which are public in
 * this repo.
 */

if (process.env.NODE_ENV !== "production") {
  process.exit(0);
}

const PLACEHOLDERS = new Set([
  "change-me",
  "change-me-in-production",
  "change-me-session-secret-32b",
  "change-me-to-a-long-random-string",
  "studiogate-dev-secret-change-me",
  "studiogate-session-secret-32chars!!",
]);

const checks = [
  { name: "JWT_SECRET", minLength: 32 },
  { name: "SESSION_SECRET", minLength: 32 },
];

const problems = [];

for (const { name, minLength } of checks) {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    problems.push(`  - ${name} is not set.`);
  } else if (PLACEHOLDERS.has(value)) {
    problems.push(`  - ${name} is still the sample placeholder value from .env.example.`);
  } else if (value.length < minLength) {
    problems.push(`  - ${name} is too short (${value.length} chars, need ${minLength}+).`);
  }
}

if (problems.length) {
  console.error("\n✖ StudioGate refused to start in production mode:\n");
  console.error(problems.join("\n"));
  console.error(
    "\nGenerate real secrets, e.g.:\n  openssl rand -hex 32\nand put them in your .env (or docker-compose env_file) before starting.\n"
  );
  process.exit(1);
}

process.exit(0);
