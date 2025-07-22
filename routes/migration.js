const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Migration route to update existing users
router.post('/migrate-users', async (req, res) => {
  try {
    console.log('Starting user migration...');
    
    // Find all users
    const users = await User.find({});
    console.log(`Found ${users.length} users to migrate`);
    
    let updatedCount = 0;
    const results = [];
    
    for (const user of users) {
      let needsUpdate = false;
      const updates = {};
      const result = {
        name: user.name,
        originalMobile: user.mobileNumber,
        originalCountry: user.country,
        updated: false
      };
      
      // Check if mobile number needs country code
      if (user.mobileNumber && !user.mobileNumber.startsWith('+')) {
        // Add +91 for Indian numbers (assuming most users are from India)
        if (user.mobileNumber.length === 10) {
          updates.mobileNumber = `+91${user.mobileNumber}`;
          needsUpdate = true;
          result.newMobile = `+91${user.mobileNumber}`;
          console.log(`Updating mobile number for ${user.name}: ${user.mobileNumber} -> +91${user.mobileNumber}`);
        } else if (user.mobileNumber.length === 12 && user.mobileNumber.startsWith('91')) {
          updates.mobileNumber = `+${user.mobileNumber}`;
          needsUpdate = true;
          result.newMobile = `+${user.mobileNumber}`;
          console.log(`Updating mobile number for ${user.name}: ${user.mobileNumber} -> +${user.mobileNumber}`);
        }
      }
      
      // Check if country field is missing
      if (!user.country) {
        updates.country = 'India'; // Default to India
        needsUpdate = true;
        result.newCountry = 'India';
        console.log(`Adding country for ${user.name}: India`);
      }
      
      // Update user if needed
      if (needsUpdate) {
        await User.findByIdAndUpdate(user._id, updates);
        updatedCount++;
        result.updated = true;
      }
      
      results.push(result);
    }
    
    console.log(`Migration completed! Updated ${updatedCount} users.`);
    
    res.json({
      success: true,
      message: `Migration completed! Updated ${updatedCount} users.`,
      totalUsers: users.length,
      updatedUsers: updatedCount,
      results: results
    });
    
  } catch (error) {
    console.error('Migration failed:', error);
    res.status(500).json({
      success: false,
      message: 'Migration failed',
      error: error.message
    });
  }
});

module.exports = router; 