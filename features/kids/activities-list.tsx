import { Clock, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { parseWeekdayList } from "@/lib/weekdays";

interface ActivitiesListProps {
  childId: string;
}

export async function ActivitiesList({ childId }: ActivitiesListProps) {
  const [t, tWeekday] = await Promise.all([
    getTranslations("Planner"),
    getTranslations("Weekday.long"),
  ]);

  const activities = await db.activity.findMany({
    where: { childId },
    orderBy: { name: "asc" },
  });

  if (activities.length === 0) {
    return (
      <p className="py-4 text-center text-muted-foreground text-xs italic">
        {t("activitiesEmpty")}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const days = parseWeekdayList(activity.weekdays)
          .map((day) => tWeekday(day))
          .join(" & ");
        return (
          <div
            key={activity.id}
            className="rounded-2xl border border-orange-200 bg-orange-50 p-3.5 dark:border-orange-900 dark:bg-orange-950/40"
          >
            <h4 className="font-bold text-orange-900 text-xs dark:text-orange-200">
              {activity.name}
            </h4>
            <p className="mt-0.5 flex items-center gap-1 text-orange-700 text-xs dark:text-orange-300">
              <Clock className="size-3" />
              {days} • {activity.startTime} - {activity.endTime}
            </p>
            <p className="mt-0.5 flex items-center gap-1 font-medium text-orange-600 text-xs dark:text-orange-400">
              <MapPin className="size-3" />
              {activity.location}
            </p>
          </div>
        );
      })}
    </div>
  );
}
