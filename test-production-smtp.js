const nodemailer = require('nodemailer');

async function testProductionSMTP() {
  console.log('🧪 Testing production SMTP configuration...');
  
  try {
    // Create transporter with production-like settings
    const transporter = nodemailer.createTransport({
      host: 'smtpout.secureserver.net',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER || 'support@gooofit.com',
        pass: process.env.EMAIL_PASSWORD || 'Fortune$$336699'
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
      },
      debug: true,
      logger: true,
      requireTLS: true,
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000
    });
    
    console.log('📧 Email Configuration:');
    console.log('   Host:', 'smtpout.secureserver.net');
    console.log('   User:', process.env.EMAIL_USER || 'support@gooofit.com');
    console.log('   Password:', process.env.EMAIL_PASSWORD ? '***SET***' : '***NOT SET***');
    
    // Test connection
    console.log('\n🔗 Testing SMTP connection...');
    const result = await transporter.verify();
    
    if (result) {
      console.log('✅ SMTP connection successful!');
      
      // Try sending a test email
      console.log('\n📧 Sending test email...');
      const mailOptions = {
        from: process.env.EMAIL_USER || 'support@gooofit.com',
        to: 'test@example.com',
        subject: 'SMTP Test',
        text: 'This is a test email to verify SMTP configuration.'
      };
      
      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Test email sent successfully!');
      console.log('   Message ID:', info.messageId);
      
    } else {
      console.log('❌ SMTP connection failed');
    }
    
  } catch (error) {
    console.error('❌ SMTP test failed:', error.message);
    console.error('   Error details:', error);
  }
}

testProductionSMTP(); 