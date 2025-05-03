// Create and Get Patients for a Doctor

import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { doctor, patient, staff, appointments } from "../../../../../db/schema";
import db from "../../../../../db/db";
import { verifyAuthToken } from "../../../../lib/verify";

// =======================
// GET - Fetch Patients for a Doctor
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
    const patients = await db
      .select()
      .from(patient)
      .where(eq(patient.doctorId, requiredDoctorId));

    const allAppointments = await db
      .select()
      .from(appointments)
      .where(eq(appointments.doctorId, requiredDoctorId));

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().slice(0, 10);

    const todaysAppointments = allAppointments.filter(
      (appointment) => appointment.date === today
    );

    // Create a Date object for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    // const tomorrowDateString = tomorrow.toISOString().slice(0, 10);

    // const futureAppointments = allAppointments.filter(
    //   (appointment) => appointment.date >= tomorrowDateString
    // );
    
    const staffss = await db
    .select()
    .from(staff)
    .where(eq(staff.doctorId, requiredDoctorId));

    const patientsCount = patients.length;
    const todaysAppointmentsCount = todaysAppointments.length;
    const allAppointmentsCount = allAppointments.length;
    const staffCount = staffss.length

    return NextResponse.json({
      patientsCount,
      todaysAppointmentsCount,
      allAppointmentsCount,
      staffCount,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
