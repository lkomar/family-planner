import { Plus, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addChild, updateHouseholdName } from "@/features/family/actions";
import { ChildRow } from "@/features/family/child-row";
import { db } from "@/lib/db";
import { getCurrentHousehold } from "@/lib/household";

export default async function FamilyPage() {
  const [t, household] = await Promise.all([
    getTranslations("Family"),
    getCurrentHousehold(),
  ]);

  const children = await db.child.findMany({
    where: { householdId: household.id },
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border bg-card p-6 shadow-sm">
        <h2 className="font-bold text-2xl">{t("title")}</h2>
        <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
      </div>

      <div className="rounded-3xl border bg-card p-6 shadow-sm">
        <h3 className="mb-4 font-bold text-lg">{t("householdNameTitle")}</h3>
        <form action={updateHouseholdName} className="flex max-w-sm gap-2">
          <Input
            name="name"
            required
            maxLength={100}
            defaultValue={household.name}
            aria-label={t("householdNameLabel")}
          />
          <Button type="submit">{t("save")}</Button>
        </form>
      </div>

      <div className="rounded-3xl border bg-card p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 font-bold text-lg">
          <span className="flex size-8 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <Users className="size-4" />
          </span>
          {t("childrenTitle")}
        </h3>

        {children.length === 0 ? (
          <p className="mb-4 text-muted-foreground text-sm italic">
            {t("childrenEmpty")}
          </p>
        ) : (
          <div className="mb-4 space-y-3">
            {children.map((child) => (
              <ChildRow key={child.id} child={child} />
            ))}
          </div>
        )}

        <details className="group rounded-2xl border bg-muted/30 p-4">
          <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-sm [&::-webkit-details-marker]:hidden">
            {t("addChildTitle")}
            <span
              aria-hidden
              className="text-muted-foreground transition group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <form
            action={addChild}
            className="mt-4 flex flex-col gap-2 sm:flex-row"
          >
            <Input
              name="name"
              required
              maxLength={80}
              placeholder={t("namePlaceholder")}
              aria-label={t("nameLabel")}
              className="flex-1"
            />
            <Input
              name="grade"
              required
              maxLength={40}
              placeholder={t("gradePlaceholder")}
              aria-label={t("gradeLabel")}
              className="sm:w-48"
            />
            <Button type="submit">
              <Plus /> {t("add")}
            </Button>
          </form>
        </details>
      </div>
    </div>
  );
}
