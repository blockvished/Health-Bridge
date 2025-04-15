import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import {
  doctor,
  appointments,
  users,
  patient,
} from "../../../../../../db/schema";
import db from "../../../../../../db/db";
import { verifyAuthToken } from "../../../../../lib/verify";

// =======================
// Get - All Appointments for a Doctor
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
    const appointmentsData = await db
      .select({
        appointmentId: appointments.id,
        date: appointments.date,
        timeFrom: appointments.timeFrom,
        timeTo: appointments.timeTo,
        mode: appointments.mode,
        reason: appointments.reason,

        visitStatus: appointments.visitStatus,
        paymentStatus: appointments.paymentStatus,

        patientId: patient.id,
        patientName: users.name,
        patientEmail: users.email,
        patientPhone: users.phone,
      })
      .from(appointments)
      .innerJoin(patient, eq(appointments.patientId, patient.id))
      .innerJoin(users, eq(patient.userId, users.id))
      .where(
        // and(
          eq(appointments.doctorId, requiredDoctorId),
          // eq(appointments.isCancelled, false) // Filter for isCancelled = false
        // )
      );

    return NextResponse.json({ appointments: appointmentsData });
  } catch (error) {
    console.error("Error fetching appointment of doctor:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
