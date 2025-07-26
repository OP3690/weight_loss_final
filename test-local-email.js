const { testEmailService, sendWelcomeEmail, sendPasswordResetEmail } = require('./services/emailService');

async function testLocalEmail() {
  console.log('🧪 Testing email service locally...');
  console.log('📧 EMAIL_USER:', process.env.EMAIL_USER);
  console.log('📧 EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***SET***' : '***NOT SET***');
  
  try {
    // Test 1: SMTP Connection
    console.log('\n1️⃣ Testing SMTP connection...');
    const smtpTest = await testEmailService();
    console.log('SMTP Test Result:', smtpTest);
    
    if (!smtpTest.success) {
      console.log('❌ SMTP test failed, stopping here');
      return;
    }
    
    // Test 2: Welcome Email
    console.log('\n2️⃣ Testing welcome email...');
    const welcomeResult = await sendWelcomeEmail('global5665@gmail.com', 'Global Test');
    console.log('Welcome Email Result:', welcomeResult);
    
    // Test 3: Password Reset Email
    console.log('\n3️⃣ Testing password reset email...');
    const resetToken = 'test-token-12345';
    const resetResult = await sendPasswordResetEmail('global5665@gmail.com', resetToken, 'Global Test');
    console.log('Password Reset Email Result:', resetResult);
    
    console.log('\n✅ All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Error details:', error);
  }
}

testLocalEmail(); 