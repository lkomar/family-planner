"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentHousehold } from "@/lib/household";

function revalidateFamily() {
  revalidatePath("/[locale]", "layout");
}

const householdNameSchema = z.object({
  name: z.string().trim().min(1).max(100),
});

export async function updateHouseholdName(formData: FormData) {
  const { name } = householdNameSchema.parse({ name: formData.get("name") });
  const household = await getCurrentHousehold();

  await db.household.update({
    where: { id: household.id },
    data: { name },
  });

  revalidateFamily();
}

const childSchema = z.object({
  name: z.string().trim().min(1).max(80),
  grade: z.string().trim().min(1).max(40),
});

export async function addChild(formData: FormData) {
  const data = childSchema.parse({
    name: formData.get("name"),
    grade: formData.get("grade"),
  });
  const household = await getCurrentHousehold();

  const childCount = await db.child.count({
    where: { householdId: household.id },
  });

  await db.child.create({
    data: { householdId: household.id, order: childCount, ...data },
  });

  revalidateFamily();
}

export async function updateChild(id: string, formData: FormData) {
  const data = childSchema.parse({
    name: formData.get("name"),
    grade: formData.get("grade"),
  });

  await db.child.update({ where: { id }, data });

  revalidateFamily();
}

export async function deleteChild(id: string) {
  // Cascades to that child's timetable slots, activities, and homework
  // (see prisma/schema.prisma).
  await db.child.delete({ where: { id } });

  revalidateFamily();
}
