// src/api/doctor/custom_domain/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db/db"; // Adjust path as needed
import {
  doctor,
  doctorEducation,
  doctorWebsiteDetails,
} from "../../../../db/schema"; // Ensure doctor and doctorWebsiteDetails are imported
import { eq } from "drizzle-orm";
import { verifyAuthToken } from "../../../../app/lib/verify"; // Assuming this utility exists for authentication

export async function GET() {
  try {
    const decodedOrResponse = await verifyAuthToken();
    if (decodedOrResponse instanceof NextResponse) return decodedOrResponse;
    const { userId } = decodedOrResponse;
    const numericUserId = Number(userId);

    // Get doctor data
    const doctorData = await db
      .select({ id: doctor.id })
      .from(doctor)
      .where(eq(doctor.userId, numericUserId))
      .then((res) => res[0]);

    if (!doctorData) {
      return NextResponse.json(
        { error: "Doctor profile not found for this user." },
        { status: 404 }
      );
    }

    const requiredDoctorId = doctorData.id;

    // Fetch all custom domains for this doctor
    const domains = await db
      .select({
        id: doctorWebsiteDetails.id,
        currentUrl: doctorWebsiteDetails.currentUrl,
        customDomain: doctorWebsiteDetails.customDomain,
        status: doctorWebsiteDetails.status,
        createdAt: doctorWebsiteDetails.createdAt,
      })
      .from(doctorWebsiteDetails)
      .where(eq(doctorWebsiteDetails.doctorId, requiredDoctorId));

    return NextResponse.json({
      message: "Custom domains fetched successfully.",
      data: domains,
    });
  } catch (error) {
    console.error("API Error fetching custom domains:", error);
    return NextResponse.json(
      { error: "Internal Server Error occurred while fetching domains." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const decodedOrResponse = await verifyAuthToken();
    if (decodedOrResponse instanceof NextResponse) return decodedOrResponse;
    const { userId } = decodedOrResponse;
    const numericUserId = Number(userId);

    const doctorData = await db
      .select({ id: doctor.id, name: doctor.name })
      .from(doctor)
      .where(eq(doctor.userId, numericUserId))
      .then((res) => res[0]); // Get the first result or undefined

    if (!doctorData) {
      // Check if doctorData is undefined or null
      return NextResponse.json(
        { error: "Doctor profile not found for this user." },
        { status: 404 }
      );
    }

    const requiredDoctorId = doctorData.id;
    const doctorName = doctorData.name ?? ""; 

    function formatDoctorName(doctorName: string) {
      // Use a regular expression to find spaces that are not at the beginning
      // and replace them with hyphens.
      return doctorName.replace(/ /g, "-");
    }

    const requiredDoctorName = formatDoctorName(doctorName);

    const body = await req.json();
    const { customDomain } = body;

    // 1. Validate customDomain input
    if (
      !customDomain ||
      typeof customDomain !== "string" ||
      customDomain.trim() === ""
    ) {
      return NextResponse.json(
        { error: "Custom domain is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    // 2. Check if custom domain already exists for this doctor
    const existingDomain = await db
      .select({ id: doctorWebsiteDetails.id })
      .from(doctorWebsiteDetails)
      .where(eq(doctorWebsiteDetails.customDomain, customDomain.trim()))
      .then((res) => res[0]);

    if (existingDomain) {
      return NextResponse.json(
        { error: "This custom domain is already in use." },
        { status: 409 }
      );
    }

    // 3. Generate currentUrl (Crucial as it's notNull in your schema)
    const generatedCurrentUrl = `https://livedoctors24.com/profile/${requiredDoctorName}`;

    // 4. Insert the new custom domain entry into the database
    const newWebsiteDetail = {
      doctorId: requiredDoctorId,
      currentUrl: generatedCurrentUrl,
      customDomain: customDomain.trim(),
      // 'status' will automatically default to 'inactive' as per your Drizzle schema
      // 'createdAt' will automatically default to current timestamp as per your Drizzle schema
    };

    const insertedData = await db
      .insert(doctorWebsiteDetails)
      .values(newWebsiteDetail)
      .returning();

    if (!insertedData || insertedData.length === 0) {
      return NextResponse.json(
        { error: "Failed to create custom domain entry in the database." },
        { status: 500 }
      );
    }

    // 5. Return success response
    return NextResponse.json({
      message: "Custom domain request submitted successfully.",
      data: insertedData[0], // Return the newly created record
    });
  } catch (error) {
    console.error("API Error adding custom domain:", error);
    // Generic error message for client to prevent leaking sensitive details
    return NextResponse.json(
      {
        error: "Internal Server Error occurred while processing your request.",
      },
      { status: 500 }
    );
  }
}
