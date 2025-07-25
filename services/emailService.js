const nodemailer = require('nodemailer');

// Create transporter with environment variables (using Gmail SMTP)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Gmail SMTP server
  port: 587, // Gmail SMTP port
  secure: false, // Use STARTTLS for port 587
  auth: {
    user: process.env.EMAIL_USER || 'onboarding.gooofit@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'comk mmlv lycy ibjk'
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true, // Enable debug output
  logger: true // Log to console
});

// Alternative GoDaddy SMTP servers to try
const createAlternativeGoDaddyTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.secureserver.net', // Alternative GoDaddy SMTP server
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER || 'support@gooofit.com',
      pass: process.env.EMAIL_PASSWORD || 'Fortune$$336699'
    },
    tls: {
      rejectUnauthorized: false
    },
    debug: true,
    logger: true,
    authMethod: 'PLAIN'
  });
};

// Log email configuration (without password)
console.log('📧 Email Configuration:');
console.log('   Host:', 'smtp.gmail.com');
console.log('   User:', process.env.EMAIL_USER || 'onboarding.gooofit@gmail.com');
console.log('   Password:', process.env.EMAIL_PASSWORD ? '***SET***' : '***NOT SET***');

// Alternative transporter for testing different configurations (port 587 as backup)
const createAlternativeTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtpout.secureserver.net',
    port: 587,
    secure: false, // Use STARTTLS for port 587
    auth: {
      user: process.env.EMAIL_USER || 'support@gooofit.com',
      pass: process.env.EMAIL_PASSWORD || 'Fortune$$336699'
    },
    tls: {
      rejectUnauthorized: false
    },
    debug: true,
    logger: true,
    authMethod: 'LOGIN' // Try LOGIN method for port 587
  });
};

// Create transporter with different authentication methods
const createTransporterWithAuth = (authMethod) => {
  return nodemailer.createTransport({
    host: 'smtpout.secureserver.net',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER || 'support@gooofit.com',
      pass: process.env.EMAIL_PASSWORD || 'Fortune$$336699'
    },
    tls: {
      rejectUnauthorized: false
    },
    debug: true,
    logger: true,
    authMethod: authMethod
  });
};

