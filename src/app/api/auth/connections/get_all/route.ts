import { NextResponse } from "next/server";
import { db } from "../../../../../db/db";
import { socialConnections } from "../../../../../db/schema";
import { verifyAuthToken } from "../../../../lib/verify";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
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

    // Return the connections as JSON
    return NextResponse.json({ connections }, { status: 200 });
  } catch (error) {
    console.error("Error fetching social connections:", error);
    return NextResponse.json(
      { error: "Failed to fetch social connections" },
      { status: 500 }
    );
  }
}


// export const socialConnections = pgTable("social_connections", {
//   id: serial("id").primaryKey(),
//   userId: integer("user_id")
//     .notNull()
//     .references(() => users.id, { onDelete: "cascade" }),
//   provider: text("provider").notNull().unique(), // e.g., "twitter"
//   accountName: text("account_name"),
//   accessToken: text("access_token").notNull(),
//   refreshToken: text("refresh_token"),
//   expiresAt: timestamp("expires_at", { mode: "date" }),
//   autoposting: boolean("autoposting").default(false),
//   createdAt: timestamp("created_at").defaultNow(),
// });