const sendMailsService = require('./sendMailsService');

// Log email configuration
console.log('📧 Email Configuration:');
console.log('   Service: SendMails.io API');
console.log('   Status: Ready to send emails automatically');

/**
 * Send welcome email using SendMails.io API
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient name
 * @returns {Promise<Object>} API response
 */
async function sendWelcomeEmail(to, name) {
  try {
    console.log('📧 Sending welcome email via SendMails.io API...');
    const result = await sendMailsService.sendWelcomeEmail(to, name);
    
    if (result.success) {
      console.log('✅ Welcome email sent successfully');
    } else {
      console.error('❌ Failed to send welcome email:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Send password reset email using SendMails.io API
 * @param {string} to - Recipient email address
 * @param {string} resetToken - Password reset token
 * @param {string} name - Recipient name (optional)
 * @returns {Promise<Object>} API response
 */
async function sendPasswordResetEmail(to, resetToken, name = 'User') {
  try {
    console.log('📧 Sending password reset email via SendMails.io API...');
    const result = await sendMailsService.sendPasswordResetEmail(to, resetToken, name);
    
    if (result.success) {
      console.log('✅ Password reset email sent successfully');
    } else {
      console.error('❌ Failed to send password reset email:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Send registration notification email using SendMails.io API
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient name
 * @returns {Promise<Object>} API response
 */
async function sendRegistrationNotificationEmail(to, name) {
  try {
    console.log('📧 Sending registration notification email via SendMails.io API...');
    const result = await sendMailsService.sendRegistrationNotificationEmail(to, name);
    
    if (result.success) {
      console.log('✅ Registration notification email sent successfully');
    } else {
      console.error('❌ Failed to send registration notification email:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error sending registration notification email:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Send generic email using SendMails.io API
 * @param {Object} emailData - Email data object
 * @returns {Promise<Object>} API response
 */
async function sendEmail(emailData) {
  try {
    console.log('📧 Sending generic email via SendMails.io API...');
    const result = await sendMailsService.sendEmail(emailData);
    
    if (result.success) {
      console.log('✅ Generic email sent successfully');
    } else {
      console.error('❌ Failed to send generic email:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error sending generic email:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Test SendMails.io API connection
 * @returns {Promise<Object>} Test result
 */
async function testEmailService() {
  try {
    console.log('🧪 Testing SendMails.io API connection...');
    const result = await sendMailsService.testSendMailsConnection();
    
    if (result.success) {
      console.log('✅ SendMails.io API connection test successful');
    } else {
      console.error('❌ SendMails.io API connection test failed:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error testing SendMails.io API connection:', error.message);
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