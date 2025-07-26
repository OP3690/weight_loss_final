const nodemailer = require('nodemailer');
const sendMailsService = require('./sendMailsService');

// Log email configuration
console.log('📧 Email Configuration:');
console.log('   Primary: SendMails.io API');
console.log('   Fallback: GoDaddy SMTP');
console.log('   Status: Ready to send emails automatically');

// GoDaddy SMTP Configuration (Fallback)
const createGoDaddyTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtpout.secureserver.net',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER || 'support@gooofit.com',
      pass: process.env.EMAIL_PASSWORD || 'Fortune$$336699'
    },
    tls: {
      rejectUnauthorized: false,
      ciphers: 'SSLv3'
    },
    debug: true,
    logger: true,
    requireTLS: true,
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000
  });
};

/**
 * Send welcome email using SendMails.io API with SMTP fallback
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient name
 * @returns {Promise<Object>} API response
 */
async function sendWelcomeEmail(to, name) {
  try {
    console.log('📧 Sending welcome email...');
    
    // Try SendMails.io API first
    try {
      console.log('   Trying SendMails.io API...');
      const result = await sendMailsService.sendWelcomeEmail(to, name);
      
      if (result.success) {
        console.log('✅ Welcome email sent successfully via SendMails.io API');
        return result;
      }
    } catch (apiError) {
      console.log('   ❌ SendMails.io API failed, trying SMTP fallback...');
    }
    
    // Fallback to GoDaddy SMTP
    console.log('   Using GoDaddy SMTP fallback...');
    const transporter = createGoDaddyTransporter();
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to GoooFit</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2c5aa0;">Welcome to GoooFit! 🎉</h1>
          <p>Hi ${name},</p>
          <p>Thank you for joining GoooFit! We're excited to help you on your health and fitness journey.</p>
          <p>With GoooFit, you can:</p>
          <ul>
            <li>Track your weight and health metrics</li>
            <li>Use our comprehensive health calculators</li>
            <li>Get personalized insights and recommendations</li>
            <li>Join a community of health enthusiasts</li>
          </ul>
          <p>Start your journey today by exploring our health calculators and tracking your progress!</p>
          <p>Best regards,<br>The GoooFit Team</p>
        </div>
      </body>
      </html>
    `;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'support@gooofit.com',
      to: to,
      subject: 'Welcome to GoooFit! 🎉',
      html: html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully via GoDaddy SMTP');
    console.log('   Message ID:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
      method: 'SMTP'
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
 * Send password reset email using SendMails.io API with SMTP fallback
 * @param {string} to - Recipient email address
 * @param {string} resetToken - Password reset token
 * @param {string} name - Recipient name (optional)
 * @returns {Promise<Object>} API response
 */
async function sendPasswordResetEmail(to, resetToken, name = 'User') {
  try {
    console.log('📧 Sending password reset email...');
    
    // Try SendMails.io API first
    try {
      console.log('   Trying SendMails.io API...');
      const result = await sendMailsService.sendPasswordResetEmail(to, resetToken, name);
      
      if (result.success) {
        console.log('✅ Password reset email sent successfully via SendMails.io API');
        return result;
      }
    } catch (apiError) {
      console.log('   ❌ SendMails.io API failed, trying SMTP fallback...');
    }
    
    // Fallback to GoDaddy SMTP
    console.log('   Using GoDaddy SMTP fallback...');
    const transporter = createGoDaddyTransporter();
    
    const resetUrl = `${process.env.CLIENT_URL || 'https://gooofit.com'}/reset-password?token=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset - GoooFit</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2c5aa0;">Password Reset Request</h1>
          <p>Hi ${name},</p>
          <p>We received a request to reset your password for your GoooFit account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #2c5aa0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p>This link will expire in 1 hour for security reasons.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>Best regards,<br>The GoooFit Team</p>
        </div>
      </body>
      </html>
    `;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'support@gooofit.com',
      to: to,
      subject: 'Password Reset Request - GoooFit',
      html: html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully via GoDaddy SMTP');
    console.log('   Message ID:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
      method: 'SMTP'
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
 * Send registration notification email using SendMails.io API with SMTP fallback
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient name
 * @returns {Promise<Object>} API response
 */
async function sendRegistrationNotificationEmail(to, name) {
  try {
    console.log('📧 Sending registration notification email...');
    
    // Try SendMails.io API first
    try {
      console.log('   Trying SendMails.io API...');
      const result = await sendMailsService.sendRegistrationNotificationEmail(to, name);
      
      if (result.success) {
        console.log('✅ Registration notification email sent successfully via SendMails.io API');
        return result;
      }
    } catch (apiError) {
      console.log('   ❌ SendMails.io API failed, trying SMTP fallback...');
    }
    
    // Fallback to GoDaddy SMTP
    console.log('   Using GoDaddy SMTP fallback...');
    const transporter = createGoDaddyTransporter();
    
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
      from: process.env.EMAIL_USER || 'support@gooofit.com',
      to: to,
      subject: 'New User Registration - GoooFit',
      html: html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Registration notification email sent successfully via GoDaddy SMTP');
    console.log('   Message ID:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
      method: 'SMTP'
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
 * Send generic email using SendMails.io API with SMTP fallback
 * @param {Object} emailData - Email data object
 * @returns {Promise<Object>} API response
 */
async function sendEmail(emailData) {
  try {
    console.log('📧 Sending generic email...');
    
    // Try SendMails.io API first
    try {
      console.log('   Trying SendMails.io API...');
      const result = await sendMailsService.sendEmail(emailData);
      
      if (result.success) {
        console.log('✅ Generic email sent successfully via SendMails.io API');
        return result;
      }
    } catch (apiError) {
      console.log('   ❌ SendMails.io API failed, trying SMTP fallback...');
    }
    
    // Fallback to GoDaddy SMTP
    console.log('   Using GoDaddy SMTP fallback...');
    const transporter = createGoDaddyTransporter();
    
    const mailOptions = {
      from: emailData.from || process.env.EMAIL_USER || 'support@gooofit.com',
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Generic email sent successfully via GoDaddy SMTP');
    console.log('   Message ID:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
      method: 'SMTP'
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
 * Test email service (both API and SMTP)
 * @returns {Promise<Object>} Test result
 */
async function testEmailService() {
  try {
    console.log('🧪 Testing email service (API + SMTP fallback)...');
    
    // Test SendMails.io API
    console.log('1️⃣ Testing SendMails.io API...');
    const apiTest = await sendMailsService.testSendMailsConnection();
    console.log('   API Test:', apiTest.success ? '✅ SUCCESS' : '❌ FAILED');
    
    // Test GoDaddy SMTP
    console.log('2️⃣ Testing GoDaddy SMTP...');
    const transporter = createGoDaddyTransporter();
    const smtpTest = await transporter.verify();
    console.log('   SMTP Test:', smtpTest ? '✅ SUCCESS' : '❌ FAILED');
    
    return {
      success: apiTest.success || smtpTest,
      api: apiTest,
      smtp: { success: smtpTest },
      message: 'Email service test completed'
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
  testEmailService
}; 