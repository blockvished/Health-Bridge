import { sendEmail } from './emailSender';

(async () => {
  try {
    const to = 'postpostman123@gmail.com';
    const subject = 'Email Verification Code';
    const html = `<p>This is your OTP for email verification: <strong>240950</strong></p>`;
    const text = 'This is your OTP for email verification: 240950';

    await sendEmail(to, text, subject, html);
  } catch (err) {
    console.error('Email sending failed:', (err as Error).message);
  }
})();
