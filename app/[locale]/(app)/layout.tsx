import type { ReactNode } from "react";
import { AppHeader } from "@/features/navigation/app-header";
import { SelectedDayProvider } from "@/features/navigation/selected-day-context";

// Every page here reads live household data that changes via Server Actions
// (todos, notes, groceries, ...) — render per-request rather than caching a
// build-time snapshot.
export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SelectedDayProvider>
      <div className="flex min-h-full flex-1 flex-col">
        <AppHeader />
        <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </SelectedDayProvider>
  );
}
