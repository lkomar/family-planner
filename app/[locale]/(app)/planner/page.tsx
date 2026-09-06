import { Backpack, PartyPopper, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { ActivitiesList } from "@/features/kids/activities-list";
import { ChildTabs } from "@/features/kids/child-tabs";
import { HomeworkList } from "@/features/kids/homework-list";
import { Timetable } from "@/features/kids/timetable";
import { NotesBoard } from "@/features/notes/notes-board";
import { Link } from "@/i18n/navigation";
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

  const selectedChild =
    children.find((child) => child.id === requestedChildId) ?? children[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border bg-card p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h2 className="font-bold text-2xl">{t("title")}</h2>
          <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
        </div>
        {selectedChild && (
          <ChildTabs childList={children} selectedChildId={selectedChild.id} />
        )}
      </div>

      {selectedChild ? (
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
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-3xl border bg-card p-10 text-center shadow-sm">
          <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Users className="size-6" />
          </span>
          <p className="max-w-sm text-muted-foreground text-sm">
            {t("noChildren")}
          </p>
          <Button asChild>
            <Link href="/family">{t("addChildLink")}</Link>
          </Button>
        </div>
      )}

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
