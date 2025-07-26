const nodemailer = require('nodemailer');

// Log email configuration
console.log('📧 Email Configuration:');
console.log('   Transactional Emails: Gmail SMTP (Temporary)');
console.log('   Marketing Emails: SendMails.io API');
console.log('   Status: Ready for instant transactional email delivery');

// Generate OTP function
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Gmail SMTP Configuration (Temporary for production)
const createGmailTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'onboarding.gooofit@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'yabi ffau orlt lguq'
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

/**
 * Send welcome email using Gmail SMTP for instant delivery
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient name
 * @returns {Promise<Object>} API response
 */
async function sendWelcomeEmail(to, name) {
  try {
    console.log('📧 Sending welcome email via Gmail SMTP...');
    
    const transporter = createGmailTransporter();
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to GoooFit</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        </style>
      </head>
      <body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Header with gradient -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">🎉 Welcome to GoooFit!</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Your Health Journey Starts Here</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Hi ${name || 'there'}! 👋</h2>
            
            <p style="color: #4b5563; margin: 0 0 20px 0; font-size: 16px;">
              Thank you for joining GoooFit! We're excited to be part of your health and fitness journey. 
              Get ready to transform your life with our comprehensive health tools and personalized insights.
            </p>
            
            <!-- Features -->
            <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 12px; padding: 30px; margin: 30px 0;">
              <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">🚀 What you can do with GoooFit:</h3>
              <ul style="color: #4b5563; margin: 0; padding-left: 20px; font-size: 16px;">
                <li style="margin-bottom: 10px;"><strong>📊 Track Progress:</strong> Monitor your weight and health metrics</li>
                <li style="margin-bottom: 10px;"><strong>🧮 Health Calculators:</strong> BMI, Calories, Body Fat, BMR, and more</li>
                <li style="margin-bottom: 10px;"><strong>💡 Smart Insights:</strong> Get personalized recommendations</li>
                <li style="margin-bottom: 10px;"><strong>👥 Community:</strong> Join health enthusiasts worldwide</li>
                <li style="margin-bottom: 0;"><strong>🎯 Goal Setting:</strong> Set and achieve your fitness targets</li>
              </ul>
            </div>
            
            <!-- Action Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://gooofit.com" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(102, 126, 234, 0.3); transition: all 0.3s ease;">Start Your Journey</a>
            </div>
            
            <p style="color: #6b7280; margin: 30px 0 0 0; font-size: 14px;">
              Ready to transform your health? Start by exploring our health calculators and tracking your progress!
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">Best regards,</p>
            <p style="color: #6b7280; margin: 0; font-size: 14px;">The GoooFit Team 💪</p>
            <div style="margin-top: 20px;">
              <a href="https://gooofit.com" style="color: #667eea; text-decoration: none; font-size: 14px; font-weight: 500;">gooofit.com</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'onboarding.gooofit@gmail.com',
      to: to,
      subject: 'Welcome to GoooFit! 🎉',
      html: html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully via Gmail SMTP');
    console.log('   Message ID:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
      method: 'Gmail SMTP (Temporary)'
    };
    
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Send password reset email using Gmail SMTP for instant delivery
 * @param {string} to - Recipient email address
 * @param {string} resetToken - Password reset token
 * @param {string} name - Recipient name (optional)
 * @returns {Promise<Object>} API response
 */
async function sendPasswordResetEmail(to, resetToken, name = 'User') {
  try {
    console.log('📧 Sending password reset email via Gmail SMTP...');
    
    const transporter = createGmailTransporter();
    
    // Use OTP instead of token for better UX
    const resetUrl = `${process.env.CLIENT_URL || 'https://gooofit.com'}/reset-password?otp=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset - GoooFit</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        </style>
      </head>
      <body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Header with gradient -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">🔐 Password Reset</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">GoooFit - Your Health Journey</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Hi ${name || 'there'}! 👋</h2>
            
            <p style="color: #4b5563; margin: 0 0 20px 0; font-size: 16px;">
              We received a request to reset your password for your GoooFit account. 
              To keep your account secure, we've generated a verification code for you.
            </p>
            
            <!-- OTP Display -->
            <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
              <p style="color: #6b7280; margin: 0 0 15px 0; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
              <div style="background: white; border-radius: 8px; padding: 20px; display: inline-block; border: 2px solid #e5e7eb;">
                <span style="font-size: 32px; font-weight: 700; color: #1f2937; letter-spacing: 4px; font-family: 'Courier New', monospace;">${resetToken}</span>
              </div>
            </div>
            
            <!-- Action Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(102, 126, 234, 0.3); transition: all 0.3s ease;">Reset Password Now</a>
            </div>
            
            <!-- Security Notice -->
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 0 8px 8px 0; margin: 30px 0;">
              <p style="color: #92400e; margin: 0; font-size: 14px; font-weight: 500;">
                🔒 <strong>Security Notice:</strong> This verification code will expire in 1 hour for your security.
              </p>
            </div>
            
            <p style="color: #6b7280; margin: 30px 0 0 0; font-size: 14px;">
              If you didn't request this password reset, please ignore this email. 
              Your account security is important to us.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">Best regards,</p>
            <p style="color: #6b7280; margin: 0; font-size: 14px;">The GoooFit Team 💪</p>
            <div style="margin-top: 20px;">
              <a href="https://gooofit.com" style="color: #667eea; text-decoration: none; font-size: 14px; font-weight: 500;">gooofit.com</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'onboarding.gooofit@gmail.com',
      to: to,
      subject: 'Password Reset Request - GoooFit',
      html: html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully via Gmail SMTP');
    console.log('   Message ID:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
      method: 'Gmail SMTP (Temporary)'
    };
    
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Send registration notification email using Gmail SMTP for instant delivery
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient name
 * @returns {Promise<Object>} API response
 */
async function sendRegistrationNotificationEmail(to, name) {
  try {
    console.log('📧 Sending registration notification email via Gmail SMTP...');
    
    const transporter = createGmailTransporter();
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New User Registration - GoooFit</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2c5aa0;">New User Registration</h1>
          <p>A new user has registered on GoooFit:</p>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${to}</li>
            <li><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</li>
          </ul>
          <p>Welcome them to the GoooFit community!</p>
          <p>Best regards,<br>GoooFit System</p>
        </div>
      </body>
      </html>
    `;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'onboarding.gooofit@gmail.com',
      to: to,
      subject: 'New User Registration - GoooFit',
      html: html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Registration notification email sent successfully via Gmail SMTP');
    console.log('   Message ID:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
      method: 'Gmail SMTP (Temporary)'
    };
    
  } catch (error) {
    console.error('❌ Failed to send registration notification email:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Send generic email using Gmail SMTP for instant delivery
 * @param {Object} emailData - Email data object
 * @returns {Promise<Object>} API response
 */
async function sendEmail(emailData) {
  try {
    console.log('📧 Sending generic email via Gmail SMTP...');
    
    const transporter = createGmailTransporter();
    
    const mailOptions = {
      from: emailData.from || process.env.EMAIL_USER || 'onboarding.gooofit@gmail.com',
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Generic email sent successfully via Gmail SMTP');
    console.log('   Message ID:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
      method: 'Gmail SMTP (Temporary)'
    };
    
  } catch (error) {
    console.error('❌ Failed to send generic email:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Test email service (Gmail SMTP only)
 * @returns {Promise<Object>} Test result
 */
async function testEmailService() {
  try {
    console.log('🧪 Testing email service (Gmail SMTP)...');
    
    // Test Gmail SMTP
    console.log('1️⃣ Testing Gmail SMTP...');
    const transporter = createGmailTransporter();
    const smtpTest = await transporter.verify();
    console.log('   SMTP Test:', smtpTest ? '✅ SUCCESS' : '❌ FAILED');
    
    return {
      success: smtpTest,
      smtp: { success: smtpTest },
      message: 'Email service test completed (Gmail SMTP only)'
    };
    
  } catch (error) {
    console.error('❌ Error testing email service:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendRegistrationNotificationEmail,
  sendEmail,
  testEmailService,
  generateOTP
}; 