// Verify transporter configuration
const verifyTransporter = async () => {
  try {
    console.log('🔧 Verifying email transporter...');
    console.log('📧 Using configuration:');
    console.log('   Host:', 'smtp.gmail.com');
    console.log('   Port:', 587);
    console.log('   Secure:', false);
    console.log('   User:', process.env.EMAIL_USER || 'onboarding.gooofit@gmail.com');
    console.log('   Password length:', process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 0);
    
    await transporter.verify();
    console.log('✅ Email transporter verified successfully');
    return true;
  } catch (error) {
    console.error('❌ Email transporter verification failed:', error);
    console.error('❌ Error details:', {
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      response: error.response,
      message: error.message
    });
    return false;
  }
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Test email configuration
const testEmailConfig = async () => {
  try {
    console.log('🧪 Testing email configuration...');
    console.log('📧 Environment variables:');
    console.log('   EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET');
    console.log('   EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'SET' : 'NOT SET');
    console.log('   NODE_ENV:', process.env.NODE_ENV || 'NOT SET');
    
    // Try primary configuration (Gmail SMTP)
    console.log('🔧 Testing Gmail SMTP configuration...');
    const isVerified = await verifyTransporter();
    if (isVerified) {
      console.log('✅ Gmail email configuration is working');
      
      // Try sending a test email
      console.log('📤 Attempting to send test email...');
      try {
        const testResult = await transporter.sendMail({
          from: '"GoooFit Test" <onboarding.gooofit@gmail.com>',
          to: 'onboarding.gooofit@gmail.com',
          subject: 'Test Email - GoooFit',
          text: 'This is a test email to verify Gmail SMTP is working correctly.',
          html: '<p>This is a test email to verify Gmail SMTP is working correctly.</p>'
        });
        console.log('✅ Test email sent successfully!');
        console.log('📧 Message ID:', testResult.messageId);
        return true;
      } catch (testError) {
        console.error('❌ Test email failed:', testError.message);
        return false;
      }
    }
    
    // Try LOGIN authentication method
    console.log('🔧 Testing LOGIN authentication method...');
    try {
      const loginTransporter = createTransporterWithAuth('LOGIN');
      await loginTransporter.verify();
      console.log('✅ LOGIN authentication method is working');
      return true;
    } catch (loginError) {
      console.error('❌ LOGIN authentication failed:', loginError.message);
    }
    
    // Try alternative GoDaddy SMTP server
    console.log('🔧 Testing alternative GoDaddy SMTP server (smtp.secureserver.net)...');
    try {
      const altGoDaddyTransporter = createAlternativeGoDaddyTransporter();
      await altGoDaddyTransporter.verify();
      console.log('✅ Alternative GoDaddy SMTP server is working');
      return true;
    } catch (altGoDaddyError) {
      console.error('❌ Alternative GoDaddy SMTP server failed:', altGoDaddyError.message);
    }
    
    // Try alternative configuration (port 587, STARTTLS) - backup
    console.log('🔧 Testing alternative configuration (port 587, STARTTLS)...');
    const altTransporter = createAlternativeTransporter();
    try {
      await altTransporter.verify();
      console.log('✅ Alternative email configuration is working');
      return true;
    } catch (altError) {
      console.error('❌ Alternative configuration also failed:', altError.message);
    }
    
    console.log('❌ All email configurations failed');
    return false;
  } catch (error) {
    console.error('❌ Email configuration test failed:', error);
    return false;
  }
};

// Send Welcome Email
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    console.log('🎉 Starting welcome email process...');
    console.log('📧 To:', userEmail);
    console.log('👤 User:', userName);
    
    // Verify transporter first
    const isVerified = await verifyTransporter();
    if (!isVerified) {
      throw new Error('Email transporter verification failed');
    }
    
    const welcomeEmailHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="Welcome to GoooFit - Your personalized weight loss and fitness tracking platform. Start your health journey today with expert guidance and progress tracking.">
        <meta name="keywords" content="weight loss, fitness tracking, health goals, BMI calculator, progress monitoring, healthy lifestyle, weight management, fitness app">
        <meta name="author" content="GoooFit Team">
        <meta name="robots" content="noindex, nofollow">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="format-detection" content="telephone=no">
        <meta name="format-detection" content="date=no">
        <meta name="format-detection" content="address=no">
        <meta name="format-detection" content="email=no">
        <title>Welcome to GoooFit - Your Weight Loss Journey Begins</title>
        <!--[if mso]>
        <noscript>
            <xml>
                <o:OfficeDocumentSettings>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
        </noscript>
        <![endif]-->
        <style type="text/css">
            /* Reset styles */
            body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
            
            /* Base styles */
            body {
                margin: 0 !important;
                padding: 0 !important;
                background-color: #f8f9fa !important;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
                font-size: 16px !important;
                line-height: 1.6 !important;
                color: #333333 !important;
                -webkit-font-smoothing: antialiased !important;
                -moz-osx-font-smoothing: grayscale !important;
            }
            
            /* Container */
            .email-container {
                max-width: 600px !important;
                margin: 0 auto !important;
                background-color: #ffffff !important;
                border-radius: 12px !important;
                overflow: hidden !important;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
            }
            
            /* Header */
            .email-header {
                background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%) !important;
                padding: 40px 30px !important;
                text-align: center !important;
                color: #ffffff !important;
            }
            
            .logo {
                font-size: 36px !important;
                font-weight: 700 !important;
                margin-bottom: 15px !important;
                letter-spacing: -1px !important;
            }
            
            .welcome-title {
                font-size: 28px !important;
                font-weight: 600 !important;
                margin: 0 !important;
                line-height: 1.3 !important;
            }
            
            .welcome-subtitle {
                font-size: 18px !important;
                margin: 10px 0 0 0 !important;
                opacity: 0.9 !important;
                font-weight: 400 !important;
            }
            
            /* Content */
            .email-content {
                padding: 40px 30px !important;
                background-color: #ffffff !important;
            }
            
            .greeting {
                font-size: 18px !important;
                margin-bottom: 25px !important;
                color: #2c3e50 !important;
            }
            
            .main-message {
                font-size: 16px !important;
                line-height: 1.7 !important;
                margin-bottom: 30px !important;
                color: #555555 !important;
            }
            
            /* Feature boxes */
            .feature-box {
                background-color: #f8f9fa !important;
                border-left: 4px solid #ff6b35 !important;
                padding: 20px !important;
                margin: 20px 0 !important;
                border-radius: 8px !important;
            }
            
            .feature-title {
                color: #ff6b35 !important;
                font-size: 18px !important;
                font-weight: 600 !important;
                margin: 0 0 12px 0 !important;
            }
            
            .feature-content {
                color: #555555 !important;
                font-size: 15px !important;
                line-height: 1.6 !important;
                margin: 0 !important;
            }
            
            .feature-list {
                margin: 15px 0 0 0 !important;
                padding-left: 20px !important;
            }
            
            .feature-list li {
                margin-bottom: 8px !important;
                color: #555555 !important;
            }
            
            /* CTA Button */
            .cta-section {
                text-align: center !important;
                margin: 35px 0 !important;
            }
            
            .cta-button {
                display: inline-block !important;
                background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%) !important;
                color: #ffffff !important;
                text-decoration: none !important;
                padding: 16px 32px !important;
                border-radius: 50px !important;
                font-weight: 600 !important;
                font-size: 16px !important;
                text-transform: uppercase !important;
                letter-spacing: 0.5px !important;
                box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3) !important;
                transition: all 0.3s ease !important;
            }
            
            .cta-button:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4) !important;
            }
            
            /* Footer */
            .email-footer {
                background-color: #2c3e50 !important;
                color: #ffffff !important;
                padding: 30px !important;
                text-align: center !important;
            }
            
            .footer-content {
                font-size: 14px !important;
                line-height: 1.6 !important;
                margin: 0 !important;
            }
            
            .footer-links {
                margin: 20px 0 !important;
            }
            
            .footer-link {
                color: #ff6b35 !important;
                text-decoration: none !important;
                margin: 0 15px !important;
                font-size: 14px !important;
            }
            
            .footer-link:hover {
                text-decoration: underline !important;
            }
            
            .unsubscribe {
                font-size: 12px !important;
                color: #bdc3c7 !important;
                margin-top: 20px !important;
            }
            
            /* Responsive */
            @media only screen and (max-width: 600px) {
                .email-container {
                    margin: 0 !important;
                    border-radius: 0 !important;
                }
                
                .email-header, .email-content, .email-footer {
                    padding: 25px 20px !important;
                }
                
                .logo {
                    font-size: 28px !important;
                }
                
                .welcome-title {
                    font-size: 24px !important;
                }
                
                .welcome-subtitle {
                    font-size: 16px !important;
                }
                
                .cta-button {
                    padding: 14px 28px !important;
                    font-size: 15px !important;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Header -->
            <div class="email-header">
                <div class="logo">GoooFit</div>
                <h1 class="welcome-title">Welcome to Your Health Journey!</h1>
                <p class="welcome-subtitle">Your personalized weight management platform</p>
            </div>
            
            <!-- Content -->
            <div class="email-content">
                <p class="greeting">Dear <strong>${userName}</strong>,</p>
                
                <p class="main-message">
                    Welcome to GoooFit! We're excited to have you join our community of health-conscious individuals. 
                    Your journey towards a healthier, more active lifestyle begins today.
                </p>
                
                <div class="feature-box">
                    <h3 class="feature-title">📊 Your Personalized Dashboard</h3>
                    <p class="feature-content">
                        You now have access to your comprehensive health tracking dashboard with:
                    </p>
                    <ul class="feature-list">
                        <li>Daily weight tracking and progress monitoring</li>
                        <li>BMI calculation and health metrics analysis</li>
                        <li>Personalized goal setting and achievement tracking</li>
                        <li>Visual progress charts and insights</li>
                        <li>Nutrition and exercise recommendations</li>
                    </ul>
                </div>
                
                <div class="feature-box">
                    <h3 class="feature-title">🎯 Start Strong, Stay Consistent</h3>
                    <p class="feature-content">
                        Remember, sustainable weight loss is a journey, not a destination. 
                        Small, consistent changes lead to lasting results. We're here to support 
                        you every step of the way with evidence-based guidance and motivation.
                    </p>
                </div>
                
                <div class="feature-box">
                    <h3 class="feature-title">🚀 Ready to Begin?</h3>
                    <p class="feature-content">
                        Your dashboard is ready and waiting. Log in now to start tracking your progress 
                        and take the first step towards achieving your health goals.
                    </p>
                </div>
                
                <div class="cta-section">
                    <a href="https://gooofit.com/dashboard" class="cta-button">Access Your Dashboard</a>
                </div>
                
                <p class="main-message">
                    If you have any questions or need assistance, our support team is here to help. 
                    Simply reply to this email or contact us through your dashboard.
                </p>
            </div>
            
            <!-- Footer -->
            <div class="email-footer">
                <p class="footer-content">
                    Thank you for choosing GoooFit for your health journey.
                </p>
                
                <div class="footer-links">
                    <a href="https://gooofit.com/privacy" class="footer-link">Privacy Policy</a>
                    <a href="https://gooofit.com/terms" class="footer-link">Terms of Service</a>
                    <a href="https://gooofit.com/support" class="footer-link">Support</a>
                </div>
                
                <p class="footer-content">
                    © 2024 GoooFit. All rights reserved.<br>
                    This email was sent to you because you registered for a GoooFit account.
                </p>
                
                <p class="unsubscribe">
                    If you no longer wish to receive these emails, you can 
                    <a href="https://gooofit.com/unsubscribe" style="color: #ff6b35; text-decoration: none;">unsubscribe here</a>.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
    
    const mailOptions = {
      from: '"GoooFit" <onboarding.gooofit@gmail.com>',
      to: userEmail,
      subject: 'Welcome to GoooFit - Your Health Journey Begins',
      html: welcomeEmailHTML,
      text: `Welcome to GoooFit, ${userName}!

We're excited to have you join our community of health-conscious individuals. Your journey towards a healthier, more active lifestyle begins today.

Your personalized dashboard is now ready with:
- Daily weight tracking and progress monitoring
- BMI calculation and health metrics analysis
- Personalized goal setting and achievement tracking
- Visual progress charts and insights
- Nutrition and exercise recommendations

Access your dashboard: https://gooofit.com/dashboard

Remember, sustainable weight loss is a journey, not a destination. Small, consistent changes lead to lasting results.

If you have any questions or need assistance, our support team is here to help.

Best regards,
The GoooFit Team

---
This email was sent to you because you registered for a GoooFit account.
To unsubscribe, visit: https://gooofit.com/unsubscribe`
    };

    console.log('📤 Sending welcome email...');
    console.log('📧 From:', mailOptions.from);
    console.log('📧 To:', mailOptions.to);
    console.log('📧 Subject:', mailOptions.subject);

    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Welcome email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('📧 Response:', result.response);
    
    return {
      success: true,
      messageId: result.messageId,
      response: result.response
    };
    
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      response: error.response
    });
    
    throw new Error(`Welcome email failed: ${error.message}`);
  }
};

