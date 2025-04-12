import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import {
  doctor,
  appointmentSettings,
  appointmentDays,
  dayEnum,
} from "../../../../../../db/schema";
import db from "../../../../../../db/db";
import { verifyAuthToken } from "../../../../../lib/verify";

// =======================
// Get - Appointment Interval for a Doctor
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
    const existingSetting = await db
      .select({
        intervalMinutes: appointmentSettings.intervalMinutes,
        id: appointmentSettings.id,
      })
      .from(appointmentSettings)
      .where(eq(appointmentSettings.doctorId, requiredDoctorId));

    const days = await db
      .select()
      .from(appointmentDays)
      .where(eq(appointmentDays.doctorId, requiredDoctorId));

    // console.log("Fetched -Appointment:", existingSetting);

    return NextResponse.json({
      success: true,
      existingSetting: existingSetting,
      days: days,
    });
    
  } catch (error) {
    console.error("Error fetching appointment interval:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointment interval." },
      { status: 500 }
    );
  }
}
// =======================
// POST - Update/Create - Appointment Interval for a Doctor
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
    const reqBody = await req.json();
    const { intervalMinutes } = reqBody;

    if (typeof intervalMinutes !== "number" || intervalMinutes < 1) {
      return NextResponse.json(
        {
          error:
            "Invalid intervalMinutes provided. Must be a number greater than 0.",
        },
        { status: 400 }
      );
    }

    const existingSetting = await db
      .select()
      .from(appointmentSettings)
      .where(eq(appointmentSettings.doctorId, requiredDoctorId));

    console.log("Fetched -Appointment:", existingSetting);

    let intervalResult;
    if (existingSetting.length > 0) {
      // Update existing settings
      intervalResult = await db
        .update(appointmentSettings)
        .set({ intervalMinutes })
        .where(eq(appointmentSettings.doctorId, requiredDoctorId))
        .returning(); // Return the updated row(s)
    } else {
      // Create new settings
      intervalResult = await db
        .insert(appointmentSettings)
        .values({ doctorId: requiredDoctorId, intervalMinutes })
        .returning(); // Return the newly inserted row(s)

      // Create default appointment days with isActive = false
      const days: (typeof appointmentDays.$inferInsert)[] = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ].map((day) => ({
        doctorId: requiredDoctorId,
        dayOfWeek: day as (typeof dayEnum.enumValues)[number],
        isActive: false,
      }));

      await db.insert(appointmentDays).values(days);
      console.log("Initialized default appointment days.");
    }

    if (intervalResult && intervalResult.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Appointment interval updated successfully.",
        updatedSetting: intervalResult[0], // Return the updated or created setting
      });
    } else {
      return NextResponse.json(
        { error: "Failed to update/create appointment interval." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating/creating appointment interval:", error);
    return NextResponse.json(
      { error: "Failed to update/create appointment interval." },
      { status: 500 }
    );
  }
}
