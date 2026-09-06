"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Weekday } from "@/lib/generated/prisma/enums";
import { getCurrentWeekday } from "@/lib/weekdays";

interface SelectedDayContextValue {
  selectedDay: Weekday;
  setSelectedDay: (day: Weekday) => void;
}

const SelectedDayContext = createContext<SelectedDayContextValue | null>(null);

/**
 * Shares the app-wide selected weekday (driven by the header's day picker)
 * with any component that wants to show that day's data, e.g. the
 * dashboard's kids' schedule.
 */
export function SelectedDayProvider({ children }: { children: ReactNode }) {
  const [selectedDay, setSelectedDay] = useState<Weekday>(getCurrentWeekday);

  const value = useMemo(() => ({ selectedDay, setSelectedDay }), [selectedDay]);

  return (
    <SelectedDayContext.Provider value={value}>
      {children}
    </SelectedDayContext.Provider>
  );
}

export function useSelectedDay(): SelectedDayContextValue {
  const context = useContext(SelectedDayContext);
  if (!context) {
    throw new Error("useSelectedDay must be used within a SelectedDayProvider");
  }
  return context;
}
