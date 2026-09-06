"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import type { NoteColor } from "@/lib/generated/prisma/enums";
import { getCurrentHousehold } from "@/lib/household";
import { NOTE_COLOR_ORDER } from "@/lib/note-colors";

function revalidateNotes() {
  revalidatePath("/[locale]", "layout");
}

const noteSchema = z.object({
  author: z.string().trim().max(60),
  content: z.string().trim().min(1).max(500),
  color: z.enum(NOTE_COLOR_ORDER as [NoteColor, ...NoteColor[]]),
});

function parseNoteForm(formData: FormData) {
  return noteSchema.parse({
    author: formData.get("author"),
    content: formData.get("content"),
    color: formData.get("color"),
  });
}

export async function createNote(formData: FormData) {
  const data = parseNoteForm(formData);
  const household = await getCurrentHousehold();

  await db.stickyNote.create({
    data: { householdId: household.id, ...data },
  });

  revalidateNotes();
}

export async function updateNote(id: string, formData: FormData) {
  const data = parseNoteForm(formData);

  await db.stickyNote.update({
    where: { id },
    data,
  });

  revalidateNotes();
}

export async function deleteNote(id: string) {
  await db.stickyNote.delete({ where: { id } });
  revalidateNotes();
}
