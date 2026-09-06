"use client";

import { Search, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { WasteType } from "@/lib/generated/prisma/enums";
import { WASTE_TYPE_COLOR_CLASSES, WASTE_TYPE_ICONS } from "@/lib/waste-types";
import { deleteTrashGuideItem } from "./actions";

interface TrashGuideSearchProps {
  items: Array<{ id: string; item: string; wasteType: WasteType }>;
}

export function TrashGuideSearch({ items }: TrashGuideSearchProps) {
  const t = useTranslations("Trash");
  const tWasteType = useTranslations("WasteType");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items;
    return items.filter(
      (entry) =>
        entry.item.toLowerCase().includes(normalized) ||
        tWasteType(`${entry.wasteType}.name`)
          .toLowerCase()
          .includes(normalized),
    );
  }, [items, query, tWasteType]);

  return (
    <div>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-bold text-xl">{t("dictionaryTitle")}</h3>
          <p className="text-muted-foreground text-xs">
            {t("dictionarySubtitle")}
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            className="pl-9"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground text-sm italic">
          {t("dictionaryEmpty")}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((entry) => {
            const Icon = WASTE_TYPE_ICONS[entry.wasteType];
            return (
              <div
                key={entry.id}
                className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm"
              >
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ${WASTE_TYPE_COLOR_CLASSES[entry.wasteType]}`}
                >
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="truncate font-bold text-sm">{entry.item}</h5>
                  <p className="font-semibold text-emerald-600 text-xs dark:text-emerald-400">
                    {t("binLabel", {
                      bin: tWasteType(`${entry.wasteType}.name`),
                    })}
                  </p>
                </div>
                <form action={deleteTrashGuideItem.bind(null, entry.id)}>
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
            );
          })}
        </div>
      )}
    </div>
  );
}
