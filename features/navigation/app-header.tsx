import { House } from "lucide-react";
import { getFormatter } from "next-intl/server";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Link } from "@/i18n/navigation";
import { getCurrentHousehold } from "@/lib/household";
import { GlobalDayNavigator } from "./global-day-navigator";
import { NavLinks } from "./nav-links";

export async function AppHeader() {
  const [format, household] = await Promise.all([
    getFormatter(),
    getCurrentHousehold(),
  ]);

  const today = format.dateTime(new Date(), { dateStyle: "full" });

  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
            <House className="size-5" />
          </span>
          <span>
            <h1 className="font-bold text-lg leading-tight tracking-wide">
              {household.name}
            </h1>
            <p className="text-muted-foreground text-xs">{today}</p>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <NavLinks />
          <LanguageSwitcher />
        </div>
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 pb-3">
        <GlobalDayNavigator />
      </div>
    </header>
  );
}
