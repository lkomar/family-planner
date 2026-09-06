import createIntlProxy from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createIntlProxy(routing);

export const config = {
  // Run on every path except API routes, Next internals, and files that
  // contain a dot (e.g. favicon.ico, robots.txt).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
