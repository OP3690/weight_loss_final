const nodemailer = require('nodemailer');

// Create transporter for Gmail (you'll need to set up app-specific password)
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'support@gooofit.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-specific-password'
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
                text-align: center;
            }
            .social-links a {
                display: inline-block;
                margin: 0 10px;
                color: #4f46e5;
                text-decoration: none;
            }
            .stats {
                display: flex;
                justify-content: space-around;
                margin: 30px 0;
                text-align: center;
            }
            .stat {
                flex: 1;
                padding: 15px;
            }
            .stat-number {
                font-size: 24px;
                font-weight: bold;
                color: #4f46e5;
                display: block;
            }
            .stat-label {
                font-size: 14px;
                color: #6b7280;
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
                <p>Congratulations on taking the first step towards a healthier, happier you! You're now part of a community of thousands who are achieving their weight loss goals with confidence.</p>
                
                <div class="stats">
                    <div class="stat">
                        <span class="stat-number">100+</span>
                        <span class="stat-label">Users Onboarded</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">4.7kg</span>
                        <span class="stat-label">Average Weight Loss</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">73.28%</span>
                        <span class="stat-label">Daily Updates</span>
                    </div>
                </div>
                
                <h3>What's waiting for you:</h3>
                
                <div class="feature">
                    <h3>📊 Smart Analytics</h3>
                    <p>Track your progress with beautiful charts and AI-powered insights that help you understand your weight loss journey better.</p>
                </div>
                
                <div class="feature">
                    <h3>🎯 Goal Tracking</h3>
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
            
            <div style="text-align: center;">
                <a href="https://gooofit.com" class="cta-button">
                    Start Your Journey Now
                </a>
            </div>
            
            <div class="social-links">
                <a href="#">Privacy Policy</a> | 
                <a href="#">Terms of Service</a> | 
                <a href="#">Support</a>
            </div>
            
            <div class="footer">
                <p>Thank you for choosing WeightPro!</p>
                <p>If you have any questions, feel free to reach out to us at support@gooofit.com</p>
                <p>© 2024 WeightPro. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Password Reset Email Template
const createPasswordResetEmail = (userName, otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - WeightPro</title>
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
            .title {
                font-size: 24px;
                color: #1f2937;
                margin-bottom: 20px;
                text-align: center;
            }
            .otp-container {
                background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                color: white;
                padding: 30px;
                border-radius: 15px;
                text-align: center;
                margin: 30px 0;
            }
            .otp-code {
                font-size: 36px;
                font-weight: bold;
                letter-spacing: 8px;
                margin: 20px 0;
                font-family: 'Courier New', monospace;
            }
            .warning {
                background-color: #fef3c7;
                border: 1px solid #f59e0b;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
                color: #92400e;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                color: #6b7280;
                font-size: 14px;
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
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">WeightPro</div>
            </div>
            
            <div class="title">
                Password Reset Request
            </div>
            
            <p>Hello ${userName},</p>
            
            <p>We received a request to reset your password for your WeightPro account. To proceed with the password reset, please use the following OTP (One-Time Password):</p>
            
            <div class="otp-container">
                <div style="font-size: 18px; margin-bottom: 10px;">Your OTP Code:</div>
                <div class="otp-code">${otp}</div>
                <div style="font-size: 14px;">This code will expire in 10 minutes</div>
            </div>
            
            <div class="warning">
                <strong>⚠️ Security Notice:</strong><br>
                • Never share this OTP with anyone<br>
                • WeightPro will never ask for your OTP via phone or email<br>
                • If you didn't request this reset, please ignore this email
            </div>
            
            <p>If you're having trouble with the OTP, you can also click the button below to reset your password directly:</p>
            
            <div style="text-align: center;">
                <a href="https://gooofit.com/reset-password" class="cta-button">
                    Reset Password
                </a>
            </div>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team at support@gooofit.com</p>
            
            <div class="footer">
                <p>Thank you for using WeightPro!</p>
                <p>© 2024 WeightPro. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Send Welcome Email
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const mailOptions = {
      from: '"WeightPro Team" <support@gooofit.com>',
      to: userEmail,
      subject: '🎉 Welcome to WeightPro - Your Weight Loss Journey Starts Here!',
      html: createWelcomeEmail(userName)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

// Send Password Reset Email
const sendPasswordResetEmail = async (userEmail, userName, otp) => {
  try {
    const mailOptions = {
      from: '"WeightPro Security" <support@gooofit.com>',
      to: userEmail,
      subject: '🔐 Password Reset Request - WeightPro',
      html: createPasswordResetEmail(userName, otp)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  generateOTP
}; 