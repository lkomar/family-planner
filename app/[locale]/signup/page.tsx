import { UserPlus } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signup } from "@/features/auth/actions";

interface SignupPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const [t, locale, { error }] = await Promise.all([
    getTranslations("Signup"),
    getLocale(),
    searchParams,
  ]);

  const rootDomain = process.env.ROOT_DOMAIN ?? "yourdomain.com";

  return (
    <div className="flex min-h-full flex-1 items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 rounded-3xl border bg-card p-8 shadow-md">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary">
            <UserPlus className="size-6" />
          </span>
          <h1 className="font-bold text-xl">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
        </div>

        <form action={signup} className="space-y-3">
          <input type="hidden" name="locale" value={locale} />

          <div className="space-y-1">
            <label
              htmlFor="householdName"
              className="block font-semibold text-muted-foreground text-xs"
            >
              {t("householdNameLabel")}
            </label>
            <Input
              id="householdName"
              name="householdName"
              required
              maxLength={100}
              placeholder={t("householdNamePlaceholder")}
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="subdomain"
              className="block font-semibold text-muted-foreground text-xs"
            >
              {t("subdomainLabel")}
            </label>
            <div className="flex items-center gap-1.5">
              <Input
                id="subdomain"
                name="subdomain"
                required
                minLength={3}
                maxLength={63}
                pattern="[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?"
                placeholder="smiths"
                className="flex-1"
              />
              <span className="whitespace-nowrap text-muted-foreground text-sm">
                .{rootDomain}
              </span>
            </div>
            {error === "taken" && (
              <p className="text-destructive text-xs">{t("errorTaken")}</p>
            )}
            {error === "invalid" && (
              <p className="text-destructive text-xs">{t("errorInvalid")}</p>
            )}
          </div>

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
              required
              minLength={8}
              placeholder={t("passwordPlaceholder")}
            />
          </div>

          <Button type="submit" className="w-full">
            {t("submit")}
          </Button>
        </form>
      </div>
    </div>
  );
}
