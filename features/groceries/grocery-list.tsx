import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import type { GroceryCategory } from "@/lib/generated/prisma/enums";
import {
  GROCERY_CATEGORY_ICONS,
  GROCERY_CATEGORY_ORDER,
} from "@/lib/grocery-categories";
import { getCurrentHousehold } from "@/lib/household";
import { cn } from "@/lib/utils";
import {
  addGroceryItem,
  clearCompletedGroceries,
  deleteGroceryItem,
  toggleGroceryItem,
} from "./actions";

interface GroceryListProps {
  categoryFilter?: GroceryCategory;
}

export async function GroceryList({ categoryFilter }: GroceryListProps) {
  const [t, tCategory, household] = await Promise.all([
    getTranslations("Groceries"),
    getTranslations("GroceryCategory"),
    getCurrentHousehold(),
  ]);

  const items = await db.groceryItem.findMany({
    where: {
      householdId: household.id,
      ...(categoryFilter ? { category: categoryFilter } : {}),
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border bg-card p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h2 className="font-bold text-2xl">{t("title")}</h2>
          <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
        </div>
        <form action={clearCompletedGroceries}>
          <Button type="submit" variant="outline" size="sm">
            {t("clearChecked")}
          </Button>
        </form>
      </div>

      <div className="space-y-6 rounded-3xl border bg-card p-6 shadow-sm">
        <form
          action={addGroceryItem}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <Input
            name="name"
            required
            maxLength={120}
            placeholder={t("addPlaceholder")}
            aria-label={t("addPlaceholder")}
            className="flex-1"
          />
          <select
            name="category"
            defaultValue={categoryFilter ?? GROCERY_CATEGORY_ORDER[0]}
            aria-label={t("categoryLabel")}
            className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {GROCERY_CATEGORY_ORDER.map((category) => (
              <option key={category} value={category}>
                {tCategory(category)}
              </option>
            ))}
          </select>
          <Input
            name="quantity"
            maxLength={120}
            placeholder={t("quantityPlaceholder")}
            aria-label={t("quantityPlaceholder")}
            className="sm:w-48"
          />
          <Button type="submit">
            <Plus /> {t("add")}
          </Button>
        </form>

        <div className="flex flex-wrap gap-2 border-b pb-4">
          <Link
            href="/groceries"
            className={cn(
              "rounded-xl px-4 py-1.5 font-semibold text-xs transition",
              !categoryFilter
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/70",
            )}
          >
            {t("filterAll")}
          </Link>
          {GROCERY_CATEGORY_ORDER.map((category) => (
            <Link
              key={category}
              href={{ pathname: "/groceries", query: { category } }}
              className={cn(
                "rounded-xl px-4 py-1.5 font-semibold text-xs transition",
                categoryFilter === category
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/70",
              )}
            >
              {tCategory(category)}
            </Link>
          ))}
        </div>

        {items.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground text-sm italic">
            {t("empty")}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const CategoryIcon = GROCERY_CATEGORY_ICONS[item.category];
              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-2xl border p-4 transition",
                    item.completed
                      ? "bg-muted/40 opacity-60"
                      : "bg-card shadow-sm hover:border-primary/40",
                  )}
                >
                  <form
                    action={toggleGroceryItem.bind(null, item.id)}
                    className="flex min-w-0 flex-1 items-center gap-3"
                  >
                    <button
                      type="submit"
                      aria-pressed={item.completed}
                      aria-label={t("toggle")}
                      data-completed={item.completed}
                      className="flex size-5 shrink-0 items-center justify-center rounded-md border border-input data-[completed=true]:border-primary data-[completed=true]:bg-primary"
                    >
                      {item.completed && (
                        <span
                          aria-hidden
                          className="text-primary-foreground text-xs"
                        >
                          ✓
                        </span>
                      )}
                    </button>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <CategoryIcon className="size-4" />
                    </span>
                    <div className="min-w-0 text-left">
                      <h4
                        className={cn(
                          "truncate font-semibold text-sm",
                          item.completed &&
                            "text-muted-foreground line-through",
                        )}
                      >
                        {item.name}
                      </h4>
                      {item.quantity && (
                        <p className="truncate text-muted-foreground text-xs">
                          {item.quantity}
                        </p>
                      )}
                    </div>
                  </form>
                  <form action={deleteGroceryItem.bind(null, item.id)}>
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={t("delete")}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <span aria-hidden>×</span>
                    </Button>
                  </form>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
