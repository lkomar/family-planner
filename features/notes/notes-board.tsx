import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { getCurrentHousehold } from "@/lib/household";
import { createNote } from "./actions";
import { NoteCard } from "./note-card";
import { NoteFormFields } from "./note-form-fields";

interface NotesBoardProps {
  /** Cap the number of notes shown (dashboard preview). Omit to show all. */
  limit?: number;
  /** Show the "create a note" form inline (full board only). */
  showCreateForm?: boolean;
  /** Single-column layout for a narrow dashboard tile instead of a wide grid. */
  compact?: boolean;
}

export async function NotesBoard({
  limit,
  showCreateForm = false,
  compact = false,
}: NotesBoardProps) {
  const [t, household] = await Promise.all([
    getTranslations("Notes"),
    getCurrentHousehold(),
  ]);

  const notes = await db.stickyNote.findMany({
    where: { householdId: household.id },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return (
    <div className="space-y-6">
      {showCreateForm && (
        <details className="group rounded-2xl border bg-muted/30 p-4">
          <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-sm [&::-webkit-details-marker]:hidden">
            {t("createTitle")}
            <span
              aria-hidden
              className="text-muted-foreground transition group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <form action={createNote} className="mt-4 space-y-3">
            <NoteFormFields
              idPrefix="note-create"
              labels={{
                author: t("form.author"),
                authorPlaceholder: t("form.authorPlaceholder"),
                content: t("form.content"),
                contentPlaceholder: t("form.contentPlaceholder"),
                color: t("form.color"),
              }}
            />
            <Button type="submit">{t("save")}</Button>
          </form>
        </details>
      )}

      {notes.length === 0 ? (
        <p className="py-6 text-center text-muted-foreground text-sm italic">
          {t("empty")}
        </p>
      ) : (
        <div
          className={
            compact
              ? "grid grid-cols-1 gap-3"
              : "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          }
        >
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} compact={compact} />
          ))}
        </div>
      )}
    </div>
  );
}
