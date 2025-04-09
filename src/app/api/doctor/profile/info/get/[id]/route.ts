import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";

import {
  doctor,
  doctorMetaTags as dbMetaTags,
} from "../../../../../../../db/schema";

export async function GET(req: NextRequest) {
  try {
    // Get doctor ID from URL
    const userIdFromUrl = req.nextUrl.pathname.split("/").pop() || "unknown";

    // Get authentication token from cookies - using await
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    const userId = Number(decoded.userId);

    // Check if the requested doctor ID matches the authenticated user's ID
    if (String(userId) !== userIdFromUrl) {
      return NextResponse.json(
        { error: "Forbidden: You don't have access to this profile" },
        { status: 403 }
      );
    }

    // Connect to database
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not set in environment variables.");
    }

    const sql = postgres(connectionString, { max: 1 });
    const db = drizzle(sql);

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
