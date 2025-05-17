import { NextResponse } from "next/server";
import { db } from "../../../../../db/db";
import { socialConnections } from "../../../../../db/schema";
import { verifyAuthToken } from "../../../../lib/verify";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  const decodedOrResponse = await verifyAuthToken();

  // Handle potential error response from token verification
  if (decodedOrResponse instanceof NextResponse) {
    return decodedOrResponse;
  }

  const { userId } = decodedOrResponse;
  const numericUserId = Number(userId);

  try {
    // Parse the request body
    const { provider, autoposting, connectionId } = await req.json();

    // Validate required fields
    if (provider === undefined || autoposting === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: provider and autoposting" },
        { status: 400 }
      );
    }

    let updateResult;

    // If connectionId is provided, use it for more precise targeting
    if (connectionId) {
      updateResult = await db
        .update(socialConnections)
        .set({ autoposting })
        .where(
          and(
            eq(socialConnections.id, connectionId),
            eq(socialConnections.userId, numericUserId)
          )
        )
        .returning({ updatedId: socialConnections.id });
    } else {
      // Otherwise update by userId and provider
      updateResult = await db
        .update(socialConnections)
        .set({ autoposting })
        .where(
          and(
            eq(socialConnections.provider, provider),
            eq(socialConnections.userId, numericUserId)
          )
        )
        .returning({ updatedId: socialConnections.id });
    }

    // Check if any row was updated
    if (updateResult.length === 0) {
      return NextResponse.json(
        { error: "No connection found to update" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: "Autoposting settings updated successfully",
        autoposting, 
        updatedConnectionId: updateResult[0].updatedId 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating autoposting settings:", error);
    return NextResponse.json(
      { error: "Failed to update autoposting settings" },
      { status: 500 }
    );
  }
}