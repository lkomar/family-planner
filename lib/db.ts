import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prismaClient: PrismaClient | undefined;
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set — see .env.example. Use the *pooled* connection " +
        'string your Postgres provider gives you (e.g. Neon\'s "-pooler" host) ' +
        "in serverless deployments, so concurrent invocations don't exhaust " +
        "direct connections.",
    );
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

// Reuse the client across Fast Refresh reloads in dev so we don't open a new
// connection pool on every module reload.
export const db = globalThis.prismaClient ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaClient = db;
}
