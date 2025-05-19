import { NextResponse } from "next/server";
import { db } from "../../../../../db/db"
import { socialConnections } from "../../../../../db/schema";
import { verifyAuthToken } from "../../../../lib/verify";

export async function POST(req: Request) {
  const decodedOrResponse = await verifyAuthToken();

  // Handle potential error response from token verification
  if (decodedOrResponse instanceof NextResponse) {
    return decodedOrResponse;
  }

  const { userId } = decodedOrResponse;
  const numericUserId = Number(userId);
  try {
    const sessionData = await req.json();

    console.log("Received session data:", sessionData);

    const {
      accessToken,
      refreshToken,
      expires,
      expiresAt,
      provider,
      user: { name },
    } = sessionData;

    const expiresAtDate = expiresAt ? new Date(expiresAt * 1000) : null;

    // Database interaction: create or update social connection
    try {
      await db
        .insert(socialConnections)
        .values({
          userId: numericUserId, // Use the userId from the decoded token
          provider: provider,
          accountName: name || "Connected Account", // Use session name
          accessToken: accessToken,
          refreshToken: refreshToken || "",
          disconnected: false,
          expiresAt: expiresAtDate,
        })
        .onConflictDoUpdate({
          target: [socialConnections.userId, socialConnections.provider],
          set: {
            accountName: name || "Connected Account",
            accessToken: accessToken,
            refreshToken: refreshToken || "", 
            disconnected: false,
            expiresAt: expiresAtDate,
          },
        });
    } catch (error) {
      console.error("Error upserting social connection", error);
      return NextResponse.json(
        { error: "Failed to save/update connection data" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Connection data saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving connection data:", error);
    return NextResponse.json(
      { error: "Failed to save connection data" },
      { status: 500 }
    );
  }
}
