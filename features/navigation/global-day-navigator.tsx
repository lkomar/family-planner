"use client";

import { DayNavigator } from "./day-navigator";
import { useSelectedDay } from "./selected-day-context";

/** Wires the app-wide selected day to the shared day-picker UI. */
export function GlobalDayNavigator() {
  const { selectedDay, setSelectedDay } = useSelectedDay();

  return (
    <DayNavigator selectedDay={selectedDay} onDayChange={setSelectedDay} />
  );
}
