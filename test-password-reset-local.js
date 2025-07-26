const axios = require('axios');

async function testPasswordReset() {
  console.log('🧪 Testing password reset endpoint locally...');
  
  try {
    // Test 1: Email test endpoint
    console.log('\n1️⃣ Testing email endpoint...');
    const emailResponse = await axios.get('http://localhost:3001/api/test-email');
    console.log('Email Test Response:', emailResponse.data);
    
    // Test 2: Password reset with correct payload
    console.log('\n2️⃣ Testing password reset endpoint...');
    const resetPayload = {
      method: 'email',
      email: 'global5665@gmail.com'
    };
    
    console.log('Sending payload:', resetPayload);
    const resetResponse = await axios.post('http://localhost:3001/api/users/forgot-password', resetPayload);
    console.log('Password Reset Response:', resetResponse.data);
    
    console.log('\n✅ Password reset test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testPasswordReset(); 