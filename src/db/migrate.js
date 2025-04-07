// src/db/migrate.js
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import dotenv from "dotenv";

const runMigration = async () => {
  dotenv.config();
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("DATABASE_URL not found in environment variables");
    process.exit(1);
  }

  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql);

  console.log("Running migrations...");

  await migrate(db, { migrationsFolder: "./src/db/migrations" });

  console.log("Migrations completed successfully");
  await sql.end();
  process.exit(0);
};

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
