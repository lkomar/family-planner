import {
  Carrot,
  Croissant,
  Milk,
  Package,
  Popcorn,
  SprayCan,
} from "lucide-react";
import type { GroceryCategory } from "@/lib/generated/prisma/enums";

export const GROCERY_CATEGORY_ORDER: GroceryCategory[] = [
  "PRODUCE",
  "DAIRY_EGGS",
  "BAKERY",
  "PANTRY",
  "HOUSEHOLD",
  "SNACKS_DRINKS",
];

export const GROCERY_CATEGORY_ICONS: Record<GroceryCategory, typeof Carrot> = {
  PRODUCE: Carrot,
  DAIRY_EGGS: Milk,
  BAKERY: Croissant,
  PANTRY: Package,
  HOUSEHOLD: SprayCan,
  SNACKS_DRINKS: Popcorn,
};
