import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema"; // Import your schema

import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment variables.");
}

const client = postgres(connectionString as string, { max: 1 }); // Limit connections
export const db = drizzle(client, { schema, logger: true });

export default db;
