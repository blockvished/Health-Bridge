import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

// Constants
const SALT_KEY = "96434309-7796-489d-8924-ab56988a6076";
const MERCHANT_ID = "PGTESTPAYUAT86";

// Type guard to check if an error is an instance of Error
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export async function POST(req: NextRequest) {
  try {
    // Extract userId from URL path
    const userId = req.nextUrl.pathname.split("/").pop();
    console.log("Order ID:", userId); // Log the order ID for debugging
    
    // Check if request body exists
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 400 }
      );
    }
    
    // Parse request body with error handling
    let reqData;
    try {
      // Clone the request before reading the body
      const clonedReq = req.clone();
      const bodyText = await clonedReq.text();
      
      if (!bodyText || bodyText.trim() === "") {
        return NextResponse.json(
          { error: "Request body is empty" },
          { status: 400 }
        );
      }
      
      reqData = JSON.parse(bodyText);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      let details = "Unknown parsing error";
      if (isError(parseError)) {
        details = parseError.message;
      }
      return NextResponse.json(
        { error: "Invalid JSON in request body", details: details },
        { status: 400 }
      );

    }

    // Validate required fields
    if (!reqData.transactionId || !reqData.amount || !reqData.name || !reqData.mobile) {
      return NextResponse.json(
        { error: "Missing required fields. Required: transactionId, amount, name, mobile" },
        { status: 400 }
      );
    }

    // Extract transaction details
    const merchantTransactionId = reqData.transactionId;

    // Prepare the payload for PhonePe
    const data = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      name: reqData.name,
      mobileNumber: reqData.mobile,
      amount: reqData.amount * 100, // Convert to paise (smallest currency unit)
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/status/${userId}?id=${merchantTransactionId}`,
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/status/${userId}?id=${merchantTransactionId}`,
      redirectMode: "POST",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    // Encode payload as Base64
    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");

    // Generate checksum
    const keyIndex = 1;
    const string = payloadMain + "/pg/v1/pay" + SALT_KEY;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = `${sha256}###${keyIndex}`;

    // Define PhonePe API URL - using sandbox URL for preprod
    const API_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

    // API call options
    const headers = {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
    };
    const body = JSON.stringify({ request: payloadMain });

    console.log("Sending request to PhonePe:", {
      url: API_URL,
      headers: { ...headers, body: "..." }, // Don't log the full body for security
      merchantTransactionId,
      amount: reqData.amount,
    });

    // Make the API call using fetch
    const response = await fetch(API_URL, {
      method: "POST",
      headers: headers,
      body: body,
    });

    // Log response status
    console.log(`PhonePe API response status: ${response.status}`);

    if (!response.ok) {
      // Handle HTTP errors
      const errorText = await response.text();
      console.error(`PhonePe API error: ${response.status} - ${errorText}`);
      return NextResponse.json(
        { 
          error: "Payment initiation failed", 
          details: `HTTP error! status: ${response.status}`, 
          response: errorText 
        },
        { status: response.status }
      );
    }
    
    const responseData = await response.json();
    console.log("PhonePe API success response:", responseData);

    // Store transaction details in database (optional)
    // await storeTransactionDetails(userId, merchantTransactionId, reqData.amount);

    // Return the response from PhonePe
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error during payment initiation:", error);

    let details = "Unknown error during payment initiation";
    if (error instanceof Error) {
      details = error.message;
    }

    // Handle errors with appropriate status code
    return NextResponse.json(
      { error: "Payment initiation failed", details: details },
      { status: 500 }
    );
  }
}
