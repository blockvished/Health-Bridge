import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { doctor, doctorEducation } from "../../../../../../db/schema";
import db from "../../../../../../db/db";
import { verifyAuthToken } from "../../../../../lib/verify";
// =======================
// GET - Fetch -Educations
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
    const Educations = await db
      .select()
      .from(doctorEducation)
      .where(eq(doctorEducation.doctorId, requiredDoctorId))
      .orderBy(doctorEducation.sortOrder);
    // console.log("Fetched -Educations:", Educations);

    return NextResponse.json({ Educations });
  } catch (error) {
    console.error("Error fetching doctor -Education:", error);
    return NextResponse.json({
      success: true,
    });
  }
}
// /api/doctor/profile/education/[userId]
// =======================
// POST - Create or Update - Education
// =======================
export async function POST(req: NextRequest) {
  const userIdFromUrl = req.nextUrl.pathname.split("/").pop() || "unknown";
  try {
    // Verify JWT token
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

    const reqBody = await req.json();
    const { id, title, institution, yearFrom, yearTo, details, sortOrder } =
      reqBody;

    // Query for doctor information based on the authenticated user ID
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

    if (id) {
      // Update existing education
      const existingEducation = await db.query.doctorEducation.findFirst({
        where: eq(doctorEducation.id, id),
      });

      if (!existingEducation) {
        return NextResponse.json(
          { error: "Education entry not found." },
          { status: 404 }
        );
      }

      if (existingEducation.doctorId !== requiredDoctorId) {
        return NextResponse.json(
          {
            error:
              "Forbidden: You don't have permission to update this education.",
          },
          { status: 403 }
        );
      }

      const updatedEducation = await db
        .update(doctorEducation)
        .set({
          title,
          institution,
          yearFrom,
          yearTo,
          details,
          sortOrder,
          updatedAt: new Date(),
        })
        .where(eq(doctorEducation.id, id))
        .returning();

      // console.log("Updated -Education:", updatedEducation);
      return NextResponse.json({ education: updatedEducation[0] });
    } else {
      // Create new education
      const newEducation = await db
        .insert(doctorEducation)
        .values({
          doctorId: requiredDoctorId,
          title,
          institution,
          yearFrom,
          yearTo,
          details,
          sortOrder,
        })
        .returning();

      // console.log("Created -Education:", newEducation);
      return NextResponse.json({ education: newEducation[0] }, { status: 201 });
    }
  } catch (error) {
    console.error("Error creating/updating doctor -Education:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// /api/doctor/profile/education/[userId]
// =======================
// DELETE - Delete - Education
// =======================
export async function DELETE(req: NextRequest) {
  const userIdFromUrl = req.nextUrl.pathname.split("/").pop() || "unknown";
  const searchParams = req.nextUrl.searchParams;
  const educationIdToDelete = searchParams.get("id");

  if (!educationIdToDelete) {
    return NextResponse.json(
      { error: "Missing education ID to delete." },
      { status: 400 }
    );
  }

  try {
    // Verify JWT token
    const decodedOrResponse = await verifyAuthToken();

    // Handle potential error response from token verification
    if (decodedOrResponse instanceof NextResponse) {
      return decodedOrResponse;
    }

    const decoded = decodedOrResponse;
    const userId = Number(decoded.userId);

    if (String(userId) !== userIdFromUrl) {
      return NextResponse.json(
        {
          error:
            "Forbidden: You don't have access to this profile's education data.",
        },
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

    // Check if the education to delete belongs to the logged-in doctor
    const existingEducation = await db.query.doctorEducation.findFirst({
      where: and(
        eq(doctorEducation.id, Number(educationIdToDelete)),
        eq(doctorEducation.doctorId, requiredDoctorId)
      ),
    });

    if (!existingEducation) {
      return NextResponse.json(
        {
          error:
            "Education entry not found or does not belong to this profile.",
        },
        { status: 404 }
      );
    }

    const deletedEducation = await db
      .delete(doctorEducation)
      .where(eq(doctorEducation.id, Number(educationIdToDelete)))
      .returning();

    if (deletedEducation.length > 0) {
      return NextResponse.json({ message: "Education deleted successfully." });
    } else {
      return NextResponse.json(
        { error: "Failed to delete education." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error deleting doctor -Education:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
