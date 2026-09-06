"use client";

import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  Clock,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useSelectedDay } from "@/features/navigation/selected-day-context";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface ChildSummary {
  id: string;
  name: string;
  grade: string;
}

interface Activity {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  location: string;
  childId: string;
}

interface TimetableSlot {
  id: string;
  subject: string;
  startTime: string;
  endTime: string;
  order: number;
  childId: string;
}

interface DayActivitiesProps {
  childList: ChildSummary[];
}

/** A single row in a child's day, merged from timetable slots and activities. */
interface ScheduleEntry {
  id: string;
  kind: "class" | "activity";
  label: string;
  startTime: string;
  endTime: string;
  location?: string;
}

const CHILD_ACCENTS = [
  { dot: "bg-sky-500", icon: "text-sky-500" },
  { dot: "bg-pink-500", icon: "text-pink-500" },
  { dot: "bg-violet-500", icon: "text-violet-500" },
  { dot: "bg-amber-500", icon: "text-amber-500" },
  { dot: "bg-emerald-500", icon: "text-emerald-500" },
] as const;

/** Groups timetable slots and activities by child id, each sorted chronologically. */
function groupByChildId(
  timetable: TimetableSlot[],
  activities: Activity[],
): Map<string, ScheduleEntry[]> {
  const byChild = new Map<string, ScheduleEntry[]>();

  const addEntry = (childId: string, entry: ScheduleEntry) => {
    const existing = byChild.get(childId);
    if (existing) {
      existing.push(entry);
      return;
    }

    byChild.set(childId, [entry]);
  };

  for (const slot of timetable) {
    addEntry(slot.childId, {
      id: `class-${slot.id}`,
      kind: "class",
      label: slot.subject,
      startTime: slot.startTime,
      endTime: slot.endTime,
    });
  }

  for (const activity of activities) {
    addEntry(activity.childId, {
      id: `activity-${activity.id}`,
      kind: "activity",
      label: activity.name,
      startTime: activity.startTime,
      endTime: activity.endTime,
      location: activity.location || undefined,
    });
  }

  for (const entries of byChild.values()) {
    entries.sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  return byChild;
}

/** Fetches and displays activities and timetable for a selected day. */
export function DayActivities({ childList }: DayActivitiesProps) {
  const t = useTranslations("Planner");
  const tWeekday = useTranslations("Weekday.long");
  const { selectedDay } = useSelectedDay();
  const [isOpen, setIsOpen] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(false);

  const childrenIdsKey = childList.map((child) => child.id).join(",");

  useEffect(() => {
    if (!isOpen) return;

    const fetchDayData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          day: selectedDay,
          childrenIds: childrenIdsKey,
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
  }, [selectedDay, childrenIdsKey, isOpen]);

  const scheduleByChild = useMemo(
    () => groupByChildId(timetable, activities),
    [timetable, activities],
  );

  return (
    <div className="rounded-3xl border bg-card p-4 shadow-sm sm:p-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="group flex w-full items-center justify-between gap-3 rounded-2xl text-left outline-none transition-colors hover:bg-muted/30 focus-visible:ring-2 focus-visible:ring-ring/50">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
              <GraduationCap className="size-5" />
            </span>
            <div className="min-w-0">
              <h4 className="truncate font-semibold text-base text-foreground tracking-tight">
                {t("kidsScheduleTitle")}
              </h4>
              <p className="truncate text-muted-foreground text-xs">
                {t("kidsScheduleSubtitle")}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-medium text-primary text-xs sm:inline">
              {t("dayScheduleBadge", { day: tWeekday(selectedDay) })}
            </span>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-muted text-muted-foreground transition-colors group-hover:text-foreground">
              <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=closed]:-rotate-90" />
            </span>
            <span className="sr-only">
              {isOpen ? t("hideSchedule") : t("showSchedule")}
            </span>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden">
          <div className="mt-4 border-t pt-4">
            {loading ? (
              <div className="flex h-28 items-center justify-center text-muted-foreground text-sm">
                {t("loading")}
              </div>
            ) : (
              <div
                className={cn(
                  "grid w-full gap-4",
                  childList.length === 1
                    ? "grid-cols-1"
                    : "grid-cols-1 sm:grid-cols-2",
                )}
              >
                {childList.map((child, index) => {
                  const entries = scheduleByChild.get(child.id) ?? [];
                  const accent = CHILD_ACCENTS[index % CHILD_ACCENTS.length];

                  return (
                    <section
                      key={child.id}
                      className="min-w-0 space-y-3 rounded-xl border bg-muted/10 p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className={cn(
                              "size-2.5 shrink-0 rounded-full",
                              accent.dot,
                            )}
                            aria-hidden
                          />
                          <h5 className="truncate font-semibold text-sm">
                            {child.name}{" "}
                            <span className="font-normal text-muted-foreground text-xs">
                              ({child.grade})
                            </span>
                          </h5>
                        </div>
                        <Link
                          href={{
                            pathname: "/planner",
                            query: { child: child.id },
                          }}
                          className="shrink-0 text-primary text-xs font-semibold hover:underline"
                        >
                          {t("fullTimetable")}
                        </Link>
                      </div>

                      {entries.length === 0 ? (
                        <p className="rounded-lg border border-dashed py-6 text-center text-muted-foreground text-xs italic">
                          {t("nothingScheduled")}
                        </p>
                      ) : (
                        <ul className="space-y-2">
                          {entries.map((entry) => {
                            const EntryIcon =
                              entry.kind === "class" ? BookOpen : CalendarDays;

                            return (
                              <li
                                key={entry.id}
                                className="flex items-center justify-between gap-3 rounded-lg border bg-background/60 px-3 py-2.5 text-xs"
                              >
                                <div className="flex min-w-0 items-center gap-2">
                                  <EntryIcon
                                    className={cn(
                                      "size-3.5 shrink-0",
                                      accent.icon,
                                    )}
                                  />
                                  <div className="min-w-0">
                                    <p className="truncate font-medium">
                                      {entry.label}
                                    </p>
                                    {entry.location ? (
                                      <p className="mt-0.5 flex items-center gap-1 truncate text-muted-foreground">
                                        <MapPin className="size-3 shrink-0" />
                                        <span className="truncate">
                                          {entry.location}
                                        </span>
                                      </p>
                                    ) : null}
                                  </div>
                                </div>
                                <span className="flex shrink-0 items-center gap-1 whitespace-nowrap font-mono text-[11px] text-muted-foreground tabular-nums">
                                  <Clock className="size-3 shrink-0" />
                                  {entry.startTime} – {entry.endTime}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </section>
                  );
                })}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
