import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import path from "path";
import { doctor } from "../../../../../../../db/schema";
import db from "../../../../../../../db/db";
import { verifyAuthToken } from "../../../../../../lib/verify";
import { promises as fs } from 'fs'; // Import the promises API for fs

export async function GET(req: NextRequest) {
  try {
    // Get doctor ID and file name from URL
    const pathSegments = req.nextUrl.pathname.split("/");
    const file_name = pathSegments[pathSegments.length - 1] || "unknown";
    // const userIdFromUrl = pathSegments[pathSegments.length - 2] || "unknown";

    // Verify JWT token using the modularized function
    const decodedOrResponse = await verifyAuthToken();

    // Handle potential error response from token verification
    if (decodedOrResponse instanceof NextResponse) {
      return decodedOrResponse;
    }

    const decoded = decodedOrResponse;
    const userId = Number(decoded.userId);

    // Query for doctor information (although not directly used for serving the file)
    const doctorData = await db
      .select()
      .from(doctor)
      .where(eq(doctor.userId, userId));

    if (doctorData.length === 0) {
      return NextResponse.json(
        { error: "Doctor profile not found" },
        { status: 404 }
      );
    }

    // Define the base upload directory
    const uploadDir = path.join(process.cwd(), "private_uploads/clinics");
    const filePath = path.join(uploadDir, String(userId), file_name);
    const contentType = getContentType(file_name);

    try {
      const fileBuffer = await fs.readFile(filePath);

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
        },
      });
    } catch (error: unknown) {
      console.error("Error reading file:", error);
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

  } catch (error: unknown) {
    console.error("An unexpected error occurred:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to determine content type based on file extension
function getContentType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();

  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.svg':
      return 'image/svg+xml';
    case '.webp':
      return 'image/webp';
    default:
      return 'application/octet-stream';
  }
}