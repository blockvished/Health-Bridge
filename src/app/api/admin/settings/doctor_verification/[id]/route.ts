// app/api/admin/settings/doctor_verification/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../../db/db'; // Adjust import path to your database connection
import { doctorVerificationDocuments } from '../../../../../../db/schema'; // Adjust import path to your schema
import { eq } from 'drizzle-orm';

interface RouteParams {
  params: {
    id: string;
  };
}

// DELETE - Delete a specific document by ID
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    
    console.log(`DELETE /api/admin/settings/doctor_verification/${id}`);

    // Validate ID
    const documentId = parseInt(id);
    if (isNaN(documentId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid document ID'
      }, { status: 400 });
    }

    // Check if document exists
    const existingDoc = await db
      .select()
      .from(doctorVerificationDocuments)
      .where(eq(doctorVerificationDocuments.id, documentId))
      .limit(1);

    if (existingDoc.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Document not found'
      }, { status: 404 });
    }

    // Delete the document
    const [deletedDoc] = await db
      .delete(doctorVerificationDocuments)
      .where(eq(doctorVerificationDocuments.id, documentId))
      .returning();

    console.log(`Deleted document: ${deletedDoc.name}`);

    return NextResponse.json({
      success: true,
      data: deletedDoc,
      message: 'Document deleted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete document'
    }, { status: 500 });
  }
}

// GET - Get a specific document by ID (optional - for individual document fetching)
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    
    console.log(`GET /api/admin/settings/doctor_verification/${id}`);

    // Validate ID
    const documentId = parseInt(id);
    if (isNaN(documentId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid document ID'
      }, { status: 400 });
    }

    // Fetch the document
    const document = await db
      .select()
      .from(doctorVerificationDocuments)
      .where(eq(doctorVerificationDocuments.id, documentId))
      .limit(1);

    if (document.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Document not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: document[0]
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch document'
    }, { status: 500 });
  }
}