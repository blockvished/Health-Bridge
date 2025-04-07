import { hash } from 'argon2';
import crypto from 'crypto';
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { users, userRoleEnum } from "../../../db/schema"

// Define the type for role based on the enum values
type UserRole = "superadmin" | "admin" | "doctor" | "staff" | "user";

async function registerUser(
  name: string, 
  email: string, 
  password: string, 
  mobile?: string, 
  role: UserRole = 'doctor'
) {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set in environment variables.");
  }
  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql);
  
  const SERVER_PEPPER = process.env.SERVER_PEPPER || 'default_pepper'; // Use a secure pepper
  try {
    const salt = crypto.randomBytes(16).toString('hex');
    const saltedPassword = SERVER_PEPPER + password + SERVER_PEPPER; // Apply pepper
    const passwordHash = await hash(saltedPassword);
    
    await db.insert(users).values({
      name,
      email,
      mobile,
      password_hash: passwordHash,
      salt,
      role: role as any, // Type assertion to handle enum compatibility
    });
    
    return { success: true, message: 'User registered successfully' };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, message: 'Failed to register user' };
  }
}