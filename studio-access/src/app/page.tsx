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
            Скачать приложение
          </a>
          <Link href="/login" className="text-[var(--muted)] hover:text-white">
            Войти
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-[var(--accent)] px-3 py-2 font-semibold text-[#042421]"
          >
            Начать бесплатно
          </Link>
        </div>
      </header>

      <section className="flex flex-1 flex-col justify-center gap-10 py-16 lg:grid lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Для креативных студий
          </p>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">
            Доступ к Figma без хаоса с паролями
          </h1>
          <p className="mt-5 max-w-md text-lg text-[var(--muted)]">
            Дизайнеры ставят StudioGate на Mac или Windows, входят в аккаунт и
            нажимают «Открыть Figma». Без git и без терминала.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={WIN_ZIP}
              className="rounded-md bg-[var(--accent)] px-5 py-3 font-semibold text-[#042421]"
            >
              Скачать для Windows
            </a>
            <a
              href={RELEASE_TAG}
              className="rounded-md border border-[var(--line)] px-5 py-3 text-[var(--text)]"
            >
              Все загрузки
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
          <p className="text-sm text-[var(--muted)]">Что скачивает команда</p>
          <div className="mt-4 grid gap-3">
            <a
              href={WIN_ZIP}
              className="rounded-xl border border-[var(--line)] bg-[var(--panel-2)] px-4 py-3 hover:border-[var(--accent)]"
            >
              <p className="font-semibold">Windows</p>
              <p className="text-sm text-[var(--muted)]">
                Готово · zip → открыть StudioGate.exe
              </p>
            </a>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--panel-2)] px-4 py-3">
              <p className="font-semibold">Mac</p>
              <p className="text-sm text-[var(--muted)]">
                Соберите на Mac командой npm run dist:mac и раздайте .dmg
              </p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--panel-2)] px-4 py-3 opacity-60">
              <p className="font-semibold">Linux</p>
              <p className="text-sm text-[var(--muted)]">
                Есть, но большинству студий не нужен
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
