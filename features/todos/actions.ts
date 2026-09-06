"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentHousehold } from "@/lib/household";

function revalidateDashboard() {
  revalidatePath("/[locale]", "layout");
}

const addTodoSchema = z.object({
  text: z.string().trim().min(1).max(280),
});

export async function addTodo(formData: FormData) {
  const { text } = addTodoSchema.parse({ text: formData.get("text") });
  const household = await getCurrentHousehold();

  await db.todo.create({
    data: { householdId: household.id, text },
  });

  revalidateDashboard();
}

export async function toggleTodo(id: string) {
  const todo = await db.todo.findUniqueOrThrow({ where: { id } });
  await db.todo.update({
    where: { id },
    data: { completed: !todo.completed },
  });

  revalidateDashboard();
}

export async function deleteTodo(id: string) {
  await db.todo.delete({ where: { id } });
  revalidateDashboard();
}
