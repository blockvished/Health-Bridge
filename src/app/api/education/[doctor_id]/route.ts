// app/api/education/[doctor_id]/route.ts
import { NextResponse } from "next/server";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { doctorEducation } from "../../../../db/schema";

import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { doctor_id: string } }) {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not set in environment variables.");
    }

    const doctorId = Number(params.doctor_id);
    if (isNaN(doctorId)) {
      return NextResponse.json({ error: "Invalid Doctor ID" }, { status: 400 });
    }

    const sql = postgres(connectionString, { max: 1 });
    const db = drizzle(sql);

    const educationData = await db
      .select()
      .from(doctorEducation)
      .where(eq(doctorEducation.doctorId, doctorId));

    return NextResponse.json(educationData);
  } catch (error) {
    console.error("Error fetching doctor education data:", error);
    return NextResponse.json({ error: "Failed to fetch doctor education data" }, { status: 500 });
  }
}