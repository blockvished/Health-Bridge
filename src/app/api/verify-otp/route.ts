
// /app/api/verify-otp/route.ts
import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(request: Request) {
  try {
    const { verificationId, otp } = await request.json();

    if (!verificationId || !otp) {
      return NextResponse.json(
        { success: false, message: 'Verification ID and OTP are required' },
        { status: 400 }
      );
    }

    // Initialize Twilio client
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const verifySid = process.env.TWILIO_VERIFY_SID;

    if (!accountSid || !authToken || !verifySid) {
      console.error('Missing Twilio environment variables');
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }

    const client = twilio(accountSid, authToken);

    // Verify the OTP
    const verification_check = await client.verify.v2.services(verifySid)
      .verificationChecks.create({
        verificationSid: verificationId,
        code: otp
      });

    if (verification_check.status === 'approved') {
      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully'
      }, { status: 200 });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Invalid OTP'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
