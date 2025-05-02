import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { doctor, plans, users } from "../../../../db/schema";
import db from "../../../../db/db";
import { verifyAuthToken } from "../../../lib/verify";

// =======================
// GET - Fetch Patients for a Doctor
// =======================

export async function GET() {
    // Verify JWT token using the modularized function
    const decodedOrResponse = await verifyAuthToken();
  
    // Handle potential error response from token verification
    if (decodedOrResponse instanceof NextResponse) {
      return decodedOrResponse;
    }
  
    const decoded = decodedOrResponse;
    const userId = Number(decoded.userId);
  
    try {
      // First check if the user is an admin
      const currentUser = await db
        .select({
          id: users.id,
          role: users.role,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
  
      // If no user found or not an admin/superadmin, return unauthorized
      if (!currentUser.length || (currentUser[0].role !== 'admin' && currentUser[0].role !== 'superadmin')) {
        return NextResponse.json(
          { error: "Unauthorized. Admin privileges required." },
          { status: 403 }
        );
      }
  
      // If admin, fetch all doctors with plan name
      const doctors = await db
        .select({
          id: doctor.id,
          name: users.name,
          email: users.email,
          phone: users.phone,
          verified: doctor.accountVerified, // doctor verification
          paymentStatus: doctor.paymentStatus, // paid subscription
          accountStatus: doctor.accountStatus, // his account active for live doctors
          image_link: doctor.image_link, // doctor image link if present
          planId: doctor.planId, // plan ID
          planName: plans.name, // Added plan name
          createdAt: doctor.createdAt,
        })
        .from(doctor)
        .innerJoin(users, eq(doctor.userId, users.id))
        .leftJoin(plans, eq(doctor.planId, plans.id)); // Left join to get plan name (left join in case some doctors don't have a plan)
      
      // Calculate counts
      const totalDoctors = doctors.length;
      const verifiedDoctorsCount = doctors.filter(doc => doc.verified === true).length;
      const pendingVerifications = doctors.filter(doc => doc.verified === false).length;
      const expiredAccounts = doctors.filter(doc => doc.accountStatus === false && doc.verified === true).length;
      
      // Return both the doctors array and the counts
      return NextResponse.json({
        doctors: doctors,
        counts: {
          totalDoctors,
          verifiedDoctorsCount,
          pendingVerifications,
          expiredAccounts
        }
      });
    } catch (error) {
      console.error("Error fetching doctors:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }