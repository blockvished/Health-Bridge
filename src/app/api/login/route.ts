import { NextResponse } from "next/server";
import { verify } from "argon2";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { users } from "../../../db/schema";
import { eq, or } from "drizzle-orm";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie"; // Needed for manual cookie setting

export async function POST(request: Request) {
  try {
    const { login, password } = await request.json();

    // Validate inputs
    if (!login || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Login credentials and password are required",
        },
        { status: 400 }
      );
    }

    // Connect to database
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not set in environment variables.");
    }
    const sql = postgres(connectionString, { max: 1 });
    const db = drizzle(sql);

    // Find user by email
    const userResult = await db
      .select()
      .from(users)
      .where(or(eq(users.email, login), eq(users.phone, login)))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const user = userResult[0];
    const SERVER_PEPPER = process.env.SERVER_PEPPER;
    const saltedPassword = SERVER_PEPPER + password + SERVER_PEPPER;

    // Verify password
    const passwordValid = await verify(user.password_hash, saltedPassword);

    if (!passwordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }
    // Generate JWT token
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not set in environment variables.");
    }

    const token = sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set cookie using "serialize" (works in /api routes)
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.headers.set(
      "Set-Cookie",
      serialize("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60, // 1 hour
      })
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
