"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  GitBranch,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Webhook,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/pipelines", label: "Pipelines", icon: GitBranch },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/settings/api-keys", label: "API Keys", icon: KeyRound },
  { href: "/settings/webhooks", label: "Webhooks", icon: Webhook },
];

export function DashboardShell({
  children,
  userName,
  orgName,
}: {
  children: React.ReactNode;
  userName: string;
  orgName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-[var(--border)] bg-[var(--sidebar)] lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center px-5">
          <Link href="/dashboard" className="font-display text-xl tracking-tight">
            Smart<span className="font-semibold text-[var(--accent)]">Doc</span>
          </Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto hidden border-t border-[var(--border)] p-4 lg:block">
          <div className="mb-3">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-[var(--muted-foreground)]">{orgName}</p>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </aside>
      <main className="min-w-0">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3 lg:hidden">
          <div>
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-[var(--muted-foreground)]">{orgName}</p>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            Log out
          </Button>
        </div>
        <div className="px-4 py-6 sm:px-8">{children}</div>
      </main>
    </div>
  );
}
