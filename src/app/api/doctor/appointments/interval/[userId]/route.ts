// Create and Get Patients for a Doctor

import { NextRequest, NextResponse } from "next/server";
import { eq, or } from "drizzle-orm";
import {
  doctor,
  appointmentSettings,
  appointmentDays,
  appointmentTimeRanges,
} from "../../../../../../db/schema";
import db from "../../../../../../db/db";
import { verifyAuthToken } from "../../../../../lib/verify";

// =======================
// POST - GET, Update and Create Appointment Interval for a Doctor
// =======================
export async function POST(req: NextRequest) {
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
    const { intervalMinutes } = await req.json();

    if (!intervalMinutes || intervalMinutes <= 0) {
      return NextResponse.json(
        { error: "Interval must be a positive number." },
        { status: 400 }
      );
    }

    const existingSetting = await db
      .select()
      .from(appointmentSettings)
      .where(eq(appointmentSettings.doctorId, requiredDoctorId));

    if (!existingSetting.length) {
      // Create new setting
      const newSetting = await db
        .insert(appointmentSettings)
        .values({
          doctorId: requiredDoctorId,
          intervalMinutes,
        })
        .returning();

      return NextResponse.json({ appointmentSetting: newSetting[0] });
    } else {
      const currentSetting = existingSetting[0];

      if (currentSetting.intervalMinutes !== intervalMinutes) {
        // Update if interval is different
        const updatedSetting = await db
          .update(appointmentSettings)
          .set({ intervalMinutes })
          .where(eq(appointmentSettings.doctorId, requiredDoctorId))
          .returning();

        return NextResponse.json({ appointmentSetting: updatedSetting[0] });
      }

      // Return existing if no update needed
      return NextResponse.json({ appointmentSetting: currentSetting });
    }
  } catch (error) {
    console.error("Error handling appointment settings:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
// if (!appointmentSetting.length) {
//   return NextResponse.json(
//     { error: "Appointment setting not found for this doctor." },
//     { status: 404 }
//   );
// } else {
//   const appointment_Days = await db
//   .select()
//   .from(appointmentDays)
//   .where(eq(appointmentDays.doctorId, requiredDoctorId))
// console.log("Fetched -Appointment:", appointmentSetting);
// }
