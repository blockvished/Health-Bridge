import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { readdir } from "fs/promises";
import { verifyAuthToken } from "../../../lib/verify";
import db from "../../../../db/db";
import { doctor } from "../../../../db/schema";
import { eq } from "drizzle-orm";

// Ensure edge compatibility
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Verify JWT token
  const decodedOrResponse = await verifyAuthToken();
  if (decodedOrResponse instanceof NextResponse) return decodedOrResponse;

  const decoded = decodedOrResponse;
  const userId = Number(decoded.userId);

  // Validate doctor
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

  const formData = await req.formData();
  const files = formData.getAll("files");

  const now = new Date();
  const dateTimePrefix = now
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(0, 14); // YYYYMMDDHHMMSS

  const uploadDir = path.join(
    process.cwd(),
    "private_uploads",
    "verification_docs",
    userId.toString(),
  );

  try {
    await fs.mkdir(uploadDir, { recursive: true });

    for (const file of files) {
      if (file instanceof File) {
        const originalName = file.name;
        const ext = originalName.split(".").pop();
        const base = originalName.substring(0, originalName.lastIndexOf("."));
        const safeBase = base.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
        const newFileName = `${dateTimePrefix}_${safeBase}.${ext}`;
        const filePath = path.join(uploadDir, newFileName);

        const buffer = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(filePath, buffer);
        console.log(`Saved ${originalName} -> ${newFileName}`);
      }
    }

    return NextResponse.json({ success: true, message: "Files uploaded successfully." });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Failed to upload files." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Verify JWT token
  const decodedOrResponse = await verifyAuthToken();
  if (decodedOrResponse instanceof NextResponse) return decodedOrResponse;

  const decoded = decodedOrResponse;
  const userId = Number(decoded.userId);

  // Validate doctor
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

  const folderPath = path.join(
    process.cwd(),
    "private_uploads",
    "verification_docs",
    userId.toString(),
  );

  try {
    const files = await readdir(folderPath);
    return NextResponse.json({ files });
  } catch (err: any) {
    if (err.code === "ENOENT") {
      return NextResponse.json({ files: [] }); // No files yet
    }
    console.error("Error reading verification files:", err);
    return NextResponse.json(
      { error: "Failed to list verification files." },
      { status: 500 }
    );
  }
}
