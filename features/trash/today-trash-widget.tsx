import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { getCurrentHousehold } from "@/lib/household";
import { WASTE_TYPE_COLOR_CLASSES, WASTE_TYPE_ICONS } from "@/lib/waste-types";
import { getCurrentWeekday } from "@/lib/weekdays";

export async function TodayTrashWidget() {
  const [t, tWeekday, household] = await Promise.all([
    getTranslations("WasteType"),
    getTranslations("Weekday.long"),
    getCurrentHousehold(),
  ]);

  const today = getCurrentWeekday();
  const entry = await db.trashScheduleEntry.findUnique({
    where: {
      householdId_weekday: { householdId: household.id, weekday: today },
    },
  });

  const wasteType = entry?.wasteType ?? "NONE";
  const Icon = WASTE_TYPE_ICONS[wasteType];

  return (
    <div className="z-10 flex min-w-[260px] items-center space-x-4 rounded-2xl border bg-card/90 p-4 shadow-md backdrop-blur-sm">
      <div
        className={`flex size-12 shrink-0 items-center justify-center rounded-xl text-white shadow-inner ${WASTE_TYPE_COLOR_CLASSES[wasteType]}`}
      >
        <Icon className="size-5" />
      </div>
      <div>
        <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
          {t("collectionTodayLabel")}
        </p>
        <h4 className="font-bold text-foreground text-lg">
          {t(`${wasteType}.name`)}
        </h4>
        <p className="text-emerald-600 text-xs font-medium dark:text-emerald-400">
          {tWeekday(today)}: {t(`${wasteType}.description`)}
        </p>
      </div>
    </div>
  );
}
