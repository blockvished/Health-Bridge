import { NextResponse } from "next/server";
import { db } from "../../../db/db"; // Your Drizzle DB instance

// GET /api/plans
export async function GET() {
  try {
    const allPlans = await db.query.plans.findMany({
      with: {
        features: true,
      },
    });

    return NextResponse.json({ success: true, data: allPlans });
  } catch (error: unknown) {
    console.error("Error fetching plans:", error);
    let errorMessage = "Failed to fetch plans";
    if (error instanceof Error) {
      errorMessage = error.message || errorMessage;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
