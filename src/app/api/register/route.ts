import { NextResponse } from "next/server";
import { registerUser } from "../../lib/auth"; // Adjust the import path
import { userRoleEnum } from "../../../db/schema";

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
      return NextResponse.json(
        { message: registrationResult.message },
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
  
    console.error("Registration error details:", errorMessage); // It's good to log the detailed message
    return NextResponse.json(
      { error: errorMessage }, // Use the specific errorMessage
      { status: 500 }
    );
  }
}
