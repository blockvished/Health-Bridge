import { NextResponse } from "next/server";
import { registerUser } from "../../lib/auth"; // Adjust the import path
import { userRoleEnum, doctor } from "../../../db/schema";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { InferInsertModel } from "drizzle-orm";

// Define the type for the doctor insert
type NewDoctor = InferInsertModel<typeof doctor>;

export async function POST(request: Request) {
  try {
    const { name, email, password, phone, role } = await request.json(); // 'role' is being extracted
    if (!userRoleEnum.enumValues.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role provided" },
        { status: 400 }
      );
    }

    const registrationResult = await registerUser(
      name,
      email,
      password,
      phone,
      role
    );

    if (registrationResult.success) {
      // If user registration was successful and role is doctor, create doctor entry
      if (role === "doctor" && registrationResult.user && registrationResult.user.id) {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
          throw new Error("DATABASE_URL is not set in environment variables.");
        }
        
        const sql = postgres(connectionString, { max: 1 });
        const db = drizzle(sql);
        
        // Create new doctor entry with user ID
        const newDoctor: NewDoctor = {
          userId: registrationResult.user.id,
          name: name,
          email: email,
          phone: phone || null,
        };
        
        try {
          await db.insert(doctor).values(newDoctor);
          console.log("Doctor record created successfully");
        } catch (error) {
          console.error("Error creating doctor record:", error);
          // Note: We still return success even if doctor creation fails
          // You could change this behavior if needed
        }
      }
      
      return NextResponse.json(
        { 
          message: registrationResult.message,
          user: registrationResult.user // Return the user data including ID
        },
        { status: 201 }
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
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}