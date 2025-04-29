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
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch plans" }, { status: 500 });
  }
}