const nodemailer = require('nodemailer');

// Test email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'support@gooofit.com',
    pass: 'Fortune$$336699'
  }
});

// Test email
const testEmail = async () => {
  try {
    console.log('🧪 Testing email configuration...');
    
    const mailOptions = {
      from: '"WeightPro Test" <support@gooofit.com>',
      to: 'support@gooofit.com', // Send to yourself for testing
      subject: '🧪 WeightPro Email Test',
      html: `
        <h2>Email Test Successful!</h2>
        <p>This is a test email to verify that your WeightPro email configuration is working correctly.</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        <p>If you received this email, your email functionality is ready!</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📬 Check your email inbox for the test message');
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check if 2-Factor Authentication is enabled on your Gmail account');
    console.log('2. Generate an app-specific password for "WeightPro Email Service"');
    console.log('3. Make sure the password is correct');
    console.log('4. Check if Gmail allows "less secure app access" (if not using 2FA)');
  }
};

// Run the test
testEmail(); 