import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ locale }) => {
  // `locale` is only pre-filled when an awaitable server function (e.g.
  // getTranslations({ locale })) explicitly overrides it. Otherwise resolve
  // it from the `[locale]` root param, which the proxy guarantees is set.
  if (!locale) {
    const paramValue = await rootLocale();
    if (!hasLocale(routing.locales, paramValue)) notFound();
    locale = paramValue;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
