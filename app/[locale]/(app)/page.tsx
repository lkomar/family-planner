import {
  PartyPopper,
  ShoppingCart,
  StickyNote as StickyNoteIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { DinnerCard } from "@/features/dinner/dinner-card";
import { NotesBoard } from "@/features/notes/notes-board";
import { TodoList } from "@/features/todos/todo-list";
import { TodayTrashWidget } from "@/features/trash/today-trash-widget";
import { DayActivities } from "@/features/dashboard/day-activities";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { GROCERY_CATEGORY_ICONS } from "@/lib/grocery-categories";
import { getCurrentHousehold } from "@/lib/household";

export default async function DashboardPage() {
  const [t, tCategory, household] = await Promise.all([
    getTranslations("Dashboard"),
    getTranslations("GroceryCategory"),
    getCurrentHousehold(),
  ]);

  const [pendingGroceries, children] = await Promise.all([
    db.groceryItem.findMany({
      where: { householdId: household.id, completed: false },
      orderBy: { createdAt: "asc" },
      take: 4,
    }),
    db.child.findMany({
      where: { householdId: household.id },
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-3xl border-2 border-amber-300 border-dashed bg-gradient-to-r from-amber-200 via-amber-100 to-yellow-100 p-6 shadow-sm dark:border-amber-800 dark:from-amber-950 dark:via-amber-900/40 dark:to-yellow-950/40 md:flex-row">
        <div className="pointer-events-none absolute -right-6 -bottom-6 text-9xl text-amber-300/30 dark:text-amber-700/20">
          <StickyNoteIcon className="size-32" />
        </div>
        <div className="z-10 space-y-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 font-bold text-white text-xs uppercase tracking-wider shadow-sm">
            <PartyPopper className="size-3.5" />
            {t("badge")}
          </span>
          <h2 className="font-bold text-2xl text-amber-900 sm:text-3xl dark:text-amber-100">
            {t("welcomeTitle", { name: household.name })}
          </h2>
          <p className="max-w-xl text-amber-800 text-sm dark:text-amber-200">
            {t("welcomeSubtitle")}
          </p>
        </div>
        <TodayTrashWidget />
      </div>

      {children.length > 0 && (
        <DayActivities
          childList={children.map((child) => ({
            id: child.id,
            name: child.name,
            grade: child.grade,
          }))}
        />
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex flex-col rounded-3xl border bg-card p-5 shadow-md">
          <TodoList />
        </div>

        <div className="flex flex-col justify-between rounded-3xl border bg-card p-5 shadow-md">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-bold text-lg">
                <span className="flex size-8 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400">
                  <StickyNoteIcon className="size-4" />
                </span>
                {t("notesTitle")}
              </h3>
            </div>
            <NotesBoard limit={3} compact />
          </div>
          <div className="mt-4 flex items-center justify-between border-t pt-3 text-muted-foreground text-xs">
            <span>{t("notesPinnedHint")}</span>
            <Link
              href="/planner"
              className="font-semibold text-primary hover:underline"
            >
              {t("viewAllNotes")}
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-3xl border bg-card p-5 shadow-md">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-bold text-lg">
                <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <ShoppingCart className="size-4" />
                </span>
                {t("groceryWatchTitle")}
              </h3>
              <Link
                href="/groceries"
                className="font-semibold text-primary text-xs hover:underline"
              >
                {t("openList")}
              </Link>
            </div>
            <p className="mb-3 text-muted-foreground text-xs">
              {t("groceryWatchSubtitle")}
            </p>
            <div className="max-h-[220px] space-y-2 overflow-y-auto">
              {pendingGroceries.length === 0 ? (
                <p className="text-muted-foreground text-xs italic">
                  {t("groceryWatchEmpty")}
                </p>
              ) : (
                pendingGroceries.map((item) => {
                  const CategoryIcon = GROCERY_CATEGORY_ICONS[item.category];
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl border bg-muted/40 p-2.5 text-xs"
                    >
                      <span className="font-medium">{item.name}</span>
                      <span className="flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <CategoryIcon className="size-3" />
                        {tCategory(item.category)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <DinnerCard />
        </div>
      </div>
    </div>
  );
}
