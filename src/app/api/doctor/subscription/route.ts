import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { doctor, plans } from "../../../../db/schema";
import db from "../../../../db/db";
import { verifyAuthToken } from "../../../lib/verify";

// =======================
// Get - Plan details of Doctor
// =======================
export async function GET(req: NextRequest) {
  // Verify JWT token using the modularized function
  const decodedOrResponse = await verifyAuthToken();

  // Handle potential error response from token verification
  if (decodedOrResponse instanceof NextResponse) {
    return decodedOrResponse;
  }

  const { userId } = decodedOrResponse;
  const numericUserId = Number(userId);

  // Query for doctor information
  const doctorData = await db
    .select({ 
      id: doctor.id,
      planId: doctor.planId,
      planType: doctor.planType,
      paymentStatus: doctor.paymentStatus,
      paymentAt: doctor.paymentAt,
      expireAt: doctor.expireAt,
      accountStatus: doctor.accountStatus,
      accountVerified: doctor.accountVerified
    })
    .from(doctor)
    .where(eq(doctor.userId, numericUserId));

  if (!doctorData.length) {
    return NextResponse.json(
      { error: "Doctor profile not found for this user." },
      { status: 404 }
    );
  }
  
  const doctorProfile = doctorData[0];

  try {
    // If doctor has a plan, fetch plan details
    if (doctorProfile.planId) {
      const planData = await db
        .select({
          id: plans.id,
          name: plans.name,
          monthlyPrice: plans.monthlyPrice,
          yearlyPrice: plans.yearlyPrice,
          staffLimit: plans.staffLimit,
          chamberLimit: plans.chamberLimit,
          isActive: plans.isActive
        })
        .from(plans)
        .where(eq(plans.id, doctorProfile.planId));

      if (planData.length > 0) {
        // Return combined doctor plan data and plan details
        return NextResponse.json({
          doctorPlan: {
            planId: doctorProfile.planId,
            planType: doctorProfile.planType,
            paymentStatus: doctorProfile.paymentStatus,
            paymentAt: doctorProfile.paymentAt,
            expireAt: doctorProfile.expireAt,
            accountStatus: doctorProfile.accountStatus,
            accountVerified: doctorProfile.accountVerified
          },
          planDetails: planData[0]
        });
      }
    }

    // Return only doctor plan data if no plan is associated or plan not found
    return NextResponse.json({
      doctorPlan: {
        planId: doctorProfile.planId,
        planType: doctorProfile.planType,
        paymentStatus: doctorProfile.paymentStatus,
        paymentAt: doctorProfile.paymentAt,
        expireAt: doctorProfile.expireAt,
        accountStatus: doctorProfile.accountStatus,
        accountVerified: doctorProfile.accountVerified
      },
      planDetails: null
    });
  } catch (error) {
    console.error("Error fetching plan details of doctor:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}