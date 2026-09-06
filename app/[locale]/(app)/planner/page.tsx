import { Backpack, PartyPopper } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ActivitiesList } from "@/features/kids/activities-list";
import { ChildTabs } from "@/features/kids/child-tabs";
import { HomeworkList } from "@/features/kids/homework-list";
import { Timetable } from "@/features/kids/timetable";
import { NotesBoard } from "@/features/notes/notes-board";
import { db } from "@/lib/db";
import { getCurrentHousehold } from "@/lib/household";

interface PlannerPageProps {
  searchParams: Promise<{ child?: string }>;
}

export default async function PlannerPage({ searchParams }: PlannerPageProps) {
  const [t, { child: requestedChildId }, household] = await Promise.all([
    getTranslations("Planner"),
    searchParams,
    getCurrentHousehold(),
  ]);

  const children = await db.child.findMany({
    where: { householdId: household.id },
    orderBy: { order: "asc" },
  });

  if (children.length === 0) {
    notFound();
  }

  const selectedChild =
    children.find((child) => child.id === requestedChildId) ?? children[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border bg-card p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h2 className="font-bold text-2xl">{t("title")}</h2>
          <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
        </div>
        <ChildTabs childList={children} selectedChildId={selectedChild.id} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Timetable
          childId={selectedChild.id}
          childName={selectedChild.name}
          childGrade={selectedChild.grade}
        />

        <div className="space-y-6">
          <div className="rounded-3xl border bg-card p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-lg">
              <PartyPopper className="size-5 text-orange-500" />
              {t("activitiesTitle")}
            </h3>
            <ActivitiesList childId={selectedChild.id} />
          </div>

          <div className="rounded-3xl border bg-card p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-lg">
              <Backpack className="size-5 text-blue-500" />
              {t("homeworkTitle")}
            </h3>
            <HomeworkList childId={selectedChild.id} />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="font-bold text-xl">{t("notesBoardTitle")}</h3>
          <p className="text-muted-foreground text-xs">
            {t("notesBoardSubtitle")}
          </p>
        </div>
        <NotesBoard showCreateForm />
      </div>
    </div>
  );
}
