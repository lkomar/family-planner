import { type NextRequest, NextResponse } from "next/server";
import createIntlProxy from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { isValidSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

const intlProxy = createIntlProxy(routing);

// Matches "/unlock", "/en/unlock", "/pl/unlock", and any sub-path of those —
// the one route that must stay reachable without a session.
const UNLOCK_PATH_PATTERN = new RegExp(
  `^/(?:(?:${routing.locales.join("|")})/)?unlock(?:/.*)?$`,
);

/**
 * Gates the whole app behind a single shared household password (see
 * features/auth/actions.ts and app/[locale]/unlock). This is deliberately
 * simple — one signed, expiring cookie, no accounts — since the goal is
 * keeping the public out of a personal deployment, not per-user identity.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = isValidSessionToken(
    request.cookies.get(SESSION_COOKIE_NAME)?.value,
  );

  if (UNLOCK_PATH_PATTERN.test(pathname)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return intlProxy(request);
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/unlock", request.url));
  }

  return intlProxy(request);
}

export const config = {
  // Skip all internal paths (_next), API routes, and files that contain a
  // dot (e.g. favicon.ico) — same matcher next-intl's own docs recommend.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
