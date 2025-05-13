import { hash } from "argon2";
import crypto from "crypto";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { users, UserRole } from "../../db/schema";
import { InferInsertModel } from "drizzle-orm";
import { eq } from "drizzle-orm";

// Define the expected type for the insert values
type NewUser = InferInsertModel<typeof users>;

/**
 * Register a new user
 */
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

  // Check if user with this phone number already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.phone, phone));

  if (existingUser && existingUser.length > 0) {
    return {
      success: false,
      message: "User with this mobile number already exists",
    };
  }

  try {
    const salt = crypto.randomBytes(16).toString("hex");
    
    // Create user object
    const newUser: NewUser = {
      name,
      email: email || null,
      phone,
      role: role,
    };

    // Only hash and store password if one is provided
    if (password) {
      // applied salt = salt + password
      const saltedPassword = salt + password
      const passwordHash = await hash(saltedPassword);
      newUser.password_hash = passwordHash;
      newUser.salt = salt;
    }

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

/**
 * Update an existing user
 */
async function updateUser(
  userId: number,
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

  try {
    // Create update object
    const updateData: Partial<NewUser> = {
      name,
      phone,
      role,
    };

    // Only update email if provided
    if (email) {
      updateData.email = email;
    }
    
    // Only update password if provided
    if (password) {
      const salt = crypto.randomBytes(16).toString("hex");
      const saltedPassword = salt + password
      const passwordHash = await hash(saltedPassword);
      
      updateData.password_hash = passwordHash;
      updateData.salt = salt;
    }

    // Update the user
    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId));
      
    // Fetch the updated user to return
    const updatedUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));
      
    if (updatedUser && updatedUser.length > 0) {
      return {
        success: true,
        message: "User updated successfully",
        user: updatedUser[0],
      };
    } else {
      return {
        success: false,
        message: "User not found after update",
      };
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, message: "Failed to update user" };
  }
}

export { registerUser, updateUser };