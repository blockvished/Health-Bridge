import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { doctor, appointments, users, patient, clinic } from "../../../../db/schema";
import db from "../../../../db/db";
import { verifyAuthToken } from "../../../lib/verify";

// =======================
// Get - All Appointments for Patient
// =======================
export async function GET() {
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
        date: appointments.date,
        timeFrom: appointments.timeFrom,
        timeTo: appointments.timeTo,
        mode: appointments.mode,
        reason: appointments.reason,
        visitStatus: appointments.visitStatus,
        paymentStatus: appointments.paymentStatus,
        amount: appointments.amount,

        patientId:appointments.patientId,
        patientName: users.name,
        patientEmail: users.email,
        patientPhone: users.phone,

        doctorName: doctor.name,

        clinicName: clinic.name,
        clinicAddress: clinic.address,

        isCancelled: appointments.isCancelled,
        cancelReason: appointments.cancelReason,
      })
      .from(appointments)
      .innerJoin(patient, eq(appointments.patientId, patient.id))
      .innerJoin(users, eq(patient.userId, users.id))
      .innerJoin(doctor, eq(appointments.doctorId, doctor.id))
      .innerJoin(clinic, eq(appointments.clinicId, clinic.id))
      .where(eq(appointments.patientId, requiredPatientId));

    return NextResponse.json({ appointments: appointmentsData });
  } catch (error) {
    console.error("Error fetching appointment of doctor:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
