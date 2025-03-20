// app/api/doctor/route.ts (or pages/api/doctor.ts if using Pages Router)
import { NextResponse } from "next/server";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { doctor } from "../../../db/schema";

export async function GET() {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not set in environment variables.");
    }

    const sql = postgres(connectionString, { max: 1 });
    const db = drizzle(sql);

    const requestedDoctor = await db.select().from(doctor).limit(1);
    console.log(requestedDoctor)
    return NextResponse.json(requestedDoctor);
  } catch (error) {
    console.error("Error fetching doctor data:", error);
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });
  }
}
