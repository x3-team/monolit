"use client";

import { FormEvent, useState } from "react";

const AVAILABLE_TOOLS = ["FIGMA", "HIGGSFIELD"];

export function InviteForm({
  onInvite,
}: {
  onInvite: (input: {
    name: string;
    email: string;
    password: string;
    tools: string[];
  }) => Promise<boolean>;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("freelancer123");
  const [tools, setTools] = useState<string[]>(AVAILABLE_TOOLS);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const ok = await onInvite({ name, email, password, tools });
    if (ok) {
      setName("");
      setEmail("");
    }
  }

  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
      <h2 className="font-display text-xl">Пригласить фрилансера</h2>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
        <input
          placeholder="Имя"
          className="rounded-md border border-[var(--line)] bg-[var(--panel-2)] px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Почта"
          type="email"
          className="rounded-md border border-[var(--line)] bg-[var(--panel-2)] px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Временный пароль"
          className="rounded-md border border-[var(--line)] bg-[var(--panel-2)] px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="flex items-center gap-4 text-sm">
          {AVAILABLE_TOOLS.map((t) => (
            <label key={t} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={tools.includes(t)}
                onChange={(e) =>
                  setTools((prev) => (e.target.checked ? [...prev, t] : prev.filter((x) => x !== t)))
                }
              />
              {t}
            </label>
          ))}
        </div>
        <button className="rounded-md bg-[var(--accent-2)] px-3 py-2 font-semibold text-[#1d1400] md:col-span-2">
          Выдать доступ
        </button>
      </form>
    </section>
  );
}
