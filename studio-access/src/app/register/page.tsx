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
      if (!res.ok) throw new Error(data.error || "Не удалось создать студию");
      router.push("/app");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось создать студию");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <Link href="/" className="mb-8 font-display text-2xl">
        Studio<span className="text-[var(--accent)]">Gate</span>
      </Link>
      <h1 className="font-display text-3xl">Создать студию</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Рабочее пространство для доступов и учёта AI-затрат
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-3">
        {(
          [
            ["Название студии", studioName, setStudioName, "text"],
            ["Ваше имя", name, setName, "text"],
            ["Почта", email, setEmail, "email"],
            ["Пароль", password, setPassword, "password"],
          ] as const
        ).map(([label, value, setter, type]) => (
          <label key={label} className="block space-y-1 text-sm">
            <span>{label}</span>
            <input
              className="w-full rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2"
              value={value}
              onChange={(e) => setter(e.target.value)}
              type={type}
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
          {busy ? "Создаём…" : "Создать пространство"}
        </button>
      </form>
      <p className="mt-6 text-sm text-[var(--muted)]">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="text-[var(--accent)]">
          Войти
        </Link>
      </p>
    </main>
  );
}
