import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, User, BarChart3, Plus, Home } from 'lucide-react';
import toast from 'react-hot-toast';

// Components
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Analytics from './components/Analytics';
import WeightEntry from './components/WeightEntry';
import Navigation from './components/Navigation';
import Onboarding from './components/Onboarding';
import BMICalculator from './components/BMICalculator';

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
        {/* Hero Section */}
        {!currentUser && (
          <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
            <div className="max-w-lg w-full bg-white/80 glass-effect rounded-2xl shadow-xl p-10 text-center animate-float">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary-500 to-success-500 flex items-center justify-center shadow-lg">
                  <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path d="M12 3v18m9-9H3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gradient mb-2">Weight Management Dashboard</h1>
              <p className="text-gray-600 mb-8">Track your weight, calculate BMI, and achieve your health goals with beautiful analytics and a modern experience.</p>
              <div className="space-y-3">
                <button
                  onClick={() => handleUserLogin({ id: 'demo', name: 'Demo User' })}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <span>Start Demo</span>
                </button>
                <button
                  onClick={() => { setShowOnboarding(true); setOnboardingMode('register'); }}
                  className="w-full btn-secondary flex items-center justify-center space-x-2"
                >
                  <span>Create your profile to get started</span>
                </button>
                <button
                  onClick={() => { setShowOnboarding(true); setOnboardingMode('login'); }}
                  className="w-full btn-secondary flex items-center justify-center space-x-2 border border-primary-200"
                >
                  <span>Login</span>
                </button>
                <div className="text-center mt-2">
                  <p className="text-sm text-gray-500">
                    Already have an account? Use your email to login.
                  </p>
                </div>
              </div>
            </div>
          </div>
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
        {showOnboarding && (
          <Onboarding
            onSuccess={handleUserLogin}
            onClose={() => setShowOnboarding(false)}
            initialMode={onboardingMode}
          />
        )}

        {/* Footer */}
        <footer className="w-full py-6 bg-white/80 border-t border-gray-200 text-center mt-auto">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between px-4">
            <div className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Weight Management Dashboard. All rights reserved.</div>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <a href="#features" className="text-primary-600 hover:underline">Features</a>
              <a href="#contact" className="text-primary-600 hover:underline">Contact</a>
              <a href="#privacy" className="text-primary-600 hover:underline">Privacy</a>
            </div>
          </div>
        </footer>
      </div>
    </UserProvider>
  );
}

export default App; 