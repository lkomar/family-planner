import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const t = await getTranslations("HomePage");

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between px-4 py-3 sm:px-8">
        <span className="text-sm font-semibold">{t("title")}</span>
        <LanguageSwitcher />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center sm:px-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("title")}
        </h1>
        <p className="max-w-md text-balance text-muted-foreground">
          {t("subtitle")}
        </p>
        <Button size="lg">{t("getStarted")}</Button>
      </main>
    </div>
  );
}
