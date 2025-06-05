import { NextRequest, NextResponse } from "next/server";
import {
  doctor,
  doctorConsultation,
  doctorEducation,
} from "../../../../../db/schema";
import { eq, ilike } from "drizzle-orm";
import db from "../../../../../db/db";

type RouteParams = {
  params: Promise<{
    name: string;
  }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Unwrap the params Promise
    const resolvedParams = await params;
    const { name } = resolvedParams;

    // Console log all received data
    console.log("=== API Route Called ===");
    console.log("Received name parameter:", name);
    console.log("Request URL:", request.url);
    console.log("Request method:", request.method);
    console.log(
      "Request headers:",
      Object.fromEntries(request.headers.entries())
    );
    console.log(
      "Search params:",
      Object.fromEntries(request.nextUrl.searchParams.entries())
    );
    console.log("========================");

    // Decode the name (convert john-smith to john smith)
    const decodedName = decodeURIComponent(name).replace(/-/g, " ");

    const doctorData = await db
      .select({
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.specialization,
        degree: doctor.degree,
        aboutSelf: doctor.aboutSelf,
        experience: doctor.experience,
        image: doctor.image_link,
      })
      .from(doctor)
      .where(ilike(doctor.name, `%${decodedName}%`))
      .limit(1);

    if (!doctorData || doctorData.length === 0) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    const reqDoctorId = doctorData[0].id;

    const consultationDataSettings = await db
      .select()
      .from(doctorConsultation)
      .where(eq(doctorConsultation.doctorId, reqDoctorId))
      .limit(1);

    const doctorEducations = await db
      .select()
      .from(doctorEducation)
      .where(eq(doctorEducation.doctorId, reqDoctorId));

    console.log("Doctor :", doctorEducations);

    // Return both doctor and consultation data
    const responseData = {    
      doctor: doctorData[0], // Return the first (and only) doctor
      consultation:
        consultationDataSettings.length > 0
          ? consultationDataSettings[0]
          : null, // Return consultation if exists, null
      educations: doctorEducations,
    };

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("=== API Error ===");
    console.error("Error in doctor API:", error);
    console.error("================");

    return NextResponse.json(
      { error: "Failed to fetch doctor data" },
      { status: 500 }
    );
  }
}

//  edu/exp
//  monday-sunday open or close, consultation dates and time,  fee
//  online  allow?
