const { sendWelcomeEmail } = require('./services/sendMailsService');

async function testEmail() {
  console.log('📧 Testing SendMails.io email sending...');
  
  try {
    const result = await sendWelcomeEmail('test@example.com', 'Test User');
    console.log('📊 Result:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ Email sent successfully via SendMails.io API!');
      console.log('   Campaign ID:', result.campaignId);
    } else {
      console.log('❌ Email sending failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testEmail(); 