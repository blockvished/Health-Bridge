// app/api/public/appointments/existing/route.ts
import { NextRequest, NextResponse } from "next/server";
import { and, eq, or } from "drizzle-orm";
import {
  appointments,
  doctorConsultation,
  NewAppointment,
  patient,
  users,
} from "../../../../../db/schema";
import db from "../../../../../db/db";
import { randomBytes } from "crypto";
import { hash } from "argon2";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("=== EXISTING USER APPOINTMENT DATA ===");
    console.log("Full Request Body:", JSON.stringify(body, null, 2));

    // Extract booking data
    const {
      date,
      timeSlot,
      consultationMode,
      doctorId,
      clinicId,
      consultationFees,
      // Login data
      emailOrPhone,
      password,
    } = body;

    // Parse time slot (format: "09:00-10:00")
    const [timeFrom, timeTo] = timeSlot.split("-");

    console.log("=== PARSED APPOINTMENT DATA ===");
    console.log({
      date,
      timeFrom,
      timeTo,
      mode: consultationMode,
      doctorId,
      clinicId: parseInt(clinicId),
      amount: consultationFees,
      // Patient login data
      loginData: {
        emailOrPhone,
        password,
      },
    });

    ////////////////////////////////////////////////////////////////////////////////////////

    const [doctorConsultationDetails] = await db
      .select({ consultationFees: doctorConsultation.consultationFees })
      .from(doctorConsultation)
      .where(and(eq(doctorConsultation.doctorId, doctorId)));

    const consultationFee = doctorConsultationDetails?.consultationFees;

    // existing has issue
    // create the appointment
    const appointmentData: NewAppointment = {
      date: date,
      timeFrom: timeTo,
      timeTo: timeFrom,
      mode: consultationMode as "online" | "offline",
      patientId: parseInt(String(newPatientId), 10),
      doctorId: parseInt(String(doctorId), 10),
      clinicId: clinicId,
      amount: consultationFee,
      reason: "",
      paymentStatus: false,
      visitStatus: false,
    };

    await db.insert(appointments).values(appointmentData);
    console.log("appointment created");

    // login the user

    return NextResponse.json({
      success: true,
      message: "Appointment created successfully for new patient.",
    });

    // TODO: Implement actual logic
    // 1. Authenticate existing patient
    // 2. Get patientId from authentication
    // 3. Create appointment record
    // 4. Send confirmation

    return NextResponse.json({
      success: true,
      message: "Existing user appointment booking received",
      appointmentId: "temp_existing_" + Date.now(), // Temporary ID
      patientId: "temp_existing_patient_" + Date.now(), // Temporary patient ID from auth
    });
  } catch (error) {
    console.error("Error processing existing user appointment:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process appointment booking",
      },
      { status: 500 }
    );
  }
} // send  the data to api /api/public/appointment/route.ts
// and console there send

// date, timeto, timefrom, mode, patientid will be generated based on data , doctorid, clinicid, amount,
// for new -> name, email?, phone, password
// for alreadyexisting - > email password

// alreadyexisting or new

// amout should be verified
// validate mode in future

//   const appointmentData: NewAppointment = {
//     date: reqBody.date,
//     timeFrom: reqBody.time.from,
//     timeTo: reqBody.time.to,
//     mode: reqBody.appointmentType.toLowerCase() as "online" | "offline",
//     patientId: parseInt(String(newPatientId), 10),
//     doctorId: parseInt(String(requiredDoctorId), 10),
//     clinicId: reqBody.clinic_id,
//     amount: consultationFee,
//     reason: reqBody.reason,
//     paymentStatus: false,
//     visitStatus: false,
//   };
