const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendCredentials = async (email, username, password) => {
  try {
    if (!email) {
      throw new Error('Email address is required');
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Library Management System - Your Credentials',
      html: `
        <h1>Welcome to Library Management System</h1>
        <p>Your credentials:</p>
        <p>Username: ${username}</p>
        <p>Password: ${password}</p>
        <p>Please change your password after first login.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};

module.exports = { sendCredentials }; 