import type { Weekday } from "@/lib/generated/prisma/enums";

/** Monday-first order, matching how the timetable and trash schedule read. */
export const WEEKDAY_ORDER: Weekday[] = [
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
  "SUN",
];

/** Today's weekday, Monday-first (JS's `Date#getDay()` is Sunday-first). */
export function getCurrentWeekday(): Weekday {
  const jsDay = new Date().getDay();
  return WEEKDAY_ORDER[(jsDay + 6) % 7];
}

/** Parses an Activity.weekdays field (e.g. "TUE,THU") back into a list. */
export function parseWeekdayList(value: string): Weekday[] {
  return value.split(",").map((day) => day.trim() as Weekday);
}

/** The five weekdays a class timetable spans. */
export const SCHOOL_WEEKDAYS: Weekday[] = WEEKDAY_ORDER.slice(0, 5);
