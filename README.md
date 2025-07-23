# Weight Management Dashboard

A comprehensive weight management application with BMI tracking, analytics, and user management.

## Features

- **User Authentication**: Secure login/signup with JWT tokens
- **Weight Tracking**: Daily weight entries with progress visualization
- **BMI Calculator**: Real-time BMI calculation and categorization
- **Analytics Dashboard**: Comprehensive weight loss analytics and insights
- **SMS Password Reset**: Secure password reset via SMS OTP
- **Email Notifications**: Welcome emails and password reset emails
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT, bcryptjs
- **SMS**: Twilio
- **Email**: Nodemailer with SendGrid
- **Deployment**: Vercel (Frontend), Render (Backend)

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start development server: `npm run dev`

## Environment Variables

Create a `.env` file with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
SENDGRID_API_KEY=your_sendgrid_api_key
```

## Deployment

- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Render

## API Endpoints

- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/forgot-password-sms` - SMS password reset
- `POST /api/weight-entries` - Add weight entry
- `GET /api/weight-entries` - Get user's weight entries

---

**Deployment Trigger**: Force Vercel deployment for SMS password reset fix - v5.0 