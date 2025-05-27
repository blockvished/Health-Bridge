import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../db/db'; // Adjust import path to your database connection
import { doctorVerificationDocuments } from '../../../../../db/schema'; // Adjust import path to your schema
import { eq } from 'drizzle-orm';

// GET - Fetch all doctor verification documents
export async function GET() {
  try {    
    const documents = await db
      .select()
      .from(doctorVerificationDocuments)
    
    return NextResponse.json({
      success: true,
      data: documents
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch documents'
    }, { status: 500 });
  }
}

// PUT - Bulk update/create documents
export async function PUT(request: NextRequest) {
  try {    
    const body = await request.json();
    const { documents } = body;

    if (!documents || !Array.isArray(documents)) {
      return NextResponse.json({
        success: false,
        error: 'Documents array is required'
      }, { status: 400 });
    }

    // Validate documents
    for (const doc of documents) {
      if (!doc.name || typeof doc.name !== 'string' || doc.name.trim() === '') {
        return NextResponse.json({
          success: false,
          error: 'All documents must have a valid name'
        }, { status: 400 });
      }
    }

    // Get all existing documents
    const existingDocs = await db
      .select()
      .from(doctorVerificationDocuments);

    const results = [];
    
    for (const doc of documents) {
      const trimmedName = doc.name.trim();
      
      if (doc.id) {
        // Update existing document
        console.log(`Updating document with id: ${doc.id}`);
        
        const [updatedDoc] = await db
          .update(doctorVerificationDocuments)
          .set({ name: trimmedName })
          .where(eq(doctorVerificationDocuments.id, doc.id))
          .returning();
        
        if (updatedDoc) {
          results.push(updatedDoc);
          console.log(`Updated document: ${updatedDoc.name}`);
        }
      } else {
        // Check if document with same name already exists
        const existingDoc = existingDocs.find(existing => 
          existing.name.toLowerCase() === trimmedName.toLowerCase()
        );
        
        if (existingDoc) {
          console.log(`Document already exists: ${trimmedName}`);
          results.push(existingDoc);
        } else {
          // Create new document
          console.log(`Creating new document: ${trimmedName}`);
          
          const [newDoc] = await db
            .insert(doctorVerificationDocuments)
            .values({ name: trimmedName })
            .returning();
          
          if (newDoc) {
            results.push(newDoc);
            console.log(`Created document: ${newDoc.name}`);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
      message: `Successfully processed ${results.length} documents`
    }, { status: 200 });

  } catch (error) {
    console.error('Error in bulk update/create:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update documents'
    }, { status: 500 });
  }
}

// POST - Create a single new document
export async function POST(request: NextRequest) {
  try {    
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({
        success: false,
        error: 'Document name is required'
      }, { status: 400 });
    }

    const trimmedName = name.trim();

    // Check if document already exists
    const existingDoc = await db
      .select()
      .from(doctorVerificationDocuments)
      .where(eq(doctorVerificationDocuments.name, trimmedName))
      .limit(1);

    if (existingDoc.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'A document with this name already exists'
      }, { status: 409 });
    }

    // Create new document
    const [newDoc] = await db
      .insert(doctorVerificationDocuments)
      .values({ name: trimmedName })
      .returning();

    console.log(`Created new document: ${newDoc.name}`);

    return NextResponse.json({
      success: true,
      data: newDoc,
      message: 'Document created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create document'
    }, { status: 500 });
  }
}