import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  ArrowLeftIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const PasswordReset = ({ onBackToLogin }) => {
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resend OTP
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/users/forgot-password', { email });
      toast.success('OTP sent successfully! Check your email.');
      setOtpSent(true);
      setStep(2);
      setCountdown(60); // 60 seconds countdown
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send OTP';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/users/verify-otp', { email, otp });
      toast.success('OTP verified successfully!');
      setStep(3);
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid OTP';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/users/reset-password', {
        email,
        otp,
        newPassword,
        confirmPassword
      });
      toast.success('Password reset successfully!');
      onBackToLogin();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    try {
      await axios.post('/api/users/forgot-password', { email });
      toast.success('OTP resent successfully!');
      setCountdown(60);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resend OTP';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <EnvelopeIcon className="w-8 h-8 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Forgot Password?</h2>
        <p className="text-gray-600 leading-relaxed">
          No worries! Enter your email address and we'll send you a secure OTP to reset your password.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
          Email Address
        </label>
        <div className="relative">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm bg-gray-50 focus:bg-white"
            placeholder="Enter your email address"
            disabled={loading}
          />
          <EnvelopeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <button
        onClick={handleSendOTP}
        disabled={loading || !email}
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Sending OTP...
          </div>
        ) : (
          'Send OTP'
        )}
      </button>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheckIcon className="w-8 h-8 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Enter OTP</h2>
        <p className="text-gray-600 leading-relaxed">
          We've sent a 6-digit security code to{' '}
          <span className="font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-md">{email}</span>
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="otp" className="block text-sm font-semibold text-gray-700">
          OTP Code
        </label>
        <input
          type="text"
          id="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-xl font-mono tracking-widest bg-gray-50 focus:bg-white transition-all duration-200"
          placeholder="000000"
          maxLength={6}
          disabled={loading}
        />
        <p className="text-xs text-gray-500 text-center">Enter the 6-digit code from your email</p>
      </div>

      <button
        onClick={handleVerifyOTP}
        disabled={loading || otp.length !== 6}
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Verifying...
          </div>
        ) : (
          'Verify OTP'
        )}
      </button>

      <div className="text-center space-y-3">
        <div className="flex items-center justify-center text-gray-500">
          <ClockIcon className="w-4 h-4 mr-2" />
          <span className="text-sm">
            {countdown > 0 ? `Resend available in ${countdown}s` : 'Didn\'t receive the OTP?'}
          </span>
        </div>
        <button
          onClick={handleResendOTP}
          disabled={countdown > 0 || loading}
          className="text-orange-600 hover:text-orange-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors duration-200 hover:underline"
        >
          {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
        </button>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <LockClosedIcon className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Set New Password</h2>
        <p className="text-gray-600 leading-relaxed">
          Create a strong new password for your account. Make sure it's secure and memorable.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm bg-gray-50 focus:bg-white"
              placeholder="Enter new password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {newPassword && (
            <div className="flex items-center space-x-2 text-xs">
              {newPassword.length >= 6 ? (
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
              ) : (
                <ExclamationCircleIcon className="h-4 w-4 text-red-500" />
              )}
              <span className={newPassword.length >= 6 ? 'text-green-600' : 'text-red-600'}>
                At least 6 characters
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm bg-gray-50 focus:bg-white"
              placeholder="Confirm new password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {confirmPassword && (
            <div className="flex items-center space-x-2 text-xs">
              {newPassword === confirmPassword && newPassword.length >= 6 ? (
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
              ) : (
                <ExclamationCircleIcon className="h-4 w-4 text-red-500" />
              )}
              <span className={newPassword === confirmPassword && newPassword.length >= 6 ? 'text-green-600' : 'text-red-600'}>
                {newPassword === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
              </span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleResetPassword}
        disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 6}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Resetting Password...
          </div>
        ) : (
          'Reset Password'
        )}
      </button>
    </motion.div>
  );

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Back Button */}
      <button
        onClick={onBackToLogin}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors text-sm font-medium group"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Login
      </button>

      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-3">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  step >= stepNumber
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div
                  className={`w-8 h-1 mx-2 rounded-full transition-all duration-300 ${
                    step > stepNumber ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </AnimatePresence>
    </div>
  );
};

export default PasswordReset; 