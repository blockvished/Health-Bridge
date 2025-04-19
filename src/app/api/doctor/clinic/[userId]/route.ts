import { extname } from "path";
import { NextRequest, NextResponse } from "next/server";
import * as fs from 'fs'; // Use the standard 'fs' import
import path from "path";
import { eq } from "drizzle-orm";
import db from "../../../../../db/db";
import { verifyAuthToken } from "../../../../lib/verify";
import { doctor, clinic } from "../../../../../db/schema";

// Utility function to generate slug
function slugify(str: string) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

// Helper function to convert Blob to Buffer
async function blobToBuffer(blob: Blob): Promise<Buffer> {
    if (typeof (blob as any).arrayBuffer === 'function') {
        const arrayBuffer = await (blob as any).arrayBuffer();
        return Buffer.from(arrayBuffer);
    } else {
        // Fallback for environments where arrayBuffer is not available (e.g., older Node.js)
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

        // 2. Extract fields
        const name = formData.get("name") as string;
        const department = formData.get("department") as string;
        const appointmentLimitStr = formData.get("appointmentLimit") as string;
        const address = formData.get("address") as string;
        const imageFile = formData.get("logo") as Blob | null;

        // 3. Validation
        if (!name || !address) {
            return NextResponse.json({ error: "Name and address are required" }, { status: 400 });
        }

        let imageLink: string | null = null;

        if (imageFile) {
            // Safely get the filename
            const originalFileName = (imageFile as any).name;
            const fileExtension = extname(originalFileName || "") || ".png";
            const safeName = slugify(name);
            const uniqueFilename = `${safeName}.${fileExtension}`;
            const uploadDir = path.join(baseUploadPath, 'clinics', String(numericUserId));
            const uploadPath = path.join(uploadDir, uniqueFilename);

            // Ensure directory exists
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Convert Blob to Buffer
            const buffer = await blobToBuffer(imageFile);

            // Write the file using the standard fs.writeFileSync
            fs.writeFileSync(uploadPath, buffer);

            imageLink = `/private_uploads/clinics/${numericUserId}/${uniqueFilename}`;
        }

        // 5.  Convert appointmentLimit
        const appointmentLimit = appointmentLimitStr ? parseInt(appointmentLimitStr, 10) : undefined;

        // 6. Insert into DB
        const newClinic = await db.insert(clinic)
            .values({
                doctorId: requiredDoctorId,
                name,
                imageLink,
                department,
                appointmentLimit,
                address,
            })
            .returning();

        // 7. Respond
        return NextResponse.json(newClinic[0], { status: 201 });

    } catch (error: any) {
        console.error("Error creating clinic:", error);
        return NextResponse.json(
            { error: "Failed to create clinic", details: error.message },
            { status: 500 }
        );
    }
}
