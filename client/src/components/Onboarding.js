import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import PasswordReset from './PasswordReset';

const Onboarding = ({ onSuccess, onClose, initialMode }) => {
  const [mode, setMode] = useState(initialMode || 'register'); // 'register' or 'login'
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: basic info, 2: health info
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    getValues,
    setError
  } = useForm();

  useEffect(() => {
    if (initialMode) setMode(initialMode);
    setStep(1); // Always start at step 1 for register
  }, [initialMode]);

  const onRegister = async (data) => {
    setLoading(true);
    try {
      // Convert numeric fields to numbers before sending to backend
      const payload = {
        ...data,
        age: Number(data.age),
        height: Number(data.height),
        currentWeight: Number(data.currentWeight),
        targetWeight: Number(data.targetWeight),
      };
      const response = await userAPI.register(payload);
      toast.success('Registration successful!');
      
      // Automatically log in the user after successful registration
      const loginResponse = await userAPI.login({
        email: data.email,
        password: data.password
      });
      
      onSuccess(loginResponse.user);
      onClose();
    } catch (err) {
      // error handled by toast in api.js
    } finally {
      setLoading(false);
    }
  };

  const onLogin = async (data) => {
    setLoading(true);
    try {
      const res = await userAPI.login(data);
      toast.success('Login successful!');
      onSuccess(res.user);
      onClose();
    } catch (err) {
      // error handled by toast in api.js
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Basic Info
  const renderStep1 = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
        <input
          type="text"
          {...register('name', { required: 'Name is required', minLength: 2 })}
          className="input-field"
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        <input
          type="email"
          {...register('email', { required: 'Email is required' })}
          className="input-field"
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
        <input
          type="tel"
          {...register('mobile', { required: 'Mobile number is required', pattern: /^[0-9]{10,15}$/ })}
          className="input-field"
        />
        {errors.mobile && <p className="text-sm text-red-600">{errors.mobile.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
        <input
          type="number"
          {...register('age', { required: 'Age is required', min: 1, max: 120 })}
          className="input-field"
        />
        {errors.age && <p className="text-sm text-red-600">{errors.age.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
          <input
            type="password"
            {...register('password', { required: 'Password is required', minLength: 6 })}
            className="input-field"
          />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
          <input
            type="password"
            {...register('confirmPassword', { required: 'Confirm your password', validate: (val) => val === watch('password') || 'Passwords do not match' })}
            className="input-field"
          />
          {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
        </div>
      </div>
      <button
        type="button"
        className="btn-primary w-full flex items-center justify-center space-x-2 mt-2"
        onClick={() => {
          // Validate step 1 fields before moving to step 2
          const values = getValues();
          let valid = true;
          if (!values.name || values.name.length < 2) { setError('name', { message: 'Name is required' }); valid = false; }
          if (!values.email) { setError('email', { message: 'Email is required' }); valid = false; }
          if (!values.mobile) { setError('mobile', { message: 'Mobile number is required' }); valid = false; }
          if (!values.age) { setError('age', { message: 'Age is required' }); valid = false; }
          if (!values.password || values.password.length < 6) { setError('password', { message: 'Password is required' }); valid = false; }
          if (!values.confirmPassword || values.confirmPassword !== values.password) { setError('confirmPassword', { message: 'Passwords do not match' }); valid = false; }
          if (valid) setStep(2);
        }}
        disabled={loading}
      >
        <span>Next</span>
      </button>
    </>
  );

  // Step 2: Health Info
  const renderStep2 = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
          <select {...register('gender', { required: 'Gender is required' })} className="input-field">
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="text-sm text-red-600">{errors.gender.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm) *</label>
          <input
            type="number"
            {...register('height', { required: 'Height is required', min: 50, max: 300 })}
            className="input-field"
          />
          {errors.height && <p className="text-sm text-red-600">{errors.height.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg) *</label>
          <input
            type="number"
            {...register('currentWeight', { required: 'Weight is required', min: 20, max: 500 })}
            className="input-field"
          />
          {errors.currentWeight && <p className="text-sm text-red-600">{errors.currentWeight.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Weight (kg) *</label>
          <input
            type="number"
            {...register('targetWeight', { required: 'Target weight is required', min: 20, max: 500 })}
            className="input-field"
          />
          {errors.targetWeight && <p className="text-sm text-red-600">{errors.targetWeight.message}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Target Date *</label>
        <input
          type="date"
          {...register('targetDate', { required: 'Target date is required', validate: (val) => new Date(val) > new Date() || 'Target date must be in the future' })}
          className="input-field"
        />
        {errors.targetDate && <p className="text-sm text-red-600">{errors.targetDate.message}</p>}
      </div>
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          className="btn-secondary flex-1"
          onClick={() => setStep(1)}
          disabled={loading}
        >
          Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1"
        >
          <span>{loading ? 'Registering...' : 'Register'}</span>
        </button>
      </div>
    </>
  );

  // Show password reset component if requested
  if (showPasswordReset) {
    return (
      <PasswordReset 
        onBackToLogin={() => setShowPasswordReset(false)} 
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
    >
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === 'register' ? 'Create Your Profile' : 'Login'}
          </h2>
          <p className="text-gray-600">
            {mode === 'register'
              ? 'Sign up to start your weight management journey.'
              : 'Login to your account.'}
          </p>
        </div>
        <form
          onSubmit={handleSubmit(mode === 'register' ? onRegister : onLogin)}
          className="space-y-4"
        >
          {mode === 'register' && (step === 1 ? renderStep1() : renderStep2())}
          {mode === 'login' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="input-field"
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  className="input-field"
                />
                {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center space-x-2 mt-2"
              >
                <span>{loading ? 'Logging in...' : 'Login'}</span>
              </button>
              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={() => setShowPasswordReset(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </>
          )}
        </form>
        <div className="mt-4 text-center">
          {mode === 'register' ? (
            <>
              <span className="text-sm text-gray-600">Already have an account?</span>
              <button
                onClick={() => { setMode('login'); reset(); setStep(1); }}
                className="ml-2 text-primary-600 hover:underline text-sm"
              >
                Login
              </button>
            </>
          ) : (
            <>
              <span className="text-sm text-gray-600">Don't have an account?</span>
              <button
                onClick={() => { setMode('register'); reset(); setStep(1); }}
                className="ml-2 text-primary-600 hover:underline text-sm"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Onboarding; 