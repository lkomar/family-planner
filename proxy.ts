import { type NextRequest, NextResponse } from "next/server";
import createIntlProxy from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { isValidSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { extractSubdomain } from "@/lib/tenant";

const intlProxy = createIntlProxy(routing);

// Matches "/unlock", "/en/unlock", "/pl/unlock", and sub-paths of those.
const UNLOCK_PATH_PATTERN = new RegExp(
  `^/(?:(?:${routing.locales.join("|")})/)?unlock(?:/.*)?$`,
);
// Same, for "/signup" — the only route reachable with no tenant resolved.
const SIGNUP_PATH_PATTERN = new RegExp(
  `^/(?:(?:${routing.locales.join("|")})/)?signup(?:/.*)?$`,
);

/**
 * Resolves which household (tenant) a request belongs to, from its
 * hostname. `null` means the apex/marketing host — no tenant, only signup
 * lives there. Mirrors lib/tenant.ts's `getRequestSubdomain`, but reads the
 * hostname straight off `NextRequest` instead of `next/headers` (not
 * available this early).
 */
function resolveSubdomain(request: NextRequest): string | null {
  const rootDomain = process.env.ROOT_DOMAIN;
  if (!rootDomain) return process.env.DEV_SUBDOMAIN ?? "demo";
  return extractSubdomain(request.nextUrl.hostname, rootDomain);
}

/**
 * Gates each tenant's space behind its own shared household password (see
 * features/auth/actions.ts and app/[locale]/unlock). Deliberately simple —
 * one signed, expiring, tenant-bound cookie, no accounts — since the goal is
 * keeping each family's space private, not per-user identity within it.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const subdomain = resolveSubdomain(request);

  // No tenant for this host (the bare root domain) — nothing to unlock,
  // only signing up for a new household makes sense here.
  if (!subdomain) {
    if (SIGNUP_PATH_PATTERN.test(pathname)) return intlProxy(request);
    return NextResponse.redirect(new URL("/signup", request.url));
  }

  const isAuthenticated = isValidSessionToken(
    request.cookies.get(SESSION_COOKIE_NAME)?.value,
    subdomain,
  );

  if (UNLOCK_PATH_PATTERN.test(pathname)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return intlProxy(request);
  }

  if (SIGNUP_PATH_PATTERN.test(pathname)) {
    // Already inside a tenant's space — signing up again doesn't apply here.
    return NextResponse.redirect(new URL("/", request.url));
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
