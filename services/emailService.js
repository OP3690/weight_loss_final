const nodemailer = require('nodemailer');

// Create transporter for GoDaddy email (gooofit.com)
const transporter = nodemailer.createTransport({
  host: 'smtpout.secureserver.net', // GoDaddy's own SMTP server
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'support@gooofit.com',
    pass: process.env.EMAIL_PASSWORD || 'Fortune$$336699'
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true, // Enable debug output
  logger: true // Log to console
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

// Enhanced Password Reset Email Template
const createPasswordResetEmail = (userName, otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - GoooFit</title>
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
                background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
                padding: 20px;
                min-height: 100vh;
            }
            
            .email-container {
                max-width: 500px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
                position: relative;
            }
            
            .header {
                background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
                padding: 50px 30px;
                text-align: center;
                color: white;
                position: relative;
                overflow: hidden;
            }
            
            .header::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                animation: float 6s ease-in-out infinite;
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(180deg); }
            }
            
            .logo {
                font-size: 42px;
                font-weight: bold;
                margin-bottom: 15px;
                text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                position: relative;
                z-index: 1;
            }
            
            .logo-icon {
                display: inline-block;
                width: 50px;
                height: 50px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                margin-right: 15px;
                vertical-align: middle;
                position: relative;
            }
            
            .logo-icon::before {
                content: '🎯';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 24px;
            }
            
            .tagline {
                font-size: 18px;
                opacity: 0.95;
                font-weight: 300;
                position: relative;
                z-index: 1;
            }
            
            .content {
                padding: 50px 40px;
                text-align: center;
            }
            
            .title {
                font-size: 32px;
                color: #1f2937;
                margin-bottom: 25px;
                font-weight: 700;
                background: linear-gradient(135deg, #ff6b6b, #ff8e53);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .message {
                font-size: 18px;
                color: #6b7280;
                margin-bottom: 40px;
                line-height: 1.8;
                max-width: 400px;
                margin-left: auto;
                margin-right: auto;
            }
            
            .otp-section {
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                border-radius: 20px;
                padding: 40px 30px;
                margin: 40px 0;
                border: 2px solid #e5e7eb;
                position: relative;
                overflow: hidden;
            }
            
            .otp-section::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #ff6b6b, #ff8e53, #ff6b6b);
                background-size: 200% 100%;
                animation: shimmer 2s linear infinite;
            }
            
            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            
            .otp-label {
                font-size: 16px;
                color: #6b7280;
                margin-bottom: 20px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .otp-code {
                font-size: 56px;
                font-weight: bold;
                color: #ff6b6b;
                letter-spacing: 12px;
                margin: 25px 0;
                font-family: 'Courier New', monospace;
                text-shadow: 0 2px 4px rgba(255, 107, 107, 0.3);
                background: linear-gradient(135deg, #ff6b6b, #ff8e53);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .otp-note {
                font-size: 14px;
                color: #6b7280;
                margin-top: 20px;
                line-height: 1.6;
                background: rgba(255, 255, 255, 0.8);
                padding: 15px;
                border-radius: 10px;
                border-left: 4px solid #ff6b6b;
            }
            
            .security-info {
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                border-radius: 15px;
                padding: 25px;
                margin: 30px 0;
                border: 1px solid #f59e0b;
            }
            
            .security-title {
                font-size: 18px;
                color: #92400e;
                margin-bottom: 15px;
                font-weight: 600;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .security-title::before {
                content: '🔒';
                margin-right: 10px;
                font-size: 20px;
            }
            
            .security-text {
                font-size: 14px;
                color: #92400e;
                line-height: 1.6;
            }
            
            .steps-section {
                margin: 40px 0;
                text-align: left;
            }
            
            .step {
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 12px;
                border-left: 4px solid #ff6b6b;
            }
            
            .step-number {
                width: 30px;
                height: 30px;
                background: linear-gradient(135deg, #ff6b6b, #ff8e53);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                margin-right: 15px;
                flex-shrink: 0;
            }
            
            .step-text {
                font-size: 14px;
                color: #6b7280;
                font-weight: 500;
            }
            
            .footer {
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                padding: 40px 30px;
                text-align: center;
                border-top: 1px solid #e5e7eb;
            }
            
            .footer-text {
                color: #6b7280;
                font-size: 14px;
                margin-bottom: 15px;
                line-height: 1.6;
            }
            
            .contact-info {
                background: rgba(255, 255, 255, 0.8);
                padding: 20px;
                border-radius: 12px;
                margin: 20px 0;
                border: 1px solid #e5e7eb;
            }
            
            .contact-email {
                color: #ff6b6b;
                font-weight: 600;
                text-decoration: none;
            }
            
            .copyright {
                color: #9ca3af;
                font-size: 12px;
                margin-top: 20px;
            }
            
            .warning-box {
                background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
                border: 1px solid #f87171;
                border-radius: 12px;
                padding: 20px;
                margin: 30px 0;
                text-align: center;
            }
            
            .warning-title {
                font-size: 16px;
                color: #dc2626;
                margin-bottom: 10px;
                font-weight: 600;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .warning-title::before {
                content: '⚠️';
                margin-right: 8px;
            }
            
            .warning-text {
                font-size: 14px;
                color: #dc2626;
                line-height: 1.5;
            }
            
            @media (max-width: 600px) {
                .content {
                    padding: 40px 25px;
                }
                
                .header {
                    padding: 40px 25px;
                }
                
                .logo {
                    font-size: 32px;
                }
                
                .otp-code {
                    font-size: 42px;
                    letter-spacing: 8px;
                }
                
                .title {
                    font-size: 28px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="logo">
                    <span class="logo-icon"></span>
                    GoooFit
                </div>
                <div class="tagline">Secure Password Reset</div>
            </div>
            
            <div class="content">
                <div class="title">Password Reset Request</div>
                <div class="message">
                    Hi <strong>${userName}</strong>,<br><br>
                    We received a request to reset your password for your GoooFit account. Use the secure OTP below to complete your password reset process.
                </div>
                
                <div class="otp-section">
                    <div class="otp-label">Your Security Code</div>
                    <div class="otp-code">${otp}</div>
                    <div class="otp-note">
                        <strong>⏰ Expires in 10 minutes</strong><br>
                        <strong>🔐 One-time use only</strong><br>
                        <strong>📧 Sent to your registered email</strong>
                    </div>
                </div>
                
                <div class="steps-section">
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-text">Copy the 6-digit code above</div>
                    </div>
                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-text">Paste it into the OTP field on GoooFit</div>
                    </div>
                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-text">Create your new secure password</div>
                    </div>
                </div>
                
                <div class="security-info">
                    <div class="security-title">Security Notice</div>
                    <div class="security-text">
                        This OTP is valid for 10 minutes only. If you didn't request this password reset, 
                        please ignore this email and ensure your account is secure. Your password will remain unchanged.
                    </div>
                </div>
                
                <div class="warning-box">
                    <div class="warning-title">Important Security Reminder</div>
                    <div class="warning-text">
                        Never share this OTP with anyone. GoooFit staff will never ask for your password or OTP codes.
                        If you receive suspicious requests, please contact us immediately.
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <div class="footer-text">
                    Need help? We're here to support you!
                </div>
                <div class="contact-info">
                    <div class="footer-text">
                        Contact us at: <a href="mailto:support@gooofit.com" class="contact-email">support@gooofit.com</a>
                    </div>
                    <div class="footer-text">
                        Visit: <a href="https://www.gooofit.com" style="color: #ff6b6b; text-decoration: none;">www.gooofit.com</a>
                    </div>
                </div>
                <div class="copyright">
                    © 2024 GoooFit. All rights reserved. | Secure • Private • Reliable
                </div>
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
      from: '"GoooFit Team" <support@gooofit.com>',
      to: userEmail,
      subject: '🎉 Welcome to GoooFit - Your Weight Loss Journey Starts Here!',
      html: createWelcomeEmail(userName)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully to:', userEmail);
    return info;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
};

// Send Password Reset Email
const sendPasswordResetEmail = async (userEmail, userName, otp) => {
  try {
    console.log('Attempting to send password reset email to:', userEmail);
    console.log('Using email configuration:', {
      host: 'smtpout.secureserver.net',
      port: 587,
      user: process.env.EMAIL_USER || 'support@gooofit.com'
    });

    const mailOptions = {
      from: '"GoooFit Security" <support@gooofit.com>',
      to: userEmail,
      subject: '🔐 Password Reset - GoooFit Security Code',
      html: createPasswordResetEmail(userName, otp),
      priority: 'high'
    };

    console.log('Mail options prepared:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully to:', userEmail);
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    return info;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    throw error;
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