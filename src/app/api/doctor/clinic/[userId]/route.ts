import { extname } from "path";
import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs"; // Use the standard 'fs' import
import path from "path";
import { eq } from "drizzle-orm";
import db from "../../../../../db/db";
import { verifyAuthToken } from "../../../../lib/verify";
import { doctor, clinic } from "../../../../../db/schema";

export async function GET(req: NextRequest) {
  // Get ID from URL
  const userIdFromUrl = req.nextUrl.pathname.split("/").pop() || "unknown";

  // Verify JWT token
  const decodedOrResponse = await verifyAuthToken();
  if (decodedOrResponse instanceof NextResponse) return decodedOrResponse;
  const { userId } = decodedOrResponse;
  const numericUserId = Number(userId);

  // Check if the requested ID matches the authenticated user's ID
  if (String(numericUserId) !== userIdFromUrl) {
    return NextResponse.json(
      { error: "Forbidden: You don't have access to this profile" },
      { status: 403 }
    );
  }

  const doctorData = await db
    .select({ id: doctor.id })
    .from(doctor)
    .where(eq(doctor.userId, numericUserId));

  if (!doctorData.length) {
    return NextResponse.json(
      { error: "Doctor profile not found for this user." },
      { status: 404 }
    );
  }

  const requiredDoctorId = doctorData[0].id;

  try {
    // Fetch clinics associated with the doctor.
    const clinicsData = await db
      .select({
        id: clinic.id,
        name: clinic.name,
        imageLink: clinic.imageLink,
        department: clinic.department,
        appointmentLimit: clinic.appointmentLimit,
        address: clinic.address,
        active: clinic.active,
        createdAt: clinic.createdAt,
        updatedAt: clinic.updatedAt,
      })
      .from(clinic)
      .where(eq(clinic.doctorId, requiredDoctorId));

    console.log(clinicsData);

    if (!clinicsData.length) {
      //   return NextResponse.json(
      //     { error: "No clinics found for this doctor." },
      //     { status: 404 }
      //   );
      return NextResponse.json([], { status: 200 });
    }

    // Return the clinic data.
    return NextResponse.json(clinicsData, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching clinics:", error);
    let errorMessage = "Failed to fetch clinics";
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    } else {
      errorMessage += `: ${String(error)}`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// Utility function to generate slug
function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Helper function to convert Blob to Buffer
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

export async function POST(req: NextRequest) {
  // Get ID from URL
  const userIdFromUrl = req.nextUrl.pathname.split("/").pop() || "unknown";

  // Verify JWT token
  const decodedOrResponse = await verifyAuthToken();
  if (decodedOrResponse instanceof NextResponse) return decodedOrResponse;
  const { userId } = decodedOrResponse;
  const numericUserId = Number(userId);

  // Check if the requested ID matches the authenticated user's ID
  if (String(numericUserId) !== userIdFromUrl) {
    return NextResponse.json(
      { error: "Forbidden: You don't have access to this profile" },
      { status: 403 }
    );
  }

  try {
    // Find the doctor's record
    const doctorData = await db
      .select({ id: doctor.id })
      .from(doctor)
      .where(eq(doctor.userId, numericUserId));

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
    console.log("$$$$$$$$$$$$$$$$getting", formData.get("active"));

    // 2. Extract fields
    const id = formData.get("id") as string | null;
    const name = formData.get("name") as string;

    // Fix for active field - properly convert string to boolean
    const activeValue = formData.get("active");
    const active = activeValue === null ? null : activeValue === "true";

    const department = formData.get("department") as string;
    const appointmentLimitStr = formData.get("appointmentLimit") as string;
    const address = formData.get("address") as string;
    const imageFile = formData.get("logo") as Blob | null;

    // 3. Validation
    if (!name || !address) {
      return NextResponse.json(
        { error: "Name and address are required" },
        { status: 400 }
      );
    }

    let imageLink: string | null = null;

    if (imageFile) {
      // Safely get the filename
      const originalFileName = (imageFile as any).name;
      const fileExtension = extname(originalFileName || "") || ".png";
      const safeName = slugify(name);
      const uniqueFilename = `${safeName}${fileExtension}`;
      const uploadDir = path.join(
        baseUploadPath,
        "clinics",
        String(numericUserId)
      );
      const uploadPath = path.join(uploadDir, uniqueFilename);

      // Ensure directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Convert Blob to Buffer
      const buffer = await blobToBuffer(imageFile);

      // Write the file using the standard fs.writeFileSync
      fs.writeFileSync(uploadPath, buffer);

      imageLink = `/api/doctor/clinic/image/${numericUserId}/${uniqueFilename}`;
    }

    // 5. Convert appointmentLimit
    const appointmentLimit = appointmentLimitStr
      ? parseInt(appointmentLimitStr, 10)
      : undefined;

    if (id) {
      const numericId = parseInt(id, 10);

      let updatedClinic;

      if (imageLink == null) {
        updatedClinic = await db
          .update(clinic)
          .set({
            name,
            department,
            appointmentLimit,
            active,
            address,
            updatedAt: new Date(),
          })
          .where(eq(clinic.id, numericId))
          .returning();
      } else {
        updatedClinic = await db
          .update(clinic)
          .set({
            name,
            imageLink,
            department,
            appointmentLimit,
            active,
            address,
            updatedAt: new Date(),
          })
          .where(eq(clinic.id, numericId))
          .returning();
      }

      if (!updatedClinic.length) {
        return NextResponse.json(
          { error: `Clinic with ID ${id} not found for this doctor.` },
          { status: 404 }
        );
      }

      // 7. Respond with the updated clinic
      return NextResponse.json(updatedClinic[0], { status: 200 });
    } else {
      console.log("lol");
      const newClinic = await db
        .insert(clinic)
        .values({
          doctorId: requiredDoctorId,
          name,
          imageLink,
          department,
          appointmentLimit,
          active,
          address,
        })
        .returning();

      // 7. Respond with the newly created clinic
      return NextResponse.json(newClinic[0], { status: 201 });
    }
  } catch (error: unknown) {
    console.error("Error creating clinic:", error);
    let errorMessage = "Failed to create clinic";
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    } else {
      errorMessage += `: ${String(error)}`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest) {
  // Get ID from URL
  const userIdFromUrl = req.nextUrl.pathname.split("/").pop() || "unknown";

  // Verify JWT token
  const decodedOrResponse = await verifyAuthToken();
  if (decodedOrResponse instanceof NextResponse) return decodedOrResponse;
  const { userId } = decodedOrResponse;
  const numericUserId = Number(userId);

  // Check if the requested ID matches the authenticated user's ID
  if (String(numericUserId) !== userIdFromUrl) {
    return NextResponse.json(
      { error: "Forbidden: You don't have access to this profile" },
      { status: 403 }
    );
  }

  const doctorData = await db
    .select({ id: doctor.id })
    .from(doctor)
    .where(eq(doctor.userId, numericUserId));

  if (!doctorData.length) {
    return NextResponse.json(
      { error: "Doctor profile not found for this user." },
      { status: 404 }
    );
  }

  try {
    // Parse the request body to get the clinic ID
    const { id: clinicIdToDelete } = await req.json();

    if (!clinicIdToDelete) {
      return NextResponse.json(
        { error: "Clinic ID to delete is missing." },
        { status: 400 }
      );
    }

    const numericClinicIdToDelete = Number(clinicIdToDelete);

    // Delete the clinic
    const deletedClinic = await db
      .delete(clinic)
      .where(eq(clinic.id, numericClinicIdToDelete))
      .returning();

    if (!deletedClinic.length) {
      return NextResponse.json(
        {
          error: `Clinic with ID ${clinicIdToDelete} not found for this doctor.`,
        },
        { status: 404 }
      );
    }

    // Respond with success
    return NextResponse.json(
      { message: `Clinic with ID ${clinicIdToDelete} deleted successfully.` },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting clinic:", error);
    let errorMessage = "Failed to delete clinic";
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    } else {
      errorMessage += `: ${String(error)}`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
