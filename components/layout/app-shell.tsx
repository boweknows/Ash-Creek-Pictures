import { ReactNode } from "react";
import { BottomNav, SidebarNav } from "./nav";
import { QuickAddButton } from "./quick-add";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="mx-auto flex max-w-6xl">
        <SidebarNav />
        <main className="w-full px-4 pb-28 pt-4 md:px-8 md:pb-8 md:pt-8">{children}</main>
      </div>
      <QuickAddButton />
      <BottomNav />
    </div>
  );
}
