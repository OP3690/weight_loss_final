// Email Service - Completely Mocked
// This service is completely mocked to prevent server crashes
// All email functionality will be logged to console for testing

// Mock transporter
const transporter = {
  sendMail: async (options) => {
    console.log('📧 Mock email would be sent:', {
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: options.html ? 'HTML content (truncated)' : 'No HTML content'
    });
    return { messageId: 'mock-email-id-' + Date.now() };
  }
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send Welcome Email (Mocked)
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    console.log('🎉 Welcome email would be sent to:', userEmail, 'for user:', userName);
    
    const mailOptions = {
      from: '"GoooFit Team" <support@gooofit.com>',
      to: userEmail,
      subject: '🎉 Welcome to GoooFit - Your Weight Loss Journey Starts Here!',
      html: `<h1>Welcome ${userName}!</h1><p>Thank you for joining GoooFit!</p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Mock welcome email sent successfully to:', userEmail);
    return info;
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    throw error;
  }
};

// Send Password Reset Email (Mocked)
const sendPasswordResetEmail = async (userEmail, userName, otp) => {
  try {
    console.log('🔐 Password reset email would be sent to:', userEmail, 'with OTP:', otp);
    
    const mailOptions = {
      from: '"GoooFit Team" <support@gooofit.com>',
      to: userEmail,
      subject: '🔐 Password Reset - GoooFit',
      html: `<h1>Password Reset</h1><p>Hi ${userName}, your OTP is: <strong>${otp}</strong></p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Mock password reset email sent successfully to:', userEmail);
    return info;
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    throw error;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  generateOTP
}; 