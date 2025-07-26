const { sendRegistrationNotificationEmail } = require('./services/emailService');

async function testAdminNotification() {
  console.log('🧪 Testing Admin Notification Email...');
  
  try {
    // Test Admin Notification Email
    console.log('\n📧 Sending Admin Notification Email...');
    const adminResult = await sendRegistrationNotificationEmail('omprakashutaha@gmail.com', 'John Doe', 'India');
    console.log('Admin Notification Email Result:', adminResult);
    
    console.log('\n✅ Admin notification email sent!');
    console.log('📧 Check your admin email: omprakashutaha@gmail.com');
    console.log('📋 This is what you\'ll receive when someone registers on your website!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAdminNotification(); 