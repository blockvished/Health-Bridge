import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";
import { doctor } from "./schema"; // Ensure schema.ts exports the correct type

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL not found in environment variables");
  process.exit(1);
}

const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql);

const addDoctor = async (): Promise<void> => {
  try {
    console.log("Inserting doctor into the database...");

    await db.insert(doctor).values({
      name: "Dr. Dheeraj Singh",
      email: "drdheeraj@doctor.in",
      city: "Chandigarh",
      specialization: "Cardiology",
      degree: "MBBS, MD",
      experience: 16,
      aboutSelf:
        "Dr. Dheeraj Singh has a distinguished 16-year career in cardiology. He has served at three prestigious hospitals, where he has made significant contributions and played pivotal roles in advancing cardiology care. His extensive experience encompasses a wide range of cardiology services, including diagnosis, treatment, and management of various heart conditions.",
      aboutClinic:
        "Hello and thank you for visiting my Doctor's profile. I want to let you know that here at my office, my staff and I will do our best to make you comfortable. I believe in ethics; as a health provider, being ethical is not just a remembered value, but a strongly observed one.",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("Doctor added successfully!");
  } catch (error) {
    console.error("Error inserting doctor:", error);
  } finally {
    await sql.end();
    process.exit(0);
  }
};

addDoctor();