import { NextRequest, NextResponse } from "next/server";
import { or, eq, and } from "drizzle-orm";
import {
  doctor,
  appointments,
  NewAppointment,
  users,
  patient,
  genderEnum,
  doctorConsultation,
} from "../../../../../../db/schema";
import db from "../../../../../../db/db";
import { verifyAuthToken } from "../../../../../lib/verify";
import { hash } from "argon2";
import { randomBytes } from "crypto";
import fs from "fs/promises";
import path from "path";

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

  const [doctorConsultationDetails] = await db
    .select({ consultationFees: doctorConsultation.consultationFees })
    .from(doctorConsultation)
    .where(and(eq(doctorConsultation.doctorId, requiredDoctorId)));

  const consultationFee = doctorConsultationDetails?.consultationFees || 0;

  try {
    const formData = await req.formData();

    const appointmentDataStr = formData.get("appointmentData");
    if (!appointmentDataStr || typeof appointmentDataStr !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid appointment data" },
        { status: 400 }
      );
    }
    const reqBody = JSON.parse(appointmentDataStr);
    console.log("print reqbody", reqBody);

    const { patientId } = reqBody;
    // Handle files - just log them for now
    const files = formData.getAll("files");

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const dateTimePrefix = `${year}_${month}_${day}_${hours}${minutes}${seconds}`;

    const uploadDir = path.join(
      process.cwd(),
      "private_uploads",
      "patient_docs",
      String(patientId)
    );

    try {
      await fs.mkdir(uploadDir, { recursive: true }); // Create directory if it doesn't exist

      for (const file of files) {
        if (file instanceof File) {
          const originalName = file.name;
          const fileExtension = originalName.split(".").pop();
          const baseName = originalName.substring(
            0,
            originalName.lastIndexOf(".")
          );
          const newFileName = `${dateTimePrefix}_${baseName}.${fileExtension}`;
          const filePath = path.join(uploadDir, newFileName);

          const fileBuffer = await file.arrayBuffer();
          const fileArray = Array.from(new Uint8Array(fileBuffer));

          await fs.writeFile(filePath, Buffer.from(fileArray));
          console.log(`Saved ${originalName} as ${newFileName} to ${filePath}`);
        }
      }
    } catch (error) {
      console.log(error);
    }

    // console.log("Received files:");

    // files.forEach((file, index) => {
    //   if (file instanceof File) {
    //     console.log(
    //       `File ${index + 1}: ${file.name}, Size: ${file.size} bytes, Type: ${
    //         file.type
    //       }`
    //     );
    //   }
    // });

    let newPatientId: number | undefined;

    // console.log("Request Body:", reqBody);

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

      console.log("user created");
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
        clinicId: reqBody.clinic_id,
        amount: consultationFee,
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
        clinicId: reqBody.clinic_id,
        amount: consultationFee,
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
