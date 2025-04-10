import { NextRequest, NextResponse } from "next/server";
import { eq, inArray, and } from "drizzle-orm";
import { doctorEducation } from "../../../../../../db/schema";
import db from "../../../../../../db/db";

// =======================
// GET - Fetch -Educations
// =======================
export async function GET(
  req: NextRequest,
  { params }: { params: { doctor_id: string } }
) {
  const doctorId = parseInt(params.doctor_id);

  if (isNaN(doctorId)) {
    return NextResponse.json({ error: "Invalid doctor ID" }, { status: 400 });
  }

  try {
    const Educations = await db
      .select()
      .from(doctorEducation)
      .where(eq(doctorEducation.doctorId, doctorId))
      .orderBy(doctorEducation.sortOrder);

    return NextResponse.json({ Educations });
  } catch (error) {
    console.error("Error fetching doctor -Education:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// =======================================
// POST - Upsert (sync) -Educations array
// =======================================
export async function POST(
  req: NextRequest,
  { params }: { params: { doctor_id: string } }
) {
  const doctorId = parseInt(params.doctor_id);

  if (isNaN(doctorId)) {
    return NextResponse.json({ error: "Invalid doctor ID" }, { status: 400 });
  }

  const { Educations } = await req.json();

  if (!Array.isArray(Educations)) {
    return NextResponse.json({ error: "-Educations must be an array" }, { status: 400 });
  }

  try {
    // Step 1: Fetch existing -Education records
    const existing = await db
      .select()
      .from(doctorEducation)
      .where(eq(doctorEducation.doctorId, doctorId));

    const existingMap = new Map(existing.map((exp) => [exp.id, exp]));

    const incomingIds = new Set<number>();
    const toInsert = [];
    const toUpdate = [];

    for (const exp of Educations) {
      const {
        id,
        title,
        organization,
        yearFrom,
        yearTo,
        details,
        sortOrder,
      } = exp;

      if (!title) continue; // skip if required fields are missing

      if (id && existingMap.has(id)) {
        incomingIds.add(id);
        toUpdate.push({
          id,
          data: {
            title,
            organization,
            yearFrom,
            yearTo,
            details,
            sortOrder,
            updatedAt: new Date(),
          },
        });
      } else {
        toInsert.push({
          doctorId,
          title,
          organization,
          yearFrom,
          yearTo,
          details,
          sortOrder,
        });
      }
    }

    // Step 2: Insert new -Educations
    if (toInsert.length > 0) {
      await db.insert(doctorEducation).values(toInsert);
    }

    // Step 3: Update existing -Educations
    for (const { id, data } of toUpdate) {
      await db.update(doctorEducation).set(data).where(eq(doctorEducation.id, id));
    }

    // Step 4: Delete removed -Educations
    const existingIds = existing.map((exp) => exp.id);
    const toDelete = existingIds.filter((id) => !incomingIds.has(id));

    if (toDelete.length > 0) {
      await db
        .delete(doctorEducation)
        .where(inArray(doctorEducation.id, toDelete));
    }

    return NextResponse.json({
      message: "Doctor -Educations synced successfully",
      inserted: toInsert.length,
      updated: toUpdate.length,
      deleted: toDelete.length,
    });
  } catch (error) {
    console.error("Error syncing doctor -Educations:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
