// src/api/auth/connections/get_all_social_platforms/route.ts
import { NextRequest, NextResponse } from "next/server";
import { socialPlatforms } from "../../../../../db/schema";
import { db } from "../../../../../db/db";

export async function GET(req: NextRequest) {
  try {
    const allPlatforms = await db.select().from(socialPlatforms);
    return NextResponse.json(allPlatforms, { status: 200 });
  } catch (error) {
    console.error("Error fetching social platforms:", error);
    return NextResponse.json(
      { message: "Failed to fetch social media platforms" },
      { status: 500 }
    );
  }
}