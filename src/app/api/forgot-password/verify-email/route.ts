// app/api/verify-otp-email/route.ts
import { NextResponse } from "next/server";
import { db } from "../../../../db/db";
import { emailOtps, passwordResetTokens } from "../../../../db/schema";
import { and, eq, gt } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const { email, otp, userId } = await req.json();

  if (!email || !otp) {
    return NextResponse.json(
      { success: false, message: "Email and OTP are required" },
      { status: 400 }
    );
  }

  const now = new Date();

  try {
    const result = await db
      .select()
      .from(emailOtps)
      .where(
        and(
          eq(emailOtps.email, email),
          eq(emailOtps.otp, otp.toString()),
          gt(emailOtps.expiresAt, now)
        )
      );

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 401 }
      );
    }

    // Optional: Delete OTP after verification
    await db.delete(emailOtps).where(eq(emailOtps.email, email));

    const resetToken = uuidv4();

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

     await db.insert(passwordResetTokens).values({
          token: resetToken, // You must provide this
          userId: userId,
          expiresAt: expiresAt,
        });

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
      resetToken: resetToken
    });
  } catch (error) {
    console.error("OTP verification failed:", error);
    return NextResponse.json(
      { success: false, message: "Server error during OTP verification" },
      { status: 500 }
    );
  }
}
