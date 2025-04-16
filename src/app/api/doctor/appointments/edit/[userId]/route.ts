import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { appointments, doctor, NewAppointment } from "../../../../../../db/schema";
import db from "../../../../../../db/db";
import { verifyAuthToken } from "../../../../../lib/verify";

// =======================
// PUT - Edit an Existing Appointment
// =======================
export async function PUT(req: NextRequest) {
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
    const reqBody = await req.json();

    const {
      appointmentId,
      mode,
      reason,
      paymentStatus,
      visitStatus,
      isCancelled,
      cancelReason,
      date,
      timeFrom,
      timeTo,
    } = reqBody;
    
    if (!date || !timeFrom || !timeTo || !mode) {
      return NextResponse.json(
        { error: "Date, timeFrom, timeTo, and mode are required fields." },
        { status: 400 }
      );
    }
    
    const updatedAppointmentData: Partial<NewAppointment> = {
      date,
      timeFrom,
      timeTo,
      mode: mode.toLowerCase() as "online" | "offline",
      reason,
      paymentStatus,
      visitStatus,
      cancelReason,
      isCancelled,
    };
    
    
    // Remove undefined properties from the update object
    Object.keys(updatedAppointmentData).forEach((key) => {
      if (
        updatedAppointmentData[key as keyof typeof updatedAppointmentData] ===
        undefined
      ) {
        delete updatedAppointmentData[
          key as keyof typeof updatedAppointmentData
        ];
      }
    });
    
    console.log("Updated Appointment Data:", reqBody);
    
    // Update the appointment in the database
    const [updatedAppointment] = await db
      .update(appointments)
      .set(updatedAppointmentData)
      .where(eq(appointments.id, appointmentId))
      .returning();

    if (!updatedAppointment) {
      return NextResponse.json(
        { error: "Appointment not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Appointment updated successfully.",
      data: updatedAppointment,
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { error: "Failed to update appointment." },
      { status: 500 }
    );
  }
}
