import { NextRequest, NextResponse } from "next/server";
import { eq, or } from "drizzle-orm";
import { doctor, users, staff } from "../../../../../db/schema";
import db from "../../../../../db/db";
import { verifyAuthToken } from "../../../../lib/verify";
import { hash } from "argon2";
import { randomBytes } from "crypto";
import { extname } from "path";
import * as fs from "fs";
import path from "path";
// =======================
// POST - Create - Staff
// =======================
export async function POST(req: NextRequest) {
  try {
    // Get doctor ID from URL
    const userIdFromUrl = req.nextUrl.pathname.split("/").pop() || "unknown";

    // Verify JWT token
    const decodedOrResponse = await verifyAuthToken();
    if (decodedOrResponse instanceof NextResponse) {
      return decodedOrResponse;
    }
    const decoded = decodedOrResponse;
    const userId = Number(decoded.userId);

    // Check if the requested ID matches the authenticated user's ID
    if (String(userId) !== userIdFromUrl) {
      console.log("hsifhisf");
      return NextResponse.json(
        { error: "Forbidden: You don't have access to this profile" },
        { status: 403 }
      );
    }

    // Fetch doctor information to ensure the requesting user is the correct doctor
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
    const baseUploadPath = path.join(process.cwd(), "private_uploads");

    // 1. Parse the form data
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const clinicId = formData.get("clinicId") as string;
    const role = formData.get("role") as string;


    // Fix for active field - properly convert string to boolean
    const password = formData.get("password") as string;

    const imageFile = formData.get("image") as Blob | null;
    let imageLink: string | null = null;

    if (imageFile) {
      // Safely get the filename
      const originalFileName = (imageFile as any).name;
      const fileExtension = extname(originalFileName || "") || ".png";
      const safeName = slugify(name);
      const uniqueFilename = `${safeName}${fileExtension}`;
      const uploadDir = path.join(baseUploadPath, "staff", String(userId));
      const uploadPath = path.join(uploadDir, uniqueFilename);

      // Ensure directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Convert Blob to Buffer
      const buffer = await blobToBuffer(imageFile);

      // Write the file using the standard fs.writeFileSync
      fs.writeFileSync(uploadPath, buffer);

      imageLink = `/api/doctor/staff/image/${userId}/${uniqueFilename}`;
    }

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Missing required fieldsKTJ." },
        { status: 400 }
      );
    }

    // Check if the email or phone already exists
    const existingUsers = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email)));

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "User with this email or phone already exists." },
        { status: 409 }
      );
    }

    // Generate a random salt
    const salt = randomBytes(16).toString("hex");

    // Hash the default password using argon2
    const SERVER_PEPPER = process.env.SERVER_PEPPER;
    const saltedPassword = SERVER_PEPPER + password + SERVER_PEPPER;
    const passwordHash = await hash(saltedPassword);

    // Create the new user
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password_hash: passwordHash,
        salt,
        role: "staff",
      })
      .returning({ id: users.id });

    if (!newUser?.id) {
      return NextResponse.json(
        { error: "Failed to create new user." },
        { status: 500 }
      );
    }

    // Create the staff profile
    const [newStaff] = await db
      .insert(staff)
      .values({
        userId: newUser.id,
        doctorId: requiredDoctorId,
        name: name,
        email: email,
        imageLink: imageLink,
        clinicId: clinicId ? Number(clinicId) : null, 
        role,
      })
      .returning();

    if (!newStaff) {
      // If staff creation fails, roll back the user creation
      await db.delete(users).where(eq(users.id, newUser.id));
      return NextResponse.json(
        { error: "Failed to create staff profile." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Staff created successfully.", staff: newStaff },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating staff:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function blobToBuffer(blob: Blob): Promise<Buffer> {
  if (typeof (blob as any).arrayBuffer === "function") {
    const arrayBuffer = await (blob as any).arrayBuffer();
    return Buffer.from(arrayBuffer);
  } else {
    // Fallback for environments where arrayBuffer is not available (e.g., older Node.js)
    const text = await blob.text();
    return Buffer.from(text);
  }
}
