import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // Keep the Prisma client and the `pg` driver out of the server bundle and
  // required at runtime instead — both expect to be loaded as real Node
  // modules, not bundled.
  serverExternalPackages: ["@prisma/client", "pg"],
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
