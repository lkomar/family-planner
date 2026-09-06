import {
  Apple,
  Coffee,
  Newspaper,
  Recycle,
  Trash,
  TriangleAlert,
  Wine,
} from "lucide-react";
import type { WasteType } from "@/lib/generated/prisma/enums";

export const WASTE_TYPE_ICONS: Record<WasteType, typeof Trash> = {
  GENERAL: Trash,
  ORGANIC: Apple,
  PLASTICS_METALS: Recycle,
  PAPER_CARDBOARD: Newspaper,
  GLASS: Wine,
  HAZARDOUS: TriangleAlert,
  NONE: Coffee,
};

/** Background color for the type's icon badge — decorative, not brand-driven. */
export const WASTE_TYPE_COLOR_CLASSES: Record<WasteType, string> = {
  GENERAL: "bg-slate-700 dark:bg-slate-600",
  ORGANIC: "bg-emerald-600",
  PLASTICS_METALS: "bg-amber-500",
  PAPER_CARDBOARD: "bg-blue-600",
  GLASS: "bg-purple-600",
  HAZARDOUS: "bg-red-600",
  NONE: "bg-slate-400",
};
