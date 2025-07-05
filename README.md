# Weight Management Dashboard

A full-stack weight management application with goal tracking, progress visualization, and analytics.

## Features

- **User Authentication**: Secure user registration and login
- **Weight Tracking**: Daily weight entry with notes
- **Goal Management**: Set and track weight loss/gain goals
- **Progress Visualization**: Interactive dashboard with progress bars and charts
- **Analytics**: Detailed progress analytics and milestone tracking
- **Responsive Design**: Modern UI that works on desktop and mobile

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing

### Frontend
- **React.js** with hooks
- **Tailwind CSS** for styling
- **Chart.js** for data visualization
- **Axios** for API calls

## Project Structure

```
AA/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context
│   │   └── services/       # API services
│   └── package.json
├── models/                 # MongoDB models
├── routes/                 # Express routes
├── server.js              # Express server
└── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/OP3690/weight_loss.git
   cd weight_loss
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=3001
   ```

5. **Start the development servers**

   **Backend (Terminal 1):**
   ```bash
   npm run dev
   ```

   **Frontend (Terminal 2):**
   ```bash
   cd client
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login

### Weight Entries
- `GET /api/weight-entries` - Get user's weight entries
- `POST /api/weight-entries` - Create new weight entry
- `PUT /api/weight-entries/:id` - Update weight entry
- `DELETE /api/weight-entries/:id` - Delete weight entry

### Analytics
- `GET /api/analytics` - Get user's progress analytics

## Deployment

### Backend Deployment (Vercel/Railway/Heroku)

1. **Prepare for deployment**
   - Ensure all environment variables are set
   - Update CORS settings for production domain

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

3. **Deploy to Railway**
   - Connect your GitHub repository
   - Set environment variables
   - Deploy automatically

### Frontend Deployment (Vercel)

1. **Build the frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   # From the client directory
   vercel
   ```

3. **Update API URL**
   - Update the API base URL in `client/src/services/api.js`
   - Point to your deployed backend URL

### Environment Variables for Production

**Backend (.env):**
```env
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
PORT=3001
NODE_ENV=production
```

**Frontend:**
Update `client/src/services/api.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@example.com or create an issue in the GitHub repository. 