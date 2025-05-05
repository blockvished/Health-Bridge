import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import path from "path";
import fs from "fs";
import { extname } from "path";
import {
  doctor,
  users,
  staff,
  staffPermissions,
} from "../../../../../../db/schema";
import db from "../../../../../../db/db";
import { verifyAuthToken } from "../../../../../lib/verify";
import { hash } from "argon2";
// import { randomBytes } from "crypto";

// =======================
// PUT - Update - Staff
// =======================
export async function PUT(req: NextRequest) {
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
      console.log("Forbidden access attempt (PUT - Staff)");
      return NextResponse.json(
        { error: "Forbidden: You don't have access to modify this data" },
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

    // const requiredDoctorId = doctorData[0].id;
    const baseUploadPath = path.join(process.cwd(), "private_uploads");

    // 1. Parse the form data
    const formData = await req.formData();
    const staffIdToUpdate = formData.get("staffId") as string;
    if (!staffIdToUpdate) {
      return NextResponse.json(
        { error: "Missing staffId for update." },
        { status: 400 }
      );
    }
    const staffIdNumber = Number(staffIdToUpdate);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const clinicId = formData.get("clinicId") as string;
    const role = formData.get("role") as string;
    const password = formData.get("password") as string | null; // Password is optional for update
    const permissionsString = formData.get("permissions") as string;
    const imageFile = formData.get("image") as File | null;
    let imageLink: string | null = null;

    // Fetch the existing staff member to preserve the image link if no new image is uploaded
    const existingStaff = await db
      .select()
      .from(staff)
      .where(eq(staff.id, staffIdNumber))
      .limit(1);
    if (!existingStaff.length) {
      return NextResponse.json(
        { error: "Staff member not found." },
        { status: 404 }
      );
    }
    const originalImageLink = existingStaff[0].imageLink;
    const staffUserId = existingStaff[0].userId;

    if (imageFile) {
      // Delete the old image if it exists
      if (originalImageLink) {
        const oldImagePathParts = originalImageLink.split("/");
        if (
          oldImagePathParts.length > 4 &&
          oldImagePathParts[3] === String(userId)
        ) {
          const oldFilename = oldImagePathParts.pop();
          const oldUploadDir = path.join(
            baseUploadPath,
            "staff",
            String(userId)
          );
          const oldUploadPath = path.join(oldUploadDir, oldFilename || "");
          if (fs.existsSync(oldUploadPath)) {
            try {
              fs.unlinkSync(oldUploadPath);
              console.log(`Old image deleted: ${oldUploadPath}`);
            } catch (error) {
              console.error(`Error deleting old image: ${error}`);
              // Non-blocking error, continue with the update
            }
          }
        }
      }

      const originalFileName = imageFile.name;
      const fileExtension = extname(originalFileName || "") || ".png";
      const safeName = slugify(name);
      const uniqueFilename = `${safeName}-${Date.now()}${fileExtension}`; // Add timestamp for uniqueness
      const uploadDir = path.join(baseUploadPath, "staff", String(userId));
      const uploadPath = path.join(uploadDir, uniqueFilename);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const buffer = await blobToBuffer(imageFile);
      fs.writeFileSync(uploadPath, buffer);
      imageLink = `/api/doctor/staff/image/${userId}/${uniqueFilename}`;
    } else {
      imageLink = originalImageLink; // Keep the existing image link if no new one is uploaded
    }

    const updateValues: {
      name: string;
      email: string;
      clinicId: number | null;
      role: string;
      imageLink: string | null;
    } = {
      name: name,
      email: email,
      clinicId: clinicId ? Number(clinicId) : null,
      role: role,
      imageLink: imageLink,
    };

    // Update the staff profile
    const [updatedStaff] = await db
      .update(staff)
      .set(updateValues)
      .where(eq(staff.id, staffIdNumber))
      .returning({ id: staff.id });

    if (!updatedStaff) {
      return NextResponse.json(
        { error: "Failed to update staff profile." },
        { status: 500 }
      );
    }

    // if password is provided then hash and save the pass in user else ignore
    if (password && password.length > 0) {
      // Hash the default password using argon2
      const SERVER_PEPPER = process.env.SERVER_PEPPER;
      const saltedPassword = SERVER_PEPPER + password + SERVER_PEPPER;
      const passwordHash = await hash(saltedPassword);

      await db
        .update(users)
        .set({ password_hash: passwordHash })
        .where(eq(users.id, staffUserId));
    }

    // Update staff permissions
    if (permissionsString) {
      try {
        const permissionIds: number[] = JSON.parse(permissionsString);

        // 1. Delete existing permissions for this staff member
        await db
          .delete(staffPermissions)
          .where(eq(staffPermissions.staffId, staffIdNumber));

        // 2. Insert the new permissions
        if (Array.isArray(permissionIds) && permissionIds.length > 0) {
          await db.insert(staffPermissions).values(
            permissionIds.map((permissionTypeId) => ({
              staffId: staffIdNumber,
              permissionTypeId: permissionTypeId,
            }))
          );
        }
      } catch (error) {
        console.error("Error updating staff permissions:", error);
        // Optionally, handle this error more specifically
      }
    }

    return NextResponse.json(
      { message: "Staff updated successfully.", staff: updatedStaff },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating staff:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

async function blobToBuffer(blob: Blob): Promise<Buffer> {
  if (typeof blob.arrayBuffer === "function") {
    const arrayBuffer = await blob.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } else {
    // Fallback for environments where arrayBuffer is not available
    const text = await blob.text();
    return Buffer.from(text);
  }
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}