import crypto from "crypto";
import axios from "axios";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { serialize } from "cookie";
import { sign } from "jsonwebtoken";

let saltKey = "96434309-7796-489d-8924-ab56988a6076";
let merchantId = "PGTESTPAYUAT86";

export async function POST(req) {
  try {
    const userId = req.nextUrl.pathname.split("/").pop();
    const searchParams = req.nextUrl.searchParams;
    const merchantTransactionId = searchParams.get("id");

    const keyIndex = 1;

    const string =
      `/pg/v1/status/${merchantId}/${merchantTransactionId}` + saltKey;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + keyIndex;

    const options = {
      method: "GET",
      url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": merchantId,
      },
    };

    const response = await axios(options);

    let redirectUrl;

    if (response.data.success === true) {
      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not set in environment variables.");
      }

      const token = sign(
        {
          userId: userId,
          // Include any other data you need in the token payload
          paymentSuccess: true,
          transactionId: merchantTransactionId,
        },
        JWT_SECRET,
        { expiresIn: "10m" }
      );

      // Create redirect response and set cookie
      redirectUrl = `http://localhost:3000/success/${userId}`;

      const response = NextResponse.redirect(redirectUrl, {
        status: 301,
      });

      // Set JWT token in cookie
      response.headers.set(
        "Set-Cookie",
        serialize("authToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 10 * 60, // 10 minutes in seconds
        })
      );

      return response;

      // TODO:mark payment as successful in db
      // return NextResponse.redirect(`http://localhost:3000/success/${userId}`, {
      //   status: 301,
      // });
    } else {
      return NextResponse.redirect("http://localhost:3000/failed", {
        status: 301,
      });
    }
  } catch (error) {
    console.error(error);
    // Return error response
    return NextResponse.json(
      { error: "Payment check failed", details: error.message },
      { status: 500 }
    );
  }
}
