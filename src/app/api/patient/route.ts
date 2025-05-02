import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { users } from "../../../db/schema";
import db from "../../../db/db";
import { verifyAuthToken } from "../../lib/verify";

// =======================
// Get - Patient Data
// =======================
export async function GET() {
  try {
    // Verify JWT token using the modularized function
    const decodedOrResponse = await verifyAuthToken();

    // Handle potential error response from token verification
    if (decodedOrResponse instanceof NextResponse) {
      return decodedOrResponse;
    }

    const decoded = decodedOrResponse;
    const userId = Number(decoded.userId);

    // Query for patient information based on userId
    const patientData = await db
      .select({
        name: users.name,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!patientData.length) {
      return NextResponse.json(
        { error: "Patient profile not found for this user." },
        { status: 404 }
      );
    }

    //  Return the patient data.  Crucially, return patientData, not an object
    return NextResponse.json(patientData);
  } catch (error) {
    console.error("Error fetching patient data:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}