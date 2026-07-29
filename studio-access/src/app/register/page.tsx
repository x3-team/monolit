"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [studioName, setStudioName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studioName, name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      router.push("/app");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <Link href="/" className="mb-8 font-display text-2xl">
        Studio<span className="text-[var(--accent)]">Gate</span>
      </Link>
      <h1 className="font-display text-3xl">Create studio</h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-3">
        {[
          ["Studio name", studioName, setStudioName, "text"],
          ["Your name", name, setName, "text"],
          ["Email", email, setEmail, "email"],
          ["Password", password, setPassword, "password"],
        ].map(([label, value, setter, type]) => (
          <label key={label as string} className="block space-y-1 text-sm">
            <span>{label as string}</span>
            <input
              className="w-full rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2"
              value={value as string}
              onChange={(e) =>
                (setter as (v: string) => void)(e.target.value)
              }
              type={type as string}
              required
              minLength={type === "password" ? 8 : undefined}
            />
          </label>
        ))}
        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
        <button
          disabled={busy}
          className="w-full rounded-md bg-[var(--accent)] py-2 font-semibold text-[#042421]"
        >
          {busy ? "…" : "Create workspace"}
        </button>
      </form>
    </main>
  );
}
