"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/today", label: "Today" },
  { href: "/slate", label: "Slate" },
  { href: "/weekly", label: "Weekly" },
  { href: "/people", label: "People" },
  { href: "/submissions", label: "Submissions" },
  { href: "/settings", label: "Settings" },
];

export function SidebarNav() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 border-r border-slate-800 bg-slate-950/40 p-4 md:block">
      <p className="mb-4 px-2 text-lg font-semibold text-text">Ash Creek Career OS</p>
      <nav className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-xl px-3 py-3 text-sm",
              pathname.startsWith(item.href)
                ? "bg-accent text-slate-900"
                : "text-muted hover:bg-slate-900 hover:text-text",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-800 bg-slate-950/95 px-2 pb-safe pt-2 md:hidden">
      <ul className="grid grid-cols-5 gap-1">
        {items.slice(0, 5).map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "flex min-h-12 items-center justify-center rounded-lg text-xs font-medium",
                pathname.startsWith(item.href)
                  ? "bg-accent text-slate-900"
                  : "text-muted hover:bg-slate-900 hover:text-text",
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
