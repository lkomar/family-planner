"use client";

import { useCallback, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WEEKDAY_ORDER } from "@/lib/weekdays";
import type { Weekday } from "@/lib/generated/prisma/enums";
import { cn } from "@/lib/utils";

interface DayNavigatorProps {
  onDayChange: (day: Weekday) => void;
  children?: React.ReactNode;
}

/** Interactive day selector that lets users browse the week ahead. */
export function DayNavigator({ onDayChange, children }: DayNavigatorProps) {
  const today = useMemo(() => {
    const jsDay = new Date().getDay();
    return WEEKDAY_ORDER[(jsDay + 6) % 7];
  }, []);

  const [selectedIndex, setSelectedIndex] = useState(
    WEEKDAY_ORDER.indexOf(today),
  );

  const selectedDay = WEEKDAY_ORDER[selectedIndex];

  const handlePrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + 7) % 7);
  }, []);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % 7);
  }, []);

  const handleDayClick = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  // Notify parent of day change
  useMemo(() => {
    onDayChange(selectedDay);
  }, [selectedDay, onDayChange]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          className="size-8 p-0"
        >
          <ChevronLeft className="size-4" />
        </Button>

        <div className="flex flex-1 gap-2 overflow-x-auto">
          {WEEKDAY_ORDER.map((weekday, index) => (
            <button
              key={weekday}
              onClick={() => handleDayClick(index)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors min-w-max",
                selectedIndex === index
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
                weekday === today && selectedIndex !== index && "ring-1 ring-primary/30",
              )}
            >
              <span className="text-xs font-bold uppercase">{weekday}</span>
              {weekday === today && (
                <span className="text-[10px] text-current opacity-75">today</span>
              )}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          className="size-8 p-0"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {children}
    </div>
  );
}
