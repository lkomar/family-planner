import { GroceryList } from "@/features/groceries/grocery-list";
import type { GroceryCategory } from "@/lib/generated/prisma/enums";
import { GROCERY_CATEGORY_ORDER } from "@/lib/grocery-categories";

interface GroceriesPageProps {
  searchParams: Promise<{ category?: string }>;
}

function isGroceryCategory(
  value: string | undefined,
): value is GroceryCategory {
  return GROCERY_CATEGORY_ORDER.includes(value as GroceryCategory);
}

export default async function GroceriesPage({
  searchParams,
}: GroceriesPageProps) {
  const { category } = await searchParams;

  return (
    <GroceryList
      categoryFilter={isGroceryCategory(category) ? category : undefined}
    />
  );
}
