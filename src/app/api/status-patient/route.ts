import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { Env, StandardCheckoutClient } from "pg-sdk-node";
import {
  doctor,
  transactions,
  users,
  passwordResetTokens,
  appointments,
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
    const appointmentId = searchParams.get("appointmentId");

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

        // Set appointment as payment true - FIXED: Convert appointmentId to number
        if (appointmentId) {
          // Convert appointmentId from string to number
          const appointmentIdNum = parseInt(appointmentId, 10);
          
          // Validate that the conversion was successful
          if (isNaN(appointmentIdNum)) {
            console.log("Invalid appointmentId format:", appointmentId);
          } else {
            const appointmentData = await db
              .select()
              .from(appointments)
              .where(eq(appointments.id, appointmentIdNum)); // Now using number instead of string

            if (appointmentData.length > 0) {
              await db
                .update(appointments)
                .set({
                  paymentStatus: true,
                })
                .where(eq(appointments.id, appointmentIdNum)); // Using number here too
              console.log("Updated appointment payment status for ID:", appointmentIdNum);
            } else {
              console.log("Appointment not found with ID:", appointmentIdNum);
            }
          }
        } else {
          console.log("No appointmentId provided, skipping appointment update");
        }

      } catch (error) {
        console.error("Error saving transaction:", error);
        // Don't throw here, continue with the response
      }

      const apiResponse = NextResponse.json({
        success: true,
        details: responseDetails,
        userId: finalUserId,
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