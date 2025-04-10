import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { doctor, doctorExperience } from "../../../../../../db/schema";
import db from "../../../../../../db/db";
import { verifyAuthToken } from "../../../../../lib/verify";

// /api/doctor/profile/experience/[userId]
// =======================
// GET - Fetch -Experiences
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
    const Experiences = await db
      .select()
      .from(doctorExperience)
      .where(eq(doctorExperience.doctorId, requiredDoctorId))
      .orderBy(doctorExperience.sortOrder);
    // console.log("Fetched -Experiences:", Experiences);

    return NextResponse.json({ Experiences });
  } catch (error) {
    console.error("Error fetching doctor -Experience:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// /api/doctor/profile/experience/[userId]
// =======================
// POST - Create or Update - Experience
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

    const reqBody = await req.json();
    const { id, title, organization, yearFrom, yearTo, details, sortOrder } =
      reqBody;
    if (String(userId) !== userIdFromUrl) {
      return NextResponse.json(
        {
          error:
            "Forbidden: You don't have access to this profile's education data.",
        },
        { status: 403 }
      );
    }

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
      // Update existing experience
      const existingExperience = await db.query.doctorExperience.findFirst({
        where: eq(doctorExperience.id, id),
      });

      if (!existingExperience) {
        return NextResponse.json(
          { error: "Experience entry not found." },
          { status: 404 }
        );
      }

      if (existingExperience.doctorId !== requiredDoctorId) {
        return NextResponse.json(
          {
            error:
              "Forbidden: You don't have permission to update this experience.",
          },
          { status: 403 }
        );
      }

      const updatedExperience = await db
        .update(doctorExperience)
        .set({
          title,
          organization,
          yearFrom,
          yearTo,
          details,
          sortOrder,
          updatedAt: new Date(),
        })
        .where(eq(doctorExperience.id, id))
        .returning();

      // console.log("Updated -Experience:", updatedExperience);
      return NextResponse.json({ experience: updatedExperience[0] });
    } else {
      // Create new experience
      const newExperience = await db
        .insert(doctorExperience)
        .values({
          doctorId: requiredDoctorId,
          title,
          organization,
          yearFrom,
          yearTo,
          details,
          sortOrder,
        })
        .returning();

      // console.log("Created -Experience:", newExperience);
      return NextResponse.json(
        { experience: newExperience[0] },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error creating/updating doctor -Experience:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// /api/doctor/profile/experience/[userId]
// =======================
// DELETE - Delete - Experience
// =======================
export async function DELETE(req: NextRequest) {
  const userIdFromUrl = req.nextUrl.pathname.split("/").pop() || "unknown";
  const searchParams = req.nextUrl.searchParams;
  const experienceIdToDelete = searchParams.get("id");

  if (!experienceIdToDelete) {
    return NextResponse.json(
      { error: "Missing experience ID to delete." },
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
            "Forbidden: You don't have access to this profile's experience data.",
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

    // Check if the experience to delete belongs to the logged-in doctor
    const existingExperience = await db.query.doctorExperience.findFirst({
      where: and(
        eq(doctorExperience.id, Number(experienceIdToDelete)),
        eq(doctorExperience.doctorId, requiredDoctorId)
      ),
    });

    if (!existingExperience) {
      return NextResponse.json(
        {
          error:
            "Experience entry not found or does not belong to this profile.",
        },
        { status: 404 }
      );
    }

    const deletedExperience = await db
      .delete(doctorExperience)
      .where(eq(doctorExperience.id, Number(experienceIdToDelete)))
      .returning();

    if (deletedExperience.length > 0) {
      return NextResponse.json({ message: "Experience deleted successfully." });
    } else {
      return NextResponse.json(
        { error: "Failed to delete experience." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error deleting doctor -Experience:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
