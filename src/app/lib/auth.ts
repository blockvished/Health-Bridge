import { hash } from "argon2";
import crypto from "crypto";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { users, UserRole } from "../../db/schema"; // Import the enum
import { InferInsertModel } from "drizzle-orm";

// Define the expected type for the insert values
type NewUser = InferInsertModel<typeof users>;

async function registerUser(
  name: string,
  email: string,
  password: string,
  phone: string,
  role: UserRole
) {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set in environment variables.");
  }
  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql);

  const SERVER_PEPPER = process.env.SERVER_PEPPER || "default_pepper";
  try {
    const salt = crypto.randomBytes(16).toString("hex");
    // applied salt = salt + password
    const saltedPassword = SERVER_PEPPER + password + SERVER_PEPPER;
    const passwordHash = await hash(saltedPassword);

    const newUser: NewUser = {
      name,
      email,
      phone,
      password_hash: passwordHash,
      salt,
      role: role, // 'role' is now correctly typed
    };

    await db.insert(users).values(newUser);

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    console.error("Error registering user:", error);
    return { success: false, message: "Failed to register user" };
  }
}

export { registerUser };