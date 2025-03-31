import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { doctorCustomJs } from "../../../../../db/schema";

export async function GET(
  request: NextRequest,
  context: { params: { doctor_id: string } } // Correct type definition
) {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not set in environment variables.");
    }

    const doctorId = parseInt(context.params.doctor_id, 10);

    if (isNaN(doctorId)) {
      return NextResponse.json({ error: "Invalid Doctor ID" }, { status: 400 });
    }

    const sql = postgres(connectionString, { max: 1 });
    const db = drizzle(sql);

    const doctorCustomJsData = await db
      .select()
      .from(doctorCustomJs)
      .where(eq(doctorCustomJs.doctorId, doctorId));

    return NextResponse.json(doctorCustomJsData);
  } catch (error) {
    console.error("Error fetching doctor education data:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctor education data" },
      { status: 500 }
    );
  }
}