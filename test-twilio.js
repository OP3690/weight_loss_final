const twilio = require('twilio');

// Set environment variables
process.env.TWILIO_ACCOUNT_SID = 'AC4581127b912c33832e7fbb28bddaaa66';
process.env.TWILIO_AUTH_TOKEN = 'a83e0a68c371dac5730122d77b43514c';
process.env.TWILIO_PHONE_NUMBER = '+14322397863';

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function testTwilio() {
  try {
    console.log('🔧 Testing Twilio credentials...');
    
    // Test account info
    const account = await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
    console.log('✅ Account verified:', account.friendlyName);
    console.log('📱 Account status:', account.status);
    
    // Test SMS sending
    console.log('📱 Testing SMS sending...');
    const message = await client.messages.create({
      body: 'Test message from GoooFit',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: '+917016453388'
    });
    
    console.log('✅ SMS sent successfully!');
    console.log('📱 Message SID:', message.sid);
    console.log('📱 Status:', message.status);
    
  } catch (error) {
    console.error('❌ Twilio test failed:', error.message);
    console.error('❌ Error code:', error.code);
    console.error('❌ Full error:', error);
  }
}

testTwilio(); 