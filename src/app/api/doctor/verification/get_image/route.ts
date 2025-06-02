// app/api/doctor/verification/get_image/route.ts

import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "../../../../lib/verify";
import { eq } from "drizzle-orm";
import { doctor, users } from "../../../../../db/schema";
import db from "../../../../../db/db";
import path from "path";
import fs from "fs/promises";
import mime from "mime";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const fileName = url.searchParams.get("name");

  if (!fileName) {
    return NextResponse.json(
      { error: "File name is required." },
      { status: 400 }
    );
  }

  const decodedOrResponse = await verifyAuthToken();
  if (decodedOrResponse instanceof NextResponse) return decodedOrResponse;

  const decoded = decodedOrResponse;
  const userId = Number(decoded.userId);

  // Get user role
  const user = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user.length) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const userRole = user[0].role;
  let fetchDoctorId = String(userId);

  if (userRole === "doctor") {
    // Verify doctor exists for this user
    const doctorData = await db
      .select()
      .from(doctor)
      .where(eq(doctor.userId, userId));
    // fetchDoctorId stays as current userId
  } else if (userRole === "admin") {
    const adminProvidedUserId = url.searchParams.get("doctorId");
    if (!adminProvidedUserId) {
      return NextResponse.json(
        { error: "userId query parameter is required for admins." },
        { status: 400 }
      );
    }

    // Verify doctor exists for provided doctor id
    const doctorData = await db
      .select()
      .from(doctor)
      .where(eq(doctor.id, Number(fetchDoctorId)));
    
    fetchDoctorId = String(doctorData[0].userId);
  } else {
    // Other roles are not allowed
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  const filePath = path.join(
    process.cwd(),
    "private_uploads",
    "verification_docs",
    fetchDoctorId.toString(),
    fileName
  );

  try {
    const fileBuffer = await fs.readFile(filePath);
    const mimeType = mime.getType(filePath) || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `inline; filename="${fileName}"`,
      },
    });
  } catch (error: unknown) {
    // Use 'unknown' for safer type handling in catch blocks
    // Type guard to check if the error is an object with a 'code' property
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof (error as { code: unknown }).code === "string" // Ensure 'code' is a string
    ) {
      const err = error as { code: string }; // Assert the type after the checks
      if (err.code === "ENOENT") {
        return NextResponse.json({ error: "File not found." }, { status: 404 });
      }
    }

    // Log the full error for better debugging
    console.error("Error reading file:", error);
    return NextResponse.json(
      { error: "Failed to retrieve file." },
      { status: 500 }
    );
  }
}
