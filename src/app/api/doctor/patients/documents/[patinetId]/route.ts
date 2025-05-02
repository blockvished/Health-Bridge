import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { doctor } from "../../../../../../db/schema";
import db from "../../../../../../db/db";
import { verifyAuthToken } from "../../../../../lib/verify";
import fs from "fs/promises";
import path from "path";

// =======================
// Get - All Appointments for a Doctor
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
    .select()
    .from(doctor)
    .where(eq(doctor.userId, userId));

  if (!doctorData.length) {
    return NextResponse.json(
      { error: "Doctor profile not found for this user." },
      { status: 404 }
    );
  }

  // const requiredDoctorId = doctorData[0].id;
  const patientIdURL = req.nextUrl.pathname.split("/").pop() || "unknown";
  const uploadDir = path.join("private_uploads", "patient_docs", patientIdURL);

  try {
    // `private_uploads/patient_docs/${patientIdURL}` in <- directory list all the filenames as array of string and send them to in response, if no exists directory or filesnames then send empty array
    try {
      await fs.access(uploadDir);
    } catch {
      // If the directory does not exist, return an empty array.
      return NextResponse.json([]);
    }

    // Read the files from the directory
    const files = await fs.readdir(uploadDir);

    return NextResponse.json(files);
  } catch (error) {
    console.error("Error fetching appointment of doctor:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
