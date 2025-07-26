const axios = require('axios');

const SENDMAILS_API_BASE = 'https://app.sendmails.io/api/v1';
const SENDMAILS_API_TOKEN = '9XYiI42Ccb70jqlRbmMqx537XvdIFLPkNafyshOHPf6kk02JCPdalA4b8ivt';

const sendMailsAPI = axios.create({
  baseURL: SENDMAILS_API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

async function debugSendMails() {
  try {
    console.log('🔍 Debugging SendMails.io API...');
    
    // Test 1: Get campaigns
    console.log('\n1️⃣ Testing campaigns endpoint...');
    try {
      const campaignsResponse = await sendMailsAPI.get('/campaigns', {
        params: { api_token: SENDMAILS_API_TOKEN }
      });
      console.log('✅ Campaigns response:', JSON.stringify(campaignsResponse.data, null, 2));
    } catch (error) {
      console.log('❌ Campaigns error:', error.response?.data || error.message);
    }
    
    // Test 2: Get lists
    console.log('\n2️⃣ Testing lists endpoint...');
    try {
      const listsResponse = await sendMailsAPI.get('/lists', {
        params: { api_token: SENDMAILS_API_TOKEN }
      });
      console.log('✅ Lists response:', JSON.stringify(listsResponse.data, null, 2));
    } catch (error) {
      console.log('❌ Lists error:', error.response?.data || error.message);
    }
    
    // Test 3: Create list
    console.log('\n3️⃣ Testing list creation...');
    try {
      const listData = {
        api_token: SENDMAILS_API_TOKEN,
        name: 'GoooFit Users',
        description: 'GoooFit application users'
      };
      
      const createListResponse = await sendMailsAPI.post('/lists', listData);
      console.log('✅ Create list response:', JSON.stringify(createListResponse.data, null, 2));
    } catch (error) {
      console.log('❌ Create list error:', error.response?.data || error.message);
    }
    
    // Test 4: Get subscribers
    console.log('\n4️⃣ Testing subscribers endpoint...');
    try {
      const subscribersResponse = await sendMailsAPI.get('/subscribers', {
        params: { api_token: SENDMAILS_API_TOKEN }
      });
      console.log('✅ Subscribers response:', JSON.stringify(subscribersResponse.data, null, 2));
    } catch (error) {
      console.log('❌ Subscribers error:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugSendMails(); 