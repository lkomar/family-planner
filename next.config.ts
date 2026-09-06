import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // better-sqlite3 is a native addon; keep it (and the Prisma client that
  // wraps it) out of the bundle and required at runtime instead.
  serverExternalPackages: ["@prisma/client", "better-sqlite3"],
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
