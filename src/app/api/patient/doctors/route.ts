import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import {
  doctor,
  appointments,
  patient,
  doctor_ratings,
} from "../../../../db/schema";
import db from "../../../../db/db";
import { verifyAuthToken } from "../../../lib/verify";

// =======================
// Get - All Appointments for Patient with Doctor Ratings
// =======================
export async function GET() {
  // Verify JWT token
  const decodedOrResponse = await verifyAuthToken();
  if (decodedOrResponse instanceof NextResponse) {
    return decodedOrResponse;
  }
  const decoded = decodedOrResponse;
  const userId = Number(decoded.userId);

  try {
    // Find the patient ID associated with the logged-in user
    const patientData = await db
      .select({ id: patient.id })
      .from(patient)
      .where(eq(patient.userId, userId));

    if (!patientData.length) {
      return NextResponse.json(
        { error: "Patient profile not found for this user." },
        { status: 404 }
      );
    }

    const requiredPatientId = patientData[0].id;

    // Query for appointments and join with doctor information
    const appointmentsData = await db
      .select({
        appointmentId: appointments.id,
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorThumb: doctor.image_link,
        doctorEmail: doctor.email,
      })
      .from(appointments)
      .innerJoin(doctor, eq(appointments.doctorId, doctor.id))
      .where(eq(appointments.patientId, requiredPatientId));

    // Extract unique doctor details and fetch their ratings
    const uniqueDoctorsWithRatings = await Promise.all(
      Array.from(
        new Map(
          appointmentsData.map((appt) => [
            appt.doctorId,
            {
              id: appt.doctorId,
              name: appt.doctorName,
              thumb: appt.doctorThumb,
              email: appt.doctorEmail,
            },
          ])
        ).values()
      ).map(async (doctorInfo) => {
        const ratingData = await db
          .select({
            id: doctor_ratings.id,
            rating: doctor_ratings.rating,
            text: doctor_ratings.text,
          })
          .from(doctor_ratings)
          .where(
            and(
              eq(doctor_ratings.doctorid, doctorInfo.id),
              eq(doctor_ratings.patientid, requiredPatientId)
            )
          )
          .limit(1); // Assuming one rating per patient per doctor for simplicity

        if (ratingData.length > 0) {
          return {
            ...doctorInfo,
            rating: true,
            ratingId: ratingData[0].id,
            stars: ratingData[0].rating,
            text: ratingData[0].text || "",
          };
        } else {
          return {
            ...doctorInfo,
            rating: false,
            ratingId: 0,
            stars: 0,
            text: "",
          };
        }
      })
    );

    return NextResponse.json(uniqueDoctorsWithRatings);
  } catch (error) {
    console.error("Error fetching appointments and doctor ratings:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// =======================
// POST - 
// =======================
export async function POST(req: NextRequest) {
  // Verify JWT token
  const decodedOrResponse = await verifyAuthToken();
  if (decodedOrResponse instanceof NextResponse) {
    return decodedOrResponse;
  }
  const decoded = decodedOrResponse;
  const userId = Number(decoded.userId);

  try {
    // Find the patient ID associated with the logged-in user
    const patientData = await db
      .select({ id: patient.id })
      .from(patient)
      .where(eq(patient.userId, userId));

    if (!patientData.length) {
      return NextResponse.json(
        { error: "Patient profile not found for this user." },
        { status: 404 }
      );
    }

    const requiredPatientId = patientData[0].id;

    // Parse the JSON request body
    const ratingData = await req.json();

    if (ratingData.ratingid !== 0) {
      // Update existing rating
      const updatedRating = await db
        .update(doctor_ratings)
        .set({
          rating: ratingData.rating,
          text: ratingData.feedback,
        })
        .where(eq(doctor_ratings.id, ratingData.ratingid))
        .returning(); // Get the updated record, useful for confirmation

      if (updatedRating.length > 0) {
          return NextResponse.json({ message: "Rating updated successfully", updatedRating: updatedRating[0] });
      }
      else{
        return NextResponse.json({error: "Rating update failed.  Rating ID not found"}, {status: 400})
      }
      
    } else {
      // Create new rating
      const newRating = await db
        .insert(doctor_ratings)
        .values({
          patientid: requiredPatientId,
          doctorid: ratingData.doctorId, // Make sure you are sending doctorId from the client
          rating: ratingData.rating,
          text: ratingData.feedback,
        })
        .returning(); // Get the newly created record

      return NextResponse.json({ message: "Rating created successfully", newRating: newRating[0] });
    }
  } catch (error) {
    console.error("Error handling doctor rating:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
