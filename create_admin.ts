import { randomBytes } from "crypto";
import { users, UserRole } from "./src/db/schema";
import { InferInsertModel } from "drizzle-orm";
import { db } from "./src/db/db";
import { hash } from "argon2";

const role: UserRole = "admin"; // user testing
const email = "admin@gmail.com";
const newPassword = "qew8rtuheqirt";
const name = "Admin";

(async () => {
  try {
    const salt = randomBytes(16).toString("hex");
    const saltedNewPassword = salt + newPassword;
    const hashedPassword = await hash(saltedNewPassword);
    const phone = "1293345345"; // Recommended to store phone as string

    const newUser: InferInsertModel<typeof users> = {
      name,
      email,
      phone,
      password_hash: hashedPassword,
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
