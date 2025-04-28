import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { doctor, prescription, users, patient, clinic } from "../../../../db/schema";
import db from "../../../../db/db";
import { verifyAuthToken } from "../../../lib/verify";

// =======================
// Get - All Prescriptions for Patient
// =======================
export async function GET(req: NextRequest) {
  // Verify JWT token using the modularized function
  const decodedOrResponse = await verifyAuthToken();

  // Handle potential error response from token verification
  if (decodedOrResponse instanceof NextResponse) {
    return decodedOrResponse;
  }

  const decoded = decodedOrResponse;
  const userId = Number(decoded.userId);
  
  // Query for patient information
  const patientData = await db
    .select()
    .from(patient)
    .where(eq(patient.userId, userId));

  if (!patientData.length) {
    return NextResponse.json(
      { error: "Patient profile not found for this user." },
      { status: 404 }
    );
  }

  const requiredPatientId = patientData[0].id;

  try {
    const prescriptionsData = await db.query.prescription.findMany({
          where: eq(prescription.patientId, requiredPatientId),
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
            doctor: {
              columns: {
                name: true,
                specialization: true,
                email: true,
                degree: true,
              },
            },
            clinic: {
              columns: {
                name: true,
                address: true,
                imageLink: true,
              },
            },    
          },
        });

    return NextResponse.json(
      { prescriptions: prescriptionsData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}