import { ListChecks, Trash } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";
import { getCurrentHousehold } from "@/lib/household";
import { addTodo, deleteTodo, toggleTodo } from "./actions";

export async function TodoList() {
  const [t, household] = await Promise.all([
    getTranslations("Dashboard.todos"),
    getCurrentHousehold(),
  ]);

  const todos = await db.todo.findMany({
    where: { householdId: household.id },
    orderBy: { createdAt: "asc" },
  });
  const remaining = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-lg">
          <span className="flex size-8 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <ListChecks className="size-4" />
          </span>
          {t("title")}
        </h3>
        <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground text-xs font-medium">
          {t("countLeft", { count: remaining })}
        </span>
      </div>

      <form action={addTodo} className="mb-4 flex gap-2">
        <Input
          name="text"
          placeholder={t("addPlaceholder")}
          maxLength={280}
          required
          aria-label={t("addPlaceholder")}
        />
        <Button type="submit" size="icon" aria-label={t("add")}>
          <span aria-hidden className="text-lg leading-none">
            +
          </span>
        </Button>
      </form>

      <div className="max-h-[300px] flex-1 space-y-2.5 overflow-y-auto pr-1">
        {todos.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground text-sm italic">
            {t("empty")}
          </p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={
                todo.completed
                  ? "flex items-center justify-between rounded-2xl border bg-muted/40 p-3 opacity-60"
                  : "flex items-center justify-between rounded-2xl border bg-card p-3 shadow-sm"
              }
            >
              <form
                action={toggleTodo.bind(null, todo.id)}
                className="flex flex-1 items-center gap-3"
              >
                <button
                  type="submit"
                  aria-pressed={todo.completed}
                  aria-label={t("toggle")}
                  className="flex size-5 shrink-0 items-center justify-center rounded-md border border-input data-[completed=true]:border-primary data-[completed=true]:bg-primary"
                  data-completed={todo.completed}
                >
                  {todo.completed && (
                    <span
                      aria-hidden
                      className="text-primary-foreground text-xs"
                    >
                      ✓
                    </span>
                  )}
                </button>
                <span
                  className={
                    todo.completed
                      ? "text-left text-muted-foreground text-sm line-through"
                      : "text-left font-medium text-sm"
                  }
                >
                  {todo.text}
                </span>
              </form>
              <form action={deleteTodo.bind(null, todo.id)}>
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
    </div>
  );
}
