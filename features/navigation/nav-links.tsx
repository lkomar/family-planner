"use client";

import {
  CalendarDays,
  LayoutDashboard,
  Recycle,
  ShoppingCart,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentType } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS: Array<{
  href: "/" | "/planner" | "/groceries" | "/trash";
  labelKey: "dashboard" | "planner" | "groceries" | "trash";
  icon: ComponentType<{ className?: string }>;
}> = [
  { href: "/", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/planner", labelKey: "planner", icon: CalendarDays },
  { href: "/groceries", labelKey: "groceries", icon: ShoppingCart },
  { href: "/trash", labelKey: "trash", icon: Recycle },
];

export function NavLinks() {
  const t = useTranslations("Nav");
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-1">
      {NAV_ITEMS.map(({ href, labelKey, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-xl px-3 py-2 font-medium text-sm transition sm:px-4",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            <span className="hidden sm:inline">{t(labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
