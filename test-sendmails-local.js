const { testSendMailsConnection } = require('./services/sendMailsService');

async function testLocal() {
  console.log('🧪 Testing SendMails.io API locally...');
  
  try {
    const result = await testSendMailsConnection();
    console.log('📊 Result:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ SendMails.io API connection successful!');
    } else {
      console.log('❌ SendMails.io API connection failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testLocal(); 