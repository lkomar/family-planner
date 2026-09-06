"use client";

import { useCallback, useEffect, useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { WEEKDAY_ORDER } from "@/lib/weekdays";
import type { Weekday } from "@/lib/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { DayNavigator } from "./day-navigator";

interface Activity {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  location: string;
  childName: string;
}

interface TimetableSlot {
  id: string;
  subject: string;
  startTime: string;
  endTime: string;
  order: number;
  childName: string;
}

interface DayActivitiesProps {
  childrenIds: string[];
}

/** Fetches and displays activities and timetable for a selected day. */
export function DayActivities({ childrenIds }: DayActivitiesProps) {
  const t = useTranslations("Planner");
  const [selectedDay, setSelectedDay] = useState<Weekday>("MON");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDayChange = useCallback((day: Weekday) => {
    setSelectedDay(day);
  }, []);

  useEffect(() => {
    const fetchDayData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          day: selectedDay,
          childrenIds: childrenIds.join(","),
        });
        const response = await fetch(
          `/api/day-activities?${params.toString()}`,
        );
        if (!response.ok) throw new Error("Failed to fetch day activities");
        const data = await response.json();
        setActivities(data.activities || []);
        setTimetable(data.timetable || []);
      } catch (error) {
        console.error("Error fetching day data:", error);
        setActivities([]);
        setTimetable([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDayData();
  }, [selectedDay, childrenIds]);

  const dayIndex = WEEKDAY_ORDER.indexOf(selectedDay);
  const dayName = t(`Weekday.long.${selectedDay}`);

  const sortedActivities = [...activities].sort(
    (a, b) => a.startTime.localeCompare(b.startTime),
  );

  const sortedTimetable = [...timetable].sort((a, b) => a.order - b.order);

  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm">
      <h3 className="mb-4 font-bold text-lg">{t("weekScheduleTitle")}</h3>
      <DayNavigator onDayChange={handleDayChange}>
        <div className="space-y-4">
          {loading ? (
            <div className="flex h-20 items-center justify-center text-muted-foreground text-sm">
              {t("loading")}
            </div>
          ) : (
            <>
              {/* Timetable section */}
              {sortedTimetable.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase">
                    {t("classSchedule")}
                  </h4>
                  <div className="space-y-2">
                    {sortedTimetable.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3"
                      >
                        <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                          <Clock className="size-4 flex-shrink-0 mt-0.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{slot.subject}</p>
                          <p className="text-xs text-muted-foreground">
                            {slot.startTime}–{slot.endTime} · {slot.childName}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activities section */}
              {sortedActivities.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase">
                    {t("activitiesTitle")}
                  </h4>
                  <div className="space-y-2">
                    {sortedActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3"
                      >
                        <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                          <Calendar className="size-4 flex-shrink-0 mt-0.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{activity.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.startTime}–{activity.endTime} ·{" "}
                            {activity.childName}
                          </p>
                          {activity.location && (
                            <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <MapPin className="size-3" />
                              {activity.location}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {sortedActivities.length === 0 && sortedTimetable.length === 0 && (
                <div className="flex h-20 items-center justify-center">
                  <p className="text-muted-foreground text-sm italic">
                    {t("nothingScheduled")}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </DayNavigator>
    </div>
  );
}
