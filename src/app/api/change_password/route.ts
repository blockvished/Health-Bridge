import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { users } from "../../../db/schema";
import db from "../../../db/db";
import { verifyAuthToken } from "../../lib/verify";
import { verify, hash } from "argon2";

// =======================
// PUT - Update - Password
// =======================
export async function PUT(req: NextRequest) {
  try {
    // Verify JWT token
    const decodedOrResponse = await verifyAuthToken();

    if (decodedOrResponse instanceof NextResponse) {
      return decodedOrResponse;
    }

    const decoded = decodedOrResponse;
    const userId = Number(decoded.userId);

    // Parse request body
    const reqBody = await req.json();
    const { oldPassword, newPassword } = reqBody;

    if (!newPassword) {
      return NextResponse.json(
        { error: "New password is required." },
        { status: 400 }
      );
    }

    // Get the user
    const existingUserResult = await db
      .select({
        id: users.id,
        password_hash: users.password_hash,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!existingUserResult || existingUserResult.length === 0) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const existingUser = existingUserResult[0];
    const SERVER_PEPPER = process.env.SERVER_PEPPER;

    // Handle the case where the user's password_hash is null (e.g., initial setup)
    if (existingUser.password_hash === null) {
      // Hash the new password
      const saltedNewPassword = SERVER_PEPPER + newPassword + SERVER_PEPPER;
      const hashedPassword = await hash(saltedNewPassword);

      // Update the user's password in the database
      await db
        .update(users)
        .set({ password_hash: hashedPassword })
        .where(eq(users.id, userId));

      return NextResponse.json(
        { message: "Password set successfully." },
        { status: 200 }
      );
    } else {
      // If password_hash exists, verify the old password
      if (!oldPassword) {
        return NextResponse.json(
          { error: "Old password is required to change the existing password." },
          { status: 400 }
        );
      }

      if (oldPassword === newPassword) {
        return NextResponse.json(
          { error: "New password cannot be the same as the old password." },
          { status: 400 }
        );
      }

      const saltedOldPassword = SERVER_PEPPER + oldPassword + SERVER_PEPPER;

      // Verify old password
      const isOldPasswordCorrect = await verify(
        existingUser.password_hash,
        saltedOldPassword
      );

      if (!isOldPasswordCorrect) {
        return NextResponse.json(
          { error: "Incorrect old password." },
          { status: 401 }
        );
      }

      // Hash the new password
      const saltedNewPassword = SERVER_PEPPER + newPassword + SERVER_PEPPER;
      const hashedPassword = await hash(saltedNewPassword);

      // Update the user's password in the database
      await db
        .update(users)
        .set({ password_hash: hashedPassword })
        .where(eq(users.id, userId));

      return NextResponse.json(
        { message: "Password changed successfully." },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error changing/setting password:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}