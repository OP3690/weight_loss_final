const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Twilio Verify Service SID
const VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID;

// Send SMS OTP using Twilio Verify
const sendSMSOTP = async (phoneNumber) => {
  try {
    console.log('Attempting to send SMS OTP to:', phoneNumber);
    console.log('Using Twilio configuration:', {
      accountSid: process.env.TWILIO_ACCOUNT_SID ? '***' : 'Not set',
      verifyServiceSid: VERIFY_SERVICE_SID ? '***' : 'Not set'
    });

    // Format phone number to E.164 format if not already
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

    const verification = await client.verify.v2
      .services(VERIFY_SERVICE_SID)
      .verifications.create({
        to: formattedPhone,
        channel: 'sms'
      });

    console.log('SMS OTP sent successfully to:', phoneNumber);
    console.log('Verification SID:', verification.sid);
    console.log('Status:', verification.status);

    return {
      success: true,
      sid: verification.sid,
      status: verification.status,
      phoneNumber: formattedPhone
    };
  } catch (error) {
    console.error('Failed to send SMS OTP:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      status: error.status
    });
    throw error;
  }
};

// Verify SMS OTP
const verifySMSOTP = async (phoneNumber, otpCode) => {
  try {
    console.log('Attempting to verify SMS OTP for:', phoneNumber);
    console.log('OTP Code:', otpCode);

    // Format phone number to E.164 format if not already
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

    const verificationCheck = await client.verify.v2
      .services(VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: formattedPhone,
        code: otpCode
      });

    console.log('SMS OTP verification result:', {
      sid: verificationCheck.sid,
      status: verificationCheck.status,
      valid: verificationCheck.status === 'approved'
    });

    return {
      success: verificationCheck.status === 'approved',
      sid: verificationCheck.sid,
      status: verificationCheck.status,
      phoneNumber: formattedPhone
    };
  } catch (error) {
    console.error('Failed to verify SMS OTP:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      status: error.status
    });
    throw error;
  }
};

// Generate a simple 6-digit OTP (fallback method)
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send SMS using Twilio SMS API (alternative method)
const sendSMS = async (phoneNumber, message) => {
  try {
    console.log('Attempting to send SMS to:', phoneNumber);
    console.log('Message:', message);

    // Format phone number to E.164 format if not already
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER || '+1234567890', // Replace with your Twilio phone number
      to: formattedPhone
    });

    console.log('SMS sent successfully to:', phoneNumber);
    console.log('Message SID:', sms.sid);
    console.log('Status:', sms.status);

    return {
      success: true,
      sid: sms.sid,
      status: sms.status,
      phoneNumber: formattedPhone
    };
  } catch (error) {
    console.error('Failed to send SMS:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      status: error.status
    });
    throw error;
  }
};

// Send password reset SMS with OTP
const sendPasswordResetSMS = async (phoneNumber, userName, otp) => {
  try {
    const message = `🔐 GoooFit Password Reset\n\nHi ${userName},\n\nYour password reset code is: ${otp}\n\n⏰ Expires in 10 minutes\n🔐 One-time use only\n\nIf you didn't request this, please ignore this message.\n\nGoooFit Team`;

    return await sendSMS(phoneNumber, message);
  } catch (error) {
    console.error('Failed to send password reset SMS:', error);
    throw error;
  }
};

module.exports = {
  sendSMSOTP,
  verifySMSOTP,
  sendSMS,
  sendPasswordResetSMS,
  generateOTP
}; 