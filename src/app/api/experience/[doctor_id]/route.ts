// app/api/education/[doctor_id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { doctorExperience } from "../../../../db/schema"

export async function GET(
  request: NextRequest,
  { params }: { params: { doctor_id: string } }
) {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not set in environment variables.");
    }

    // Await params before accessing its properties
    const { doctor_id } = await params;
    const doctorId = parseInt(doctor_id, 10);
    
    if (isNaN(doctorId)) {
      return NextResponse.json({ error: "Invalid Doctor ID" }, { status: 400 });
    }

    const sql = postgres(connectionString, { max: 1 });
    const db = drizzle(sql);

    const experienceData = await db
      .select()
      .from(doctorExperience)
      .where(eq(doctorExperience.doctorId, doctorId));

    return NextResponse.json(experienceData);
  } catch (error) {
    console.error("Error fetching doctor education data:", error);
    return NextResponse.json({ error: "Failed to fetch doctor education data" }, { status: 500 });
  }
}