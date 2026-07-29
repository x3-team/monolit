import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="hero-grid absolute inset-0 opacity-70" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <div className="font-display text-2xl tracking-tight">
            Smart<span className="font-semibold text-[var(--accent)]">Doc</span> AI
          </div>
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/register">
              <Button>Start free</Button>
            </Link>
          </div>
        </header>

        <section className="flex flex-1 flex-col justify-center gap-8 py-16 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="animate-rise max-w-xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              SmartDoc AI
            </p>
            <h1 className="font-display text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Documents in.
              <br />
              Structured CRM data out.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-[var(--muted-foreground)]">
              OCR + YandexGPT extraction pipelines that normalize passports,
              invoices, contracts and acts — then push JSON straight into
              AmoCRM, Bitrix24 or 1C.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register">
                <Button size="lg">Open client portal</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Manager login
                </Button>
              </Link>
            </div>
          </div>

          <div className="animate-rise-delay relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_30%_20%,rgba(15,109,106,0.25),transparent_55%)]" />
            <div className="relative overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] shadow-[0_30px_80px_rgba(19,33,43,0.12)]">
              <div className="border-b border-[var(--border)] px-5 py-3 text-sm text-[var(--muted-foreground)]">
                Pipeline · Supplier Invoices
              </div>
              <div className="space-y-4 p-5">
                <div className="h-1 w-full rounded-full bg-[var(--muted)]">
                  <div className="animate-pulse-line h-1 w-3/4 rounded-full bg-[var(--accent)]" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["inn_seller", "7707083893"],
                    ["invoice_date", "2026-03-15"],
                    ["vat_amount", "2000.00"],
                    ["total_amount", "12000.00"],
                  ].map(([key, value]) => (
                    <div
                      key={key}
                      className="rounded-lg bg-[var(--muted)] px-3 py-2"
                    >
                      <p className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
                        {key}
                      </p>
                      <p className="font-medium">{value}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Ready for webhook → 1C / AmoCRM / Bitrix24
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
