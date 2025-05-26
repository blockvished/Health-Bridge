// app/api/send-otp-email/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "../../../db/db";
import { emailOtps } from "../../../db/schema"; // Import users table

export async function POST(req: Request) {
  const { email } = await req.json();

  console.log("Received email:", email);

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { success: false, message: "Invalid email address" },
      { status: 400 }
    );
  }
  console.log("Sending OTP to email:", email);
  const resend = new Resend(process.env.RESEND_API_KEY!);

  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  try {
    const emailResponse = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Email Verification Code",
      html: `<p>This is your OTP for email verification: <strong>${otp}</strong></p>`,
    });

    // Optional: check if email was accepted (basic check)
    if (emailResponse.error) {
      console.error("Email failed:", emailResponse.error);
      return NextResponse.json(
        { success: false, message: "Failed to send OTP email" },
        { status: 500 }
      );
    }

    // Store OTP in DB
    await db
      .insert(emailOtps)
      .values({
        email,
        otp: otp.toString(),
        expiresAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: emailOtps.email,
        set: {
          otp: otp.toString(),
          expiresAt,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({
      success: true,
      message: "OTP sent and stored successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error while sending OTP" },
      { status: 500 }
    );
  }
}
