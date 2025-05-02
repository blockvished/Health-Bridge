// Create and Get Patients for a Doctor

import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { doctor, patient, users } from "../../../../../../../db/schema";
import db from "../../../../../../../db/db";
import { verifyAuthToken } from "../../../../../../lib/verify";

// =======================
// DELETE - Delete - Patient
// =======================
export async function DELETE(req: NextRequest) {
  try {
    // Get doctor ID and patient ID from URL params
    const patientIdFromUrl = req.nextUrl.pathname.split("/").pop();
    const segments = req.nextUrl.pathname.split("/");
    const userIdFromUrl = segments[segments.length - 3];

    // Verify JWT token
    const decodedOrResponse = await verifyAuthToken();

    if (decodedOrResponse instanceof NextResponse) {
      return decodedOrResponse;
    }
    const decoded = decodedOrResponse;
    const userId = Number(decoded.userId);

    // Check if the requested user ID matches the authenticated user's ID
    if (String(userId) !== userIdFromUrl) {
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

    // Get the patient to be deleted
    const existingPatient = await db
      .select()
      .from(patient)
      .where(eq(patient.id, Number(patientIdFromUrl)));

    //   console.log("existingPatient", existingPatient)

    if (!existingPatient.length) {
      return NextResponse.json(
        { error: "Patient not found." },
        { status: 404 }
      );
    }

    // Verify doctor has authority over this patient
    if (existingPatient[0].doctorId !== requiredDoctorId) {
      return NextResponse.json(
        { error: "Forbidden: You don't have access to this patient" },
        { status: 403 }
      );
    }

    // Get the patient's user ID
    const patientUserId = existingPatient[0].userId;

    // Begin transaction for atomic deletion
    await db.transaction(async (tx) => {
      // Delete patient record first (due to foreign key constraints)
      await tx.delete(patient).where(eq(patient.id, Number(patientIdFromUrl)));

      // Delete user record
      await tx.delete(users).where(eq(users.id, patientUserId));
    });

    return NextResponse.json(
      { message: "Patient deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting patient:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
