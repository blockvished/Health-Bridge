import crypto from "crypto";
import { NextResponse } from "next/server";

// Constants
let salt_key = "96434309-7796-489d-8924-ab56988a6076";
let merchant_id = "PGTESTPAYUAT86";

export async function POST(req) {
  try {
    const userId = req.nextUrl.pathname.split("/").pop()
    console.log("Order ID:", userId); // Log the order ID for debugging
    let reqData = await req.json(); // Parse the request data

    // Extract transaction details
    let merchantTransactionId = reqData.transactionId;

    // Prepare the payload
    const data = {
      merchantId: merchant_id,
      merchantTransactionId: merchantTransactionId,
      name: reqData.name,
      mobileNumber: reqData.mobile,
      amount: reqData.amount * 100, // Convert to paise (smallest currency unit)
      redirectUrl: `http://localhost:3000/api/status/${userId}?id=${merchantTransactionId}`,
      callbackUrl: `http://localhost:3000/api/status/${userId}?id=${merchantTransactionId}`,
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
    const string = payloadMain + "/pg/v1/pay" + salt_key;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = `${sha256}###${keyIndex}`;

    // Define PhonePe API URL
    const prod_URL =
      "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

    // API call options
    const headers = {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
    };
    const body = JSON.stringify({ request: payloadMain });

    // Make the API call using fetch
    const response = await fetch(prod_URL, {
      method: "POST",
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      // Handle HTTP errors. This is crucial for proper error handling.
      const errorText = await response.text(); // Get the error message
      console.error(`PhonePe API error: ${response.status} - ${errorText}`);
      return NextResponse.json(
        { error: "Payment initiation failed", details: `HTTP error! status: ${response.status}, body: ${errorText}` },
        { status: 500 }
      );
    }
    const responseData = await response.json();

    // Return the response from PhonePe
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error during payment initiation:", error);
    // Handle errors
    return NextResponse.json(
      { error: "Payment initiation failed", details: error.message },
      { status: 500 }
    );
  }
}
