import { db } from "@/lib/db";

/**
 * Resolves the household the current request belongs to. There's no
 * auth/multi-household support yet, so this returns the single seeded
 * household — but every query already goes through this function (and every
 * model is scoped by `householdId`), so adding accounts later is a matter of
 * deriving the id from the session here instead of picking the first row.
 */
export async function getCurrentHousehold() {
  const household = await db.household.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (!household) {
    throw new Error(
      "No household found — run `npx prisma db seed` to create one.",
    );
  }

  return household;
}
