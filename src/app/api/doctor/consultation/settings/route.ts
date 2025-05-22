// backend/app/api/doctor/consultation/settings/
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import db from "../../../../../db/db";
import { verifyAuthToken } from "../../../../lib/verify";
import { doctor, doctorConsultation } from "../../../../../db/schema";

// /api/doctor/consultation/settings
// =======================
// GET - Fetch Consultation Settings
// =======================
export async function GET(req: NextRequest) {
  // Verify JWT token using the modularized function
  const decodedOrResponse = await verifyAuthToken();

  // Handle potential error response from token verification
  if (decodedOrResponse instanceof NextResponse) {
    return decodedOrResponse;
  }

  const decoded = decodedOrResponse;
  const userId = Number(decoded.userId);

  // Query for doctor information
  const doctorData = await db
    .select({ id: doctor.id })
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
    // Fetch consultation settings for the doctor
    const consultationSettings = await db
      .select()
      .from(doctorConsultation)
      .where(eq(doctorConsultation.doctorId, requiredDoctorId));

    console.log("Fetched - Consultation Settings:", consultationSettings);
    return NextResponse.json({ consultationSettings });
  } catch (error) {
    console.error("Error fetching doctor consultation settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch consultation settings." },
      { status: 500 }
    );
  }
}

// =======================
// POST - Create or Update - Consultation Settings
// =======================
export async function POST(req: NextRequest) {
  try {
    // Verify JWT token
    const decodedOrResponse = await verifyAuthToken();

    // Handle potential error response from token verification
    if (decodedOrResponse instanceof NextResponse) {
      return decodedOrResponse;
    }

    const decoded = decodedOrResponse;
    const userId = Number(decoded.userId);

    const reqBody = await req.json();
    const { consultationFees, mode, consultationLink, liveConsultation } = reqBody; // Receive liveConsultation

    // Query for doctor information based on the authenticated user ID
    const doctorData = await db
      .select({ id: doctor.id })
      .from(doctor)
      .where(eq(doctor.userId, userId));

    if (!doctorData.length) {
      return NextResponse.json(
        { error: "Doctor profile not found for this user." },
        { status: 404 }
      );
    }

    const requiredDoctorId = doctorData[0].id;

    // Check if a consultation setting already exists for this doctor
    const existingSettings = await db
      .select()
      .from(doctorConsultation)
      .where(eq(doctorConsultation.doctorId, requiredDoctorId));

    if (existingSettings.length > 0) {
      // Update the existing consultation setting
      const updatedSettings = await db
        .update(doctorConsultation)
        .set({ consultationFees, mode, consultationLink, isLiveConsultationEnabled: liveConsultation }) // Include isLiveConsultationEnabled
        .where(eq(doctorConsultation.doctorId, requiredDoctorId))
        .returning();

      if (updatedSettings.length > 0) {
        return NextResponse.json({
          message: "Consultation settings updated successfully.",
          consultationSettings: updatedSettings[0],
        });
      } else {
        return NextResponse.json(
          { error: "Failed to update consultation settings." },
          { status: 500 }
        );
      }
    } else {
      // Create a new consultation setting
      const newSettings = await db
        .insert(doctorConsultation)
        .values({
          doctorId: requiredDoctorId,
          consultationFees,
          mode,
          consultationLink,
          isLiveConsultationEnabled: liveConsultation, // Include isLiveConsultationEnabled
        })
        .returning();

      if (newSettings.length > 0) {
        return NextResponse.json({
          message: "Consultation settings created successfully.",
          consultationSettings: newSettings[0],
        });
      } else {
        return NextResponse.json(
          { error: "Failed to create consultation settings." },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error("Error creating/updating doctor consultation settings:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}