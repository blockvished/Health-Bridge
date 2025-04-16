import { NextRequest, NextResponse } from "next/server";
import { or, eq } from "drizzle-orm";
import {
  doctor,
  appointments,
  NewAppointment,
  users,
  patient,
  genderEnum,
} from "../../../../../../db/schema";
import db from "../../../../../../db/db";
import { verifyAuthToken } from "../../../../../lib/verify";
import { hash } from "argon2";
import { randomBytes } from "crypto";

type TimeRange = {
  from: string; // e.g. '09:00:00'
  to: string; // e.g. '11:00:00'
};

type ScheduleItem = {
  id: number;
  dayOfWeek: string;
  isActive: boolean;
  times: TimeRange[];
};
// =======================
// POST - Appointment Settings for a Doctor
// =======================
export async function POST(req: NextRequest) {
  // Get ID from URL
  const userIdFromUrl = req.nextUrl.pathname.split("/").pop() || "unknown";

  // Verify JWT token using the modularized function
  const decodedOrResponse = await verifyAuthToken();

  // Handle potential error response from token verification
  if (decodedOrResponse instanceof NextResponse) {
    return decodedOrResponse;
  }

  const decoded = decodedOrResponse;
  const userId = Number(decoded.userId);

  // Check if the requested ID matches the authenticated user's ID
  if (String(userId) !== userIdFromUrl) {
    return NextResponse.json(
      { error: "Forbidden: You don't have access to this profile" },
      { status: 403 }
    );
  }

  // Query for doctor information
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
  try {
    const reqBody = await req.json();
    let newPatientId: number | undefined;

    console.log("Request Body:", reqBody);

    if (reqBody.patientType === "New") {
      const { height, address, role = "patient" } = reqBody;

      const {
        name,
        phone,
        email,
        abhaId: abha_id, // Rename abhaId to abha_id to match your variable name
        age,
        weight,
        gender: patientGender,
      } = reqBody.patient;

      if (!name || !phone) {
        return NextResponse.json({
          error: "Patient name and phone are required for new patients.",
          status: 400,
        });
      }
      
      const existingUsers = await db
        .select()
        .from(users)
        .where(or(eq(users.email, email), eq(users.phone, phone)));

      if (existingUsers.length > 0) {
        return NextResponse.json(
          { error: "User with this email or phone already exists." },
          { status: 409 }
        );
      }

      // Generate a random salt
      const salt = randomBytes(16).toString("hex");

      // Hash the default password using argon2
      const password = email || phone; // Use phone as default if email is missing
      const SERVER_PEPPER = process.env.SERVER_PEPPER;
      const saltedPassword = SERVER_PEPPER + password + SERVER_PEPPER;
      const passwordHash = await hash(saltedPassword);

      console.log("Password Hash:", passwordHash);

      // Create the new user // if email is not provided, use phone as email
      const [newUser] = await db
        .insert(users)
        .values({
          name,
          email: email || phone, // Use phone as email if email is not provided
          phone,
          password_hash: passwordHash,
          salt,
          role: role || "patient",
        })
        .returning({ id: users.id });

        console.log("user created")
      const [newPatient] = await db
        .insert(patient)
        .values({
          userId: newUser.id,
          doctorId: requiredDoctorId,
          abhaId: abha_id || "",
          age: age !== undefined ? Number(age) : null,
          weight: weight !== undefined ? Number(weight) : null,
          height: height !== undefined ? Number(height) : null,
          address: address || "",
          gender: patientGender
            ? (patientGender.toLowerCase() as (typeof genderEnum.enumValues)[number])
            : null,
        })
        .returning({ id: patient.id });

      console.log("patient created");
      newPatientId = newPatient.id;

      // create the appointment
      const appointmentData: NewAppointment = {
        date: reqBody.date,
        timeFrom: reqBody.time.from,
        timeTo: reqBody.time.to,
        mode: reqBody.appointmentType.toLowerCase() as "online" | "offline",
        patientId: parseInt(String(newPatientId), 10),
        doctorId: parseInt(String(requiredDoctorId), 10),
        reason: reqBody.reason,
        paymentStatus: false,
        visitStatus: false,
      };

      await db.insert(appointments).values(appointmentData);
      console.log("appointment created");

      return NextResponse.json({
        success: true,
        message: "Appointment created successfully for new patient.",
      });
    } else if (reqBody.patientType === "Old") {
      newPatientId = reqBody.patientId;
      if (!reqBody.patientId) {
        return NextResponse.json(
          { error: "Patient ID is required for an existing patient." },
          { status: 400 }
        );
      }

      const appointmentData: NewAppointment = {
        date: reqBody.date,
        timeFrom: reqBody.time.from,
        timeTo: reqBody.time.to,
        mode: reqBody.appointmentType.toLowerCase() as "online" | "offline",
        patientId: parseInt(String(newPatientId), 10),
        doctorId: parseInt(String(requiredDoctorId), 10),
        reason: reqBody.reason,
        paymentStatus: false,
        visitStatus: false,
      };

      await db.insert(appointments).values(appointmentData);
      return NextResponse.json({
        success: true,
        message: "Appointment created successfully for existing patient.",
      });
    } else {
      return NextResponse.json(
        { error: "Invalid patient type." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment." },
      { status: 500 }
    );
  }
}
