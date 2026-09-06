"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import type { GroceryCategory } from "@/lib/generated/prisma/enums";
import { GROCERY_CATEGORY_ORDER } from "@/lib/grocery-categories";
import { getCurrentHousehold } from "@/lib/household";

function revalidateGroceries() {
  revalidatePath("/[locale]", "layout");
}

const groceryItemSchema = z.object({
  name: z.string().trim().min(1).max(120),
  category: z.enum(
    GROCERY_CATEGORY_ORDER as [GroceryCategory, ...GroceryCategory[]],
  ),
  quantity: z.string().trim().max(120),
});

export async function addGroceryItem(formData: FormData) {
  const data = groceryItemSchema.parse({
    name: formData.get("name"),
    category: formData.get("category"),
    quantity: formData.get("quantity") ?? "",
  });
  const household = await getCurrentHousehold();

  await db.groceryItem.create({
    data: {
      householdId: household.id,
      name: data.name,
      category: data.category,
      quantity: data.quantity || null,
    },
  });

  revalidateGroceries();
}

export async function toggleGroceryItem(id: string) {
  const item = await db.groceryItem.findUniqueOrThrow({ where: { id } });
  await db.groceryItem.update({
    where: { id },
    data: { completed: !item.completed },
  });

  revalidateGroceries();
}

export async function deleteGroceryItem(id: string) {
  await db.groceryItem.delete({ where: { id } });
  revalidateGroceries();
}

export async function clearCompletedGroceries() {
  const household = await getCurrentHousehold();
  await db.groceryItem.deleteMany({
    where: { householdId: household.id, completed: true },
  });

  revalidateGroceries();
}
