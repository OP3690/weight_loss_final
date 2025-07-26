console.log('🧪 Testing environment variables...');
console.log('📧 EMAIL_USER:', process.env.EMAIL_USER);
console.log('📧 EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***SET***' : '***NOT SET***');
console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
console.log('🔗 MONGODB_URI:', process.env.MONGODB_URI ? '***SET***' : '***NOT SET***');

// Test email service import
try {
  const { testEmailService } = require('./services/emailService');
  console.log('✅ Email service imported successfully');
} catch (error) {
  console.error('❌ Failed to import email service:', error.message);
} 