import { NextRequest, NextResponse } from "next/server";
import { eq, and, inArray } from "drizzle-orm";
import db from "../../../../../../db/db";
import { verifyAuthToken } from "../../../../../lib/verify";
import { doctor, doctorExperience } from "../../../../../../db/schema";
import { features } from "process";

// /api/doctor/consultation/settings/[userId]
// =======================
// GET - Fetch Consultation Settings
// =======================
export async function GET(req: NextRequest) {
  // Get ID from URL
  const userIdFromUrl = req.nextUrl.pathname.split("/").pop() || "unknown";

  // Verify JWT token using the modularized function
  const decodedOrResponse = await verifyAuthToken();

  // Handle potential error response from token verification
  if (decodedOrResponse instanceof NextResponse) {
    return decodedOrResponse;
  }

  const decoded = decodedOrResponse;
  const userId = Number(decoded.userId);

  if (String(userId) !== userIdFromUrl) {
    return NextResponse.json(
      { error: "Forbidden: You don't have access to this profile" },
      { status: 403 }
    );
  }

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
    // consultation settings
    // const Experiences = await db
    //   .select()
    //   .from(doctorExperience)
    //   .where(eq(doctorExperience.doctorId, requiredDoctorId))
    //   .orderBy(doctorExperience.sortOrder);
    // // console.log("Fetched -Experiences:", Experiences);
    // return NextResponse.json({ Experiences });
  } catch (error) {
    console.error("Error fetching doctor -Experience:", error);
    return NextResponse.json({
      success: true,
    });
  }
}

// =======================
// POST - Create or Update - Consultation Settings
// =======================
export async function POST(req: NextRequest) {
  const userIdFromUrl = req.nextUrl.pathname.split("/").pop() || "unknown";
  try {
    // Verify JWT token
    const decodedOrResponse = await verifyAuthToken();

    // Handle potential error response from token verification
    if (decodedOrResponse instanceof NextResponse) {
      return decodedOrResponse;
    }

    const decoded = decodedOrResponse;
    const userId = Number(decoded.userId);

    const reqBody = await req.json();
    const { id, title, organization, yearFrom, yearTo, details, sortOrder } =
      reqBody;
    if (String(userId) !== userIdFromUrl) {
      return NextResponse.json(
        {
          error:
            "Forbidden: You don't have access to this profile's education data.",
        },
        { status: 403 }
      );
    }

    // Query for doctor information based on the authenticated user ID
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

    if (id) {
      // Update existing consultation setting
      
      // export const doctorConsultation = pgTable("doctor_consultation", {
      // id: serial("id").primaryKey(),
      // doctorId: integer("doctor_id").notNull().unique().references(() => doctor.id),
      // consultationFees: integer("consultation_fees"),
      // mode: consultationModeEnum("mode"), // Enforced ENUM type
      // consultationLink: text("consultation_link"),
      // });
    } else {
      // Create new consultation setting
    }
  } catch (error) {
    console.error("Error creating/updating doctor -Experience:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
