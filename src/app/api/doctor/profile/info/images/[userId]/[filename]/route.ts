import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { promises as fs } from "fs";
import path from "path";
import { doctor } from "../../../../../../../../db/schema";
import db from "../../../../../../../../db/db";
import { verifyAuthToken } from "../../../../../../../lib/verify";

export async function GET(req: NextRequest) {
  let sql: postgres.Sql<Record<string, unknown>> | undefined; // Fixed type constraint
  try {
    // Get doctor ID from URL
    const pathSegments = req.nextUrl.pathname.split("/");
    const file_name = pathSegments[pathSegments.length - 1] || "unknown";
    const userIdFromUrl = pathSegments[pathSegments.length - 2] || "unknown";

    // Verify JWT token using the modularized function
    const decodedOrResponse = await verifyAuthToken();

    // Handle potential error response from token verification
    if (decodedOrResponse instanceof NextResponse) {
      return decodedOrResponse;
    }

    // Query for doctor information
    const doctorData = await db
      .select()
      .from(doctor)
      .where(eq(doctor.userId, Number(userIdFromUrl)))

    // Define the base upload directory (adjust according to your file structure)
    const uploadDir = path.join(process.cwd(), "private_uploads");
    let filePath: string;
    let contentType: string;

    // Check which file is being requested
    if (req.nextUrl.pathname === doctorData[0].image_link) {
      // Serve profile picture
      filePath = path.join(uploadDir, "pictures", file_name);
      contentType = getContentType(file_name);
    } else if (req.nextUrl.pathname === doctorData[0].signature_link) {
      // Serve signature
      filePath = path.join(uploadDir, "signatures", file_name);
      contentType = getContentType(file_name);
    } else {
      // If neither, return the doctor data as JSON
      return NextResponse.json({
        success: true,
        doctor: doctorData[0],
      });
    }
    try {
      // Read the file
      const fileBuffer = await fs.readFile(filePath);
      
      // Return the file with appropriate headers
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': 'inline',
          'Cache-Control': 'no-cache'
        }
      });
    } catch (fileError) {
      console.error("Error reading file:", fileError);
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

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
    if (sql) {
      await sql.end();
    }
    // Ensure SQL connection is closed
    // (postgres.js should handle this automatically with the connection pool)
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