// Send Password Reset Email
const sendPasswordResetEmail = async (userEmail, userName, otp) => {
  try {
    console.log('🔐 Starting password reset email process...');
    console.log('📧 To:', userEmail);
    console.log('👤 User:', userName);
    
    // Verify transporter first
    const isVerified = await verifyTransporter();
    if (!isVerified) {
      throw new Error('Email transporter verification failed');
    }
    
    const resetEmailHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - GoooFit</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }
            .container {
                background-color: #ffffff;
                border-radius: 15px;
                padding: 40px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 32px;
                font-weight: bold;
                color: #ff6b35;
                margin-bottom: 10px;
            }
            .otp-box {
                background-color: #f8f9fa;
                border: 2px solid #ff6b35;
                border-radius: 10px;
                padding: 20px;
                text-align: center;
                margin: 20px 0;
            }
            .otp-code {
                font-size: 32px;
                font-weight: bold;
                color: #ff6b35;
                letter-spacing: 5px;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">GoooFit</div>
                <h1>Password Reset Request</h1>
            </div>
            
            <div class="content">
                <p>Dear <strong>${userName}</strong>,</p>
                
                <p>We received a request to reset your password for your GoooFit account.</p>
                
                <div class="otp-box">
                    <h3>Your Verification Code</h3>
                    <div class="otp-code">${otp}</div>
                    <p>Enter this code in the app to reset your password.</p>
                </div>
                
                <p><strong>Important:</strong></p>
                <ul>
                    <li>This code will expire in 10 minutes</li>
                    <li>If you didn't request this reset, please ignore this email</li>
                    <li>For security, never share this code with anyone</li>
                </ul>
                
                <p>If you have any questions, please contact our support team.</p>
            </div>
            
            <div class="footer">
                <p>Thank you for using GoooFit!</p>
                <p>© 2024 GoooFit. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
    
    const mailOptions = {
      from: '"GoooFit Support" <onboarding.gooofit@gmail.com>',
      to: userEmail,
      subject: 'Password Reset Code - GoooFit 🔐',
      html: resetEmailHTML,
      text: `Password Reset Request\n\nDear ${userName},\n\nYour verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this reset, please ignore this email.\n\nBest regards,\nThe GoooFit Team`
    };

    console.log('📤 Sending password reset email...');
    console.log('📧 From:', mailOptions.from);
    console.log('📧 To:', mailOptions.to);
    console.log('📧 Subject:', mailOptions.subject);

    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Password reset email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('📧 Response:', result.response);
    
    return {
      success: true,
      messageId: result.messageId,
      response: result.response
    };
    
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      response: error.response
    });
    
    throw new Error(`Password reset email failed: ${error.message}`);
  }
};

