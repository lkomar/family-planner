import { Trash } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { addHomework, deleteHomework, toggleHomework } from "./actions";

interface HomeworkListProps {
  childId: string;
}

export async function HomeworkList({ childId }: HomeworkListProps) {
  const t = await getTranslations("Planner");

  const homework = await db.homework.findMany({
    where: { childId },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-2.5">
      <form
        action={addHomework.bind(null, childId)}
        className="mb-3 flex gap-2"
      >
        <Input
          name="task"
          required
          maxLength={280}
          placeholder={t("addHomeworkPlaceholder")}
          aria-label={t("addHomeworkPlaceholder")}
          className="h-8 text-xs"
        />
        <Button type="submit" size="icon-sm" aria-label={t("add")}>
          <span aria-hidden className="text-sm leading-none">
            +
          </span>
        </Button>
      </form>

      {homework.length === 0 ? (
        <p className="py-4 text-center text-muted-foreground text-xs italic">
          {t("homeworkEmpty")}
        </p>
      ) : (
        homework.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center justify-between rounded-xl border p-2.5 text-xs transition",
              item.done
                ? "bg-muted/40 text-muted-foreground line-through"
                : "bg-card",
            )}
          >
            <form
              action={toggleHomework.bind(null, item.id)}
              className="flex flex-1 items-center gap-2"
            >
              <button
                type="submit"
                aria-pressed={item.done}
                aria-label={t("toggle")}
                data-completed={item.done}
                className="flex size-4 shrink-0 items-center justify-center rounded border border-input data-[completed=true]:border-primary data-[completed=true]:bg-primary"
              >
                {item.done && (
                  <span
                    aria-hidden
                    className="text-[10px] text-primary-foreground"
                  >
                    ✓
                  </span>
                )}
              </button>
              <span className={cn(!item.done && "font-medium text-foreground")}>
                {item.task}
              </span>
            </form>
            <form action={deleteHomework.bind(null, item.id)}>
              <Button
                type="submit"
                variant="ghost"
                size="icon-sm"
                aria-label={t("delete")}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash />
              </Button>
            </form>
          </div>
        ))
      )}
    </div>
  );
}
