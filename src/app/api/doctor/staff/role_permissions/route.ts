import { db } from '../../../../../db/db'; 
import { permissionTypes } from  '../../../../../db/schema'; 
import { NextResponse } from 'next/server';

export async function GET() {
    try {
      const permissions = await db
        .select({
          id: permissionTypes.id,
          name: permissionTypes.name,
          description: permissionTypes.description,
        })
        .from(permissionTypes);
  
      return NextResponse.json(permissions, { status: 200 });
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch role permissions' },
        { status: 500 }
      );
    }
  }
  