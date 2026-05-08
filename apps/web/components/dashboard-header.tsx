"use client";

import { SidebarTrigger } from "@workspace/ui/components/sidebar";

export function DashboardHeader() {
  return (
    <header className="flex h-12 shrink-0 items-center border-b px-3">
      <SidebarTrigger />
    </header>
  );
}
