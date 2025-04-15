import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import {
  doctor,
  appointments,
  patient,
  users,
} from "../../../../../../../db/schema";
import db from "../../../../../../../db/db";
import { verifyAuthToken } from "../../../../../../lib/verify";

// =======================
// Get - All Appointments for a Doctor (Grouped by Date)
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

  try {
    // Query for doctor information
    const doctorData = await db
      .select({ id: doctor.id })
      .from(doctor)
      .where(eq(doctor.userId, userId))
      .limit(1);

    if (!doctorData.length) {
      return NextResponse.json(
        { error: "Doctor profile not found for this user." },
        { status: 404 }
      );
    }

    const requiredDoctorId = doctorData[0].id;

    // Query for appointments with related patient and user data
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
        and(
          eq(appointments.doctorId, requiredDoctorId),
          eq(appointments.isCancelled, false) // Filter for isCancelled = false
        )
      );

    // Group appointments by date
    const datedAppointmentsData: { [key: string]: typeof appointmentsData } =
      {};

    appointmentsData.forEach((appointment) => {
      const date = appointment.date;
      if (!datedAppointmentsData[date]) {
        datedAppointmentsData[date] = [];
      }
      datedAppointmentsData[date].push(appointment);
    });

    // Convert the grouped data into the desired format
    const datedAppointments = Object.entries(datedAppointmentsData).map(
      ([date, appointments]) => ({ date, appointments })
    );

    return NextResponse.json({ appointments: datedAppointments });
  } catch (error) {
    console.error("Error fetching appointments for doctor:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
