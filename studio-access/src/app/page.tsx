import Link from "next/link";

const RELEASES = "https://github.com/x3-team/monolit/releases";
const RELEASE_TAG = "https://github.com/x3-team/monolit/releases/tag/studiogate-v0.1.0";
const LINUX_APP =
  "https://github.com/x3-team/monolit/releases/download/studiogate-v0.1.0/StudioGate-0.1.0.AppImage";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8">
      <header className="flex items-center justify-between">
        <div className="font-display text-2xl tracking-tight">
          Studio<span className="text-[var(--accent)]">Gate</span>
        </div>
        <div className="flex gap-3 text-sm">
          <a href={RELEASES} className="text-[var(--muted)] hover:text-white">
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
            Figma & Higgsfield access without password chaos.
          </h1>
          <p className="mt-5 max-w-md text-lg text-[var(--muted)]">
            Owner connects team accounts once. Freelancers install the app,
            log in, and click Open. You revoke in one click.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={RELEASE_TAG}
              className="rounded-md bg-[var(--accent)] px-5 py-3 font-semibold text-[#042421]"
            >
              Download StudioGate
            </a>
            <Link
              href="/register"
              className="rounded-md border border-[var(--line)] px-5 py-3 text-[var(--text)]"
            >
              Create studio workspace
            </Link>
          </div>
          <p className="mt-4 text-sm text-[var(--muted)]">
            App download is on GitHub Releases. You also need a running studio
            server (VPS recommended).
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <p className="text-sm text-[var(--muted)]">Downloads</p>
          <div className="mt-4 grid gap-3">
            <a
              href={LINUX_APP}
              className="rounded-xl border border-[var(--line)] bg-[var(--panel-2)] px-4 py-3 hover:border-[var(--accent)]"
            >
              <p className="font-semibold">Linux AppImage</p>
              <p className="text-sm text-[var(--muted)]">Ready now · v0.1.0</p>
            </a>
            <a
              href={RELEASES}
              className="rounded-xl border border-[var(--line)] bg-[var(--panel-2)] px-4 py-3 hover:border-[var(--accent)]"
            >
              <p className="font-semibold">Mac / Windows</p>
              <p className="text-sm text-[var(--muted)]">
                Build via Actions or `npm run dist:mac` / `dist:win`, then attach
                to the same release
              </p>
            </a>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--panel-2)] px-4 py-3">
              <p className="font-semibold">Studio server</p>
              <p className="text-sm text-[var(--muted)]">
                Keep StudioGate API online on a small VPS — not your laptop
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
