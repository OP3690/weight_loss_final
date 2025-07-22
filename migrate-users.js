const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://omprakashutaha:Omprakash@123@cluster0.mongodb.net/weight-management?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./models/User');

async function migrateUsers() {
  try {
    console.log('Starting user migration...');
    
    // Find all users
    const users = await User.find({});
    console.log(`Found ${users.length} users to migrate`);
    
    let updatedCount = 0;
    
    for (const user of users) {
      let needsUpdate = false;
      const updates = {};
      
      // Check if mobile number needs country code
      if (user.mobileNumber && !user.mobileNumber.startsWith('+')) {
        // Add +91 for Indian numbers (assuming most users are from India)
        if (user.mobileNumber.length === 10) {
          updates.mobileNumber = `+91${user.mobileNumber}`;
          needsUpdate = true;
          console.log(`Updating mobile number for ${user.name}: ${user.mobileNumber} -> +91${user.mobileNumber}`);
        } else if (user.mobileNumber.length === 12 && user.mobileNumber.startsWith('91')) {
          updates.mobileNumber = `+${user.mobileNumber}`;
          needsUpdate = true;
          console.log(`Updating mobile number for ${user.name}: ${user.mobileNumber} -> +${user.mobileNumber}`);
        }
      }
      
      // Check if country field is missing
      if (!user.country) {
        updates.country = 'India'; // Default to India
        needsUpdate = true;
        console.log(`Adding country for ${user.name}: India`);
      }
      
      // Update user if needed
      if (needsUpdate) {
        await User.findByIdAndUpdate(user._id, updates);
        updatedCount++;
      }
    }
    
    console.log(`Migration completed! Updated ${updatedCount} users.`);
    
    // Verify the migration
    const verifyUsers = await User.find({});
    console.log('\nVerification:');
    verifyUsers.forEach(user => {
      console.log(`${user.name}: ${user.mobileNumber} (${user.country})`);
    });
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run migration
migrateUsers(); 