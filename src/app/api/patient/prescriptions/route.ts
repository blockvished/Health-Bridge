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
    const prescriptionsData = await db
      .select({
        prescriptionId: prescription.id,
        advice: prescription.advice,
        diagnosisTests: prescription.diagnosisTests,
        nextFollowUp: prescription.nextFollowUp,
        nextFollowUpType: prescription.nextFollowUpType,
        prescriptionNotes: prescription.prescriptionNotes,
        createdAt: prescription.createdAt,
        
        patientId: prescription.patientId,
        patientName: users.name,
        patientEmail: users.email,
        patientPhone: users.phone,
        
        doctorId: prescription.doctorId,
        doctorName: doctor.name,
        doctorEmail: doctor.email,
        doctorPhone: doctor.phone,
        
        clinicName: clinic.name,
        clinicAddress: clinic.address,
      })
      .from(prescription)
      .innerJoin(patient, eq(prescription.patientId, patient.id))
      .innerJoin(users, eq(patient.userId, users.id))
      .innerJoin(doctor, eq(prescription.doctorId, doctor.id))
      .innerJoin(clinic, eq(prescription.clinicId, clinic.id))
      .where(eq(prescription.patientId, requiredPatientId));

    return NextResponse.json(
      { prescriptions: prescriptionsData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}