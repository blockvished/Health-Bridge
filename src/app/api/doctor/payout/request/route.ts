import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../db/db";
import { doctor, payoutRequests, users } from "../../../../../db/schema";
import { eq } from "drizzle-orm";
import { verifyAuthToken } from "../../../../../app/lib/verify";
import { InferInsertModel } from "drizzle-orm";
import { desc } from "drizzle-orm";

export async function GET() {
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
    const fetchDoctorId = String(userId);

    if (userRole === "admin") {
      const requests = await db
        .select({
          id: payoutRequests.id,
          doctorId: payoutRequests.doctorId,
          amount: payoutRequests.amount,
          balanceAtRequest: payoutRequests.balanceAtRequest,
          amountPaid: payoutRequests.amountPaid,
          commissionDeduct: payoutRequests.commissionDeduct,
          requestedMethod: payoutRequests.requestedMethod,
          status: payoutRequests.status,
          createdAt: payoutRequests.createdAt,
          doctorName: doctor.name, // Added doctor name
        })
        .from(payoutRequests)
        .leftJoin(doctor, eq(payoutRequests.doctorId, doctor.id))
        .orderBy(desc(payoutRequests.createdAt));

      return NextResponse.json({ payoutRequests: requests });
    }
    const doctorData = await db
      .select()
      .from(doctor)
      .where(eq(doctor.userId, Number(fetchDoctorId)))
      .then((res) => res[0]);

    if (!doctorData) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    const requests = await db
      .select()
      .from(payoutRequests)
      .where(eq(payoutRequests.doctorId, doctorData.id))
      .orderBy(desc(payoutRequests.createdAt));

    return NextResponse.json({ payoutRequests: requests });
  } catch (error) {
    console.error("Get Payout Requests Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const decodedOrResponse = await verifyAuthToken();
    if (decodedOrResponse instanceof NextResponse) {
      return decodedOrResponse;
    }

    const decoded = decodedOrResponse;
    const userId = Number(decoded.userId);

    const doctorData = await db
      .select()
      .from(doctor)
      .where(eq(doctor.userId, userId))
      .then((res) => res[0]);

    if (!doctorData) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    const body = await req.json();
    const { amount, selectedMethod } = body;

    const parsedAmount = parseFloat(amount);

    if (!parsedAmount || parsedAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }
    console.log ("parsed amosdfasofgj", selectedMethod)
    
    if (!["UPI", "NEFT", "IMPS"].includes(selectedMethod)) {
      return NextResponse.json({ error: "Invalid method" }, { status: 400 });
    }

    console.log("reached heredlogjaiodpfgioas dfisaopfdgiopdsaf")
    if (parseFloat(doctorData.balance) < parsedAmount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    const newRequest: InferInsertModel<typeof payoutRequests> = {
      doctorId: doctorData.id,
      amount: parsedAmount.toFixed(2),
      balanceAtRequest: parseFloat(doctorData.balance).toFixed(2),
      requestedMethod: selectedMethod,
      status: "pending",
    };

    await db.insert(payoutRequests).values(newRequest);

    await db
      .update(doctor)
      .set({
        balance: (parseFloat(doctorData.balance) - parsedAmount).toFixed(2),
      })
      .where(eq(doctor.id, doctorData.id));

    return NextResponse.json({ message: "Payout request submitted" });
  } catch (error) {
    console.error("Payout Request Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
