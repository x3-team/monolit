"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("owner@studio.local");
  const [password, setPassword] = useState("owner123456");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/app");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <Link href="/" className="mb-8 font-display text-2xl">
        Studio<span className="text-[var(--accent)]">Gate</span>
      </Link>
      <h1 className="font-display text-3xl">Log in</h1>
      <p className="mt-2 text-[var(--muted)]">
        Demo: owner@studio.local / owner123456
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <input
          className="w-full rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <input
          className="w-full rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />
        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
        <button
          disabled={busy}
          className="w-full rounded-md bg-[var(--accent)] py-2 font-semibold text-[#042421]"
        >
          {busy ? "…" : "Enter workspace"}
        </button>
      </form>
    </main>
  );
}
