// Create and Get Patients for a Doctor

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { doctor, patient, transactions, users } from "../../../../../db/schema";
import db from "../../../../../db/db";
import { verifyAuthToken } from "../../../../lib/verify";

// =======================
// GET - Fetch Patients for a Doctor
// =======================
export async function GET() {
  // Verify JWT token using the modularized function
  const decodedOrResponse = await verifyAuthToken();

  // Handle potential error response from token verification
  if (decodedOrResponse instanceof NextResponse) {
    return decodedOrResponse;
  }

  const decoded = decodedOrResponse;
  const userId = Number(decoded.userId);

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
    const patientsWithUsers = await db
      .select({
        id: patient.id,
        patientId: patient.userId,
        patientName: users.name,
        transactionId: transactions.id,
        orderId: transactions.orderId,
        status: transactions.status,
        amount: transactions.amount,
        paymentMode: transactions.paymentMode, // e.g., "NET_BANKING", "UPI", "CREDIT_CARD"
        // // Use bigint to store the timestamp as a number (e.g., milliseconds since epoch)
        timestamp: transactions.timestamp, // Store as number in TS, but as bigint in DB
        timestamp_date: transactions.timestamp_date,
        createdAt: transactions.createdAt,
      })
      .from(patient)
      .innerJoin(transactions, eq(transactions.userId, patient.userId))
      .innerJoin(users, eq(users.id, patient.userId))
      .where(eq(patient.doctorId, requiredDoctorId));

    return NextResponse.json({ Patients: patientsWithUsers });
  } catch (error) {
    console.error("Error fetching patients of doctor:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
