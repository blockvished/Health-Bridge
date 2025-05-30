import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import path from "path";
import { db } from "../../../../../db/db"; // Your Drizzle ORM instance
import {
  doctor,
  doctorEducation,
  doctorExperience,
} from "../../../../../db/schema"; // Your table schemas
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ doctor: string }> }
) {
  // Await the params Promise
  const { doctor: doctorParam } = await params;
  const doctorId = Number(doctorParam);

  if (isNaN(doctorId)) {
    return NextResponse.json({ error: "Invalid doctor ID" }, { status: 400 });
  }

  try {
    // Fetch doctor basic info
    const doctorInfo = await db
      .select()
      .from(doctor)
      .where(eq(doctor.id, doctorId))
      .limit(1)
      .then((res) => res[0] ?? null);

    if (!doctorInfo) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Fetch education and experience for this doctor
    const educations = await db
      .select()
      .from(doctorEducation)
      .where(eq(doctorEducation.doctorId, doctorId));

    const experiences = await db
      .select()
      .from(doctorExperience)
      .where(eq(doctorExperience.doctorId, doctorId));

    // Read verification files from the file system
    const folderPath = path.join(
      process.cwd(),
      "private_uploads",
      "verification_docs",
      String(doctorId)
    );

    let verificationFiles: string[] = [];
    try {
      verificationFiles = await readdir(folderPath);
    } catch (error: unknown) {
      // Use 'unknown' for safer type handling in catch blocks
      let isENOENT = false;

      // Type guard to safely check if the error is an object with a 'code' property
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof (error as { code: unknown }).code === "string"
      ) {
        const err = error as { code: string }; // Assert the type after checks
        if (err.code === "ENOENT") {
          isENOENT = true;
        }
      }

      // If the error is NOT ENOENT (or if it's not an object with a 'code' property),
      // then treat it as a generic 500 error.
      if (!isENOENT) {
        console.error("Error reading verification files:", error); // Log the full error object for debugging
        return NextResponse.json(
          { error: "Failed to list verification files." },
          { status: 500 }
        );
      }

      // If the error IS ENOENT, assume no files.
      verificationFiles = [];
    }

    // Return aggregated data
    return NextResponse.json({
      doctor: doctorInfo,
      education: educations,
      experience: experiences,
      verificationFiles,
    });
  } catch (error) {
    console.error("Error fetching doctor data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}