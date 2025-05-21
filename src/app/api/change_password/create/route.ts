import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { passwordResetTokens, users } from "../../../../db/schema";
import db from "../../../../db/db";

import { hash } from "argon2";
import { randomBytes } from "crypto";

// =======================
// PUT - Create - Password
// =======================
export async function PUT(req: NextRequest) {
  try {
    // Parse request body
    const reqBody = await req.json();
    const { newPassword, resetToken, userId } = reqBody;

    if (!newPassword) {
      return NextResponse.json(
        { error: "New password is required." },
        { status: 400 }
      );
    }

    const existingUserResult = await db
      .select({
        id: users.id,
        password_hash: users.password_hash,
        salt: users.salt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!existingUserResult || existingUserResult.length === 0) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const existingUser = existingUserResult[0];

    console.log(existingUser);

    const salt = randomBytes(16).toString("hex");
    const saltedNewPassword = salt + newPassword;
    const hashedPassword = await hash(saltedNewPassword);

    console.log(hashedPassword);

    await db
      .update(users)
      .set({ password_hash: hashedPassword, salt: salt })
      .where(eq(users.id, userId));

    await db
      .update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.token, resetToken));

    let redirectUrl = `http://localhost:3000/`;
    if (process.env.NODE_ENV === "production") {
      redirectUrl = `https://app.livedoctors24.com/`;
    }

    const res = NextResponse.redirect(redirectUrl, {
      status: 301, // Use 302 for temporary redirect
    });

    return res;
  } catch (error) {
    console.error("Error changing/setting password:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
