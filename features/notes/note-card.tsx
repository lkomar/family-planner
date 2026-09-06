import { Pencil, X } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import type { NoteColor } from "@/lib/generated/prisma/enums";
import { NOTE_COLOR_CARD_CLASSES } from "@/lib/note-colors";
import { cn } from "@/lib/utils";
import { deleteNote, updateNote } from "./actions";
import { NoteFormFields } from "./note-form-fields";

interface NoteCardProps {
  note: {
    id: string;
    author: string;
    content: string;
    color: NoteColor;
  };
  compact?: boolean;
}

export async function NoteCard({ note, compact = false }: NoteCardProps) {
  const t = await getTranslations("Notes");
  const fieldLabels = {
    author: t("form.author"),
    authorPlaceholder: t("form.authorPlaceholder"),
    content: t("form.content"),
    contentPlaceholder: t("form.contentPlaceholder"),
    color: t("form.color"),
  };

  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-2xl border p-4 shadow-sm transition hover:shadow-md",
        compact ? "min-h-0" : "min-h-[160px]",
        NOTE_COLOR_CARD_CLASSES[note.color],
      )}
    >
      <div>
        <div className="mb-2 flex items-start justify-between gap-2">
          <span className="font-bold text-xs uppercase tracking-wider opacity-75">
            {note.author.trim() || t("anonymousAuthor")}
          </span>
          <div className="flex shrink-0 items-center gap-1">
            <details className="group relative">
              <summary
                aria-label={t("edit")}
                className="flex size-5 cursor-pointer list-none items-center justify-center opacity-60 hover:opacity-100 [&::-webkit-details-marker]:hidden"
              >
                <Pencil className="size-3.5" />
              </summary>
              <div className="absolute top-6 right-0 z-10 w-64 rounded-2xl border bg-popover p-4 text-popover-foreground shadow-lg">
                <form
                  action={updateNote.bind(null, note.id)}
                  className="space-y-3"
                >
                  <NoteFormFields
                    idPrefix={`note-${note.id}`}
                    labels={fieldLabels}
                    defaultValues={note}
                  />
                  <Button type="submit" size="sm" className="w-full">
                    {t("save")}
                  </Button>
                </form>
              </div>
            </details>
            <form action={deleteNote.bind(null, note.id)}>
              <button
                type="submit"
                aria-label={t("delete")}
                className="flex size-5 items-center justify-center opacity-60 hover:opacity-100"
              >
                <X className="size-3.5" />
              </button>
            </form>
          </div>
        </div>
        <p className="text-sm">{note.content}</p>
      </div>
    </div>
  );
}
