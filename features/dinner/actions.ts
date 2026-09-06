"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentHousehold } from "@/lib/household";

const updateDinnerSchema = z.object({
  dinner: z.string().trim().max(200),
});

export async function updateDinner(formData: FormData) {
  const { dinner } = updateDinnerSchema.parse({
    dinner: formData.get("dinner"),
  });
  const household = await getCurrentHousehold();

  await db.household.update({
    where: { id: household.id },
    data: { dinnerTonight: dinner || null },
  });

  revalidatePath("/[locale]", "layout");
}
