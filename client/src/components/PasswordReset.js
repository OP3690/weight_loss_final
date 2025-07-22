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
  ClockIcon,
  XMarkIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import { userAPI } from '../services/api';
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
  const [error, setError] = useState('');
  const [resetMethod, setResetMethod] = useState('email'); // 'email' or 'sms'
  const [mobileNumber, setMobileNumber] = useState('');

  // Countdown timer for resend OTP
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async () => {
    if (resetMethod === 'email') {
      if (!email) {
        setError('Please enter your email address');
        return;
      }

      setError('');
      setLoading(true);
      try {
        console.log('Sending OTP request for email:', email);
        const response = await userAPI.forgotPassword(email);
        console.log('OTP response:', response);
        
        if (response.message) {
          toast.success('OTP sent successfully! Check your email.');
          setOtpSent(true);
          setStep(2);
          setCountdown(60); // 60 seconds countdown
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        console.error('OTP sending error:', error);
        const message = error.response?.data?.message || error.message || 'Failed to send OTP. Please try again.';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    } else {
      // SMS OTP
      if (!mobileNumber) {
        setError('Please enter your mobile number');
        return;
      }

      setError('');
      setLoading(true);
      try {
        console.log('Sending SMS OTP request for mobile:', mobileNumber);
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://weight-management-backend.onrender.com/api'}/users/forgot-password-sms`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mobileNumber }),
        });

        const data = await response.json();
        
        if (response.ok) {
          toast.success('SMS OTP sent successfully! Check your phone.');
          setOtpSent(true);
          setStep(2);
          setCountdown(60); // 60 seconds countdown
        } else {
          throw new Error(data.message || 'Failed to send SMS OTP');
        }
      } catch (error) {
        console.error('SMS OTP sending error:', error);
        const message = error.message || 'Failed to send SMS OTP. Please try again.';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setError('');
    setLoading(true);
    try {
      if (resetMethod === 'email') {
        await userAPI.verifyOTP(email, otp);
        toast.success('OTP verified successfully!');
        setStep(3);
      } else {
        // SMS OTP verification
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://weight-management-backend.onrender.com/api'}/users/verify-sms-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mobileNumber, otp }),
        });

        const data = await response.json();
        
        if (response.ok) {
          toast.success('SMS OTP verified successfully!');
          setStep(3);
        } else {
          throw new Error(data.message || 'Invalid SMS OTP');
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Invalid OTP';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setLoading(true);
    try {
      if (resetMethod === 'email') {
        await userAPI.resetPassword(email, otp, newPassword, confirmPassword);
        toast.success('Password reset successfully! You can now login with your new password.');
        onBackToLogin();
      } else {
        // SMS password reset
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://weight-management-backend.onrender.com/api'}/users/reset-password-sms`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mobileNumber, otp, newPassword, confirmPassword }),
        });

        const data = await response.json();
        
        if (response.ok) {
          toast.success('Password reset successfully! You can now login with your new password.');
          onBackToLogin();
        } else {
          throw new Error(data.message || 'Failed to reset password');
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to reset password';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setError('');
    setLoading(true);
    try {
      await userAPI.forgotPassword(email);
      toast.success('OTP resent successfully!');
      setCountdown(60);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to resend OTP';
      setError(message);
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
      className="space-y-8"
    >
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <EnvelopeIcon className="w-10 h-10 text-orange-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Forgot Password?</h2>
        <p className="text-gray-600 leading-relaxed text-lg max-w-sm mx-auto">
          Choose how you'd like to reset your password
        </p>
      </div>

      {/* Reset Method Selection */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setResetMethod('email')}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              resetMethod === 'email'
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <EnvelopeIcon className="w-8 h-8 mx-auto mb-2" />
            <div className="text-sm font-medium">Email OTP</div>
            <div className="text-xs text-gray-500">Send to your email</div>
          </button>
          
          <button
            onClick={() => setResetMethod('sms')}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              resetMethod === 'sms'
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <DevicePhoneMobileIcon className="w-8 h-8 mx-auto mb-2" />
            <div className="text-sm font-medium">SMS OTP</div>
            <div className="text-xs text-gray-500">Send to your phone</div>
          </button>
        </div>

        {resetMethod === 'email' ? (
          <div className="space-y-4">
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
                  className="w-full px-5 py-4 pl-14 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-base bg-gray-50 focus:bg-white"
                  placeholder="Enter your email address"
                  disabled={loading}
                />
                <EnvelopeIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <button
              onClick={handleSendOTP}
              disabled={loading || !email}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Sending OTP...
                </div>
              ) : (
                'Send Email OTP'
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="mobileNumber" className="block text-sm font-semibold text-gray-700">
                Mobile Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="mobileNumber"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full px-5 py-4 pl-14 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-base bg-gray-50 focus:bg-white"
                  placeholder="+919723231499"
                  disabled={loading}
                />
                <DevicePhoneMobileIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500">Enter your mobile number with country code</p>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <button
              onClick={handleSendOTP}
              disabled={loading || !mobileNumber}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Sending OTP...
                </div>
              ) : (
                'Send SMS OTP'
              )}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheckIcon className="w-10 h-10 text-orange-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Enter OTP</h2>
        <p className="text-gray-600 leading-relaxed text-lg">
          We've sent a 6-digit security code to{' '}
          <span className="font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">{email}</span>
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="otp" className="block text-sm font-semibold text-gray-700">
            OTP Code
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-2xl font-mono tracking-widest bg-gray-50 focus:bg-white transition-all duration-200"
            placeholder="000000"
            maxLength={6}
            disabled={loading}
          />
          <p className="text-sm text-gray-500 text-center">Enter the 6-digit code from your email</p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
      </div>

      <button
        onClick={handleVerifyOTP}
        disabled={loading || otp.length !== 6}
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
            Verifying...
          </div>
        ) : (
          'Verify OTP'
        )}
      </button>

      <div className="text-center space-y-4">
        <div className="flex items-center justify-center text-gray-500">
          <ClockIcon className="w-5 h-5 mr-2" />
          <span className="text-base">
            {countdown > 0 ? `Resend available in ${countdown}s` : 'Didn\'t receive the OTP?'}
          </span>
        </div>
        <button
          onClick={handleResendOTP}
          disabled={countdown > 0 || loading}
          className="text-orange-600 hover:text-orange-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-base transition-colors duration-200 hover:underline"
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
      className="space-y-8"
    >
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <LockClosedIcon className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Set New Password</h2>
        <p className="text-gray-600 leading-relaxed text-lg max-w-sm mx-auto">
          Create a strong new password for your account. Make sure it's secure and memorable.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-5 py-4 pr-14 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-base bg-gray-50 focus:bg-white"
              placeholder="Enter new password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-6 w-6" />
              ) : (
                <EyeIcon className="h-6 w-6" />
              )}
            </button>
          </div>
          {newPassword && (
            <div className="flex items-center space-x-2 text-sm">
              {newPassword.length >= 6 ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : (
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              )}
              <span className={newPassword.length >= 6 ? 'text-green-600' : 'text-red-600'}>
                At least 6 characters
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-5 py-4 pr-14 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-base bg-gray-50 focus:bg-white"
              placeholder="Confirm new password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-6 w-6" />
              ) : (
                <EyeIcon className="h-6 w-6" />
              )}
            </button>
          </div>
          {confirmPassword && (
            <div className="flex items-center space-x-2 text-sm">
              {newPassword === confirmPassword && newPassword.length >= 6 ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : (
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              )}
              <span className={newPassword === confirmPassword && newPassword.length >= 6 ? 'text-green-600' : 'text-red-600'}>
                {newPassword === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
              </span>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
      </div>

      <button
        onClick={handleResetPassword}
        disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 6}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
            Resetting Password...
          </div>
        ) : (
          'Reset Password'
        )}
      </button>
    </motion.div>
  );

  return (
    <>
      <div className="w-full max-w-lg mx-auto p-6">
        {/* Header with Close Button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToLogin}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors text-base font-medium group"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </button>
          <button
            onClick={onBackToLogin}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold transition-all duration-300 ${
                    step >= stepNumber
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`w-12 h-1 mx-3 rounded-full transition-all duration-300 ${
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


    </>
  );
};

export default PasswordReset; 