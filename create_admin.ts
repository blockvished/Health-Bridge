import { hash } from "argon2";
import crypto from "crypto";
import { users, UserRole } from "./src/db/schema";
import { InferInsertModel } from "drizzle-orm";
import { db } from "./src/db/db";

const SERVER_PEPPER = process.env.SERVER_PEPPER;
                                  
const role: UserRole = "admin"; // user
const passwd = "Admin123321@gmail.com"; //password
const email = "admin@gmail.com";

const salt = crypto.randomBytes(16).toString("hex");
// applied salt = salt + password
const name = "Admin User";
const saltedPassword = SERVER_PEPPER + passwd + SERVER_PEPPER;

(async () => {
  try {
    const passwordHash = await hash(saltedPassword);
    const phone = "1293"; // Recommended to store phone as string

    const newUser: InferInsertModel<typeof users> = {
      name,
      email,
      phone,
      password_hash: passwordHash,
      salt,
      role,
    };

    await db.insert(users).values(newUser);
    console.log("Admin user created successfully!");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    if (db && db.$client) {
      await db.$client.end();
    }
  }
})();
