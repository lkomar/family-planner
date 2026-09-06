import { Pencil, Trash } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteChild, updateChild } from "./actions";

interface ChildRowProps {
  child: { id: string; name: string; grade: string };
}

export async function ChildRow({ child }: ChildRowProps) {
  const t = await getTranslations("Family");

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border bg-card p-3">
      <div className="min-w-0">
        <h4 className="truncate font-semibold text-sm">{child.name}</h4>
        <p className="truncate text-muted-foreground text-xs">{child.grade}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <details className="group relative">
          <summary
            aria-label={t("editChild")}
            className="flex size-8 cursor-pointer list-none items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground [&::-webkit-details-marker]:hidden"
          >
            <Pencil className="size-4" />
          </summary>
          <div className="absolute top-9 right-0 z-10 w-64 space-y-3 rounded-2xl border bg-popover p-4 text-popover-foreground shadow-lg">
            <form
              action={updateChild.bind(null, child.id)}
              className="space-y-3"
            >
              <div className="space-y-1">
                <label
                  htmlFor={`child-${child.id}-name`}
                  className="block font-semibold text-muted-foreground text-xs"
                >
                  {t("nameLabel")}
                </label>
                <Input
                  id={`child-${child.id}-name`}
                  name="name"
                  required
                  maxLength={80}
                  defaultValue={child.name}
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor={`child-${child.id}-grade`}
                  className="block font-semibold text-muted-foreground text-xs"
                >
                  {t("gradeLabel")}
                </label>
                <Input
                  id={`child-${child.id}-grade`}
                  name="grade"
                  required
                  maxLength={40}
                  defaultValue={child.grade}
                />
              </div>
              <Button type="submit" size="sm" className="w-full">
                {t("save")}
              </Button>
            </form>
          </div>
        </details>
        <form action={deleteChild.bind(null, child.id)}>
          <Button
            type="submit"
            variant="ghost"
            size="icon-sm"
            aria-label={t("deleteChild")}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash />
          </Button>
        </form>
      </div>
    </div>
  );
}
