"use server";

import { cookies, headers } from "next/headers";
import { notFound, redirect as redirectAbsolute } from "next/navigation";
import { hasLocale } from "next-intl";
import { z } from "zod";
import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  createSessionToken,
  hashPassword,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  verifyPassword,
} from "@/lib/auth";
import { db } from "@/lib/db";
import { getRequestSubdomain } from "@/lib/tenant";

/**
 * `next-intl`'s locale getters don't work inside Server Actions (there's no
 * route context to read it from), so pages pass it through as a hidden
 * field instead — see app/[locale]/unlock and app/[locale]/signup.
 */
function readLocale(formData: FormData) {
  const raw = String(formData.get("locale") ?? "");
  return hasLocale(routing.locales, raw) ? raw : routing.defaultLocale;
}

function setSessionCookie(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  subdomain: string,
) {
  const rootDomain = process.env.ROOT_DOMAIN;

  cookieStore.set(SESSION_COOKIE_NAME, createSessionToken(subdomain), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
    // Without this, a cookie set while on the root domain (signup) or a
    // *different* subdomain never reaches the tenant it's actually for —
    // cookies default to the exact host that set them. Safe to broaden:
    // the token itself is bound to `subdomain` (see lib/auth.ts), so this
    // only controls whether the browser *attaches* it, not which tenant it
    // unlocks.
    domain: rootDomain ? `.${rootDomain}` : undefined,
  });
}

export async function unlock(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const locale = readLocale(formData);

  const subdomain = await getRequestSubdomain();
  if (!subdomain) notFound();

  const household = await db.household.findUnique({ where: { subdomain } });
  if (!household || !verifyPassword(password, household.passwordHash)) {
    redirect({ href: { pathname: "/unlock", query: { error: "1" } }, locale });
  }

  setSessionCookie(await cookies(), subdomain);
  redirect({ href: "/", locale });
}

const RESERVED_SUBDOMAINS = new Set([
  "www",
  "api",
  "app",
  "admin",
  "mail",
  "ftp",
  "unlock",
  "signup",
  "assets",
  "static",
]);

const signupSchema = z.object({
  householdName: z.string().trim().min(1).max(100),
  subdomain: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(63)
    .regex(
      /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/,
      "Lowercase letters, numbers, and hyphens only.",
    )
    .refine(
      (value) => !RESERVED_SUBDOMAINS.has(value),
      "That name is reserved.",
    ),
  password: z.string().min(8).max(200),
});

export async function signup(formData: FormData) {
  const locale = readLocale(formData);

  const parsed = signupSchema.safeParse({
    householdName: formData.get("householdName"),
    subdomain: formData.get("subdomain"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect({
      href: { pathname: "/signup", query: { error: "invalid" } },
      locale,
    });
    return;
  }

  const { householdName, subdomain, password } = parsed.data;

  const existing = await db.household.findUnique({ where: { subdomain } });
  if (existing) {
    redirect({
      href: { pathname: "/signup", query: { error: "taken" } },
      locale,
    });
    return;
  }

  await db.household.create({
    data: {
      name: householdName,
      subdomain,
      passwordHash: hashPassword(password),
    },
  });

  setSessionCookie(await cookies(), subdomain);

  const rootDomain = process.env.ROOT_DOMAIN;
  if (!rootDomain) {
    // Local dev has no real subdomain to jump to — ROOT_DOMAIN is unset, so
    // every host already resolves to DEV_SUBDOMAIN (see lib/tenant.ts).
    redirect({ href: "/", locale });
    return;
  }

  // Cross-subdomain, so this needs an absolute-URL redirect — next-intl's
  // `redirect` only knows about paths on the current origin. Match the
  // current request's protocol and port (e.g. plain http on localhost:3000,
  // or https with no port once this is behind a real domain) instead of
  // assuming https on the default port.
  const headersList = await headers();
  const protocol =
    headersList.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "production" ? "https" : "http");
  const currentHost = headersList.get("host") ?? rootDomain;
  const port = currentHost.includes(":") ? `:${currentHost.split(":")[1]}` : "";

  redirectAbsolute(`${protocol}://${subdomain}.${rootDomain}${port}/${locale}`);
}
