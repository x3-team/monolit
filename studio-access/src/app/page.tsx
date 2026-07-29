import Link from "next/link";

const RELEASE_TAG =
  "https://github.com/x3-team/monolit/releases/tag/studiogate-v0.1.0";
const WIN_ZIP =
  "https://github.com/x3-team/monolit/releases/download/studiogate-v0.1.0/StudioGate-0.1.0-windows-x64.zip";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8">
      <header className="flex items-center justify-between">
        <div className="font-display text-2xl tracking-tight">
          Studio<span className="text-[var(--accent)]">Gate</span>
        </div>
        <div className="flex gap-3 text-sm">
          <a href={RELEASE_TAG} className="text-[var(--muted)] hover:text-white">
            Download app
          </a>
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
            Figma access without password chaos.
          </h1>
          <p className="mt-5 max-w-md text-lg text-[var(--muted)]">
            Designers install StudioGate for Mac or Windows, log in, and click
            Open Figma. No git. No npm.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={WIN_ZIP}
              className="rounded-md bg-[var(--accent)] px-5 py-3 font-semibold text-[#042421]"
            >
              Download for Windows
            </a>
            <a
              href={RELEASE_TAG}
              className="rounded-md border border-[var(--line)] px-5 py-3 text-[var(--text)]"
            >
              All downloads
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
          <p className="text-sm text-[var(--muted)]">What your team downloads</p>
          <div className="mt-4 grid gap-3">
            <a
              href={WIN_ZIP}
              className="rounded-xl border border-[var(--line)] bg-[var(--panel-2)] px-4 py-3 hover:border-[var(--accent)]"
            >
              <p className="font-semibold">Windows</p>
              <p className="text-sm text-[var(--muted)]">
                Ready now · zip → open StudioGate.exe
              </p>
            </a>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--panel-2)] px-4 py-3">
              <p className="font-semibold">Mac</p>
              <p className="text-sm text-[var(--muted)]">
                Build on a Mac with `npm run dist:mac`, then share the `.dmg`
              </p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--panel-2)] px-4 py-3 opacity-60">
              <p className="font-semibold">Linux</p>
              <p className="text-sm text-[var(--muted)]">
                Exists, but most studios do not need it
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
