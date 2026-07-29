import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8">
      <header className="flex items-center justify-between">
        <div className="font-display text-2xl tracking-tight">
          Studio<span className="text-[var(--accent)]">Gate</span>
        </div>
        <div className="flex gap-3 text-sm">
          <Link href="/login" className="text-[var(--muted)] hover:text-white">
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-[var(--accent)] px-3 py-2 font-semibold text-[#042421]"
          >
            Start free
          </Link>
        </div>
      </header>

      <section className="flex flex-1 flex-col justify-center gap-10 py-16 lg:grid lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            For creative studios
          </p>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">
            Figma & Higgsfield access without password chaos.
          </h1>
          <p className="mt-5 max-w-md text-lg text-[var(--muted)]">
            Owner connects team accounts once. Freelancers work in a controlled
            window. You revoke in one click — no more dictating passwords on calls.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-md bg-[var(--accent)] px-5 py-3 font-semibold text-[#042421]"
            >
              Create studio workspace
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-[var(--line)] px-5 py-3 text-[var(--text)]"
            >
              Open demo login
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <p className="text-sm text-[var(--muted)]">MVP tools</p>
          <div className="mt-4 grid gap-3">
            {[
              ["Figma", "Design files · team account only"],
              ["Higgsfield", "AI credits · no billing for freelancers"],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="rounded-xl border border-[var(--line)] bg-[var(--panel-2)] px-4 py-3"
              >
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-[var(--muted)]">{desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Pitch price anchor for agencies: 19–29k ₽ / month.
          </p>
        </div>
      </section>
    </main>
  );
}
