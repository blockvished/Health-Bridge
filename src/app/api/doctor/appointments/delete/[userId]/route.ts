import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { doctor, appointments } from "../../../../../../db/schema";
import db from "../../../../../../db/db";
import { verifyAuthToken } from "../../../../../lib/verify";

export async function DELETE(req: NextRequest) {
  try {
    // Get ID from URL (user ID)
    const userIdFromUrl = req.nextUrl.pathname.split("/").pop() || "unknown";
    
    // Verify JWT token
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
    
    // Get appointment ID from request body
    const body = await req.json().catch(() => ({}));
    const appointmentId = body.appointmentId;

    console.log("Appointment ID:", appointmentId);
    
    if (!appointmentId) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 }
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
    
    const doctorId = doctorData[0].id;
    
    // Check if the appointment exists and belongs to this doctor
    const appointmentData = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, appointmentId));
    
    if (!appointmentData.length) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }
    
    // Verify the doctor owns this appointment
    if (appointmentData[0].doctorId !== doctorId) {
      return NextResponse.json(
        { error: "Forbidden: You don't have access to this appointment" },
        { status: 403 }
      );
    }
    
    // Delete the appointment
    await db
      .delete(appointments)
      .where(eq(appointments.id, appointmentId));
    
    return NextResponse.json(
      { message: "Appointment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}