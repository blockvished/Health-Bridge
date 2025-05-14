import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
    StandardCheckoutClient,
    Env,
    StandardCheckoutPayRequest,
} from "pg-sdk-node";

// Constants
// const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const MERCHANT_ID = randomUUID(); // Use a constant for testing

const clientIdFromEnv  = process.env.PHONEPE_CLIENTID;
const clientSecretFromEnv = process.env.PHONEPE_CLIENT_SECRET;
const client_version = 1;
const env = Env.SANDBOX; // Use Env enum
// const env = Env.PRODUCTION; // Use Env enum

// Type guard for Error
function isError(error: unknown): error is Error {
    return error instanceof Error;
}

export async function POST(req: NextRequest) {
    // Ensure clientId is defined
    if (!clientIdFromEnv) {
        console.error("PHONEPE_CLIENTID environment variable is not set.");
        return NextResponse.json(
            { error: "Configuration error: PHONEPE_CLIENTID is missing" },
            { status: 500 }
        );
    }
    
    // Ensure client_secret is defined
    if (!clientSecretFromEnv) {
      console.error("PHONEPE_CLIENT_SECRET environment variable is not set.");
      return NextResponse.json(
        { error: "Configuration error: PHONEPE_CLIENT_SECRET is missing" },
        { status: 500 }
      );
    }
    const clientId: string = clientIdFromEnv;
    const client_secret: string = clientSecretFromEnv;

    try {
        // Extract userId from URL path (if needed)
        const userId = req.nextUrl.pathname.split("/").pop();
        console.log("User ID:", userId);

        // Check for valid content type
        const contentType = req.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
            return NextResponse.json(
                { error: "Content-Type must be application/json" },
                { status: 400 }
            );
        }

        // Parse JSON body with error handling
        let reqData;
        try {
          const clonedReq = req.clone();
          const bodyText = await clonedReq.text();
          
          if (!bodyText || bodyText.trim() === "") {
            return NextResponse.json(
              { error: "Request body is empty" },
              { status: 400 }
            );
          }
          
          reqData = JSON.parse(bodyText);
        } catch (error) {
            let errorMessage = "Failed to parse JSON: Unknown error";
            if (isError(error)) {
                errorMessage = `Failed to parse JSON: ${error.message}`;
            }
            console.error(errorMessage);
            return NextResponse.json({ error: errorMessage }, { status: 400 });
        }

        // Validate required fields
        if (!reqData.amount) {
            return NextResponse.json(
                {
                    error: "Missing required fields: amount, name, mobile",
                },
                { status: 400 }
            );
        }

        // Initialize redirectUrl and callbackUrl.  Use environment variables.
        // const redirectUrl = `http://localhost:3000/api/status/${userId}` // Generate a unique merchantOrderId for each transaction.
        const redirectUrl = `http://localhost:3000/check-status/?merchantOrderId=${MERCHANT_ID}&userId=${userId}`; // Generate a unique merchantOrderId for each transaction.

        const request = StandardCheckoutPayRequest.builder()
            .merchantOrderId(MERCHANT_ID)
            .amount(reqData.amount * 100) // Convert amount to paise
            .redirectUrl(redirectUrl)
            .build();

        const client = StandardCheckoutClient.getInstance(
            clientId,
            client_secret,
            client_version,
            env
        );

        // Initiate payment
        try {
            const response = await client.pay(request);

            if (!response) {
                return NextResponse.json({error: "Payment initiation failed: Empty response from client.pay"}, {status: 500})
            }

            // Log the entire response for debugging
            console.log("PhonePe API Response:", response);

            if (!response.redirectUrl) {
                return NextResponse.json({ error: "Payment initiation failed: No redirect URL" }, { status: 500 });
            }
            // Return the redirect URL
            return NextResponse.json({ checkoutPageUrl: response.redirectUrl });

        } catch (error) {
            let errorMessage = "Payment initiation failed: Unknown error";
            if (isError(error)) {
                errorMessage = `Payment initiation failed: ${error.message}`;
            }
            console.error(errorMessage, error);
            return NextResponse.json({ error: errorMessage }, { status: 500 });
        }


    } catch (error) {
        // Handle any errors that occur outside of the API call
        let errorMessage = "Internal server error: Unknown error";
        if (isError(error)) {
            errorMessage = `Internal server error: ${error.message}`;
        }
        console.error(errorMessage, error);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}