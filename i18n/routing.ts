import { defineRouting } from "next-intl/routing";

/**
 * Single source of truth for which locales this app ships and which one
 * requests fall back to. Add a locale here and a matching messages/<locale>.json
 * file to support another language — nothing else needs to change.
 */
export const routing = defineRouting({
  locales: ["en", "pl"],
  defaultLocale: "en",
});

export type AppLocale = (typeof routing.locales)[number];
