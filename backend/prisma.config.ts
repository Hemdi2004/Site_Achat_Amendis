import { defineConfig } from "prisma/config";
import { env } from "./src/config/env";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: 'ts-node ./prisma/seed.ts'
  },
  datasource: {
    url: env.databaseUrl, // 👈 This will now be populated perfectly!
  },
});