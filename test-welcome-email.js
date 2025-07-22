const nodemailer = require('nodemailer');

// Create transporter for GoDaddy email (gooofit.com)
const transporter = nodemailer.createTransport({
  host: 'smtpout.secureserver.net', // GoDaddy's own SMTP server
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'support@gooofit.com',
    pass: 'Fortune$$336699'
  }
});

// Welcome Email Template
const createWelcomeEmail = (userName) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to WeightPro - Your Weight Loss Journey Starts Here!</title>
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
                font-size: 28px;
                font-weight: bold;
                color: #4f46e5;
                margin-bottom: 10px;
            }
            .tagline {
                color: #6b7280;
                font-size: 16px;
            }
            .welcome-message {
                font-size: 24px;
                color: #1f2937;
                margin-bottom: 20px;
                text-align: center;
            }
            .content {
                margin-bottom: 30px;
            }
            .feature {
                background-color: #f3f4f6;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 15px;
                border-left: 4px solid #4f46e5;
            }
            .feature h3 {
                color: #4f46e5;
                margin: 0 0 8px 0;
                font-size: 18px;
            }
            .feature p {
                margin: 0;
                color: #6b7280;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 25px;
                font-weight: bold;
                text-align: center;
                margin: 20px 0;
                transition: transform 0.2s;
            }
            .cta-button:hover {
                transform: translateY(-2px);
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                color: #6b7280;
                font-size: 14px;
            }
            .social-links {
                margin: 20px 0;
            }
            .social-links a {
                display: inline-block;
                margin: 0 10px;
                color: #6b7280;
                text-decoration: none;
            }
            .stats {
                background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                color: white;
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
                text-align: center;
            }
            .stats h3 {
                margin: 0 0 10px 0;
                font-size: 20px;
            }
            .stats p {
                margin: 5px 0;
                font-size: 16px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">WeightPro</div>
                <div class="tagline">Transform Your Weight Loss Journey</div>
            </div>
            
            <div class="welcome-message">
                Welcome to WeightPro, ${userName}! 🎉
            </div>
            
            <div class="content">
                <p>Thank you for joining our community of health-conscious individuals! We're excited to be part of your weight loss journey.</p>
                
                <div class="stats">
                    <h3>Our Community Impact</h3>
                    <p>🌟 100+ users onboarded in 30 Days</p>
                    <p>📊 Users have reduced 4.7 Kg on average in 3 months</p>
                    <p>📈 73.28% users update it daily</p>
                </div>
                
                <div class="feature">
                    <h3>🚀 What's Next?</h3>
                    <p>Start tracking your weight, set goals, and watch your progress with our intuitive dashboard.</p>
                </div>
                
                <div class="feature">
                    <h3>📱 Key Features</h3>
                    <p>• Daily weight tracking with beautiful charts</p>
                    <p>• BMI calculator and health insights</p>
                    <p>• Goal setting and milestone tracking</p>
                    <p>• Progress analytics and trends</p>
                </div>
                
                <div style="text-align: center;">
                    <a href="https://gooofit.com" class="cta-button">
                        Start Your Journey Now
                    </a>
                </div>
            </div>
            
            <div class="footer">
                <p>Best regards,<br>The WeightPro Team</p>
                <div class="social-links">
                    <a href="#">Website</a> |
                    <a href="#">Support</a> |
                    <a href="#">Privacy Policy</a>
                </div>
                <p>© 2024 WeightPro. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Test welcome email
const testWelcomeEmail = async () => {
  try {
    console.log('🧪 Testing welcome email...');
    
    const mailOptions = {
      from: '"WeightPro Team" <support@gooofit.com>',
      to: 'support@gooofit.com', // Send to yourself for testing
      subject: '🎉 Welcome to WeightPro - Your Weight Loss Journey Starts Here!',
      html: createWelcomeEmail('Test User')
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📬 Check your email inbox for the beautiful welcome message');
    
  } catch (error) {
    console.error('❌ Welcome email test failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Verify your GoDaddy email credentials are correct');
    console.log('2. Check if your GoDaddy email is properly configured');
    console.log('3. Make sure the password is correct');
    console.log('4. Contact GoDaddy support if email is not working');
  }
};

// Run the test
testWelcomeEmail(); 