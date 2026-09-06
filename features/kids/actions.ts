"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";

function revalidatePlanner() {
  revalidatePath("/[locale]", "layout");
}

const homeworkSchema = z.object({
  task: z.string().trim().min(1).max(280),
});

export async function addHomework(childId: string, formData: FormData) {
  const { task } = homeworkSchema.parse({ task: formData.get("task") });
  await db.homework.create({ data: { childId, task } });
  revalidatePlanner();
}

export async function toggleHomework(id: string) {
  const homework = await db.homework.findUniqueOrThrow({ where: { id } });
  await db.homework.update({
    where: { id },
    data: { done: !homework.done },
  });
  revalidatePlanner();
}

export async function deleteHomework(id: string) {
  await db.homework.delete({ where: { id } });
  revalidatePlanner();
}
