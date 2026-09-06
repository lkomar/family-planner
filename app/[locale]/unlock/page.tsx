import { KeyRound } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { unlock } from "@/features/auth/actions";

interface UnlockPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function UnlockPage({ searchParams }: UnlockPageProps) {
  const [t, locale, { error }] = await Promise.all([
    getTranslations("Unlock"),
    getLocale(),
    searchParams,
  ]);

  return (
    <div className="flex min-h-full flex-1 items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4 rounded-3xl border bg-card p-8 shadow-md">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary">
            <KeyRound className="size-6" />
          </span>
          <h1 className="font-bold text-xl">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
        </div>

        <form action={unlock} className="space-y-3">
          <input type="hidden" name="locale" value={locale} />
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block font-semibold text-muted-foreground text-xs"
            >
              {t("passwordLabel")}
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoFocus
              required
              placeholder={t("passwordPlaceholder")}
              aria-invalid={error === "1"}
            />
            {error === "1" && (
              <p className="text-destructive text-xs">{t("error")}</p>
            )}
          </div>
          <Button type="submit" className="w-full">
            {t("submit")}
          </Button>
        </form>
      </div>
    </div>
  );
}
