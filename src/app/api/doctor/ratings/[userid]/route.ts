import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import {
  doctor,
  doctor_ratings,
  patient,
  users,
} from "../../../../../db/schema";
import db from "../../../../../db/db";
import { verifyAuthToken } from "../../../../lib/verify";

// =======================
// Get - All RAtings of Doctor
// =======================
export async function GET(req: NextRequest) {
  // Get ID from URL
  const userIdFromUrl = req.nextUrl.pathname.split("/").pop() || "unknown";

  // Verify JWT token using the modularized function
  const decodedOrResponse = await verifyAuthToken();

  // Handle potential error response from token verification
  if (decodedOrResponse instanceof NextResponse) {
    return decodedOrResponse;
  }

  const decoded = decodedOrResponse;
  const userId = Number(decoded.userId);

  // Check if the requested ID matches the authenticated user's ID
  if (String(userId) !== userIdFromUrl) {
    return NextResponse.json(
      { error: "Forbidden: You don't have access to this profile" },
      { status: 403 }
    );
  }

  // Query for doctor information
  const doctorData = await db
    .select()
    .from(doctor)
    .where(eq(doctor.userId, userId));

  if (!doctorData.length) {
    return NextResponse.json(
      { error: "Doctor profile not found for this user." },
      { status: 404 }
    );
  }

  const requiredDoctorId = doctorData[0].id;

  try {
    // i want to get the patient name from this like doctor_rating has patientid and patient has userid and user has name
    const ratings = await db
      .select({
        id: doctor_ratings.id,
        rating: doctor_ratings.rating,
        text: doctor_ratings.text,
        createdAt: doctor_ratings.createdAt,
        patientName: users.name, // Select patient's name from the users table
      })
      .from(doctor_ratings)
      .innerJoin(patient, eq(doctor_ratings.patientid, patient.id))
      .innerJoin(users, eq(patient.userId, users.id))
      .where(eq(doctor_ratings.doctorid, requiredDoctorId));

    return NextResponse.json(ratings);
  } catch (error) {
    console.error("Error fetching appointment of doctor:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
