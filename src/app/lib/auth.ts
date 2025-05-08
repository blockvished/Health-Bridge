import { hash } from "argon2";
import crypto from "crypto";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { users, UserRole } from "../../db/schema";
import { InferInsertModel } from "drizzle-orm";
import { eq } from "drizzle-orm";

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
      role: role,
    };

    // Insert the user and get the ID
    const result = await db
      .insert(users)
      .values(newUser)
      .returning({ insertedId: users.id });

    if (result && result.length > 0) {
      const insertedId = result[0].insertedId;

      // Fetch the newly inserted user to return all details
      const insertedUser = await db
        .select()
        .from(users)
        .where(eq(users.id, insertedId));
        
      if (insertedUser && insertedUser.length > 0) {
        return {
          success: true,
          message: "User registered successfully",
          user: insertedUser[0],
        };
      } else {
        return {
          success: true,
          message: "User registered successfully",
          user: { id: insertedId },
        };
      }
    } else {
      return {
        success: false,
        message: "Failed to register user: No ID returned.",
      };
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return { success: false, message: "Failed to register user" };
  }
}

export { registerUser };