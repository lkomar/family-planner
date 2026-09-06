import { CalendarDays } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { SCHOOL_WEEKDAYS } from "@/lib/weekdays";

interface TimetableProps {
  childId: string;
  childName: string;
  childGrade: string;
}

export async function Timetable({
  childId,
  childName,
  childGrade,
}: TimetableProps) {
  const [t, tWeekday] = await Promise.all([
    getTranslations("Planner"),
    getTranslations("Weekday.short"),
  ]);

  const slots = await db.timetableSlot.findMany({
    where: { childId },
    orderBy: { order: "asc" },
  });

  const rowOrders = Array.from(new Set(slots.map((slot) => slot.order))).sort(
    (a, b) => a - b,
  );
  const rows = rowOrders.map((order) => {
    const rowSlots = slots.filter((slot) => slot.order === order);
    const byWeekday = new Map(
      rowSlots.map((slot) => [slot.weekday, slot.subject]),
    );
    return {
      order,
      startTime: rowSlots[0]?.startTime ?? "",
      endTime: rowSlots[0]?.endTime ?? "",
      byWeekday,
    };
  });

  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm lg:col-span-2">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-bold text-lg">
          <CalendarDays className="size-5 text-primary" />
          {t("timetableTitle", { name: childName, grade: childGrade })}
        </h3>
      </div>

      {rows.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground text-sm italic">
          {t("timetableEmpty")}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b text-muted-foreground text-xs uppercase">
                <th className="px-2 py-3 font-semibold">{t("timeColumn")}</th>
                {SCHOOL_WEEKDAYS.map((weekday) => (
                  <th key={weekday} className="px-2 py-3 font-semibold">
                    {tWeekday(weekday)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {rows.map((row) => (
                <tr key={row.order} className="transition hover:bg-muted/40">
                  <td className="whitespace-nowrap px-2 py-3 font-bold text-muted-foreground text-xs">
                    {row.startTime} - {row.endTime}
                  </td>
                  {SCHOOL_WEEKDAYS.map((weekday) => (
                    <td key={weekday} className="px-2 py-3">
                      {row.byWeekday.get(weekday) ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
