import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { doctor, enableRating } from "../../../../../db/schema";
import db from "../../../../../db/db";
import { verifyAuthToken } from "../../../../lib/verify";

// =======================
// Get -
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
    const rating = await db
      .select()
      .from(enableRating)
      .where(eq(enableRating.doctorid, requiredDoctorId));

    return NextResponse.json(rating);
  } catch (error) {
    console.error("Error fetching appointment of doctor:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// =======================
// Post - Enable rating for a doctor
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
    // Get the enable flag from request body
    const body = await req.json();
    console.log(body)
    const enable = Boolean(body.enable);

    // Check if rating configuration exists
    const existingRating = await db
      .select()
      .from(enableRating)
      .where(eq(enableRating.doctorid, requiredDoctorId));

    if (existingRating.length > 0) {
      // Update existing configuration
      await db
        .update(enableRating)
        .set({ enable })
        .where(eq(enableRating.doctorid, requiredDoctorId));

      return NextResponse.json(
        {
          message: enable
            ? "Rating enabled successfully for this doctor."
            : "Rating disabled successfully for this doctor.",
          enable,
        },
        { status: 200 }
      );
    } else {
      // Create new configuration
      await db.insert(enableRating).values({
        doctorid: requiredDoctorId,
        enable,
      });

      return NextResponse.json(
        {
          message: enable
            ? "Rating enabled successfully for this doctor."
            : "Rating disabled successfully for this doctor.",
          enable,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error updating rating status for doctor:", error);
    return NextResponse.json(
      { error: "Failed to update rating status for the doctor." },
      { status: 500 }
    );
  }
}
