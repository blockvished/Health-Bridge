// app/api/public/appointments/new/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('=== NEW REGISTRATION APPOINTMENT DATA ===');
    console.log('Full Request Body:', JSON.stringify(body, null, 2));
    
    // Extract booking data
    const {
      date,
      timeSlot,
      consultationMode,
      doctorId,
      clinicId,
      consultationFees,
      // Registration data
      name,
      email,
      phone,
      password
    } = body;
    
    // Parse time slot (format: "09:00-10:00")
    const [timeFrom, timeTo] = timeSlot.split('-');
    
    console.log('=== PARSED APPOINTMENT DATA ===');
    console.log({
      date,
      timeFrom,
      timeTo,
      mode: consultationMode,
      doctorId,
      clinicId: parseInt(clinicId),
      amount: consultationFees,
      // Patient registration data
      patientData: {
        name,
        email: email || null,
        phone,
        password
      }
    });
    
    // TODO: Implement actual logic
    // 1. Create new patient account
    // 2. Generate patientId
    // 3. Create appointment record
    // 4. Send confirmation
    
    return NextResponse.json({
      success: true,
      message: 'New appointment booking received',
      appointmentId: 'temp_' + Date.now(), // Temporary ID
      patientId: 'temp_patient_' + Date.now() // Temporary patient ID
    });
    
  } catch (error) {
    console.error('Error processing new appointment:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process appointment booking' 
      },
      { status: 500 }
    );
  }
}