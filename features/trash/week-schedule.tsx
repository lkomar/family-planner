import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { getCurrentHousehold } from "@/lib/household";
import { cn } from "@/lib/utils";
import { WASTE_TYPE_COLOR_CLASSES, WASTE_TYPE_ICONS } from "@/lib/waste-types";
import { getCurrentWeekday, WEEKDAY_ORDER } from "@/lib/weekdays";

export async function WeekSchedule() {
  const [t, tWeekday, household] = await Promise.all([
    getTranslations("WasteType"),
    getTranslations("Weekday.long"),
    getCurrentHousehold(),
  ]);

  const entries = await db.trashScheduleEntry.findMany({
    where: { householdId: household.id },
  });
  const entryByWeekday = new Map(
    entries.map((entry) => [entry.weekday, entry]),
  );
  const today = getCurrentWeekday();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
      {WEEKDAY_ORDER.map((weekday) => {
        const wasteType = entryByWeekday.get(weekday)?.wasteType ?? "NONE";
        const Icon = WASTE_TYPE_ICONS[wasteType];
        const isToday = weekday === today;

        return (
          <div
            key={weekday}
            className={cn(
              "flex flex-col justify-between rounded-3xl border p-4 shadow-sm transition",
              isToday &&
                "border-primary ring-2 ring-primary/40 bg-primary/5 shadow-md",
            )}
          >
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span
                  className={cn(
                    "text-xs font-bold",
                    isToday
                      ? "rounded-md bg-primary/15 px-2 py-0.5 text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  {tWeekday(weekday)}
                </span>
                {isToday && (
                  <span className="rounded bg-primary px-1.5 py-0.5 font-semibold text-[10px] text-primary-foreground">
                    {t("todayBadge")}
                  </span>
                )}
              </div>
              <div
                className={`mb-3 flex size-10 items-center justify-center rounded-xl text-white shadow-inner ${WASTE_TYPE_COLOR_CLASSES[wasteType]}`}
              >
                <Icon className="size-4" />
              </div>
              <h4 className="mb-1 font-bold text-sm">
                {t(`${wasteType}.name`)}
              </h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {t(`${wasteType}.description`)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
