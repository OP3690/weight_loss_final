import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Components
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Analytics from './components/Analytics';
import WeightEntry from './components/WeightEntry';
import Navigation from './components/Navigation';
import Onboarding from './components/Onboarding';
import BMICalculator from './components/BMICalculator';
import HomePage from './components/HomePage';

// Context
import { UserProvider } from './context/UserContext';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingMode, setOnboardingMode] = useState('register'); // 'register' or 'login'

  useEffect(() => {
    // Check for existing user in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const handleUserLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setShowOnboarding(false); // Close the modal after successful login
    toast.success(`Welcome back, ${user.name}!`);
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <UserProvider value={{ currentUser, setCurrentUser: handleUserLogin, logout: handleUserLogout }}>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-success-50 flex flex-col">
        {/* Home Page */}
        {!currentUser && (
          <HomePage
            onStartDemo={() => handleUserLogin({ id: 'demo', name: 'Demo User' })}
            onRegister={() => { setShowOnboarding(true); setOnboardingMode('register'); }}
            onLogin={() => { setShowOnboarding(true); setOnboardingMode('login'); }}
          />
        )}

        {/* Main App Content */}
        {currentUser && (
          <div className="flex-1">
            <Navigation currentUser={currentUser} onLogout={handleUserLogout} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/weight-entry" element={<WeightEntry />} />
              <Route path="/bmi-calculator" element={<BMICalculator />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        )}

        {/* Onboarding Modal */}
        {showOnboarding && !currentUser && (
          <Onboarding
            onSuccess={handleUserLogin}
            onClose={() => setShowOnboarding(false)}
            initialMode={onboardingMode}
          />
        )}


      </div>
    </UserProvider>
  );
}

export default App; 