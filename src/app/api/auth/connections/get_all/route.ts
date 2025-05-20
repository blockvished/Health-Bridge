import { NextResponse } from "next/server";
import { db } from "../../../../../db/db";
import { socialConnections } from "../../../../../db/schema";
import { verifyAuthToken } from "../../../../lib/verify";
import { eq } from "drizzle-orm";

export async function GET() {
  const decodedOrResponse = await verifyAuthToken();

  // Handle potential error response from token verification
  if (decodedOrResponse instanceof NextResponse) {
    return decodedOrResponse;
  }

  const { userId } = decodedOrResponse;
  const numericUserId = Number(userId);

  try {
    // Fetch all social connections for the user
    const connections = await db.select().from(socialConnections).where(eq(socialConnections.userId, numericUserId));

    // Transform the connections to include expired flag instead of expiresAt
    const now = new Date();
    const transformedConnections = connections.map(connection => {
      // Create a new object with all properties except expiresAt
      const { expiresAt, ...connectionWithoutExpiresAt } = connection;
      
      // Add expired boolean property based on comparison with current date and disconnected status
      return {
        ...connectionWithoutExpiresAt,
        expired: (expiresAt ? now > expiresAt : false) || connection.disconnected
      };
    });

    // Return the transformed connections as JSON
    return NextResponse.json({ connections: transformedConnections }, { status: 200 });
  } catch (error) {
    console.error("Error fetching social connections:", error);
    return NextResponse.json(
      { error: "Failed to fetch social connections" },
      { status: 500 }
    );
  }
}