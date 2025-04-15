//schema

// export const doctorDepartment = pgTable("doctor_department", {
//   id: serial("id").primaryKey(),
//   doctorId: integer("doctor_id")
//     .notNull()
//     .references(() => doctor.id, { onDelete: "cascade" }),
//   name: varchar("name", { length: 255 }).notNull(),
// });

import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { doctor, doctorDepartment } from "../../../../../db/schema";
import db from "../../../../../db/db";
import { verifyAuthToken } from "../../../../lib/verify";

// =======================
// Get - All Departments of Doctor
// =======================
export async function GET(req: NextRequest) {
  // Get ID from URL
  const userIdFromUrl = req.nextUrl.pathname.split("/").pop() || "unknown";

  // Verify JWT token using the modularized function
  const decodedOrResponse = await verifyAuthToken();

  // Handle potential error response from token verification
  if (decodedOrResponse instanceof NextResponse) {
    return decodedOrResponse;
  }

  const decoded = decodedOrResponse;
  const userId = Number(decoded.userId);

  // Check if the requested ID matches the authenticated user's ID
  if (String(userId) !== userIdFromUrl) {
    return NextResponse.json(
      { error: "Forbidden: You don't have access to this profile" },
      { status: 403 }
    );
  }

  // Query for doctor information
  const doctorData = await db
    .select()
    .from(doctor)
    .where(eq(doctor.userId, userId));

  if (!doctorData.length) {
    return NextResponse.json(
      { error: "Doctor profile not found for this user." },
      { status: 404 }
    );
  }

  const requiredDoctorId = doctorData[0].id;

  try {
    const departments = await db // Use the imported 'db' instance directly
      .select({
        id: doctorDepartment.id,
        name: doctorDepartment.name,
      })
      .from(doctorDepartment)
      .where(eq(doctorDepartment.doctorId, requiredDoctorId));

    console.log(typeof departments);
    console.log(departments);

    return NextResponse.json({ departments: departments });
  } catch (error) {
    console.error("Error fetching appointment of doctor:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST - create/update based on department id
// and if department id is provided then update else create
// =======================
export async function POST(req: NextRequest) {
  // Get ID from URL
  const userIdFromUrl = req.nextUrl.pathname.split("/").pop() || "unknown";

  // Verify JWT token
  const decodedOrResponse = await verifyAuthToken();
  if (decodedOrResponse instanceof NextResponse) return decodedOrResponse;
  const { userId } = decodedOrResponse;
  const numericUserId = Number(userId);

  // Check if the requested ID matches the authenticated user's ID
  if (String(numericUserId) !== userIdFromUrl) {
    return NextResponse.json(
      { error: "Forbidden: You don't have access to this profile" },
      { status: 403 }
    );
  }

  // Find the doctor's record
  const doctorData = await db
    .select({ id: doctor.id })
    .from(doctor)
    .where(eq(doctor.userId, numericUserId));

  if (!doctorData.length) {
    return NextResponse.json(
      { error: "Doctor profile not found for this user." },
      { status: 404 }
    );
  }

  const requiredDoctorId = doctorData[0].id;

  try {
    const reqBody = await req.json();
    const { id: departmentId, name } = reqBody;

    if (!name) {
      return NextResponse.json(
        { error: "Department name is required." },
        { status: 400 }
      );
    }

    if (departmentId) {
      // Update existing department
      const updatedDepartment = await db
        .update(doctorDepartment)
        .set({ name })
        .where(
          and(
            eq(doctorDepartment.id, departmentId),
            eq(doctorDepartment.doctorId, requiredDoctorId)
          )
        )
        .returning();

      if (updatedDepartment.length > 0) {
        return NextResponse.json({
          message: "Department updated successfully.",
          department: updatedDepartment[0],
        });
      } else {
        return NextResponse.json(
          { error: "Department not found or not belonging to this doctor." },
          { status: 404 }
        );
      }
    } else {
      // Create new department
      const newDepartment = await db
        .insert(doctorDepartment)
        .values({ doctorId: requiredDoctorId, name })
        .returning();

      return NextResponse.json(
        {
          message: "Department created successfully.",
          department: newDepartment[0],
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error creating/updating department:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Delete -  based on department id
// =======================
export async function DELETE(req: NextRequest) {
  // Get ID from URL
  const userIdFromUrl = req.nextUrl.pathname.split("/").pop() || "unknown";

  // Verify JWT token
  const decodedOrResponse = await verifyAuthToken();
  if (decodedOrResponse instanceof NextResponse) return decodedOrResponse;
  const { userId } = decodedOrResponse;
  const numericUserId = Number(userId);

  // Check if the requested ID matches the authenticated user's ID
  if (String(numericUserId) !== userIdFromUrl) {
    return NextResponse.json(
      { error: "Forbidden: You don't have access to this profile" },
      { status: 403 }
    );
  }

  // Find the doctor's record
  const doctorData = await db
    .select({ id: doctor.id })
    .from(doctor)
    .where(eq(doctor.userId, numericUserId));

  if (!doctorData.length) {
    return NextResponse.json(
      { error: "Doctor profile not found for this user." },
      { status: 404 }
    );
  }

  const requiredDoctorId = doctorData[0].id;

  try {
    const reqBody = await req.json();
    const departmentIdToDelete = reqBody.id;

    if (typeof departmentIdToDelete !== 'number') {
      return NextResponse.json(
        { error: "Department ID is required and must be a number." },
        { status: 400 }
      );
    }

    const deletedDepartment = await db
      .delete(doctorDepartment)
      .where(
        and(
          eq(doctorDepartment.id, departmentIdToDelete),
          eq(doctorDepartment.doctorId, requiredDoctorId)
        )
      )
      .returning();

    if (deletedDepartment.length > 0) {
      return NextResponse.json({ message: "Department deleted successfully." });
    } else {
      return NextResponse.json(
        { error: "Department not found or not belonging to this doctor." },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error deleting department:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
