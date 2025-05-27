// app/api/zoom-settings/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../db/db'; // Adjust import path to your database connection
import { zoomConfig } from '../../../../../db/schema'; // Adjust import path to your schema
import { eq } from 'drizzle-orm';


// GET - Fetch zoom settings
export async function GET() {
  try {
    const settings = await db
      .select()
      .from(zoomConfig)
      .where(eq(zoomConfig.singletonId, 'singleton'))
      .limit(1);

    if (settings.length === 0) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No zoom settings found'
      });
    }

    // Don't expose the full client secret in the response
    const settingsData = {
      ...settings[0],
      zoomClientSecret: settings[0].zoomClientSecret
    };

    return NextResponse.json({
      success: true,
      data: settingsData,
      message: 'Zoom settings retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching zoom settings:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch zoom settings'
      },
      { status: 500 }
    );
  }
}

// POST - Create or update zoom settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { zoomAccountId, zoomClientId, zoomClientSecret } = body;

    // Validate required fields
    if (!zoomAccountId || !zoomClientId || !zoomClientSecret) {
      return NextResponse.json(
        {
          success: false,
          error: 'All zoom settings fields are required'
        },
        { status: 400 }
      );
    }

    // Check if settings already exist
    const existingSettings = await db
      .select()
      .from(zoomConfig)
      .where(eq(zoomConfig.singletonId, 'singleton'))
      .limit(1);

    let result;
    
    if (existingSettings.length > 0) {
      // Update existing settings
      result = await db
        .update(zoomConfig)
        .set({
          zoomAccountId,
          zoomClientId,
          zoomClientSecret,
          updatedAt: new Date()
        })
        .where(eq(zoomConfig.singletonId, 'singleton'))
        .returning();
    } else {
      // Create new settings
      result = await db
        .insert(zoomConfig)
        .values({
          singletonId: 'singleton',
          zoomAccountId,
          zoomClientId,
          zoomClientSecret
        })
        .returning();
    }

    // Don't expose the full client secret in the response
    const responseData = {
      ...result[0],
      zoomClientSecret: '****************'
    };

    return NextResponse.json({
      success: true,
      data: responseData,
      message: existingSettings.length > 0 
        ? 'Zoom settings updated successfully' 
        : 'Zoom settings created successfully'
    });

  } catch (error) {
    console.error('Error saving zoom settings:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save zoom settings'
      },
      { status: 500 }
    );
  }
}