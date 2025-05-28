import { NextResponse } from 'next/server';
import { db } from '@/../db/db';
import { payoutSettings } from '@/../db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  // Get singleton payout settings
  const settings = await db
    .select()
    .from(payoutSettings)
    .where(eq(payoutSettings.singletonId, 'singleton'))
    .limit(1);

  if (settings.length === 0) {
    return NextResponse.json({ error: 'Payout settings not found' }, { status: 404 });
  }

  return NextResponse.json(settings[0]);
}

export async function POST(request: Request) {
  const body = await request.json();

  // Validate input, can add more validation if needed
  const {
    minimumPayoutAmount,
    commissionRate,
  } = body;

  if (
    typeof minimumPayoutAmount !== 'number' ||
    minimumPayoutAmount < 0 ||
    typeof commissionRate !== 'number' ||
    commissionRate < 1 ||
    commissionRate > 99
  ) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  // Check if settings exist
  const existingSettings = await db
    .select()
    .from(payoutSettings)
    .where(eq(payoutSettings.singletonId, 'singleton'))
    .limit(1);

  if (existingSettings.length === 0) {
    // Create
    await db
      .insert(payoutSettings)
      .values({
        singletonId: 'singleton',
        minimumPayoutAmount: minimumPayoutAmount.toFixed(2),
        commissionRate: commissionRate.toFixed(2),
      });
  } else {
    // Update
    await db
      .update(payoutSettings)
      .set({
        minimumPayoutAmount: minimumPayoutAmount.toFixed(2),
        commissionRate: commissionRate.toFixed(2),
      })
      .where(eq(payoutSettings.singletonId, 'singleton'));
  }

  return NextResponse.json({ message: 'Payout settings saved successfully' });
}
