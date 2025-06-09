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
import { sign } from "jsonwebtoken";
import { verify } from "argon2";
import { serialize } from "cookie"; // Needed for manual cookie setting

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

    ////////////////////////////////////////////////////////////////////////////////////////

    const userResult = await db
      .select()
      .from(users)
      .where(or(eq(users.email, emailOrPhone), eq(users.phone, emailOrPhone)))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const user = userResult[0];
    const salt = user.salt || "";
    const saltedPassword = salt + password;

    if (!user.password_hash) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const passwordValid = await verify(user.password_hash, saltedPassword);

    if (!passwordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not set in environment variables.");
    }

    const token = sign(
      {
        userId: user.id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set cookie using "serialize" (works in /api routes)

    const [doctorConsultationDetails] = await db
      .select({ consultationFees: doctorConsultation.consultationFees })
      .from(doctorConsultation)
      .where(and(eq(doctorConsultation.doctorId, doctorId)));

    const consultationFee = doctorConsultationDetails?.consultationFees;

    const userId = userResult[0].id;
    // get patient id

    const getPatient = await db
      .select({ existingPatientId: patient.id })
      .from(patient)
      .where(eq(patient.userId, userId));

    const existingPatientId = getPatient[0]?.existingPatientId;

    // create the appointment
    const appointmentData: NewAppointment = {
      date: date,
      timeFrom: timeTo,
      timeTo: timeFrom,
      mode: consultationMode as "online" | "offline",
      patientId: parseInt(String(existingPatientId), 10),
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
    const response = NextResponse.json({
      success: true,
      message: "Appointment created successfully for patient",
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });

    response.headers.set(
      "Set-Cookie",
      serialize("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60, // 1 hour
      })
    );

    return response;
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
}