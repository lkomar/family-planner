import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { NoteColor } from "@/lib/generated/prisma/enums";
import { NOTE_COLOR_ORDER, NOTE_COLOR_SWATCH_CLASSES } from "@/lib/note-colors";
import { cn } from "@/lib/utils";

interface NoteFormFieldsProps {
  idPrefix: string;
  labels: {
    author: string;
    authorPlaceholder: string;
    content: string;
    contentPlaceholder: string;
    color: string;
  };
  defaultValues?: {
    author: string;
    content: string;
    color: NoteColor;
  };
}

/** Shared fields for the create-note and edit-note forms. */
export function NoteFormFields({
  idPrefix,
  labels,
  defaultValues,
}: NoteFormFieldsProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label
          htmlFor={`${idPrefix}-author`}
          className="block font-semibold text-muted-foreground text-xs"
        >
          {labels.author}
        </label>
        <Input
          id={`${idPrefix}-author`}
          name="author"
          maxLength={60}
          placeholder={labels.authorPlaceholder}
          defaultValue={defaultValues?.author}
        />
      </div>
      <div className="space-y-1">
        <label
          htmlFor={`${idPrefix}-content`}
          className="block font-semibold text-muted-foreground text-xs"
        >
          {labels.content}
        </label>
        <Textarea
          id={`${idPrefix}-content`}
          name="content"
          rows={4}
          required
          maxLength={500}
          placeholder={labels.contentPlaceholder}
          defaultValue={defaultValues?.content}
        />
      </div>
      <div className="space-y-1">
        <span className="block font-semibold text-muted-foreground text-xs">
          {labels.color}
        </span>
        <div className="flex gap-3">
          {NOTE_COLOR_ORDER.map((color) => (
            <label key={color} className="cursor-pointer">
              <input
                type="radio"
                name="color"
                value={color}
                defaultChecked={(defaultValues?.color ?? "YELLOW") === color}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "block size-8 rounded-full border-2 border-transparent shadow-sm peer-checked:border-primary",
                  NOTE_COLOR_SWATCH_CLASSES[color],
                )}
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
