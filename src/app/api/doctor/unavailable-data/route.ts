// \api\doctor\unavailable-data
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import {
  appointmentDays,
  appointmentTimeRanges,
  clinic,
  doctor,
  doctorConsultation,
  doctorEducation,
  doctorExperience,
} from "../../../../db/schema";
import db from "../../../../db/db";
import { verifyAuthToken } from "../../../lib/verify";

export async function GET() {
  // Verify JWT token
  const decodedOrResponse = await verifyAuthToken();
  if (decodedOrResponse instanceof NextResponse) {
    return decodedOrResponse;
  }
  const decoded = decodedOrResponse;
  const userId = Number(decoded.userId);

  // Fetch doctor information
  const doctorData = await db
    .select()
    .from(doctor)
    .where(eq(doctor.userId, userId));

  const requiredDoctorId = doctorData[0].id;

  let doctorInfoPage = false;

  const doctor_name = doctorData[0].name;
  const doctor_email = doctorData[0].email;
  const doctor_phone = doctorData[0].phone;
  const doctor_city = doctorData[0].city;
  const doctor_pincode = doctorData[0].pincode;
  const doctor_specialization = doctorData[0].specialization;
  const doctor_degree = doctorData[0].degree;
  const doctor_experience = doctorData[0].experience;
  const doctor_aboutSelf = doctorData[0].aboutSelf;
  const doctor_aboutClinic = doctorData[0].aboutClinic;
  const doctor_image_link = doctorData[0].image_link;
  const doctor_signature_link = doctorData[0].signature_link;

  const fields = [
    doctor_name,
    doctor_email,
    doctor_phone,
    doctor_city,
    doctor_pincode,
    doctor_specialization,
    doctor_degree,
    doctor_experience,
    doctor_aboutSelf,
    doctor_aboutClinic,
    doctor_image_link,
    doctor_signature_link,
  ];

  if (fields.some((field) => field === null || field === "")) {
    doctorInfoPage = true;
  }
  // fetch doctor edu, if empty items then set above as true
  let doctorEduPage = false;

  const Educations = await db
    .select()
    .from(doctorEducation)
    .where(eq(doctorEducation.doctorId, requiredDoctorId));

  if (
    Educations.length === 0 ||
    Educations.some((edu) =>
      [edu.title, edu.institution, edu.yearFrom, edu.yearTo, edu.details].some(
        (field) => field === null || field === ""
      )
    )
  ) {
    doctorEduPage = true;
  }

  // fetch doctor exp, if empty items then set above as true
  let doctorExpPage = false;

  const Experience = await db
    .select()
    .from(doctorExperience)
    .where(eq(doctorExperience.doctorId, requiredDoctorId));

  if (
    Experience.length === 0 ||
    Experience.some((ex) =>
      [ex.title, ex.organization, ex.yearFrom, ex.yearTo, ex.details].some(
        (field) => field === null || field === ""
      )
    )
  ) {
    doctorExpPage = true;
  }
  let doctorSchedulePage = false;

  // Fetch days
  const days = await db
    .select()
    .from(appointmentDays)
    .where(eq(appointmentDays.doctorId, requiredDoctorId));

  // Attach time ranges for each day
  const result = await Promise.all(
    days.map(async (day) => {
      if (!day.isActive) {
        return { ...day, times: [] };
      }

      const timeRanges = await db
        .select({
          from: appointmentTimeRanges.startTime,
          to: appointmentTimeRanges.endTime,
        })
        .from(appointmentTimeRanges)
        .where(eq(appointmentTimeRanges.dayId, day.id));

      return {
        ...day,
        times: timeRanges.map(({ from, to }) => ({ from, to })),
      };
    })
  );

  // Set doctorSchedulePage to true only if **all** are inactive
  if (result.every((day) => day.isActive === false)) {
    doctorSchedulePage = true;
  }

  let doctorConsultDetailPage = false;

  const consultationSettings = await db
    .select()
    .from(doctorConsultation)
    .where(eq(doctorConsultation.doctorId, requiredDoctorId));

  if (
    consultationSettings.length === 0 || // No entries at all
    !consultationSettings[0].consultationFees || // null, 0, or empty
    consultationSettings[0].mode === null ||
    consultationSettings[0].consultationLink === null ||
    consultationSettings[0].consultationLink === ""
  ) {
    doctorConsultDetailPage = true;
  }

  let doctorClinicPage = false;

  const clinicsData = await db
    .select({
      name: clinic.name,
      imageLink: clinic.imageLink,
      department: clinic.department,
      appointmentLimit: clinic.appointmentLimit,
      address: clinic.address,
      active: clinic.active,
    })
    .from(clinic)
    .where(eq(clinic.doctorId, requiredDoctorId));

  if (!clinicsData.length) {
    doctorClinicPage = true
  } 
  try {
    return NextResponse.json({
      doctorInfoPage: doctorInfoPage,
      doctorEduPage: doctorEduPage,
      doctorExpPage: doctorExpPage,
      doctorSchedulePage: doctorSchedulePage,
      doctorConsultDetailPage: doctorConsultDetailPage,
      doctorClinicPage: doctorClinicPage,
    });
  } catch (error) {
    console.error("Some Error:", error);
    return NextResponse.json({ error: "Some Error" }, { status: 500 });
  }
}
