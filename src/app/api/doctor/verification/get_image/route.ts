// app/api/doctor/verification/get_image/route.ts

import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "../../../../lib/verify";
import { eq } from "drizzle-orm";
import { doctor } from "../../../../../db/schema";
import db from "../../../../../db/db";
import path from "path";
import fs from "fs/promises";
import mime from "mime";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const fileName = url.searchParams.get("name");

  if (!fileName) {
    return NextResponse.json({ error: "File name is required." }, { status: 400 });
  }

  const decodedOrResponse = await verifyAuthToken();
  if (decodedOrResponse instanceof NextResponse) return decodedOrResponse;

  const decoded = decodedOrResponse;
  const userId = Number(decoded.userId);

  // Get doctor by userId
  const doctorData = await db
    .select()
    .from(doctor)
    .where(eq(doctor.userId, userId));

  if (!doctorData.length) {
    return NextResponse.json({ error: "Doctor not found." }, { status: 404 });
  }

  const filePath = path.join(
    process.cwd(),
    "private_uploads",
    "verification_docs",
    userId.toString(),
    fileName
  );

  console.log("File path:", filePath);
  

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
  } catch (err: any) {
    if (err.code === "ENOENT") {
      return NextResponse.json({ error: "File not found." }, { status: 404 });
    }
    console.error("Error reading file:", err);
    return NextResponse.json({ error: "Failed to retrieve file." }, { status: 500 });
  }
}
