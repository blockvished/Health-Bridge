// /api/doctor/payout/balance/route.ts

import { NextResponse } from "next/server";
import { db } from  "../../../../../db/db" // adjust based on your structure
import { doctor } from "../../../../../db/schema"; // path to your doctor table schema
import { eq } from "drizzle-orm";
import { verifyAuthToken } from "../../../../../app/lib/verify"; // adjust path as needed

export async function GET() {
  try {
    // Verify JWT token
    const decodedOrResponse = await verifyAuthToken();
    if (decodedOrResponse instanceof NextResponse) {
      return decodedOrResponse; // Likely 401/403 error
    }

    const decoded = decodedOrResponse;
    const userId = Number(decoded.userId);

    // Fetch doctor's payout data
    const doctorData = await db
      .select({
        balance: doctor.balance,
        totalWithdraw: doctor.totalWithdraw,
        totalEarnings: doctor.totalEarnings,
      })
      .from(doctor)
      .where(eq(doctor.userId, userId))
      .limit(1);

    if (!doctorData.length) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json(doctorData[0]);
  } catch (error) {
    console.error("[DOCTOR_PAYOUT_BALANCE]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
