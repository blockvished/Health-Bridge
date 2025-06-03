// src/api/admin/users/bank_data/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../db/db"; // Adjust path as per your setup
import { doctorBankDetail } from "../../../../../db/schema"; // Adjust path as per your setup
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const type = searchParams.get("type");
  const doctorIdParam = searchParams.get("doctorId");

  // Validate presence of 'type' parameter
  if (!type) {
    return NextResponse.json(
      { error: "Missing 'type' query parameter (UPI, NEFT, or IMPS)." },
      { status: 400 }
    );
  }

  // Validate presence and format of 'doctorId' parameter
  if (!doctorIdParam) {
    return NextResponse.json(
      { error: "Missing 'doctorId' query parameter." },
      { status: 400 }
    );
  }

  const doctorId = parseInt(doctorIdParam, 10);
  if (isNaN(doctorId)) {
    return NextResponse.json(
      { error: "Invalid 'doctorId' format. Must be an integer." },
      { status: 400 }
    );
  }

  try {
    // Fetch the doctor's bank details from the database
    const result = await db
      .select()
      .from(doctorBankDetail)
      .where(eq(doctorBankDetail.doctorId, doctorId))
      .limit(1); // Assuming doctorId has a unique bank detail entry

    const bankData = result[0];

    if (!bankData) {
      return NextResponse.json(
        { message: "Doctor bank details not found." },
        { status: 404 }
      );
    }

    // Conditionally return data based on the 'type'
    if (type.toUpperCase() === "UPI") {
      if (!bankData.upiId) {
        return NextResponse.json(
          { message: "UPI ID not available for this doctor." },
          { status: 404 }
        );
      }
      return NextResponse.json({
        upiId: bankData.upiId,
      });
    } else if (type.toUpperCase() === "NEFT" || type.toUpperCase() === "IMPS") {
      return NextResponse.json({
        accountHolderName: bankData.accountHolderName,
        bankName: bankData.bankName,
        accountNumber: bankData.accountNumber,
        ifscCode: bankData.ifscCode,
      });
    } else {
      return NextResponse.json(
        { error: "Invalid 'type' specified. Must be UPI, NEFT, or IMPS." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error fetching bank data:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}