// Send Registration Notification Email to Admin
const sendRegistrationNotificationEmail = async (userData) => {
  try {
    console.log('🎉 Starting registration notification email process...');
    console.log('📧 To: omprakashutaha@gmail.com');
    console.log('👤 New User:', userData.name);
    
    // Verify transporter first
    const isVerified = await verifyTransporter();
    if (!isVerified) {
      throw new Error('Email transporter verification failed');
    }
    
    const registrationNotificationHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="New user registration notification for GoooFit">
        <title>New User Registration - GoooFit</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }
            .container {
                background-color: #ffffff;
                border-radius: 15px;
                padding: 40px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
                color: white;
                padding: 30px;
                border-radius: 12px;
                margin: -40px -40px 30px -40px;
            }
            .logo {
                font-size: 32px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .notification-title {
                font-size: 24px;
                margin: 0;
                font-weight: 600;
            }
            .user-info {
                background-color: #f8f9fa;
                border-left: 4px solid #ff6b35;
                padding: 25px;
                margin: 25px 0;
                border-radius: 8px;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-top: 20px;
            }
            .info-item {
                background-color: white;
                padding: 15px;
                border-radius: 8px;
                border: 1px solid #e9ecef;
            }
            .info-label {
                font-weight: 600;
                color: #ff6b35;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 5px;
            }
            .info-value {
                font-size: 16px;
                color: #333;
                font-weight: 500;
            }
            .stats {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
                margin: 25px 0;
            }
            .stat-item {
                text-align: center;
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #e9ecef;
            }
            .stat-number {
                font-size: 24px;
                font-weight: bold;
                color: #ff6b35;
                margin-bottom: 5px;
            }
            .stat-label {
                font-size: 12px;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 14px;
            }
            .timestamp {
                background-color: #e9ecef;
                padding: 10px;
                border-radius: 5px;
                text-align: center;
                margin: 20px 0;
                font-size: 14px;
                color: #666;
            }
            @media only screen and (max-width: 600px) {
                .info-grid {
                    grid-template-columns: 1fr;
                }
                .stats {
                    grid-template-columns: 1fr;
                }
                .container {
                    padding: 20px;
                }
                .header {
                    margin: -20px -20px 20px -20px;
                    padding: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🎉 GoooFit</div>
                <h1 class="notification-title">New User Registration!</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">A new member has joined the GoooFit community</p>
            </div>
            
            <div class="user-info">
                <h2 style="margin: 0 0 15px 0; color: #ff6b35;">👤 User Details</h2>
                
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Full Name</div>
                        <div class="info-value">${userData.name}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Email Address</div>
                        <div class="info-value">${userData.email}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Mobile Number</div>
                        <div class="info-value">${userData.mobileNumber}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Country</div>
                        <div class="info-value">${userData.country}</div>
                    </div>
                </div>
            </div>
            
            <div class="stats">
                <div class="stat-item">
                    <div class="stat-number">${userData.age}</div>
                    <div class="stat-label">Age</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${userData.height}cm</div>
                    <div class="stat-label">Height</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${userData.currentWeight}kg</div>
                    <div class="stat-label">Current Weight</div>
                </div>
            </div>
            
            <div style="background-color: #e8f5e8; border-left: 4px solid #28a745; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h3 style="margin: 0 0 10px 0; color: #28a745;">🎯 Weight Goal</h3>
                <p style="margin: 0; color: #155724;">
                    <strong>Target Weight:</strong> ${userData.goalWeight}kg<br>
                    <strong>Target Date:</strong> ${new Date(userData.targetDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}<br>
                    <strong>Days to Target:</strong> ${userData.daysToTarget} days
                </p>
            </div>
            
            <div class="timestamp">
                <strong>Registration Time:</strong> ${new Date().toLocaleString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short'
                })}
            </div>
            
            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h3 style="margin: 0 0 10px 0; color: #856404;">📊 Quick Actions</h3>
                <p style="margin: 0; color: #856404;">
                    • Review user profile in admin dashboard<br>
                    • Monitor their progress and engagement<br>
                    • Send personalized welcome message if needed<br>
                    • Track conversion from registration to active usage
                </p>
            </div>
            
            <div class="footer">
                <p style="margin: 0 0 10px 0;">🎉 Another success story begins with GoooFit!</p>
                <p style="margin: 0; font-size: 12px; color: #999;">
                    This notification was automatically sent when a new user registered on gooofit.com
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
    
    const mailOptions = {
      from: '"GoooFit Registration Alert" <onboarding.gooofit@gmail.com>',
      to: 'omprakashutaha@gmail.com',
      subject: '🎉 New User Registration - GoooFit',
      html: registrationNotificationHTML,
      text: `New User Registration - GoooFit

🎉 A new user has registered on gooofit.com!

User Details:
- Name: ${userData.name}
- Email: ${userData.email}
- Mobile: ${userData.mobileNumber}
- Country: ${userData.country}
- Age: ${userData.age}
- Height: ${userData.height}cm
- Current Weight: ${userData.currentWeight}kg
- Goal Weight: ${userData.goalWeight}kg
- Target Date: ${new Date(userData.targetDate).toLocaleDateString()}
- Days to Target: ${userData.daysToTarget}

Registration Time: ${new Date().toLocaleString()}

This notification was automatically sent when a new user registered on gooofit.com.

Best regards,
GoooFit System`
    };

    console.log('📤 Sending registration notification email...');
    console.log('📧 From:', mailOptions.from);
    console.log('📧 To:', mailOptions.to);
    console.log('📧 Subject:', mailOptions.subject);

    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Registration notification email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('📧 Response:', result.response);
    
    return {
      success: true,
      messageId: result.messageId,
      response: result.response
    };
    
  } catch (error) {
    console.error('❌ Failed to send registration notification email:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      response: error.response
    });
    
    throw new Error(`Registration notification email failed: ${error.message}`);
  }
};

// Generic email sending function
const sendEmail = async (emailOptions) => {
  try {
    console.log('📤 Sending email...');
    console.log('📧 From:', emailOptions.from || 'onboarding.gooofit@gmail.com');
    console.log('📧 To:', emailOptions.to);
    console.log('📧 Subject:', emailOptions.subject);
    console.log('📧 Has attachments:', emailOptions.attachments ? emailOptions.attachments.length : 0);

    const mailOptions = {
      from: emailOptions.from || '"GoooFit Team" <onboarding.gooofit@gmail.com>',
      to: emailOptions.to,
      subject: emailOptions.subject,
      html: emailOptions.html,
      text: emailOptions.text,
      attachments: emailOptions.attachments || []
    };

    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('📧 Response:', result.response);
    
    return {
      success: true,
      messageId: result.messageId,
      response: result.response
    };
    
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      response: error.response
    });
    
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendRegistrationNotificationEmail,
  generateOTP,
  verifyTransporter,
  testEmailConfig
}; 