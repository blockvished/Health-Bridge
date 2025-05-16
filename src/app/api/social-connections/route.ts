// app/api/social-connections/route.ts
import { db } from '../../../db/db';
import { socialConnections } from '../../../db/schema';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { platform, account } = await req.json();

  // Upsert: remove existing then insert
  await db.delete(socialConnections)
    .where(
      socialConnections.userId.eq(session.user.id).and(
        socialConnections.platform.eq(platform)
      )
    );

  await db.insert(socialConnections).values({
    userId: session.user.id,
    platform,
    account,
    autoposting: false,
  });

  return NextResponse.json({ success: true });
}
