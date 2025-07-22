const nodemailer = require('nodemailer');

// Test email configuration for GoDaddy email
const transporter = nodemailer.createTransport({
  host: 'smtpout.secureserver.net', // GoDaddy's own SMTP server
  port: 587,
  secure: false, // true for 465, false for other ports
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
    console.log('1. Verify your GoDaddy email credentials are correct');
    console.log('2. Check if your GoDaddy email is properly configured');
    console.log('3. Make sure the password is correct');
    console.log('4. Contact GoDaddy support if email is not working');
    console.log('5. Try using GoDaddy\'s webmail interface to verify access');
  }
};

// Run the test
testEmail(); 