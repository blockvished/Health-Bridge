// app/api/status/route.js
import { NextResponse } from "next/server";
import { serialize } from "cookie";
import { sign } from "jsonwebtoken";

// This would be your payment client implementation
// Assuming you have a client that can check the payment status
const client = {
  getOrderStatus: async (merchantOrderId) => {
    // This is where you would call your payment gateway's API
    // For demonstration, we'll simulate a successful response
    // In a real implementation, you would call PhonePe's API here
    
    try {
      // Here you would implement the actual API call to PhonePe
      // using the merchantOrderId
      
      // Simulating a response from the payment gateway
      return {
        success: true,
        state: "COMPLETED", // or "FAILED", "PENDING", etc.
        details: {
          transactionId: merchantOrderId,
          amount: 100, // Example amount
          // Other payment details
        }
      };
    } catch (error) {
      console.error("Error getting order status:", error);
      throw error;
    }
  }
};

export async function POST(req) {
  try {
    // Parse the request body
    const body = await req.json();
    const { merchantOrderId, userId } = body;
    
    // Also get the query parameters (in case they're provided there)
    const searchParams = req.nextUrl.searchParams;
    const queryMerchantOrderId = searchParams.get("merchantOrderId");
    const queryUserId = searchParams.get("userId");
    
    // Use values from body or fallback to query parameters
    const finalMerchantOrderId = merchantOrderId || queryMerchantOrderId;
    const finalUserId = userId || queryUserId;
    
    if (!finalMerchantOrderId) {
      return NextResponse.json(
        { success: false, error: "MerchantOrderId is required" },
        { status: 400 }
      );
    }
    
    if (!finalUserId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get the payment status from your payment client
    const response = await client.getOrderStatus(finalMerchantOrderId);
    
    // Check if the payment was successful
    if (response.success && response.state === "COMPLETED") {
      // Create JWT token
      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not set in environment variables.");
      }

      // Create the JWT token with user data and payment details
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

      // Return success response with payment details
      const apiResponse = NextResponse.json({
        success: true,
        details: {
          transactionId: finalMerchantOrderId,
          status: "COMPLETED",
          // Include other payment details you want to return
        }
      });

      // Set JWT token in cookie
      apiResponse.headers.set(
        "Set-Cookie",
        serialize("authToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 10 * 60, // 10 minutes in seconds
        })
      );

      return apiResponse;
    } else {
      // Payment failed or is in another state
      return NextResponse.json({
        success: false,
        error: "Payment verification failed",
        details: response.state || "Unknown status"
      });
    }
  } catch (error) {
    console.error("Error checking payment status:", error);
    
    // Return error response
    return NextResponse.json(
      { 
        success: false, 
        error: "Payment check failed", 
        details: error instanceof Error ? error.message : "An unknown error occurred" 
      },
      { status: 500 }
    );
  }
}