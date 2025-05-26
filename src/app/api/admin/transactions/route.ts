import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db/db";
import { transactions, users, doctor, plans } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { verifyAuthToken } from "@/lib/verify";

export async function GET(request: NextRequest) {
  const decodedOrResponse = await verifyAuthToken();

  // Handle potential error response from token verification
  if (decodedOrResponse instanceof NextResponse) {
    return decodedOrResponse;
  }

  const decoded = decodedOrResponse;
  try {
    // Join all the required tables
    const result = await db
      .select({
        doctorName: doctor.name,
        doctorEmail: doctor.email,
        planName: plans.name,
        planType: doctor.planType,
        transactionAmount: transactions.amount,
        transactionStatus: transactions.status,
        transactionDate: transactions.timestamp_date,
        expireAt: doctor.expireAt,
      })
      .from(transactions)
      .innerJoin(users, eq(transactions.userId, users.id))
      .innerJoin(doctor, eq(users.id, doctor.userId))
      .leftJoin(plans, eq(doctor.planId, plans.id))
      .where(eq(users.role, "doctor"));

    // Format the response
    const formattedResult = result.map((row) => ({
      doctorName: row.doctorName,
      doctorEmail: row.doctorEmail,
      planName: row.planName || "No Plan", // Handle case where planId might be null
      planType: row.planType,
      transactionAmount: row.transactionAmount,
      transactionStatus: row.transactionStatus,
      transactionDate: row.transactionDate,
      expireAt: row.expireAt ? row.expireAt.toISOString() : null, // Format date to ISO string
    }));

    return NextResponse.json({
      success: true,
      data: formattedResult,
      count: formattedResult.length,
    });
  } catch (error) {
    console.error("Error fetching doctor transactions:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch doctor transactions",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
