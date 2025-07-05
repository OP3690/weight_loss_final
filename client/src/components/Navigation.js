import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  User, 
  BarChart3, 
  Plus, 
  LogOut, 
  Menu, 
  X,
  Activity,
  Calculator
} from 'lucide-react';
import { useUser } from '../context/UserContext';

const Navigation = ({ currentUser, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/bmi-calculator', label: 'BMI Calculator', icon: Calculator },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-8 h-8 bg-gradient-to-r from-primary-500 to-success-500 rounded-lg flex items-center justify-center"
              >
                <Activity className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold text-gradient">WeightTracker</span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive(item.path)
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {isActive(item.path) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary-50 rounded-lg -z-10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-medium text-gray-900">{currentUser.name}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-success-500 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gradient">WeightTracker</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <motion.div
            initial={false}
            animate={{ height: isMobileMenuOpen ? 'auto' : 0, opacity: isMobileMenuOpen ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive(item.path)
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              <div className="border-t border-gray-200 pt-2 mt-4">
                <div className="px-3 py-2 text-sm text-gray-600">
                  Welcome, <span className="font-medium text-gray-900">{currentUser.name}</span>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-3 py-2 w-full text-left text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </nav>
    </>
  );
};

export default Navigation; 