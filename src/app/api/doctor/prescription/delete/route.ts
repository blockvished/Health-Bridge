import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { doctor, prescription } from "../../../../../db/schema";
import db from "../../../../../db/db";
import { verifyAuthToken } from "../../../../lib/verify";

// DELETE - delete a prescription by ID
// =======================
export async function DELETE(req: NextRequest) {
  // *** COMMENT OUT AUTHENTICATION AND AUTHORIZATION BELOW ***

  // Verify JWT token
  const decodedOrResponse = await verifyAuthToken();
  if (decodedOrResponse instanceof NextResponse) return decodedOrResponse;
  const { userId } = decodedOrResponse;

  // Get the prescription ID from the query parameters
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Prescription ID is required." },
      { status: 400 }
    );
  }

  const prescriptionId = Number(id);
  if (isNaN(prescriptionId)) {
    return NextResponse.json(
      { error: "Invalid prescription ID. Must be a number." },
      { status: 400 }
    );
  }

  try {
    // 1.  Find the prescription to be deleted.  Crucially, check that
    //    the doctor making the request is the one who *owns* the
    //    prescription.  This is the authorization check.
    const doctorRecord = await db.query.doctor.findFirst({
      // Changed to findFirst
      where: eq(doctor.userId, Number(userId)),
      columns: { id: true }, // Select only the doctor.id
    });

    if (!doctorRecord) {
      return NextResponse.json(
        { error: "Doctor not found for the given user." },
        { status: 404 }
      );
    }
    const doctorId = doctorRecord.id;

    const prescriptionToDelete = await db.query.prescription.findFirst({
      where: and(
        eq(prescription.id, prescriptionId),
        eq(prescription.doctorId, doctorId) // Use the doctorId we fetched
      ),
    });

    if (!prescriptionToDelete) {
      return NextResponse.json(
        {
          error:
            "Prescription not found or you are not authorized to delete it.",
        },
        { status: 404 }
      );
    }

    // 2. Delete the prescription.
    const deletedPrescriptions = await db
      .delete(prescription)
      .where(eq(prescription.id, prescriptionId))
      .returning(); // Get back the deleted record to confirm deletion

    if (deletedPrescriptions.length === 0) {
      // This *shouldn't* happen, because we already checked for existence,
      // but it's good to be defensive.
      return NextResponse.json(
        { error: "Prescription not found." },
        { status: 404 }
      );
    }

    // 3.  Return a success response.  It's good practice to return the
    //    deleted object, in case the client wants to do anything with that
    //    data.
    return NextResponse.json(
      {
        message: "Prescription deleted successfully.",
        deleted: deletedPrescriptions[0],
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    // Handle database errors (and other errors)
    console.error("Error deleting prescription:", error);
    let errorMessage = "Failed to delete prescription";
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    } else {
      errorMessage += `: ${String(error)}`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
