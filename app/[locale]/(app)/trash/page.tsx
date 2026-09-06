import { getTranslations } from "next-intl/server";
import { TrashGuide } from "@/features/trash/trash-guide";
import { WeekSchedule } from "@/features/trash/week-schedule";

export default async function TrashPage() {
  const t = await getTranslations("Trash");

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border bg-card p-6 shadow-sm">
        <h2 className="font-bold text-2xl">{t("title")}</h2>
        <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
      </div>

      <WeekSchedule />

      <TrashGuide />
    </div>
  );
}
