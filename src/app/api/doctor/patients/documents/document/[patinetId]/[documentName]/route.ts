import { NextRequest, NextResponse } from "next/server";
import { or, eq } from "drizzle-orm";
import { doctor } from "../../../../../../../../db/schema";
import db from "../../../../../../../../db/db";
import { verifyAuthToken } from "../../../../../../../lib/verify";
import fs from "fs/promises"; // Use the promise-based version of fs
import path from "path";

// =======================
// GET
// =======================
export async function GET(req: NextRequest) {
  // Get ID from URL
  const pathParts = req.nextUrl.pathname.split("/");
  const documentNameFromUrl = pathParts.pop() || "unknown";
  const patientIdFromUrl = pathParts[pathParts.length - 1] || "unknown"; // Get patient ID

  console.log(documentNameFromUrl)
  console.log(patientIdFromUrl)

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

  const requiredDoctorId = doctorData[0].id;
  try {
    // Construct the file path
    const filePath = path.join(
      "private_uploads",
      "patient_docs",
      patientIdFromUrl,
      documentNameFromUrl
    );
    console.log("what is happening", filePath);

    // Check if the file exists
    await fs.access(filePath);

    // Read the file content
    const fileContent = await fs.readFile(filePath);
    console.log("asdgfkasdkjhguohidwkfgohiuefr");
    console.log(fileContent);

    // Determine the content type (basic example, you might want a better library)
    let contentType = "application/octet-stream"; // Default
    if (documentNameFromUrl.endsWith(".pdf")) {
      contentType = "application/pdf";
    } else if (
      documentNameFromUrl.endsWith(".jpg") ||
      documentNameFromUrl.endsWith(".jpeg")
    ) {
      contentType = "image/jpeg";
    } else if (documentNameFromUrl.endsWith(".png")) {
      contentType = "image/png";
    }

    // Return the file in the response
    return new NextResponse(fileContent, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${documentNameFromUrl}"`, // or "attachment; filename=..." for download
      },
      status: 200,
    });
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // Handle file not found error
      return NextResponse.json({ error: "File not found." }, { status: 404 });
    }
    // Handle other errors
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: `Failed to process request: ${error.message || "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}
