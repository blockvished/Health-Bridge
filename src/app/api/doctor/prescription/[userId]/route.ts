import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import {
  doctor,
  prescription,
  medication,
  medicationDosage,
} from "../../../../../db/schema";
import db from "../../../../../db/db";
import { verifyAuthToken } from "../../../../lib/verify";

type ValidTimeFrequencyType = "days" | "weeks" | "months";
type ValidDosageType =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "1/2"
  | "0.5 ml"
  | "1 ml"
  | "2 ml"
  | "3 ml"
  | "4 ml"
  | "5 ml";
type ValidMealTimeType = "after_meal" | "before_meal" | "after_before_meal";

// Define enum types to match your schema
type ValidDrugType = "cap" | "tab" | "syp" | "oin";

type APIDrugDosage = {
  id?: number;
  morning?: string;
  afternoon?: string;
  evening?: string;
  night?: string;
  durationValue?: string;
  durationUnit?: string;
  mealTime?: string;
  note?: string;
};

type APIDrug = {
  id?: number;
  name: string;
  type: ValidDrugType;
  dosages: APIDrugDosage[];
};

// POST - create
// =======================
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
  console.log(requiredDoctorId);

  try {
    const reqBody = await req.json();

    const {
      patientId,
      clinicId,
      advice,
      diagnosisTests,
      nextFollowUp,
      nextFollowUpType,
      prescriptionNotes,
      drugs,
    }: {
      patientId: string | number;
      clinicId: string | number;
      advice: string;
      diagnosisTests: string;
      nextFollowUp: string | number;
      nextFollowUpType: string;
      prescriptionNotes: string;
      drugs: APIDrug[];
    } = reqBody;

    const lowerCaseNextFollowUpType = (nextFollowUpType || "").toLowerCase();

    console.log("drugs:", JSON.stringify(drugs, null, 2));

    const [newPrescription] = await db
      .insert(prescription)
      .values({
        patientId:
          typeof patientId === "string" ? parseInt(patientId) : patientId,
        doctorId: requiredDoctorId,
        clinicId: typeof clinicId === "string" ? parseInt(clinicId) : clinicId,
        advice,
        diagnosisTests,
        nextFollowUp:
          typeof nextFollowUp === "string"
            ? parseInt(nextFollowUp)
            : nextFollowUp,
        nextFollowUpType: lowerCaseNextFollowUpType as ValidTimeFrequencyType,
        prescriptionNotes,
      })
      .returning({ id: prescription.id });

    if (drugs && Array.isArray(drugs)) {
      for (const drugItem of drugs) {
        // Insert the medication
        const [newMedication] = await db
          .insert(medication)
          .values({
            prescriptionId: newPrescription.id,
            drugType: drugItem.type.toLowerCase() as ValidDrugType, // Use the actual DrugType
            drugName: drugItem.name,
          })
          .returning({ id: medication.id });

        if (newMedication?.id && Array.isArray(drugItem.dosages)) {
          for (const dosage of drugItem.dosages) {
            await db.insert(medicationDosage).values({
              medicationId: newMedication.id,
              morning: dosage.morning as ValidDosageType | undefined, // Use ValidDosageType
              afternoon: dosage.afternoon as ValidDosageType | undefined, // Use ValidDosageType
              evening: dosage.evening as ValidDosageType | undefined, // Use ValidDosageType
              night: dosage.night as ValidDosageType | undefined, // Use ValidDosageType
              whenToTake: dosage.mealTime as ValidMealTimeType,
              howManyDaysToTakeMedication: dosage.durationValue
                ? parseInt(dosage.durationValue)
                : undefined,
              medicationFrequecyType: dosage.durationUnit?.toLowerCase() as
                | ValidTimeFrequencyType
                | undefined, // Use ValidTimeFrequencyType
              note: dosage.note,
            });
          }
        }
      }

      return NextResponse.json(
        { success: true, prescriptionId: newPrescription.id },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        {
          success: true,
          prescriptionId: newPrescription.id,
          message: "Prescription created without medications.",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error creating prescription:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
