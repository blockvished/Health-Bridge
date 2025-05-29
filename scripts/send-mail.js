require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL/TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

const mailOptions = {
  from: `"Live Doctors India" <${process.env.EMAIL_USER}>`,
  to: 'postpostman123@gmail.com', // Change to the real recipient
  subject: 'Test Email from Node.js',
  text: 'Hello! This is a test email using Gmail SMTP and Node.js.',
  // html: '<b>Hello! This is a test email.</b>' // Optional: HTML content
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.error('Error sending email:', error);
  }
  console.log('Email sent successfully:', info.response);
});
