import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { sign } from "jsonwebtoken";
import { Env, StandardCheckoutClient } from "pg-sdk-node";
import {
  doctor,
  transactions,
  users,
  passwordResetTokens,
} from "../../../db/schema";
import db from "../../../db/db";
import { eq } from "drizzle-orm";

/**
 * PhonePe API configuration
 * These environment variables must be set in your .env or deployment config
 */
const clientIdFromEnv = process.env.PHONEPE_CLIENTID;
const clientSecretFromEnv = process.env.PHONEPE_CLIENT_SECRET;
const client_version = 1;
// const env =  process.env.NODE_ENV === "production" ? Env.PRODUCTION : Env.SANDBOX;
const env = Env.SANDBOX;

/**
 * API handler for checking PhonePe payment status
 * Endpoint: POST /api/status
 * @param req - Incoming request with merchantOrderId and userId
 */
export async function POST(req: Request) {
  // Check for required environment variables - CLIENT ID
  if (!clientIdFromEnv) {
    console.log("ERROR: PHONEPE_CLIENTID missing");
    return NextResponse.json(
      {
        success: false,
        error: "Configuration error: PHONEPE_CLIENTID is missing",
      },
      { status: 500 }
    );
  }

  // Check for required environment variables - CLIENT SECRET
  if (!clientSecretFromEnv) {
    console.log("ERROR: PHONEPE_CLIENT_SECRET missing");
    return NextResponse.json(
      {
        success: false,
        error: "Configuration error: PHONEPE_CLIENT_SECRET is missing",
      },
      { status: 500 }
    );
  }

  try {
    // Parse the request body
    const body = await req.json().catch((e) => {
      console.log("BODY PARSE ERROR:", e.message);
      return {};
    });

    const { merchantOrderId, userId } = body;
    // Also get the query parameters (in case they're provided there)
    const searchParams = new URL(req.url).searchParams;
    const queryMerchantOrderId = searchParams.get("merchantOrderId");
    const queryUserId = searchParams.get("userId");

    // Use values from body or fallback to query parameters
    const finalMerchantOrderId = merchantOrderId || queryMerchantOrderId;
    const finalUserId = userId || queryUserId;

    // Validate required parameters - ORDER ID
    if (!finalMerchantOrderId) {
      console.log("VALIDATION FAILURE: No merchantOrderId provided");
      return NextResponse.json(
        { success: false, error: "MerchantOrderId is required" },
        { status: 400 }
      );
    }

    // Validate required parameters - USER ID
    if (!finalUserId) {
      console.log("VALIDATION FAILURE: No userId provided");
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    console.log("STEP 2: Initializing PhonePe client");
    // Initialize the PhonePe client
    const client = StandardCheckoutClient.getInstance(
      clientIdFromEnv,
      clientSecretFromEnv,
      client_version,
      env
    );

    console.log("STEP 3: Fetching order status");
    // Get order status from PhonePe - await the promise
    const response = await client.getOrderStatus(finalMerchantOrderId);
    console.log("PHONEPE RESPONSE:", JSON.stringify(response, null, 2));

    if (response?.paymentDetails && response.paymentDetails.length > 0) {
      if (response.paymentDetails[0].state === "FAILED") {
        console.log("Error Code:", response.paymentDetails[0].errorCode);
        console.log(
          "Detailed Error Code:",
          response.paymentDetails[0].detailedErrorCode
        );
      }
    } else {
      console.log("No payment details available in response");
    }

    // Check if the payment was successful
    if (response && response.state === "COMPLETED") {
      // Create JWT token
      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not set in environment variables.");
      }

      // Create the JWT token with user data and payment details
      console.log("Creating JWT token for user:", finalUserId);
      const token = sign(
        {
          userId: finalUserId,
          paymentSuccess: true,
          transactionId: finalMerchantOrderId,
          // Add any other data you need
        },
        JWT_SECRET,
        { expiresIn: "10m" }
      );

      // Prepare response data
      const responseDetails = {
        transactionId: finalMerchantOrderId,
        orderId: response.orderId,
        status: response.state,
        amount: response.amount ? response.amount / 100 : 0, // Convert paisa to rupees
        paymentMode: response.paymentDetails?.[0]?.paymentMode || "N/A",
        timestamp: response.paymentDetails?.[0]?.timestamp || null,
      };
      console.log(
        "RESPONSE DETAILS:",
        JSON.stringify(responseDetails, null, 2)
      );
      let resetTokenF = "";
      let expiresAtF = new Date();
      try {
        // Convert the numeric timestamp to a Date object for the timestamp_date column
        const timestampAsDate = responseDetails.timestamp
          ? new Date(Number(responseDetails.timestamp))
          : null;

        await db.insert(transactions).values({
          userId: finalUserId,
          transactionId: responseDetails.transactionId,
          orderId: responseDetails.orderId,
          status: responseDetails.status,
          amount: responseDetails.amount,
          paymentMode: responseDetails.paymentMode || "N/A", // Provide default value
          timestamp: responseDetails.timestamp || Date.now(), // Fallback to current time if missing
          timestamp_date: timestampAsDate,
        });

        await db
          .update(users)
          .set({
            email_verified: true,
            phone_verified: true,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId));

        const doctorData = await db
          .select({
            planId: doctor.planId,
            planType: doctor.planType,
          })
          .from(doctor)
          .where(eq(doctor.userId, userId))
          .limit(1);

        if (doctorData.length > 0) {
          const { planId, planType } = doctorData[0];
          console.log(
            `Doctor Plan Information - Plan ID: ${planId}, Plan Type: ${planType}`
          );

          const expireAt = new Date(timestampAsDate || new Date());

          if (planType && planType.toLowerCase() === "monthly") {
            expireAt.setDate(expireAt.getDate() + 30);
          } else if (planType && planType.toLowerCase() === "yearly") {
            expireAt.setDate(expireAt.getDate() + 365);
          }

          await db
            .update(doctor)
            .set({
              paymentStatus: true,
              paymentAt: timestampAsDate,
              expireAt: expireAt,
              accountStatus: true,
              accountVerified: true,
            })
            .where(eq(doctor.userId, userId));
        }
        console.log(`Transaction saved successfully for user ${finalUserId}!`);

        // also save a variable with time + 5 minutes for create password that takes uuid, user id, used false
        const resetToken = uuidv4();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);

        resetTokenF = resetToken
        expiresAtF = expiresAt

        await db.insert(passwordResetTokens).values({
          token: resetToken, // You must provide this
          userId: finalUserId,
          expiresAt: expiresAt,
        });
      } catch (error) {
        console.error("Error saving transaction:", error);
      }

      const apiResponse = NextResponse.json({
        success: true,
        details: responseDetails,
        resetToken: resetTokenF,
        userId: finalUserId,
        expiresAt: expiresAtF,
      });

      return apiResponse;
    } else {
      // Payment failed or is in another state

      const failureDetails = {
        status: response?.state || "Unknown",
        errorCode: response?.paymentDetails?.[0]?.errorCode,
        detailedErrorCode: response?.paymentDetails?.[0]?.detailedErrorCode,
      };

      return NextResponse.json({
        success: false,
        error: "Payment verification failed",
        details: failureDetails,
      });
    }
  } catch (error: unknown) {
    console.log(
      "Error Type:",
      error instanceof Error ? "Error object" : typeof error
    );
    console.log(
      "Error Message:",
      error instanceof Error ? error.message : "Unknown error"
    );
    if (error instanceof Error && error.stack) {
      console.log("Stack Trace:", error.stack);
    }

    let errorMessage = "Payment check failed";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    // Return error response
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
