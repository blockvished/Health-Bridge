import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Sends an email using Gmail SMTP.
 *
 * @param to - Recipient email address.
 * @param text - Email body (plain text).
 * @param subject - Optional subject (defaults to 'Test Email from Node.js').
 */
export async function sendEmail(
  to: string,
  text: string,
  subject: string = 'Test Email from Node.js',
  html?: string // Optional HTML version
): Promise<void> {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error('Missing EMAIL_USER or EMAIL_PASS in .env');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: `"Live Doctors India" <${user}>`,
    to,
    subject,
    text,
    ...(html && { html }), // Include HTML if provided
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.response);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
}
