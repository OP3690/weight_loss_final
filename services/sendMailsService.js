const axios = require('axios');

// SendMails.io API Configuration
const SENDMAILS_API_BASE_URL = 'https://app.sendmails.io/api/v1';
const SENDMAILS_API_TOKEN = '9XYiI42Ccb70jqlRbmMqx537XvdIFLPkNafyshOHPf6kk02JCPdalA4b8ivt';

// Create axios instance with default configuration
const sendMailsApi = axios.create({
  baseURL: SENDMAILS_API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${SENDMAILS_API_TOKEN}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000 // 30 seconds timeout
});

// Log configuration (without token)
console.log('📧 SendMails.io API Configuration:');
console.log('   Base URL:', SENDMAILS_API_BASE_URL);
console.log('   Token:', SENDMAILS_API_TOKEN ? '***SET***' : '***NOT SET***');

/**
 * Send email using SendMails.io API
 * @param {Object} emailData - Email data object
 * @param {string} emailData.to - Recipient email address
 * @param {string} emailData.subject - Email subject
 * @param {string} emailData.html - HTML content
 * @param {string} emailData.text - Plain text content (optional)
 * @param {string} emailData.from - Sender email address
 * @param {string} emailData.fromName - Sender name (optional)
 * @returns {Promise<Object>} API response
 */
async function sendEmail(emailData) {
  try {
    console.log('📧 Sending email via SendMails.io API...');
    console.log('   To:', emailData.to);
    console.log('   Subject:', emailData.subject);
    console.log('   From:', emailData.from);

    const payload = {
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text || emailData.html.replace(/<[^>]*>/g, ''), // Strip HTML tags for text
      from: emailData.from,
      from_name: emailData.fromName || 'GoooFit'
    };

    const response = await sendMailsApi.post('/send', payload);
    
    console.log('✅ Email sent successfully via SendMails.io API');
    console.log('   Response:', response.data);
    
    return {
      success: true,
      messageId: response.data.message_id || response.data.id,
      data: response.data
    };
  } catch (error) {
    console.error('❌ Failed to send email via SendMails.io API:');
    console.error('   Error:', error.message);
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    
    return {
      success: false,
      error: error.message,
      details: error.response?.data || null
    };
  }
}

/**
 * Send welcome email
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient name
 * @returns {Promise<Object>} API response
 */
async function sendWelcomeEmail(to, name) {
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

  return await sendEmail({
    to,
    subject: 'Welcome to GoooFit! 🎉',
    html,
    from: 'support@gooofit.com',
    fromName: 'GoooFit Team'
  });
}

/**
 * Send password reset email
 * @param {string} to - Recipient email address
 * @param {string} resetToken - Password reset token
 * @param {string} name - Recipient name (optional)
 * @returns {Promise<Object>} API response
 */
async function sendPasswordResetEmail(to, resetToken, name = 'User') {
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

  return await sendEmail({
    to,
    subject: 'Password Reset Request - GoooFit',
    html,
    from: 'support@gooofit.com',
    fromName: 'GoooFit Support'
  });
}

/**
 * Send registration notification email
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient name
 * @returns {Promise<Object>} API response
 */
async function sendRegistrationNotificationEmail(to, name) {
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

  return await sendEmail({
    to,
    subject: 'New User Registration - GoooFit',
    html,
    from: 'support@gooofit.com',
    fromName: 'GoooFit System'
  });
}

/**
 * Test SendMails.io API connection
 * @returns {Promise<Object>} Test result
 */
async function testSendMailsConnection() {
  try {
    console.log('🧪 Testing SendMails.io API connection...');
    
    // Try to get account info or test endpoint
    const response = await sendMailsApi.get('/account');
    
    console.log('✅ SendMails.io API connection successful');
    console.log('   Account info:', response.data);
    
    return {
      success: true,
      message: 'SendMails.io API connection successful',
      data: response.data
    };
  } catch (error) {
    console.error('❌ SendMails.io API connection failed:');
    console.error('   Error:', error.message);
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    
    return {
      success: false,
      error: error.message,
      details: error.response?.data || null
    };
  }
}

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendRegistrationNotificationEmail,
  testSendMailsConnection
}; 