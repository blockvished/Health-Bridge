import { NextResponse } from 'next/server';
import { registerUser } from '../../lib/auth'; // Adjust the import path

export async function POST(request: Request) {
  try {
    const { name, email, password, phone, role } = await request.json();

    const registrationResult = await registerUser(name, email, password, phone, role);

    if (registrationResult.success) {
      return NextResponse.json({ message: registrationResult.message }, { status: 201 });
    } else {
      return NextResponse.json({ error: registrationResult.message }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}