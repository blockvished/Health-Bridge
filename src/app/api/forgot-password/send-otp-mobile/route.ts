// /app/api/send-otp/route.ts
import { NextResponse } from "next/server";
import twilio from "twilio";
import db from "../../../../db/db";
import { users } from "../../../../db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { mobile } = await request.json();

    if (!mobile || mobile.length < 10) {
      return NextResponse.json(
        { success: false, message: "Invalid mobile number" },
        { status: 400 }
      );
    }

    const existingUserResult = await db
      .select()
      .from(users)
      .where(eq(users.phone, mobile))
      .limit(1);

    const existingUser = existingUserResult[0];

    // If user doesn't exist, return error message
    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Account does not exist",
          userExists: false,
        },
        { status: 404 }
      );
    }

    const formattedMobile = mobile.startsWith("+") ? mobile : `+91${mobile}`;

    // Initialize Twilio client
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const verifySid = process.env.TWILIO_VERIFY_SID;
    const client = twilio(accountSid, authToken);

    if (!accountSid || !authToken || !verifySid) {
      console.error("Missing Twilio environment variables");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Send verification code only if user exists
    const verification = await client.verify.v2
      .services(verifySid)
      .verifications.create({
        channel: "sms",
        to: formattedMobile,
      });

    console.log(verification.sid);

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent successfully",
        verificationId: verification.sid,
        existingUserId: existingUser.id,
        userExists: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send OTP" },
      { status: 500 }
    );
  }
}