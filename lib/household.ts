import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getRequestSubdomain } from "@/lib/tenant";

/**
 * Resolves the household (tenant) the current request belongs to, by
 * subdomain (see lib/tenant.ts). 404s if the host has no tenant (the
 * apex/marketing domain) or the subdomain doesn't match any household —
 * pages that must render without a tenant (the signup flow) should not call
 * this.
 */
export async function getCurrentHousehold() {
  const subdomain = await getRequestSubdomain();
  if (!subdomain) notFound();

  const household = await db.household.findUnique({ where: { subdomain } });
  if (!household) notFound();

  return household;
}
