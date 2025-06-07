// app/api/public/appointments/new/route.ts
import { and, eq, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { appointments, doctorConsultation, NewAppointment, patient, users } from "../../../../../db/schema";
import db from "../../../../../db/db";
import { randomBytes } from "crypto";
import { hash } from "argon2";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("=== NEW REGISTRATION APPOINTMENT DATA ===");
    console.log("Full Request Body:", JSON.stringify(body, null, 2));

    // Extract booking data
    const {
      date,
      timeSlot,
      consultationMode,
      doctorId,
      clinicId,
      // Registration data
      name,
      email,
      phone,
      password,
    } = body;

    // Parse time slot (format: "09:00-10:00")
    const [timeFrom, timeTo] = timeSlot.split("-");

    // TODO: Implement actual logic
    const [doctorConsultationDetails] = await db
      .select({ consultationFees: doctorConsultation.consultationFees })
      .from(doctorConsultation)
      .where(and(eq(doctorConsultation.doctorId, doctorId)));

    const consultationFee = doctorConsultationDetails?.consultationFees;

    ////////////////////////////////
    if (!name || !phone) {
      return NextResponse.json({
        error: "Patient name and phone are required for new patients.",
        status: 400,
      });
    }

    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.phone, phone))

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "User with this email or phone already exists." },
        { status: 409 }
      );
    }

    // Generate a random salt
    const salt = randomBytes(16).toString("hex");

    // Hash the default password using argon2
    const saltedPassword = salt + password;
    const passwordHash = await hash(saltedPassword);

    // Create the new user // if email is not provided, use phone as email
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email: email || phone, // Use phone as email if email is not provided
        phone,
        password_hash: passwordHash,
        salt,
        role: "patient",
      })
      .returning({ id: users.id });

    console.log("user created");
    const [newPatient] = await db
      .insert(patient)
      .values({
        userId: newUser.id,
        doctorId: doctorId,
        abhaId: "",
        age: null,
        weight: null,
        height: null,
        address: "",
        gender:  null,
      })
      .returning({ id: patient.id });

    console.log("patient created");
    const newPatientId = newPatient.id;

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

  } catch (error) {
    console.error("Error processing new appointment:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process appointment booking",
      },
      { status: 500 }
    );
  }
}
