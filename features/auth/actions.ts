"use server";

import { cookies } from "next/headers";
import { hasLocale } from "next-intl";
import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  verifySitePassword,
} from "@/lib/auth";

export async function unlock(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  // `next-intl`'s locale getters don't work inside Server Actions (there's no
  // route context to read it from), so the page passes it through as a
  // hidden field instead — see app/[locale]/unlock/page.tsx.
  const rawLocale = String(formData.get("locale") ?? "");
  const locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale;

  if (!verifySitePassword(password)) {
    redirect({ href: { pathname: "/unlock", query: { error: "1" } }, locale });
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  redirect({ href: "/", locale });
}
