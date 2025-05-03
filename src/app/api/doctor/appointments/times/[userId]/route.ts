import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import {
  doctor,
  appointmentSettings,
  appointmentDays,
  appointmentTimeRanges,
} from "../../../../../../db/schema";
import db from "../../../../../../db/db";
import { verifyAuthToken } from "../../../../../lib/verify";

type TimeRange = {
  from: string; // e.g. '09:00:00'
  to: string; // e.g. '11:00:00'
};

type ScheduleItem = {
  id: number;
  dayOfWeek: string;
  isActive: boolean;
  times: TimeRange[];
};
// =======================
// POST - Appointment Settings for a Doctor
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
    // const existingSetting = await db
    //   .select({
    //     intervalMinutes: appointmentSettings.intervalMinutes,
    //     id: appointmentSettings.id,
    //   })
    //   .from(appointmentSettings)
    //   .where(eq(appointmentSettings.doctorId, requiredDoctorId));

    // const days = await db
    //   .select()
    //   .from(appointmentDays)
    //   .where(eq(appointmentDays.doctorId, requiredDoctorId));

    ///////////////
    // const result = await Promise.all(
    //   days.map(async (day) => {
    //     if (!day.isActive) {
    //       return { ...day, times: [] };
    //     }

    //     const timeRanges = await db
    //       .select({
    //         from: appointmentTimeRanges.startTime,
    //         to: appointmentTimeRanges.endTime,
    //       })
    //       .from(appointmentTimeRanges)
    //       .where(eq(appointmentTimeRanges.dayId, day.id));

    //     return {
    //       ...day,
    //       times: timeRanges.map(({ from, to }) => ({
    //         from,
    //         to,
    //       })),
    //     };
    //   })
    // );

    const reqBody = await req.json();
    const { schedule } = reqBody;

    // console.log(JSON.stringify(schedule, null, 2));
    // console.log(schedule[0]);

    if (schedule && schedule.length) {
      // Process each day in the schedule
      await Promise.all(
        schedule.map(async (item: ScheduleItem) => {
          console.log(`Day: ${item.dayOfWeek} (ID: ${item.id})`);

          // If the day is active and has time ranges, create new ones
          // then use item.id to get the appointmentTimeRanges
          // delete all the appointmentTimeRanges with id -> ${item.id})
          // then create new appointmentTimeRanges -> based on item.times.length -> startTime: from, endTime: to
          
          // First, update the day's active status
          await db
            .update(appointmentDays)
            .set({ isActive: item.isActive })
            .where(eq(appointmentDays.id, item.id));

          // Delete all existing time ranges for this day
          await db
            .delete(appointmentTimeRanges)
            .where(eq(appointmentTimeRanges.dayId, item.id));

          if (item.isActive && item.times && item.times.length) {
            // Insert new time ranges
            await Promise.all(
              item.times.map(async (time) => {
                await db.insert(appointmentTimeRanges).values({
                  dayId: item.id,
                  startTime: time.from,
                  endTime: time.to,
                });

                console.log(`  Time added: ${time.from} - ${time.to}`);
              })
            );
          } else {
            console.log("  No times set or day is inactive.");
          }
        })
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error fetching appointment interval:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointment interval." },
      { status: 500 }
    );
  }
}
