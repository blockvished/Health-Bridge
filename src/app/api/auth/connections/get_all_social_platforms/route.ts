import { NextRequest, NextResponse } from "next/server";
import { socialPlatforms, socialConnections } from "../../../../../db/schema";
import { db } from "../../../../../db/db";
import { eq, inArray } from "drizzle-orm";
import { verifyAuthToken } from "../../../../lib/verify";

export async function GET(req: NextRequest) {
  try {
    const decodedOrResponse = await verifyAuthToken();
    if (decodedOrResponse instanceof NextResponse) {
      return decodedOrResponse;
    }

    const decoded = decodedOrResponse;
    const userId = Number(decoded.userId);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get user's social connections
    const userConnections = await db
      .select({
        provider: socialConnections.provider,
      })
      .from(socialConnections)
      .where(eq(socialConnections.userId, parseInt(String(userId))));

    if (userConnections.length === 0) {
      // If user has no connections, return empty array
      return NextResponse.json([], { status: 200 });
    }

    // Extract the provider names from connections
    const connectedProviders = userConnections.map((conn) => conn.provider);

    // Get only the social platforms that match the user's connected providers
    const connectedPlatforms = await db.select().from(socialPlatforms).where(
      // Use inArray instead of in for checking if a value is in an array
      inArray(socialPlatforms.name, connectedProviders)
    );

    return NextResponse.json(connectedPlatforms, { status: 200 });
  } catch (error) {
    console.error("Error fetching connected social platforms:", error);
    return NextResponse.json(
      { message: "Failed to fetch connected social media platforms" },
      { status: 500 }
    );
  }
}