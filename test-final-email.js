const { sendWelcomeEmail } = require('./services/emailService');

async function testFinalEmail() {
  console.log('📧 Testing direct GoDaddy SMTP for instant transactional email...');
  
  try {
    // Test with a new email address
    const result = await sendWelcomeEmail('global5665@gmail.com', 'Global Test');
    console.log('📊 Result:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ Email sent successfully via GoDaddy SMTP!');
      console.log('   Message ID:', result.messageId);
      console.log('   Method:', result.method);
      console.log('   Delivery: Instant (no opt-in required)');
    } else {
      console.log('❌ Email sending failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFinalEmail(); 