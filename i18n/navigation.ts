import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware wrappers around Next.js navigation APIs. Use these instead of
 * `next/link` / `next/navigation` anywhere a link or route change needs to
 * keep the current locale prefix intact.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
