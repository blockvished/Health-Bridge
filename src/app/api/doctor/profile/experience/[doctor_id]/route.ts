import { NextRequest, NextResponse } from "next/server";
import { eq, inArray } from "drizzle-orm";
import { doctorExperience } from "../../../../../../db/schema";
import db from "../../../../../../db/db";

// =======================
// GET - Fetch experiences
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
    const experiences = await db
      .select()
      .from(doctorExperience)
      .where(eq(doctorExperience.doctorId, doctorId))
      .orderBy(doctorExperience.sortOrder);

    return NextResponse.json({ experiences });
  } catch (error) {
    console.error("Error fetching doctor experience:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// =======================================
// POST - Upsert (sync) experiences array
// =======================================
export async function POST(
  req: NextRequest,
  { params }: { params: { doctor_id: string } }
) {
  const doctorId = parseInt(params.doctor_id);

  if (isNaN(doctorId)) {
    return NextResponse.json({ error: "Invalid doctor ID" }, { status: 400 });
  }

  const { experiences } = await req.json();

  if (!Array.isArray(experiences)) {
    return NextResponse.json({ error: "Experiences must be an array" }, { status: 400 });
  }

  try {
    // Step 1: Fetch existing experience records
    const existing = await db
      .select()
      .from(doctorExperience)
      .where(eq(doctorExperience.doctorId, doctorId));

    const existingMap = new Map(existing.map((exp) => [exp.id, exp]));

    const incomingIds = new Set<number>();
    const toInsert = [];
    const toUpdate = [];

    for (const exp of experiences) {
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

    // Step 2: Insert new experiences
    if (toInsert.length > 0) {
      await db.insert(doctorExperience).values(toInsert);
    }

    // Step 3: Update existing experiences
    for (const { id, data } of toUpdate) {
      await db.update(doctorExperience).set(data).where(eq(doctorExperience.id, id));
    }

    // Step 4: Delete removed experiences
    const existingIds = existing.map((exp) => exp.id);
    const toDelete = existingIds.filter((id) => !incomingIds.has(id));

    if (toDelete.length > 0) {
      await db
        .delete(doctorExperience)
        .where(inArray(doctorExperience.id, toDelete));
    }

    return NextResponse.json({
      message: "Doctor experiences synced successfully",
      inserted: toInsert.length,
      updated: toUpdate.length,
      deleted: toDelete.length,
    });
  } catch (error) {
    console.error("Error syncing doctor experiences:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
