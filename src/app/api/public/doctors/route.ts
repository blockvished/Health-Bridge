import { NextResponse } from 'next/server';
import { db } from '@../../../src/db/db';
import { doctor } from '@../../../src/db/schema';
import { eq } from 'drizzle-orm';

// GET all verified doctors
export async function GET() {
  try {
    const doctors = await db
      .select({
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.specialization,
        image_link: doctor.image_link,
        experience: doctor.experience,
      })
      .from(doctor)
      .where(eq(doctor.accountVerified, true));

    return NextResponse.json({ doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}
