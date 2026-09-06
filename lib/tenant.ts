import { headers } from "next/headers";

/**
 * Turns a request hostname into a tenant subdomain slug, or `null` for the
 * apex/marketing host itself (e.g. "planner.example.com" or
 * "www.planner.example.com" — only the signup flow lives there).
 *
 * Pure and domain-agnostic on purpose: `rootDomain` comes from the
 * ROOT_DOMAIN environment variable rather than being hardcoded, so this
 * works under whichever domain ends up in front of the app.
 */
export function extractSubdomain(
  hostname: string,
  rootDomain: string,
): string | null {
  const host = hostname.split(":")[0]?.toLowerCase() ?? "";
  const root = rootDomain.toLowerCase();

  if (host === root || host === `www.${root}`) return null;
  if (!host.endsWith(`.${root}`)) return null;

  return host.slice(0, -(root.length + 1));
}

/**
 * The current request's tenant subdomain, for use in Server Components and
 * Server Actions (proxy.ts resolves it directly from the request instead —
 * see its own `resolveSubdomain`).
 *
 * Without ROOT_DOMAIN configured (local dev, or before a domain is chosen),
 * this always resolves to DEV_SUBDOMAIN so `npm run dev` works out of the
 * box against one seeded household. Set ROOT_DOMAIN to test real subdomain
 * routing locally — e.g. `ROOT_DOMAIN=lvh.me` and visit
 * `http://acme.lvh.me:3000`, since *.lvh.me always resolves to 127.0.0.1.
 */
export async function getRequestSubdomain(): Promise<string | null> {
  const rootDomain = process.env.ROOT_DOMAIN;
  if (!rootDomain) return process.env.DEV_SUBDOMAIN ?? "demo";

  const host = (await headers()).get("host") ?? "";
  return extractSubdomain(host, rootDomain);
}
