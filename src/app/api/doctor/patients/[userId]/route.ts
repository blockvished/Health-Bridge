// Create and Get Patients for a Doctor

import { NextRequest, NextResponse } from "next/server";
import { eq, or } from "drizzle-orm";
import { doctor, patient, users } from "../../../../../db/schema";
import db from "../../../../../db/db";
import { verifyAuthToken } from "../../../../lib/verify";
import { hash } from "argon2";
import { randomBytes } from "crypto";

// =======================
// GET - Fetch -Educations
// =======================
export async function GET(req: NextRequest) {
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
    // const Patients = await db
    //   .select()
    //   .from(patient)
    //   .where(eq(patient.doctorId, requiredDoctorId))
    // console.log("Fetched -Patients:", Patients);

    // return NextResponse.json({ Patients });

    const patientsWithUsers = await db
      .select({
        id: patient.id,
        patientId: patient.userId, // Renaming for clarity in the API response
        abha_id: patient.abhaId,
        age: patient.age,
        weight: patient.weight,
        address: patient.address,
        gender: patient.gender,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt,
        name: users.name,
        email: users.email,
        phone: users.phone,
      })
      .from(patient)
      .innerJoin(users, eq(patient.userId, users.id))
      .where(eq(patient.doctorId, requiredDoctorId));

    // console.log("Fetched - Patients with User Info:", patientsWithUsers);

    return NextResponse.json({ Patients: patientsWithUsers });
  } catch (error) {
    console.error("Error fetching patients of doctor:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// =======================
// POST - Create - Patient
// =======================
export async function POST(req: NextRequest) {
  try {
    // Get doctor ID from URL
    const userIdFromUrl = req.nextUrl.pathname.split("/").pop() || "unknown";

    // Verify JWT token
    const decodedOrResponse = await verifyAuthToken();
    if (decodedOrResponse instanceof NextResponse) {
      return decodedOrResponse;
    }
    const decoded = decodedOrResponse;
    const userId = Number(decoded.userId);

    // Check if the requested ID matches the authenticated user's ID
    if (String(userId) !== userIdFromUrl) {
      console.log("hsifhisf");
      return NextResponse.json(
        { error: "Forbidden: You don't have access to this profile" },
        { status: 403 }
      );
    }

    // Fetch doctor information to ensure the requesting user is the correct doctor
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

    const reqBody = await req.json();
    const { name, email, phone, abha_id, age, weight, height, address, gender, role } =
      reqBody;

    // Validate required fields
    if (
      !name ||
      !email ||
      !phone ||
      !abha_id ||
      !age ||
      !height ||
      !weight ||
      !address ||
      !gender
    ) {
      return NextResponse.json(
        { error: "Missing required fieldsKTJ." },
        { status: 400 }
      );
    }

    // Check if the email or phone already exists
    const existingUsers = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email)));

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "User with this email or phone already exists." },
        { status: 409 }
      );
    }

    // Generate a random salt
    const salt = randomBytes(16).toString("hex");

    // Hash the default password using argon2
    const password = email // Better default password
    const SERVER_PEPPER = process.env.SERVER_PEPPER;
    const saltedPassword = SERVER_PEPPER + password + SERVER_PEPPER;
    const passwordHash = await hash(saltedPassword);

    // Create the new user
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        phone,
        password_hash: passwordHash,
        salt,
        role: role || "patient",
      })
      .returning({ id: users.id });

    if (!newUser?.id) {
      return NextResponse.json(
        { error: "Failed to create new user." },
        { status: 500 }
      );
    }

    // Create the patient profile
    const [newPatient] = await db
      .insert(patient)
      .values({
        userId: newUser.id,
        doctorId: requiredDoctorId,
        abhaId: abha_id,
        age: Number(age),
        weight: Number(weight),
        height: Number(height),
        address,
        gender,
      })
      .returning();

    if (!newPatient) {
      // If patient creation fails, roll back the user creation
      await db.delete(users).where(eq(users.id, newUser.id));
      return NextResponse.json(
        { error: "Failed to create patient profile." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Patient created successfully.", patient: newPatient },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating patient:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
