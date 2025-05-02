import { NextResponse } from "next/server";
import { eq, and, sql } from "drizzle-orm";
import { appointments, patient, doctorConsultation } from "../../../../db/schema";
import db from "../../../../db/db";
import { verifyAuthToken } from "../../../lib/verify";

// =======================
// Get - Consultation Link if Patient has Appointment Today
// =======================
export async function GET() {
  // Verify JWT token using the modularized function
  const decodedOrResponse = await verifyAuthToken();

  // Handle potential error response from token verification
  if (decodedOrResponse instanceof NextResponse) {
    return decodedOrResponse;
  }

  const decoded = decodedOrResponse;
  const userId = Number(decoded.userId);

  try {
    // Query for patient information to get patientId and doctorId
    const patientData = await db
      .select({ id: patient.id, doctorId: patient.doctorId })
      .from(patient)
      .where(eq(patient.userId, userId));

    if (!patientData.length) {
      return NextResponse.json(
        { error: "Patient profile not found for this user." },
        { status: 404 }
      );
    }

    const requiredPatientId = patientData[0].id;
    const requiredDoctorId = patientData[0].doctorId;

    // Get today's date in the format 'YYYY-MM-DD'
    const today = new Date().toISOString().slice(0, 10);

    // Query for appointments today for the specific patient and doctor
    const todaysAppointment = await db.query.appointments.findFirst({
      where: and(
        eq(appointments.patientId, requiredPatientId),
        eq(appointments.doctorId, requiredDoctorId),
        eq(sql<string>`DATE(${appointments.date})`, today),
        eq(appointments.isCancelled, false) // Ensure the appointment is not cancelled
      ),
    });

    if (todaysAppointment) {
      // If there's an appointment today, fetch the consultation link
      const consultationLinkData = await db
        .select({ link: doctorConsultation.consultationLink })
        .from(doctorConsultation)
        .where(eq(doctorConsultation.doctorId, requiredDoctorId));

      if (consultationLinkData.length > 0) {
        return NextResponse.json({ consultationLink: consultationLinkData[0].link });
      } else {
        return NextResponse.json({ consultationLink: null, message: "No consultation link found for this doctor." });
      }
    } else {
      // If no appointment today, return null or a message indicating no consultation
      return NextResponse.json({ consultationLink: null, message: "No appointment scheduled for today." });
    }
  } catch (error) {
    console.error("Error fetching appointment and consultation link:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}