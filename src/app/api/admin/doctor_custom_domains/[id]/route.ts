// app/api/admin/doctor_custom_domains/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@../../../src/db/db'; // Adjust import path as needed
import { doctorWebsiteDetails } from '@../../../src/db/schema'; // Adjust import path as needed
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const domainId = parseInt(id, 10);
    const body = await request.json();
    const { currentDomain, status } = body;

    
    // Validate required fields
    if (!currentDomain || !status) {
      return NextResponse.json(
        { error: 'Current domain and status are required' },
        { status: 400 }
      );
    }
    
    // Validate status enum (adjust values based on your websiteStatusEnum)
    const validStatuses = ['active', 'inactive'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    console.log(id, domainId, currentDomain, status.toLowerCase())
  
    // Check if record exists
    const existingRecord = await db
      .select()
      .from(doctorWebsiteDetails)
      .where(eq(doctorWebsiteDetails.id, domainId))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json(
        { error: 'Domain request not found' },
        { status: 404 }
      );
    }

    // Update the record
    const updatedRecord = await db
      .update(doctorWebsiteDetails)
      .set({
        currentUrl: currentDomain,
        status: status.toLowerCase(),
      })
      .where(eq(doctorWebsiteDetails.id, domainId))
      .returning();

    if (updatedRecord.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update domain request' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Domain request updated successfully',
        data: updatedRecord[0]
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating domain request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
