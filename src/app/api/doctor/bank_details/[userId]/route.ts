import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { doctor, doctorBankDetail } from "../../../../../db/schema";
import db from "../../../../../db/db";
import { verifyAuthToken } from "../../../../lib/verify";

// =======================
// Get - Bank details of Doctor
// =======================
export async function GET(req: NextRequest) {
  // Get ID from URL
  const userIdFromUrl = req.nextUrl.pathname.split("/").pop() || "unknown";

  // Verify JWT token using the modularized function
  const decodedOrResponse = await verifyAuthToken();

  // Handle potential error response from token verification
  if (decodedOrResponse instanceof NextResponse) {
    return decodedOrResponse;
  }

  const { userId } = decodedOrResponse;
  const numericUserId = Number(userId);

  // Check if the requested ID matches the authenticated user's ID
  if (String(numericUserId) !== userIdFromUrl) {
    return NextResponse.json(
      { error: "Forbidden: You don't have access to this profile" },
      { status: 403 }
    );
  }

  // Query for doctor information
  const doctorData = await db
    .select({ id: doctor.id })
    .from(doctor)
    .where(eq(doctor.userId, numericUserId));

  if (!doctorData.length) {
    return NextResponse.json(
      { error: "Doctor profile not found for this user." },
      { status: 404 }
    );
  }

  const requiredDoctorId = doctorData[0].id;

  try {
    const bankDetailsResult = await db // Use the imported 'db' instance directly
      .select({
        fullName: doctorBankDetail.fullName,
        state: doctorBankDetail.state,
        city: doctorBankDetail.city,
        pincode: doctorBankDetail.pincode,
        accountHolderName: doctorBankDetail.accountHolderName,
        bankName: doctorBankDetail.bankName,
        accountNumber: doctorBankDetail.accountNumber,
        ifscCode: doctorBankDetail.ifscCode,
        upiId: doctorBankDetail.upiId,
      })
      .from(doctorBankDetail)
      .where(eq(doctorBankDetail.doctorId, requiredDoctorId));

    // console.log(bankDetailsResult[0]);

    if (bankDetailsResult.length > 0) {
      return NextResponse.json(bankDetailsResult[0]);
    } else {
      return NextResponse.json({
        fullName: "",
        state: "",
        city: "",
        pincode: "",
        accountHolderName: "",
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        upiId: "",
      }); // Return empty attributes if no details found
    }
  } catch (error) {
    console.error("Error fetching bank details of doctor:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST - create/update bank details for a doctor, allowing missing fields
// =======================
export async function POST(req: NextRequest) {
  // Get ID from URL
  const userIdFromUrl = req.nextUrl.pathname.split("/").pop() || "unknown";

  // Verify JWT token
  const decodedOrResponse = await verifyAuthToken();
  if (decodedOrResponse instanceof NextResponse) return decodedOrResponse;
  const { userId } = decodedOrResponse;
  const numericUserId = Number(userId);

  // Check if the requested ID matches the authenticated user's ID
  if (String(numericUserId) !== userIdFromUrl) {
    return NextResponse.json(
      { error: "Forbidden: You don't have access to this profile" },
      { status: 403 }
    );
  }

  // Find the doctor's record
  const doctorData = await db
    .select({ id: doctor.id })
    .from(doctor)
    .where(eq(doctor.userId, numericUserId));

  if (!doctorData.length) {
    return NextResponse.json(
      { error: "Doctor profile not found for this user." },
      { status: 404 }
    );
  }

  const requiredDoctorId = doctorData[0].id;

  try {
    const reqBody = await req.json();

    // Check if bank details already exist for this doctor
    const existingBankDetailsResult = await db
      .select()
      .from(doctorBankDetail)
      .where(eq(doctorBankDetail.doctorId, requiredDoctorId));

    const existingBankDetails = existingBankDetailsResult[0];

    if (existingBankDetails) {
      // Update existing bank details, only setting provided values
      const updateSet: Partial<typeof doctorBankDetail.$inferInsert> = {};
      if (reqBody.fullName !== undefined) updateSet.fullName = reqBody.fullName;
      if (reqBody.state !== undefined) updateSet.state = reqBody.state;
      if (reqBody.city !== undefined) updateSet.city = reqBody.city;
      if (reqBody.pincode !== undefined) updateSet.pincode = reqBody.pincode;
      if (reqBody.accountHolderName !== undefined)
        updateSet.accountHolderName = reqBody.accountHolderName;
      if (reqBody.bankName !== undefined) updateSet.bankName = reqBody.bankName;
      if (reqBody.accountNumber !== undefined)
        updateSet.accountNumber = reqBody.accountNumber;
      if (reqBody.ifscCode !== undefined) updateSet.ifscCode = reqBody.ifscCode;
      if (reqBody.upiId !== undefined) updateSet.upiId = reqBody.upiId;

      if (Object.keys(updateSet).length > 0) {
        await db
          .update(doctorBankDetail)
          .set(updateSet)
          .where(eq(doctorBankDetail.doctorId, requiredDoctorId));
        return NextResponse.json(
          { message: "Bank details updated successfully" },
          { status: 200 }
        );
      } else {
        return NextResponse.json({ message: "No updates provided" }, { status: 200 });
      }
    } else {
      // Create new bank details, only including provided values
      const insertValues: Partial<typeof doctorBankDetail.$inferInsert> = {
        doctorId: requiredDoctorId,
      };
      if (reqBody.fullName !== undefined) insertValues.fullName = reqBody.fullName;
      if (reqBody.state !== undefined) insertValues.state = reqBody.state;
      if (reqBody.city !== undefined) insertValues.city = reqBody.city;
      if (reqBody.pincode !== undefined) insertValues.pincode = reqBody.pincode;
      if (reqBody.accountHolderName !== undefined)
        insertValues.accountHolderName = reqBody.accountHolderName;
      if (reqBody.bankName !== undefined) insertValues.bankName = reqBody.bankName;
      if (reqBody.accountNumber !== undefined)
        insertValues.accountNumber = reqBody.accountNumber;
      if (reqBody.ifscCode !== undefined) insertValues.ifscCode = reqBody.ifscCode;
      if (reqBody.upiId !== undefined) insertValues.upiId = reqBody.upiId;

      // Ensure at least one required field (other than doctorId) is present for creation
      const requiredFields = [
        reqBody.fullName,
        reqBody.state,
        reqBody.city,
        reqBody.pincode,
        reqBody.accountHolderName,
        reqBody.bankName,
        reqBody.accountNumber,
        reqBody.ifscCode,
      ];
      if (requiredFields.some((field) => field !== undefined)) {
        await db.insert(doctorBankDetail).values(insertValues as typeof doctorBankDetail.$inferInsert);
        return NextResponse.json(
          { message: "Bank details created successfully" },
          { status: 201 }
        );
      } else {
        return NextResponse.json(
          { error: "At least one bank detail field is required to create entry" },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.error("Error creating/updating bank Details:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}