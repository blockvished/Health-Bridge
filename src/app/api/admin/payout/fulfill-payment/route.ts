// app/api/admin/payout/fulfill-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../db/db";
import {
  doctor,
  payoutRequests,
  payoutSettings,
  users,
} from "../../../../../db/schema";
import { eq } from "drizzle-orm";
import { verifyAuthToken } from "../../../../../app/lib/verify";

export async function POST(request: NextRequest) {
  try {
    const decodedOrResponse = await verifyAuthToken();
    if (decodedOrResponse instanceof NextResponse) {
      return decodedOrResponse;
    }

    const decoded = decodedOrResponse;
    const userId = Number(decoded.userId);

    const user = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (!user.length) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const userRole = user[0].role;

    if (userRole === "admin") {
      const { id, amount, selectedMethod } = await request.json();

      // Console log the received data
      console.log("=== Payout Process Request ===");
      console.log("Request ID:", id);
      console.log("Payment Method:", selectedMethod);
      console.log("Amount:", amount);
      console.log("================================");

      const settings = await db
        .select()
        .from(payoutSettings)
        .where(eq(payoutSettings.singletonId, "singleton"))
        .limit(1);

      const commission_rate_percent = Number(settings[0].commissionRate);
      const commission_amount = (amount * commission_rate_percent) / 100;
      const payout_amount = amount - commission_amount;

      console.log("commission_amount", commission_amount);
      console.log("payout_amout", payout_amount);

      const updatedPayoutRequest = await db
        .update(payoutRequests)
        .set({
          status: "completed",
          amountPaid: payout_amount.toString(),
          commissionDeduct: commission_amount.toString(),
          paymentMethod: selectedMethod,
        })
        .where(eq(payoutRequests.id, id))
        .returning();

      // TODO: should also update the total withdraw to existing + amount

      if (!updatedPayoutRequest.length) {
        return NextResponse.json(
          { error: "Payout request not found or failed to update." },
          { status: 404 }
        );
      }

      console.log(
        "Payout request updated successfully:",
        updatedPayoutRequest[0]
      );

      return NextResponse.json(
        {
          message: "Payout request processed successfully",
          payoutRequest: updatedPayoutRequest[0],
          details: {
            originalAmount: amount,
            commissionDeducted: commission_amount,
            finalPayoutAmount: payout_amount,
            paymentMethod: selectedMethod,
          },
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("Error processing payout request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Here you would typically:
// 1. Validate the request data
// 2. Check user authentication/authorization
// 3. Update database records
// 4. Initiate actual payment processing
// 5. Send notifications
