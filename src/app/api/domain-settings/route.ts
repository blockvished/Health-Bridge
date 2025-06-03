// app/api/domain-settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/../../src/db/db'; // Your Drizzle database instance
import { customDomainSettings } from '@/../../src/db/schema';
import { eq } from 'drizzle-orm';

// GET - Retrieve the custom domain settings
export async function GET() {
  try {
    // Get the first (and only) record
    const settings = await db.select().from(customDomainSettings).limit(1);
    
    if (settings.length === 0) {
      // If no settings exist, create default settings
      const defaultSettings = await db.insert(customDomainSettings).values({}).returning();
      return NextResponse.json(defaultSettings[0]);
    }
    
    return NextResponse.json(settings[0]);
  } catch (error) {
    console.error('Error fetching custom domain settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch custom domain settings' },
      { status: 500 }
    );
  }
}

// POST - Save or update the custom domain settings
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'title', 'shortDetails', 'details', 'serverIp',
      'type1', 'host1', 'value1', 'ttl1',
      'type2', 'host2', 'value2', 'ttl2'
    ];
    
    for (const field of requiredFields) {
      if (data[field] === undefined) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Check if settings already exist
    const existingSettings = await db.select().from(customDomainSettings).limit(1);
    
    if (existingSettings.length === 0) {
      // Create new settings
      const newSettings = await db.insert(customDomainSettings).values({
        title: data.title,
        shortDetails: data.shortDetails,
        details: data.details,
        serverIp: data.serverIp,
        type1: data.type1,
        host1: data.host1,
        value1: data.value1,
        ttl1: data.ttl1,
        type2: data.type2,
        host2: data.host2,
        value2: data.value2,
        ttl2: data.ttl2,
        updatedAt: new Date(),
      }).returning();
      
      return NextResponse.json(newSettings[0]);
    } else {
      // Update existing settings
      const updatedSettings = await db
        .update(customDomainSettings)
        .set({
          title: data.title,
          shortDetails: data.shortDetails,
          details: data.details,
          serverIp: data.serverIp,
          type1: data.type1,
          host1: data.host1,
          value1: data.value1,
          ttl1: data.ttl1,
          type2: data.type2,
          host2: data.host2,
          value2: data.value2,
          ttl2: data.ttl2,
          updatedAt: new Date(),
        })
        .where(eq(customDomainSettings.id, existingSettings[0].id))
        .returning();
      
      return NextResponse.json(updatedSettings[0]);
    }
  } catch (error) {
    console.error('Error saving custom domain settings:', error);
    return NextResponse.json(
      { error: 'Failed to save custom domain settings' },
      { status: 500 }
    );
  }
}