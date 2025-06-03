import { db } from '@/../../src/db/db'; // Adjust import path as needed
import { doctorWebsiteDetails, doctor } from '@/../../src/db/schema'; // Adjust import path as needed
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const domainRequests = await db
      .select({
        id: doctorWebsiteDetails.id,
        currentUrl: doctorWebsiteDetails.currentUrl,
        customDomain: doctorWebsiteDetails.customDomain,
        status: doctorWebsiteDetails.status,
        createdAt: doctorWebsiteDetails.createdAt,
        doctorId: doctorWebsiteDetails.doctorId,
      })
      .from(doctorWebsiteDetails)
      .leftJoin(doctor, eq(doctorWebsiteDetails.doctorId, doctor.id))
      .orderBy(doctorWebsiteDetails.createdAt);

    const formattedData = domainRequests.map((request) => ({
      id: request.id,
      currentDomain: request.currentUrl,
      customDomain: request.customDomain || 'Not set',
      date: request.createdAt.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      status: request.status.charAt(0).toUpperCase() + request.status.slice(1),
      action: '...'
    }));

    return Response.json(formattedData);
  } catch (error) {
    console.error('Error fetching domain requests:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
