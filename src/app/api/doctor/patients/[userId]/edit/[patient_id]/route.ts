// Create and Get Patients for a Doctor

import { NextRequest, NextResponse } from "next/server";
import { eq, or } from "drizzle-orm";
import { doctor, patient, users } from "../../../../../../../db/schema";
import db from "../../../../../../../db/db";
import { verifyAuthToken } from "../../../../../../lib/verify";

// =======================
// PUT - Update - Patient
// =======================
export async function PUT(req: NextRequest) {
  try {
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

    // Get the patient to be updated
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

    // Parse request body
    const reqBody = await req.json();
    const {
      name,
      email,
      phone,
      abha_id,
      age,
      weight,
      height,
      address,
      gender,
    } = reqBody;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Check if the email already exists for another user
    const existingUsers = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email)));

    // Filter out the current user from results
    const conflictingUsers = existingUsers.filter(
      (user) => user.id !== patientUserId
    );

    if (conflictingUsers.length > 0) {
      return NextResponse.json(
        { error: "Email already in use by another user." },
        { status: 409 }
      );
    }

    // Update the user's basic information
    await db
      .update(users)
      .set({
        name,
        email,
        phone,
        // Note: We're not updating password or role for security reasons
      })
      .where(eq(users.id, patientUserId));

    // Update the patient-specific information
    const [updatedPatient] = await db
      .update(patient)
      .set({
        abhaId: abha_id || null,
        age: age ? Number(age) : null,
        weight: weight ? Number(weight) : null,
        height: height ? Number(height) : null,
        address: address || null,
        gender: gender || null,
      })
      .where(eq(patient.id, Number(patientIdFromUrl)))
      .returning();

    if (!updatedPatient) {
      return NextResponse.json(
        { error: "Failed to update patient information." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Patient updated successfully.", patient: updatedPatient },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating patient:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
