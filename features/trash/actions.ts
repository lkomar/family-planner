"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentHousehold } from "@/lib/household";

const WASTE_TYPES = [
  "GENERAL",
  "ORGANIC",
  "PLASTICS_METALS",
  "PAPER_CARDBOARD",
  "GLASS",
  "HAZARDOUS",
] as const;

const trashGuideItemSchema = z.object({
  item: z.string().trim().min(1).max(120),
  wasteType: z.enum(WASTE_TYPES),
});

export async function addTrashGuideItem(formData: FormData) {
  const data = trashGuideItemSchema.parse({
    item: formData.get("item"),
    wasteType: formData.get("wasteType"),
  });
  const household = await getCurrentHousehold();

  await db.trashGuideItem.create({
    data: { householdId: household.id, ...data },
  });

  revalidatePath("/[locale]", "layout");
}

export async function deleteTrashGuideItem(id: string) {
  await db.trashGuideItem.delete({ where: { id } });
  revalidatePath("/[locale]", "layout");
}
