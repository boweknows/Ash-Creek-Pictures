"use client";

import Link from "next/link";

export function QuickAddButton() {
  return (
    <div className="fixed bottom-20 right-4 z-40 md:hidden">
      <Link
        href="/slate?new=1"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-3xl text-slate-900 shadow-lg"
        aria-label="Quick add project"
      >
        +
      </Link>
    </div>
  );
}
