import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import {
  doctor,
  prescription,
  medication,
  medicationDosage,
} from "../../../../../db/schema";
import db from "../../../../../db/db";
import { verifyAuthToken } from "../../../../lib/verify";

// GET - get all prescriptions for a doctor
// =======================
export async function GET(req: NextRequest) {
  // Get ID from URL
  // *** COMMENT OUT AUTHENTICATION AND AUTHORIZATION BELOW ***
  //   const userIdFromUrl = req.nextUrl.pathname.split("/").pop() || "unknown";

  // // Verify JWT token
  const decodedOrResponse = await verifyAuthToken();
  if (decodedOrResponse instanceof NextResponse) return decodedOrResponse;
  const { userId } = decodedOrResponse;

  const numericUserId = Number(userId);

  //   // Check if the requested ID matches the authenticated user's ID
  //   if (String(numericUserId) !== userIdFromUrl) {
  //     return NextResponse.json(
  //       { error: "Forbidden: You don't have access to this profile" },
  //       { status: 403 }
  //     );
  //   }

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

  try {
    const allPrescriptionsWithDetails = await db.query.prescription.findMany({
      with: {
        medication: {
          with: {
            medicationDosage: true,
          },
        },
      },
    });

    return NextResponse.json(
      { prescriptions: allPrescriptionsWithDetails },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
