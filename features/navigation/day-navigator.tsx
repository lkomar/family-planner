"use client";

import { useTranslations } from "next-intl";
import type { Weekday } from "@/lib/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { getCurrentWeekday, WEEKDAY_ORDER } from "@/lib/weekdays";

interface DayNavigatorProps {
  selectedDay: Weekday;
  onDayChange: (day: Weekday) => void;
}

/** Compact equal-width day tiles for picking a weekday. */
export function DayNavigator({ selectedDay, onDayChange }: DayNavigatorProps) {
  const t = useTranslations("Planner");
  const tWeekday = useTranslations("Weekday.short");
  const today = getCurrentWeekday();

  return (
    <div
      className="flex w-full gap-1.5 sm:gap-2"
      role="tablist"
      aria-label={t("weekScheduleTitle")}
    >
      {WEEKDAY_ORDER.map((weekday) => {
        const isSelected = weekday === selectedDay;
        const isToday = weekday === today;

        return (
          <button
            key={weekday}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onDayChange(weekday)}
            className={cn(
              "flex min-w-0 flex-1 basis-0 flex-col items-center justify-center gap-0.5 rounded-xl border px-1 py-2 transition-colors sm:py-2.5",
              isSelected
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <span className="text-xs font-semibold sm:text-sm">
              {tWeekday(weekday)}
            </span>
            <span
              className={cn(
                "text-[9px] font-semibold uppercase tracking-wide sm:text-[10px]",
                isSelected ? "opacity-90" : "opacity-70",
              )}
            >
              {isToday ? t("todayLabel") : t("planLabel")}
            </span>
          </button>
        );
      })}
    </div>
  );
}
