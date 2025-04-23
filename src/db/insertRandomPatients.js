import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { pgTable, serial, varchar, boolean, timestamp, text, integer } from 'drizzle-orm/pg-core';

// Database schema definition
export const userRoleEnum = pgTable.enum('user_role', ['patient', 'doctor', 'admin']);
export const genderEnum = pgTable.enum('gender', ['male', 'female', 'other']);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  email_verified: boolean("email_verified").default(false),
  phone: varchar("phone", { length: 20 }),
  phone_verified: boolean("phone_verified").default(false),
  password_hash: text("password").notNull(),
  salt: text("salt").notNull(),
  role: userRoleEnum("role").default("patient").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const doctor = pgTable("doctor", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  specialization: text("specialization").notNull(),
  experience: integer("experience"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const patient = pgTable("patient", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  doctorId: integer("doctor_id").notNull().references(() => doctor.id, { onDelete: "cascade" }),
  abhaId: text("abha_id"),
  age: integer("age"),
  weight: integer("weight"),
  height: integer("height"),
  address: text("address"),
  gender: genderEnum("gender"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Configure database connection
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres', // change to your database user
  password: 'postgres', // change to your database password
  database: 'medical_app' // change to your database name
});

const db = drizzle(pool);

// Generate Indian users data
const generateIndianUsers = () => {
  const users = [
    { name: "Aarav Sharma", email: "aarav.sharma@gmail.com", phone: "9876543210", role: "patient" },
    { name: "Diya Patel", email: "diya.patel@hotmail.com", phone: "9876123450", role: "patient" },
    { name: "Arjun Singh", email: "arjun.singh@outlook.com", phone: "8765432109", role: "patient" },
    { name: "Ananya Reddy", email: "ananya.reddy@gmail.com", phone: "7654321098", role: "patient" },
    { name: "Vihaan Khanna", email: "vihaan.khanna@yahoo.com", phone: "9765432108", role: "patient" },
    { name: "Saanvi Kumar", email: "saanvi.kumar@gmail.com", phone: "8765123490", role: "patient" },
    { name: "Reyansh Gupta", email: "reyansh.gupta@outlook.com", phone: "7890123456", role: "patient" },
    { name: "Aanya Mittal", email: "aanya.mittal@gmail.com", phone: "9870123456", role: "patient" },
    { name: "Vivaan Malhotra", email: "vivaan.malhotra@yahoo.com", phone: "8901234567", role: "patient" },
    { name: "Ishaan Joshi", email: "ishaan.joshi@gmail.com", phone: "7890234561", role: "patient" },
    { name: "Aditi Agarwal", email: "aditi.agarwal@hotmail.com", phone: "9876543211", role: "patient" },
    { name: "Kabir Mishra", email: "kabir.mishra@gmail.com", phone: "8765432101", role: "patient" },
    { name: "Avni Desai", email: "avni.desai@outlook.com", phone: "7654321090", role: "patient" },
    { name: "Dhruv Verma", email: "dhruv.verma@yahoo.com", phone: "8901234560", role: "patient" },
    { name: "Pari Kapoor", email: "pari.kapoor@gmail.com", phone: "9876012345", role: "patient" },
    { name: "Kiaan Choudhary", email: "kiaan.choudhary@hotmail.com", phone: "8765012349", role: "patient" },
    { name: "Myra Bhatia", email: "myra.bhatia@gmail.com", phone: "7654012389", role: "patient" },
    { name: "Advait Saxena", email: "advait.saxena@outlook.com", phone: "9087612345", role: "patient" },
    { name: "Prisha Rao", email: "prisha.rao@gmail.com", phone: "8907612345", role: "patient" },
    { name: "Atharv Mehta", email: "atharv.mehta@yahoo.com", phone: "7896012345", role: "patient" },
    { name: "Anika Chauhan", email: "anika.chauhan@gmail.com", phone: "9876540123", role: "patient" },
    { name: "Ayaan Tiwari", email: "ayaan.tiwari@hotmail.com", phone: "8765430129", role: "patient" },
    { name: "Anvi Bansal", email: "anvi.bansal@outlook.com", phone: "7654320198", role: "patient" },
    { name: "Rudra Mehra", email: "rudra.mehra@gmail.com", phone: "9087654321", role: "patient" },
    { name: "Kyra Iyer", email: "kyra.iyer@yahoo.com", phone: "8097654321", role: "patient" },
    { name: "Yuvan Hegde", email: "yuvan.hegde@gmail.com", phone: "7098654321", role: "patient" },
    { name: "Shanaya Nair", email: "shanaya.nair@outlook.com", phone: "9876501234", role: "patient" },
    { name: "Ved Menon", email: "ved.menon@gmail.com", phone: "8765401239", role: "patient" },
    { name: "Aadhya Pillai", email: "aadhya.pillai@hotmail.com", phone: "7654301298", role: "patient" },
    { name: "Shaurya Goel", email: "shaurya.goel@yahoo.com", phone: "9087612354", role: "patient" },
    { name: "Ahana Naidu", email: "ahana.naidu@gmail.com", phone: "8097612354", role: "patient" },
    { name: "Arnav Venkatesh", email: "arnav.venkatesh@outlook.com", phone: "7098612354", role: "patient" },
    { name: "Nitara Pathak", email: "nitara.pathak@gmail.com", phone: "9876512340", role: "patient" },
    { name: "Shlok Sharma", email: "shlok.sharma@yahoo.com", phone: "8765412390", role: "patient" },
    { name: "Kiara Thakur", email: "kiara.thakur@hotmail.com", phone: "7654312890", role: "patient" },
    { name: "Vansh Sinha", email: "vansh.sinha@gmail.com", phone: "9087651234", role: "patient" },
    { name: "Amaira Rathore", email: "amaira.rathore@outlook.com", phone: "8097651234", role: "patient" },
    { name: "Krish Chatterjee", email: "krish.chatterjee@yahoo.com", phone: "7098651234", role: "patient" },
    { name: "Riya Chandran", email: "riya.chandran@gmail.com", phone: "9876512304", role: "patient" },
    { name: "Veer Ganguly", email: "veer.ganguly@hotmail.com", phone: "8765412309", role: "patient" },
    { name: "Amyra Sengupta", email: "amyra.sengupta@outlook.com", phone: "7654312809", role: "patient" },
    { name: "Mira Ahuja", email: "mira.ahuja@gmail.com", phone: "9087651243", role: "patient" },
    { name: "Ishan Bhattacharya", email: "ishan.bhattacharya@yahoo.com", phone: "8097651243", role: "patient" },
    { name: "Navya Chakraborty", email: "navya.chakraborty@hotmail.com", phone: "7098651243", role: "patient" },
    { name: "Shivansh Yadav", email: "shivansh.yadav@gmail.com", phone: "9876512034", role: "patient" },
    { name: "Ira Mukherjee", email: "ira.mukherjee@outlook.com", phone: "8765410239", role: "patient" },
    { name: "Rohan Malik", email: "rohan.malik@yahoo.com", phone: "7654301289", role: "patient" },
    { name: "Aarohi Bajaj", email: "aarohi.bajaj@gmail.com", phone: "9087651423", role: "patient" },
    { name: "Kabir Murthy", email: "kabir.murthy@hotmail.com", phone: "8097651423", role: "patient" },
    { name: "Anaisha Seth", email: "anaisha.seth@outlook.com", phone: "7098651423", role: "patient" }
  ];

  // Add password hash and salt
  return users.map((user) => ({
    name: user.name,
    email: user.email,
    email_verified: Math.random() > 0.7,
    phone: user.phone,
    phone_verified: Math.random() > 0.8,
    password_hash: `hash_for_${user.name.toLowerCase().replace(/\s+/g, "")}`,
    salt: `salt_for_${user.name.toLowerCase().replace(/\s+/g, "")}`,
    role: user.role
  }));
};

// Generate some doctor users
const generateDoctors = () => {
  const doctorUsers = [
    { name: "Dr. Rajesh Kumar", email: "dr.rajesh@hospital.com", phone: "9812345670", role: "doctor" },
    { name: "Dr. Priya Mehta", email: "dr.priya@hospital.com", phone: "8723456901", role: "doctor" },
    { name: "Dr. Amit Patel", email: "dr.amit@hospital.com", phone: "7634567890", role: "doctor" },
    { name: "Dr. Neha Singh", email: "dr.neha@hospital.com", phone: "9845678901", role: "doctor" },
    { name: "Dr. Vikram Reddy", email: "dr.vikram@hospital.com", phone: "8756789012", role: "doctor" },
    { name: "Dr. Meera Gupta", email: "dr.meera@hospital.com", phone: "7667890123", role: "doctor" },
    { name: "Dr. Suresh Iyer", email: "dr.suresh@hospital.com", phone: "9878901234", role: "doctor" },
    { name: "Dr. Anita Sharma", email: "dr.anita@hospital.com", phone: "8789012345", role: "doctor" },
    { name: "Dr. Karthik Nair", email: "dr.karthik@hospital.com", phone: "7690123456", role: "doctor" },
    { name: "Dr. Sunita Joshi", email: "dr.sunita@hospital.com", phone: "9801234567", role: "doctor" }
  ];

  // Add password hash and salt
  return doctorUsers.map((user) => ({
    name: user.name,
    email: user.email,
    email_verified: true,
    phone: user.phone,
    phone_verified: true,
    password_hash: `hash_for_${user.name.toLowerCase().replace(/\s+/g, "")}`,
    salt: `salt_for_${user.name.toLowerCase().replace(/\s+/g, "")}`,
    role: user.role
  }));
};

const generateDoctorData = (doctorUserIds) => {
  const specializations = [
    "Cardiology", "Neurology", "Pediatrics", "Orthopedics", 
    "Gynecology", "Dermatology", "Ophthalmology", "Psychiatry", 
    "Oncology", "General Medicine"
  ];
  
  return doctorUserIds.map((userId, index) => ({
    userId,
    specialization: specializations[index % specializations.length],
    experience: Math.floor(Math.random() * 20) + 5 // 5-25 years of experience
  }));
};

const generatePatientData = (patientUserIds, doctorIds) => {
  const genders = ["male", "female", "other"];
  const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow"];
  
  return patientUserIds.map((userId, index) => ({
    userId,
    doctorId: 2, 
    abhaId: `ABHA${1000000 + userId}`,
    age: Math.floor(Math.random() * 70) + 10, // Age between 10-80
    weight: Math.floor(Math.random() * 70) + 40, // Weight between 40-110kg
    height: Math.floor(Math.random() * 60) + 140, // Height between 140-200cm
    address: `${Math.floor(Math.random() * 1000) + 1}, ${["Sector", "Block", "Phase"][Math.floor(Math.random() * 3)]}-${Math.floor(Math.random() * 50) + 1}, ${cities[Math.floor(Math.random() * cities.length)]}`,
    gender: genders[Math.floor(Math.random() * genders.length)]
  }));
};

// Main function to insert data
async function insertData() {
  try {
    // Generate data
    const indianUsers = generateIndianUsers();
    const doctorUsers = generateDoctors();
    
    // Insert all users
    console.log("Inserting doctor users...");
    for (const doctorUser of doctorUsers) {
      await db.insert(users).values(doctorUser);
    }
    
    console.log("Inserting patient users...");
    for (const patientUser of indianUsers) {
      await db.insert(users).values(patientUser);
    }
    
    // Get the inserted user IDs
    const allUsers = await db.select().from(users);
    const doctorUserIds = allUsers.filter(user => user.role === "doctor").map(user => user.id);
    const patientUserIds = allUsers.filter(user => user.role === "patient").map(user => user.id);
    
    // Insert doctor data
    console.log("Inserting doctor specializations...");
    const doctorData = generateDoctorData(doctorUserIds);
    for (const docData of doctorData) {
      await db.insert(doctor).values(docData);
    }
    
    // Get doctor IDs
    const doctors = await db.select().from(doctor);
    const doctorIds = doctors.map(doc => doc.id);
    
    // Insert patient data
    console.log("Inserting patient data...");
    const patientData = generatePatientData(patientUserIds, doctorIds);
    for (const patData of patientData) {
      await db.insert(patient).values(patData);
    }
    
    console.log("Data insertion complete!");
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    await pool.end();
  }
}

// Function for just viewing the generated data without inserting
function showGeneratedData() {
  const indianUsers = generateIndianUsers();
  const doctorUsers = generateDoctors();
  
  console.log("Patient users:", JSON.stringify(indianUsers, null, 2));
  console.log("Doctor users:", JSON.stringify(doctorUsers, null, 2));
}

// Uncomment one of these functions based on what you want to do
insertData();
// showGeneratedData();