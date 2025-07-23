import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, EnvelopeIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const ForgotPasswordPopup = ({ isOpen, onClose, onBackToLogin }) => {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('US (+1)');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const countries = [
    { name: 'US (+1)', code: '+1', flag: '🇺🇸' },
    { name: 'IN (+91)', code: '+91', flag: '🇮🇳' },
    { name: 'UK (+44)', code: '+44', flag: '🇬🇧' },
    { name: 'CA (+1)', code: '+1', flag: '🇨🇦' },
    { name: 'AU (+61)', code: '+61', flag: '🇦🇺' },
    { name: 'DE (+49)', code: '+49', flag: '🇩🇪' },
    { name: 'FR (+33)', code: '+33', flag: '🇫🇷' },
    { name: 'JP (+81)', code: '+81', flag: '🇯🇵' },
    { name: 'BR (+55)', code: '+55', flag: '🇧🇷' },
    { name: 'MX (+52)', code: '+52', flag: '🇲🇽' }
  ];

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleMethodSelect = (selectedMethod) => {
    if (selectedMethod === 'mobile') {
      toast.error('SMS service coming soon! Please use email for now.');
      return;
    }
    setMethod(selectedMethod);
    setError('');
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country.name);
  };

  const handleSendOTP = async () => {
    setLoading(true);
    setError('');

    try {
      const endpoint = method === 'email' ? '/api/users/forgot-password' : '/api/users/send-sms-otp';
      const data = method === 'email' ? { email } : { mobile: selectedCountry.split(' ')[1] + mobile };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setCountdown(60);
        toast.success(method === 'email' ? 'OTP sent to your email!' : 'OTP sent to your mobile!');
        setStep(3);
      } else {
        setError(result.message || 'Failed to send OTP');
        toast.error(result.message || 'Failed to send OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError('');

    try {
      const endpoint = method === 'email' ? '/api/users/verify-email-otp' : '/api/users/verify-sms-otp';
      const data = method === 'email' 
        ? { email, otp } 
        : { mobile: selectedCountry.split(' ')[1] + mobile, otp };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('OTP verified successfully!');
        setStep(4);
      } else {
        setError(result.message || 'Invalid OTP');
        toast.error(result.message || 'Invalid OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const endpoint = method === 'email' ? '/api/users/reset-password' : '/api/users/reset-password-sms';
      const data = method === 'email' 
        ? { email, otp, newPassword } 
        : { mobile: selectedCountry.split(' ')[1] + mobile, otp, newPassword };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Password reset successfully!');
        handleClose();
        if (onBackToLogin) onBackToLogin();
      } else {
        setError(result.message || 'Failed to reset password');
        toast.error(result.message || 'Failed to reset password');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    try {
      await handleSendOTP();
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setMethod('email');
    setEmail('');
    setMobile('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setOtpSent(false);
    setCountdown(0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-md bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative p-6 text-white">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-full">
              <ShieldCheckIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Forgot Password</h2>
              <p className="text-sm text-purple-100">
                Choose how you want to reset your password
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Method Selection */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleMethodSelect('email')}
                    className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                      method === 'email'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                    }`}
                  >
                    <EnvelopeIcon className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-center">
                      <div className="font-semibold">Email</div>
                      <div className="text-xs text-gray-500">Send to email</div>
                    </div>
                  </button>

                  <button
                    disabled
                    className="relative group p-4 rounded-2xl border-2 transition-all duration-200 bg-gray-100 border-gray-300 cursor-not-allowed opacity-60"
                  >
                    <DevicePhoneMobileIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <div className="text-center">
                      <div className="font-semibold text-gray-500">Mobile</div>
                      <div className="text-xs text-gray-400">Send via SMS</div>
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-10 shadow-lg border border-gray-700">
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-400">⚠️</span>
                        <span>SMS service coming soon!</span>
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </button>
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={method === 'mobile'}
                  className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all duration-200 transform ${
                    method === 'mobile'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-105'
                  }`}
                >
                  Continue
                </button>
              </motion.div>
            )}

            {/* Step 2: Input Email or Mobile */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {method === 'email' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <div className="relative">
                        <select
                          value={selectedCountry}
                          onChange={(e) => {
                            const country = countries.find(c => c.name === e.target.value);
                            handleCountrySelect(country);
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                        >
                          {countries.map((country) => (
                            <option key={country.name} value={country.name}>
                              {country.flag} {country.name} ({country.code})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <DevicePhoneMobileIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          placeholder="Enter your mobile number"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="text-red-500 text-sm text-center">{error}</div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={handleBack}
                    className="flex-1 py-3 px-6 rounded-2xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSendOTP}
                    disabled={loading || (method === 'email' ? !email : !mobile)}
                    className={`flex-1 py-3 px-6 rounded-2xl font-semibold transition-all duration-200 transform ${
                      loading || (method === 'email' ? !email : !mobile)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-105'
                    }`}
                  >
                    {loading ? 'Sending...' : 'Send OTP'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Enter OTP */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Enter Verification Code
                  </h3>
                  <p className="text-sm text-gray-600">
                    We've sent a 6-digit code to your {method === 'email' ? 'email' : 'mobile'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-center text-lg font-mono"
                    maxLength={6}
                  />
                </div>

                {error && (
                  <div className="text-red-500 text-sm text-center">{error}</div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={handleBack}
                    className="flex-1 py-3 px-6 rounded-2xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleVerifyOTP}
                    disabled={loading || otp.length !== 6}
                    className={`flex-1 py-3 px-6 rounded-2xl font-semibold transition-all duration-200 transform ${
                      loading || otp.length !== 6
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-105'
                    }`}
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    onClick={handleResendOTP}
                    disabled={countdown > 0 || loading}
                    className={`text-sm ${
                      countdown > 0 || loading
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-purple-600 hover:text-purple-700'
                    }`}
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Reset Password */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Reset Your Password
                  </h3>
                  <p className="text-sm text-gray-600">
                    Enter your new password below
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-sm text-center">{error}</div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={handleBack}
                    className="flex-1 py-3 px-6 rounded-2xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleResetPassword}
                    disabled={loading || !newPassword || !confirmPassword}
                    className={`flex-1 py-3 px-6 rounded-2xl font-semibold transition-all duration-200 transform ${
                      loading || !newPassword || !confirmPassword
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-105'
                    }`}
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPopup; 