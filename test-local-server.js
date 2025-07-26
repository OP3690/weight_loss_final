const axios = require('axios');

async function testLocalServer() {
  console.log('🧪 Testing local server...');
  
  try {
    // Test 1: Health endpoint
    console.log('\n1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:3001/api/health');
    console.log('Health Response:', healthResponse.data);
    
    // Test 2: Email test endpoint
    console.log('\n2️⃣ Testing email endpoint...');
    const emailResponse = await axios.get('http://localhost:3001/api/test-email');
    console.log('Email Test Response:', emailResponse.data);
    
    // Test 3: Password reset endpoint
    console.log('\n3️⃣ Testing password reset endpoint...');
    const resetResponse = await axios.post('http://localhost:3001/api/users/forgot-password', {
      email: 'global5665@gmail.com'
    });
    console.log('Password Reset Response:', resetResponse.data);
    
    console.log('\n✅ All server tests completed!');
    
  } catch (error) {
    console.error('❌ Server test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testLocalServer(); 