import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";
import { getCurrentHousehold } from "@/lib/household";
import { addTrashGuideItem } from "./actions";
import { TrashGuideSearch } from "./trash-guide-search";

const WASTE_TYPES_FOR_GUIDE = [
  "GENERAL",
  "ORGANIC",
  "PLASTICS_METALS",
  "PAPER_CARDBOARD",
  "GLASS",
  "HAZARDOUS",
] as const;

export async function TrashGuide() {
  const [t, tWasteType, household] = await Promise.all([
    getTranslations("Trash"),
    getTranslations("WasteType"),
    getCurrentHousehold(),
  ]);

  const items = await db.trashGuideItem.findMany({
    where: { householdId: household.id },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm">
      <form
        action={addTrashGuideItem}
        className="mb-6 flex flex-col gap-2 sm:flex-row"
      >
        <Input
          name="item"
          required
          maxLength={120}
          placeholder={t("addItemPlaceholder")}
          aria-label={t("addItemPlaceholder")}
          className="flex-1"
        />
        <select
          name="wasteType"
          defaultValue={WASTE_TYPES_FOR_GUIDE[0]}
          aria-label={t("binSelectLabel")}
          className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {WASTE_TYPES_FOR_GUIDE.map((wasteType) => (
            <option key={wasteType} value={wasteType}>
              {tWasteType(`${wasteType}.name`)}
            </option>
          ))}
        </select>
        <Button type="submit">
          <Plus /> {t("add")}
        </Button>
      </form>

      <TrashGuideSearch items={items} />
    </div>
  );
}
