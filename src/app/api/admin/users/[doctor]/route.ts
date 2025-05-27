import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import path from 'path';
import { db } from '../../../../../db/db'; // Your Drizzle ORM instance
import { doctor, doctorEducation, doctorExperience } from '../../../../../db/schema'; // Your table schemas
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { doctor: string } }
) {
  const doctorId = Number(params.doctor);

  if (isNaN(doctorId)) {
    return NextResponse.json({ error: 'Invalid doctor ID' }, { status: 400 });
  }

  try {
    // Fetch doctor basic info
    const doctorInfo = await db
      .select()
      .from(doctor)
      .where(eq(doctor.id, doctorId))
      .limit(1)
      .then(res => res[0] ?? null);

    if (!doctorInfo) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Fetch education and experience for this doctor
    const educations = await db
      .select()
      .from(doctorEducation)
      .where(eq(doctorEducation.doctorId, doctorId));

    const experiences = await db
      .select()
      .from(doctorExperience)
      .where(eq(doctorExperience.doctorId, doctorId));

    // Read verification files from the file system
    const folderPath = path.join(
      process.cwd(),
      'private_uploads',
      'verification_docs',
      String(doctorId)
    );

    let verificationFiles: string[] = [];
    try {
      verificationFiles = await readdir(folderPath);
    } catch (err: any) {
      if (err.code !== 'ENOENT') {
        console.error('Error reading verification files:', err);
        return NextResponse.json(
          { error: 'Failed to list verification files.' },
          { status: 500 }
        );
      }
      // If folder doesn't exist, assume no files
      verificationFiles = [];
    }

    // Return aggregated data
    return NextResponse.json({
      doctor: doctorInfo,
      education: educations,
      experience: experiences,
      verificationFiles,
    });
  } catch (error) {
    console.error('Error fetching doctor data:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
