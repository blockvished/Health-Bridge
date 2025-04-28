import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import {
  doctor,
  patient,
  prescription,
  medication,
  medicationDosage,
} from "../../../../../db/schema";
import db from "../../../../../db/db";
import { verifyAuthToken } from "../../../../lib/verify";

// GET - get all prescriptions for a doctor
// =======================
export async function GET(req: NextRequest) {
  // *** COMMENT OUT AUTHENTICATION AND AUTHORIZATION BELOW ***

  // Verify JWT token
  const decodedOrResponse = await verifyAuthToken();
  if (decodedOrResponse instanceof NextResponse) return decodedOrResponse;
  const { userId } = decodedOrResponse;

  const numericUserId = Number(userId);

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
      where: eq(prescription.doctorId, requiredDoctorId),
      columns: {
        id: true,
        advice: true,
        diagnosisTests: true,
        nextFollowUp: true,
        nextFollowUpType: true,
        prescriptionNotes: true,
        createdAt: true,
        doctorId: true,
        clinicId: true,
      },
      with: {
        medication: {
          columns: {
            id: true,
            drugType: true,
            drugName: true,
          },
          with: {
            medicationDosage: {
              columns: {
                id: true,
                medicationId: true,
                morning: true,
                afternoon: true,
                evening: true,
                night: true,
                whenToTake: true,
                howManyDaysToTakeMedication: true,
                medicationFrequecyType: true,
                note: true,
              },
            },
          },
        },
        patient: {
          // Include the patient relation
          columns: {
            id: true,
            userId: true, // Include userId to link to the users table
            age: true,
            weight: true,
          },
          with: {
            user: {
              columns: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
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
