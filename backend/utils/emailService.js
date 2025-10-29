const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Create transporter (using Gmail for demo - you can configure with your email service)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Generate 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Campus Connect - Email Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Campus Connect</h2>
          <h3>Email Verification</h3>
          <p>Thank you for registering with Campus Connect! Please use the following OTP to verify your email address:</p>
          <div style="background-color: #F3F4F6; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #4F46E5; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
          <hr style="margin: 20px 0;">
          <p style="color: #6B7280; font-size: 12px;">Campus Connect - Student Marketplace</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Campus Connect - Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Campus Connect</h2>
          <h3>Password Reset Request</h3>
          <p>You requested to reset your password. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <hr style="margin: 20px 0;">
          <p style="color: #6B7280; font-size: 12px;">Campus Connect - Student Marketplace</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendPasswordResetEmail,
  // Best-effort email for new chat
  sendNewChatEmail: async (receiverUserId, buyerName) => {
    try {
      const User = require('../models/User');
      const user = await User.findById(receiverUserId);
      if (!user || !user.email) return;
      const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: user.email,
        subject: 'New message request on Campus Connect',
        html: `<p>Hi ${user.name || 'there'},</p>
               <p><strong>${buyerName}</strong> just texted you on Campus Connect.</p>
               <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/messages" target="_blank">Open messages</a> to view and accept the chat request.</p>`
      };
      await transporter.sendMail(mailOptions);
    } catch (e) {
      // ignore email errors in dev
    }
  }
};
