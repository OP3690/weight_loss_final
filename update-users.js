const axios = require('axios');

const API_BASE_URL = 'https://weight-management-backend.onrender.com/api';

async function updateUsers() {
  try {
    console.log('Fetching users...');
    
    // Get all users
    const response = await axios.get(`${API_BASE_URL}/users`);
    const users = response.data;
    
    console.log(`Found ${users.length} users`);
    
    for (const user of users) {
      console.log(`\nProcessing user: ${user.name}`);
      console.log(`Current mobile: ${user.mobile}`);
      console.log(`Current country: ${user.country}`);
      
      let needsUpdate = false;
      const updates = {};
      
      // Check if mobile number needs country code
      if (user.mobile && !user.mobile.startsWith('+')) {
        if (user.mobile.length === 10) {
          updates.mobile = `+91${user.mobile}`;
          needsUpdate = true;
          console.log(`Will update mobile to: +91${user.mobile}`);
        } else if (user.mobile.length === 12 && user.mobile.startsWith('91')) {
          updates.mobile = `+${user.mobile}`;
          needsUpdate = true;
          console.log(`Will update mobile to: +${user.mobile}`);
        }
      }
      
      // Check if country field is missing
      if (!user.country) {
        updates.country = 'India';
        needsUpdate = true;
        console.log(`Will add country: India`);
      }
      
      if (needsUpdate) {
        try {
          const updateResponse = await axios.put(`${API_BASE_URL}/users/${user._id}`, updates);
          console.log(`✅ Updated user: ${user.name}`);
        } catch (error) {
          console.error(`❌ Failed to update user ${user.name}:`, error.response?.data?.message || error.message);
        }
      } else {
        console.log(`⏭️  No updates needed for: ${user.name}`);
      }
    }
    
    console.log('\n✅ User update process completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data?.message || error.message);
  }
}

updateUsers(); 