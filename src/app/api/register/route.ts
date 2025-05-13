import { NextResponse } from "next/server";
import { registerUser, updateUser } from "../../lib/auth";
import { users, userRoleEnum, doctor, plans } from "../../../db/schema";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { InferInsertModel } from "drizzle-orm";
import { eq } from "drizzle-orm";

// Define the types for the inserts
type NewDoctor = InferInsertModel<typeof doctor>;

export async function POST(request: Request) {
  try {
    const userData = await request.json();

    // Extract all potential fields from userData
    const {
      fullName,
      mobile,
      email,
      clinicName,
      speciality,
      practiceType,
      yearsOfExperience,
      city,
      pincode,
      subscriptionPlan,
      billingPeriod,
      password,
      role,
    } = userData;

    console.log("billing period", billingPeriod);

    // Validate required fields
    if (!fullName || !mobile) {
      return NextResponse.json(
        { error: "Name and mobile number are required" },
        { status: 400 }
      );
    }

    // Validate role
    if (role && !userRoleEnum.enumValues.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role provided" },
        { status: 400 }
      );
    }
    
    // Validate billing period if provided
    if (billingPeriod && !["monthly", "yearly"].includes(billingPeriod)) {
      return NextResponse.json(
        { error: "Invalid billing period. Must be 'monthly' or 'yearly'" },
        { status: 400 }
      );
    }

    // Establish database connection
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not set in environment variables.");
    }
    const sql = postgres(connectionString, { max: 1 });
    const db = drizzle(sql);

    // Check if user with this mobile number already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.phone, mobile));

    let registrationResult;

    // If user exists, update the user record
    if (existingUser && existingUser.length > 0) {
      registrationResult = await updateUser(
        existingUser[0].id,
        fullName,
        email || existingUser[0].email,
        password || "",
        mobile,
        role || existingUser[0].role
      );
    } else {
      // Otherwise register a new user
      registrationResult = await registerUser(
        fullName,
        email || "",
        password || "",
        mobile,
        role || "doctor"
      );
    }

    if (registrationResult.success && registrationResult.user) {
      // If user registration/update was successful and role is doctor, create/update doctor entry
      const userId = registrationResult.user.id;

      // Check if doctor record already exists
      const existingDoctor = await db
        .select()
        .from(doctor)
        .where(eq(doctor.userId, userId));

      // Calculate expiration date based on billing period
      const currentDate = new Date();
      let expirationDate = new Date();
      if (billingPeriod === "yearly") {
        expirationDate.setFullYear(currentDate.getFullYear() + 1);
      } else {
        // Default to monthly if not specified or if specified as monthly
        expirationDate.setMonth(currentDate.getMonth() + 1);
      }

      // Prepare doctor data
      const doctorData: Partial<NewDoctor> = {
        userId: userId,
        name: fullName,
        email: email || null,
        phone: mobile,
        city: city || null,
        pincode: pincode || null,
        specialization: speciality || null,
        experience: yearsOfExperience ? parseInt(yearsOfExperience) : null,
        aboutClinic: clinicName || null,
        planId: subscriptionPlan || null, // Foreign key to plans table
        planType: billingPeriod || null,  // Store the billing period
        paymentAt: currentDate,
        expireAt: expirationDate,
      };

      // If subscriptionPlan is provided, try to find the plan ID
      if (subscriptionPlan) {
        try {
          const planResult = await db
            .select({ id: plans.id })
            .from(plans)
            .where(eq(plans.name, subscriptionPlan));

          if (planResult && planResult.length > 0) {
            doctorData.planId = planResult[0].id;
          }
        } catch (error) {
          console.error("Error finding subscription plan:", error);
        }
      }

      try {
        if (existingDoctor && existingDoctor.length > 0) {
          // Update existing doctor record
          await db
            .update(doctor)
            .set(doctorData)
            .where(eq(doctor.userId, userId));
          console.log("Doctor record updated successfully");
        } else {
          // Create new doctor record
          await db.insert(doctor).values(doctorData as NewDoctor);
          console.log("Doctor record created successfully");
        }
      } catch (error) {
        console.error("Error creating/updating doctor record:", error);
      }

      // TODO: Create a JWT token with 5 min expiration and send it back to the client
      
      return NextResponse.json(
        {
          message:
            existingUser && existingUser.length > 0
              ? "User updated successfully"
              : "Registration successful",
          user: registrationResult.user,
        },
        { status: existingUser && existingUser.length > 0 ? 200 : 201 }
      );
    } else {
      return NextResponse.json(
        { error: registrationResult.message },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error("Registration API error:", error);
    let errorMessage = "Internal server error";
    if (error instanceof Error) {
      errorMessage = error.message || errorMessage;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    console.error("Registration error details:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}