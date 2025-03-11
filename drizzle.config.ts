import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",  // Required field
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,  // Use 'url' instead of 'connectionString'
  },
});