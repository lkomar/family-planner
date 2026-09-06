import { ChefHat, Pencil } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCurrentHousehold } from "@/lib/household";
import { updateDinner } from "./actions";

export async function DinnerCard() {
  const [t, household] = await Promise.all([
    getTranslations("Dashboard.dinner"),
    getCurrentHousehold(),
  ]);

  return (
    <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border bg-primary/5 p-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
          <ChefHat className="size-5" />
        </span>
        <div className="min-w-0">
          <h5 className="font-bold text-xs">{t("title")}</h5>
          <p className="truncate font-medium text-foreground text-xs">
            {household.dinnerTonight || t("empty")}
          </p>
        </div>
      </div>
      <form action={updateDinner} className="flex shrink-0 items-center gap-1">
        <Input
          name="dinner"
          defaultValue={household.dinnerTonight ?? ""}
          placeholder={t("placeholder")}
          aria-label={t("placeholder")}
          maxLength={200}
          className="h-8 w-36 text-xs"
        />
        <Button
          type="submit"
          size="icon-sm"
          variant="ghost"
          aria-label={t("save")}
        >
          <Pencil />
        </Button>
      </form>
    </div>
  );
}
