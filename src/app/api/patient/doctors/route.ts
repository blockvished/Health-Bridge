import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import {
  doctor,
  appointments,
  users,
  patient,
  clinic,
} from "../../../../db/schema";
import db from "../../../../db/db";
import { verifyAuthToken } from "../../../lib/verify";

// =======================
// Get - All Appointments for Patient
// =======================
export async function GET(req: NextRequest) {
  // Get ID from URL
  //   const userIdFromUrl = req.nextUrl.pathname.split("/").pop() || "unknown";

  // Verify JWT token using the modularized function
  const decodedOrResponse = await verifyAuthToken();

  // Handle potential error response from token verification
  if (decodedOrResponse instanceof NextResponse) {
    return decodedOrResponse;
  }

  const decoded = decodedOrResponse;
  const userId = Number(decoded.userId);
  // Query for doctor information
  const patientData = await db
    .select()
    .from(patient)
    .where(eq(patient.userId, userId));

  if (!patientData.length) {
    return NextResponse.json(
      { error: "Doctor profile not found for this user." },
      { status: 404 }
    );
  }

  const requiredPatientId = patientData[0].id;

  try {
    const appointmentsData = await db
      .select({
        appointmentId: appointments.id,
        doctorId: doctor.id, 
        doctorName: doctor.name,
        doctorThumb: doctor.image_link,
        doctorEmail: doctor.email,
      })
      .from(appointments)
      .innerJoin(doctor, eq(appointments.doctorId, doctor.id))
      .where(eq(appointments.patientId, requiredPatientId));

    // Extract unique doctor details
    const uniqueDoctors = Array.from(
      new Map(
        appointmentsData.map((appt) => [
          appt.doctorId,
          {
            id: appt.doctorId,
            name: appt.doctorName,
            thumb: appt.doctorThumb,
            email: appt.doctorEmail,
          },
        ])
      ).values()
    );

    return NextResponse.json( uniqueDoctors );
  } catch (error) {
    console.error("Error fetching appointment of doctor:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
