import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      mailHost,
      mailPort,
      mailUsername,
      mailPassword,
      mailEncryption,
      mailTitle
    } = body;

    // Validate required fields
    if (!mailHost || !mailPort || !mailUsername || !mailPassword) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields for test email: mailHost, mailPort, mailUsername, mailPassword' 
        },
        { status: 400 }
      );
    }

    // Validate encryption type
    if (mailEncryption && !['TLS', 'SSL'].includes(mailEncryption)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Mail encryption must be either TLS or SSL' 
        },
        { status: 400 }
      );
    }

    const portNumber = typeof mailPort === 'number' ? mailPort : parseInt(mailPort);

    // Ensure encryption type matches correct port
    if (mailEncryption === 'TLS' && portNumber !== 587) {
      return NextResponse.json(
        { success: false, message: 'TLS encryption requires port 587' },
        { status: 400 }
      );
    }

    if (mailEncryption === 'SSL' && portNumber !== 465) {
      return NextResponse.json(
        { success: false, message: 'SSL encryption requires port 465' },
        { status: 400 }
      );
    }

    const transporterConfig = {
      host: mailHost,
      port: portNumber,
      secure: mailEncryption === 'SSL', // true for SSL
      auth: {
        user: mailUsername,
        pass: mailPassword,
      },
      tls: {
        rejectUnauthorized: false // allow self-signed or invalid certs
      }
    };

    console.log('Creating email transporter with config:', {
      host: mailHost,
      port: portNumber,
      secure: transporterConfig.secure,
      encryption: mailEncryption
    });

    const transporter = nodemailer.createTransport(transporterConfig);

    // Verify connection
    console.log('Verifying email configuration...');
    await transporter.verify();
    console.log('Email configuration verified successfully');

    // Send test email
    const testEmailOptions = {
      from: mailUsername,
      to: "postpostman123@gmail.com", // Replace with a test inbox
      subject: 'Test Email - ' + (mailTitle || 'Email Configuration Test'),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">✅ Email Configuration Test</h2>
          <p>This is a test email to verify your email configuration is working correctly.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #28a745;">Configuration Details:</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Host:</strong> ${mailHost}</li>
              <li><strong>Port:</strong> ${mailPort}</li>
              <li><strong>Encryption:</strong> ${mailEncryption}</li>
              <li><strong>Username:</strong> ${mailUsername}</li>
            </ul>
          </div>
          <p style="margin-top: 20px; color: #666; font-size: 14px;">
            🎉 If you received this email, your email configuration is working properly!
          </p>
          <p style="margin-top: 10px; color: #999; font-size: 12px;">
            Test sent at: ${new Date().toLocaleString()}
          </p>
        </div>
      `,
      text: `
Email Configuration Test

This is a test email to verify your email configuration is working correctly.

Configuration Details:
- Host: ${mailHost}
- Port: ${mailPort}
- Encryption: ${mailEncryption}
- Username: ${mailUsername}

If you received this email, your email configuration is working properly!
Test sent at: ${new Date().toLocaleString()}
      `
    };

    console.log('Sending test email...');
    await transporter.sendMail(testEmailOptions);
    console.log('Test email sent successfully');

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${mailUsername}`
    });

  } catch (error) {
    console.error('Error sending test email:', error);
    
    let errorMessage = 'Failed to send test email';

    if (error instanceof Error) {
      if (error.message.includes('EAUTH') || error.message.includes('Invalid login')) {
        errorMessage = 'Authentication failed. Please check your username and password.';
      } else if (error.message.includes('ECONNECTION') || error.message.includes('ETIMEDOUT')) {
        errorMessage = 'Connection failed. Please check your host and port settings.';
      } else if (error.message.includes('ESOCKET')) {
        errorMessage = 'Connection error. Please verify your host and port settings.';
      } else if (error.message.includes('ENOTFOUND')) {
        errorMessage = 'Host not found. Please verify your mail host setting.';
      } else if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Connection refused. Please check your host and port settings.';
      } else {
        errorMessage = `Email error: ${error.message}`;
      }
    }

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
