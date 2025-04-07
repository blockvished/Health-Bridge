// pages/api/login.ts
import { verify } from 'argon2';
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { users } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from 'next';
import { sign } from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Connect to database
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not set in environment variables.");
    }
    const sql = postgres(connectionString, { max: 1 });
    const db = drizzle(sql);

    // Find user by email
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (userResult.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = userResult[0];
    const SERVER_PEPPER = process.env.SERVER_PEPPER || 'default_pepper';
    const saltedPassword = SERVER_PEPPER + password + SERVER_PEPPER;
    
    // Verify password
    const passwordValid = await verify(user.password_hash, saltedPassword);

    if (!passwordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
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
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '8h' }
    );

    // Return success with token and user information (excluding sensitive data)
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}