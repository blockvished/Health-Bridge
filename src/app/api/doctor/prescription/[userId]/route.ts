import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { doctor, prescription, medication } from "../../../../../db/schema";
import db from "../../../../../db/db";
import { verifyAuthToken } from "../../../../lib/verify";

// Define enum types to match your schema
type TimeFrequencyType = "days" | "weeks" | "months";
type MealTimeType = "after_meal" | "before_meal" | "after/before_meal";
type DrugType = "cap" | "tab" | "syp" | "oin";
type DosageType = 
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
  | "5 ml"
  | null;

type DrugDosage = {
  time: "morning" | "afternoon" | "evening" | "night";
  value: string;
};

type Drug = {
  id: number;
  name: string;
  type: DrugType;
  dosages: DrugDosage[];
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
      drugs: Drug[];
    } = reqBody;
    
    // Convert nextFollowUpType to proper enum value
    const validatedFollowUpType: TimeFrequencyType = 
      nextFollowUpType === "day" || nextFollowUpType === "days" ? "days" :
      nextFollowUpType === "week" || nextFollowUpType === "weeks" ? "weeks" :
      nextFollowUpType === "month" || nextFollowUpType === "months" ? "months" :
      "days"; // Default to days if invalid
      
    const [newPrescription] = await db
      .insert(prescription)
      .values({
        patientId: typeof patientId === 'string' ? parseInt(patientId) : patientId,
        doctorId: requiredDoctorId,
        clinicId: typeof clinicId === 'string' ? parseInt(clinicId) : clinicId,
        advice,
        diagnosisTests,
        nextFollowUp: typeof nextFollowUp === 'string' ? parseInt(nextFollowUp) : nextFollowUp,
        nextFollowUpType: validatedFollowUpType,
        prescriptionNotes,
      })
      .returning({ id: prescription.id });

    if (drugs && Array.isArray(drugs)) {
      const medicationValues = drugs
        .filter((drug) => drug.name)
        .map((drug) => {
          // Map dosage values to proper enum values
          const mapToDosageType = (value: string | null): DosageType => {
            if (!value) return null;
            
            // Map to one of the valid DosageType enum values
            const validDosageTypes = ["0", "1", "2", "3", "4", "5", "1/2", "0.5 ml", "1 ml", "2 ml", "3 ml", "4 ml", "5 ml"];
            if (validDosageTypes.includes(value)) {
              return value as DosageType;
            }
            
            // If not a direct match, try to find the closest match
            if (value === "0.5") return "1/2";
            if (value === "AS_NEEDED") return "1"; // Default to 1 for AS_NEEDED
            
            return "1"; // Default if not matching
          };
          
          const dosagesObj = drug.dosages.reduce<{
            morning: DosageType;
            afternoon: DosageType;
            evening: DosageType;
            night: DosageType;
          }>(
            (acc, dosage: DrugDosage) => {
              const { time, value } = dosage;
              if (time === "morning") acc.morning = mapToDosageType(value);
              if (time === "afternoon") acc.afternoon = mapToDosageType(value);
              if (time === "evening") acc.evening = mapToDosageType(value);
              if (time === "night") acc.night = mapToDosageType(value);
              return acc;
            },
            {
              morning: null,
              afternoon: null,
              evening: null,
              night: null,
            }
          );

          const daysToTake = typeof nextFollowUp === 'string' 
            ? parseInt(nextFollowUp) 
            : nextFollowUp;

          // Map drug type to match enum
          const mapDrugType = (type: string): DrugType => {
            const typeMap: Record<string, DrugType> = {
              "TAB": "tab",
              "SYP": "syp",
              "CAP": "cap",
              "OIN": "oin",
            };
            
            return typeMap[type] || "tab"; // Default to tab if not found
          };

          return {
            prescriptionId: newPrescription.id,
            drugName: drug.name,
            drugType: mapDrugType(drug.type),
            morning: dosagesObj.morning,
            afternoon: dosagesObj.afternoon,
            evening: dosagesObj.evening,
            night: dosagesObj.night,
            whenToTake: "after_meal" as MealTimeType, // Changed to lowercase to match enum
            note: "",
            howManyDaysToTakeMedication: daysToTake,
            medicationFrequecyType: validatedFollowUpType,
          };
        });

      if (medicationValues.length > 0) {
        await db.insert(medication).values(medicationValues);
      }
    }

    return NextResponse.json(
      { success: true, prescriptionId: newPrescription.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating prescription:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}