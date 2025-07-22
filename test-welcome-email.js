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
        <title>Welcome to GoooFit - Your Weight Loss Journey Starts Here!</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 20px;
            }
            
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            }
            
            .header {
                background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                padding: 40px 30px;
                text-align: center;
                color: white;
            }
            
            .logo {
                font-size: 36px;
                font-weight: bold;
                margin-bottom: 10px;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }
            
            .tagline {
                font-size: 18px;
                opacity: 0.9;
                font-weight: 300;
            }
            
            .content {
                padding: 40px 30px;
            }
            
            .welcome-message {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .welcome-title {
                font-size: 28px;
                color: #1f2937;
                margin-bottom: 15px;
                font-weight: 600;
            }
            
            .welcome-text {
                font-size: 16px;
                color: #6b7280;
                line-height: 1.8;
            }
            
            .stats-section {
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                border-radius: 15px;
                padding: 30px;
                margin: 30px 0;
                text-align: center;
            }
            
            .stats-title {
                font-size: 24px;
                color: #1f2937;
                margin-bottom: 25px;
                font-weight: 600;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
                margin-bottom: 20px;
            }
            
            .stat-item {
                text-align: center;
            }
            
            .stat-number {
                font-size: 32px;
                font-weight: bold;
                color: #4f46e5;
                margin-bottom: 8px;
            }
            
            .stat-label {
                font-size: 14px;
                color: #6b7280;
                font-weight: 500;
            }
            
            .features-section {
                margin: 30px 0;
            }
            
            .feature {
                background: #f8f9fa;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 15px;
                border-left: 4px solid #4f46e5;
                transition: transform 0.2s;
            }
            
            .feature:hover {
                transform: translateX(5px);
            }
            
            .feature h3 {
                color: #4f46e5;
                margin-bottom: 8px;
                font-size: 18px;
                font-weight: 600;
            }
            
            .feature p {
                color: #6b7280;
                margin: 0;
                font-size: 14px;
            }
            
            .cta-section {
                text-align: center;
                margin: 40px 0;
            }
            
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                color: white;
                padding: 18px 40px;
                text-decoration: none;
                border-radius: 50px;
                font-weight: bold;
                font-size: 16px;
                text-align: center;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
            }
            
            .cta-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
            }
            
            .footer {
                background: #f8f9fa;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e5e7eb;
            }
            
            .footer-text {
                color: #6b7280;
                font-size: 14px;
                margin-bottom: 15px;
            }
            
            .social-links {
                margin: 20px 0;
            }
            
            .social-links a {
                display: inline-block;
                margin: 0 10px;
                color: #6b7280;
                text-decoration: none;
                font-size: 14px;
                transition: color 0.2s;
            }
            
            .social-links a:hover {
                color: #4f46e5;
            }
            
            .copyright {
                color: #9ca3af;
                font-size: 12px;
                margin-top: 15px;
            }
            
            @media (max-width: 600px) {
                .stats-grid {
                    grid-template-columns: 1fr;
                    gap: 15px;
                }
                
                .content {
                    padding: 30px 20px;
                }
                
                .header {
                    padding: 30px 20px;
                }
                
                .logo {
                    font-size: 28px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="logo">GoooFit</div>
                <div class="tagline">Transform Your Weight Loss Journey</div>
            </div>
            
            <div class="content">
                <div class="welcome-message">
                    <div class="welcome-title">
                        Welcome to GoooFit, ${userName}! 🎉
                    </div>
                    <div class="welcome-text">
                        Congratulations on taking the first step towards a healthier, happier you! You're now part of a community of thousands who are achieving their weight loss goals with confidence.
                    </div>
                </div>
                
                <div class="stats-section">
                    <div class="stats-title">Our Community Impact</div>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-number">100+</div>
                            <div class="stat-label">Users Onboarded</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">4.7kg</div>
                            <div class="stat-label">Average Weight Loss</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">73.28%</div>
                            <div class="stat-label">Daily Updates</div>
                        </div>
                    </div>
                </div>
                
                <div class="features-section">
                    <div class="feature">
                        <h3>📊 Smart Analytics</h3>
                        <p>Track your progress with beautiful charts and AI-powered insights that help you understand your weight loss journey better.</p>
                    </div>
                    
                    <div class="feature">
                        <h3>🎯 Goal Setting</h3>
                        <p>Set personalized weight loss goals and track your progress with our intuitive dashboard and milestone celebrations.</p>
                    </div>
                    
                    <div class="feature">
                        <h3>📱 Mobile Optimized</h3>
                        <p>Access your weight management dashboard anywhere, anytime with our mobile-responsive design.</p>
                    </div>
                    
                    <div class="feature">
                        <h3>🔒 Secure & Private</h3>
                        <p>Your data is protected with enterprise-grade security. Your privacy is our top priority.</p>
                    </div>
                </div>
                
                <div class="cta-section">
                    <a href="https://www.gooofit.com" class="cta-button">
                        Start Your Journey Now
                    </a>
                </div>
            </div>
            
            <div class="footer">
                <div class="footer-text">
                    Thank you for choosing GoooFit!
                </div>
                <div class="social-links">
                    <a href="#">Privacy Policy</a> |
                    <a href="#">Terms of Service</a> |
                    <a href="#">Support</a>
                </div>
                <div class="footer-text">
                    If you have any questions, feel free to reach out to us at <strong>support@gooofit.com</strong>
                </div>
                <div class="copyright">
                    © 2024 GoooFit. All rights reserved.
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Test welcome email
const testWelcomeEmail = async () => {
  try {
    console.log('🧪 Testing improved GoooFit welcome email...');
    
    const mailOptions = {
      from: '"GoooFit Team" <support@gooofit.com>',
      to: 'support@gooofit.com', // Send to yourself for testing
      subject: '🎉 Welcome to GoooFit - Your Weight Loss Journey Starts Here!',
      html: createWelcomeEmail('Test User')
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Improved welcome email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📬 Check your email inbox for the beautiful new GoooFit welcome message');
    console.log('🎨 Features: Symmetric design, better typography, improved layout');
    
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