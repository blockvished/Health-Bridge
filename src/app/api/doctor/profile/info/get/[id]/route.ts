// app/api/doctors/[doctorId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import db from "../../../../../../../db/db";
import {
  doctor,
  doctorMetaTags as dbMetaTags,
} from "../../../../../../../db/schema";
import { verifyAuthToken } from "../../../../../../lib/verify";

export async function GET(req: NextRequest) {
  try {
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

    const requiredDoctor = doctorData[0];
    const requiredDoctorId = doctorData[0].id;

    const metaTags = await db
      .select({
        tag: dbMetaTags.tag,
      })
      .from(dbMetaTags)
      .where(eq(dbMetaTags.doctorId, requiredDoctorId));

    // Check if doctor exists
    if (doctorData.length === 0) {
      return NextResponse.json(
        { error: "Doctor profile not found" },
        { status: 404 }
      );
    }

    // Return doctor data
    return NextResponse.json({
      success: true,
      doctor: requiredDoctor,
      metaTags: metaTags,
    });
  } catch (error) {
    console.error("Error retrieving doctor profile:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Server error while retrieving doctor profile" },
      { status: 500 }
    );
  } finally {
    // Ensure SQL connection is closed
    // (postgres.js should handle this automatically with the connection pool)
  }
}
