const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const router = express.Router();
const WeightEntry = require('../models/WeightEntry');
const { sendWelcomeEmail, sendPasswordResetEmail, generateOTP } = require('../services/emailService');
const { sendSMSOTP, verifySMSOTP, sendPasswordResetSMS } = require('../services/smsService');
const PasswordReset = require('../models/PasswordReset');

// Validation middleware
const validateUserData = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('gender')
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other'),
  body('age')
    .isInt({ min: 1, max: 120 })
    .withMessage('Age must be between 1 and 120'),
  body('height')
    .isFloat({ min: 50, max: 300 })
    .withMessage('Height must be between 50 and 300 cm'),
  body('currentWeight')
    .isFloat({ min: 20, max: 500 })
    .withMessage('Current weight must be between 20 and 500 kg'),
  body('targetWeight')
    .isFloat({ min: 20, max: 500 })
    .withMessage('Target weight must be between 20 and 500 kg'),
  body('targetDate')
    .isISO8601()
    .custom((value) => {
      const targetDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (targetDate <= today) {
        throw new Error('Target date must be a future date');
      }
      return true;
    })
    .withMessage('Target date must be a future date')
];

// Add a new validation middleware for goal creation only
const validateGoalData = [
  body('height')
    .isFloat({ min: 50, max: 300 })
    .withMessage('Height must be between 50 and 300 cm'),
  body('currentWeight')
    .isFloat({ min: 20, max: 500 })
    .withMessage('Current weight must be between 20 and 500 kg'),
  body('targetWeight')
    .isFloat({ min: 20, max: 500 })
    .withMessage('Target weight must be between 20 and 500 kg'),
  body('targetDate')
    .isISO8601()
    .custom((value) => {
      const targetDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (targetDate <= today) {
        throw new Error('Target date must be a future date');
      }
      return true;
    })
    .withMessage('Target date must be a future date')
];

// Registration (Onboarding + Weight Goal)
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('mobileNumber').matches(/^\+[0-9]{1,4}[0-9]{10,15}$/).withMessage('Valid international mobile number is required'),
  body('country').isLength({ min: 2 }).withMessage('Country is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
  body('age').isInt({ min: 13, max: 120 }).withMessage('Age must be between 13 and 120'),
  body('height').isFloat({ min: 100, max: 250 }).withMessage('Height must be between 100 and 250 cm'),
  body('currentWeight').isFloat({ min: 20, max: 300 }).withMessage('Weight must be between 20 and 300 kg'),
  body('goalWeight').isFloat({ min: 20, max: 300 }).withMessage('Goal weight must be between 20 and 300 kg'),
  body('activityLevel').isIn(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active']).withMessage('Activity level is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
    const { name, email, mobileNumber, country, password, gender, age, height, currentWeight, goalWeight, activityLevel } = req.body;
    
    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { mobileNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or mobile number already registered' });
    }
    
    const user = new User({
      name,
      email,
      mobileNumber,
      country,
      password,
      gender,
      age: Number(age),
      height: Number(height),
      currentWeight: Number(currentWeight),
      goalWeight: Number(goalWeight),
      activityLevel,
      goalInitialWeight: Number(currentWeight),
      goalId: new mongoose.Types.ObjectId(),
    });
    
    // Migrate any existing UUID goalIds to ObjectIds
    await migrateGoalIds(user);
    await user.save();
    
    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.name);
      console.log('Welcome email sent successfully to:', user.email);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail registration if email fails
    }
    
    res.status(201).json({ 
      message: 'Registration successful', 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        mobileNumber: user.mobileNumber,
        country: user.country,
        goalId: user.goalId?.toString(), 
        goalInitialWeight: user.goalInitialWeight 
      } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    // Generate JWT
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '7d' });
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        gender: user.gender,
        height: user.height,
        currentWeight: user.currentWeight,
        targetWeight: user.targetWeight,
        targetDate: user.targetDate,
        goalInitialWeight: user.goalInitialWeight
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Create new user profile
router.post('/', validateUserData, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const userData = req.body;
    const user = new User(userData);
    // Migrate any existing UUID goalIds to ObjectIds
    await migrateGoalIds(user);
    await user.save();

    // Automatically create a weight entry for the goal start date if it doesn't exist
    if (user.goalId && user.goalCreatedAt && user.currentWeight) {
      const WeightEntry = require('../models/WeightEntry');
      const entryDate = new Date(user.goalCreatedAt);
      entryDate.setUTCHours(0, 0, 0, 0);
      const startOfDay = new Date(entryDate);
      const endOfDay = new Date(entryDate);
      endOfDay.setUTCDate(startOfDay.getUTCDate() + 1);
      const existingEntry = await WeightEntry.findOne({
        userId: user._id,
        goalId: user.goalId,
        date: { $gte: startOfDay, $lt: endOfDay }
      });
      if (!existingEntry) {
        const createdEntry = await WeightEntry.create({
          userId: user._id,
          weight: user.currentWeight,
          date: entryDate,
          goalId: user.goalId,
          notes: 'Auto-created for goal start'
        });
        console.log('[AUTO-WEIGHT-ENTRY]', createdEntry);
      }
    }

    res.status(201).json({
      message: 'User profile created successfully',
      user: {
        id: user._id,
        name: user.name,
        gender: user.gender,
        age: user.age,
        height: user.height,
        currentWeight: user.currentWeight,
        targetWeight: user.targetWeight,
        targetDate: user.targetDate,
        currentBMI: user.currentBMI,
        targetBMI: user.targetBMI
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user profile' });
  }
});

// Get all users (for demo purposes)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    // Handle demo user
    if (req.params.id === 'demo') {
      return res.json({
        id: 'demo',
        name: 'Demo User',
        email: 'demo@example.com',
        mobile: '+1234567890',
        gender: 'male',
        age: 30,
        height: 170,
        currentWeight: 74.2,
        targetWeight: 70,
        targetDate: new Date(Date.now() + 83 * 24 * 60 * 60 * 1000),
        goalStatus: 'active',
        goalCreatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        goalId: 'demo-goal-123',
        pastGoals: [],
        goals: [],
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      });
    }
    
    const user = await User.findById(req.params.id).select('-__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Return a consistent user object including goalCreatedAt
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      gender: user.gender,
      age: user.age,
      height: user.height,
      currentWeight: user.currentWeight,
      targetWeight: user.targetWeight,
      targetDate: user.targetDate,
      goalStatus: user.goalStatus,
      goalCreatedAt: user.goalCreatedAt,
      goalId: user.goalId?.toString(),
      pastGoals: user.pastGoals,
      goals: user.goals,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Update user profile
// Use validateGoalData if only goal fields are present, otherwise use validateUserData
router.put('/:id', async (req, res, next) => {
  // Handle demo user
  if (req.params.id === 'demo') {
    // Return a realistic demo user object, matching the GET /users/:id response
    return res.json({
      message: 'Demo user profile updated successfully',
      user: {
        id: 'demo',
        name: 'Demo User',
        email: 'demo@example.com',
        mobile: '+1234567890',
        gender: 'male',
        age: 30,
        height: 170,
        currentWeight: 74.2,
        targetWeight: 70,
        targetDate: new Date(Date.now() + 83 * 24 * 60 * 60 * 1000),
        goalStatus: 'active',
        goalCreatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        goalId: 'demo-goal-123',
        pastGoals: [],
        goals: [],
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      }
    });
  }
  
  // If only goal fields are present, use validateGoalData
  const goalFields = ['height', 'currentWeight', 'targetWeight', 'targetDate', 'goalStatus', 'goalCreatedAt', 'goalId'];
  const keys = Object.keys(req.body);
  const isGoalOnly = keys.every(k => goalFields.includes(k));
  if (isGoalOnly) {
    console.log('[GOAL HANDLER] Goal creation/update handler called', req.body);
    await Promise.all(validateGoalData.map(mw => mw.run(req)));
    // Always generate a new goalId if not provided
    let goalId = req.body.goalId;
    if (!goalId) {
      goalId = new mongoose.Types.ObjectId();
    } else if (!mongoose.Types.ObjectId.isValid(goalId)) {
      goalId = new mongoose.Types.ObjectId();
    } else {
      goalId = new mongoose.Types.ObjectId(goalId);
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.goalId = goalId;
    user.goalStatus = 'active';
    user.goalCreatedAt = new Date();
    user.goalInitialWeight = req.body.currentWeight !== undefined ? Number(req.body.currentWeight) : user.currentWeight;
    user.targetWeight = req.body.targetWeight;
    user.targetDate = req.body.targetDate;
    user.height = req.body.height;
    user.currentWeight = req.body.currentWeight;
    // Migrate any existing UUID goalIds to ObjectIds
    await migrateGoalIds(user);
    await user.save();

    // Automatically create a weight entry for the goal start date if it doesn't exist
    if (user.goalId && user.goalCreatedAt && user.currentWeight) {
      const WeightEntry = require('../models/WeightEntry');
      const entryDate = new Date(user.goalCreatedAt);
      entryDate.setUTCHours(0, 0, 0, 0);
      const startOfDay = new Date(entryDate);
      const endOfDay = new Date(entryDate);
      endOfDay.setUTCDate(startOfDay.getUTCDate() + 1);
      const existingEntry = await WeightEntry.findOne({
        userId: user._id,
        goalId: user.goalId,
        date: { $gte: startOfDay, $lt: endOfDay }
      });
      if (!existingEntry) {
        const createdEntry = await WeightEntry.create({
          userId: user._id,
          weight: user.currentWeight,
          date: entryDate,
          goalId: user.goalId,
          notes: 'Auto-created for goal start'
        });
        console.log('[AUTO-WEIGHT-ENTRY]', createdEntry);
      }
    }

    return res.json({ message: 'Goal created/updated successfully', user: { ...user.toObject(), goalId: user.goalId?.toString(), goalInitialWeight: user.goalInitialWeight } });
  } else {
    await Promise.all(validateUserData.map(mw => mw.run(req)));
  }
  next();
}, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Set goalCreatedAt if creating a new goal (targetWeight and targetDate are being set, and either goalStatus is not 'active' or goalCreatedAt is missing)
    if (req.body.targetWeight && req.body.targetDate && (user.goalStatus !== 'active' || !user.goalCreatedAt)) {
      user.goalCreatedAt = new Date();
      user.goalInitialWeight = req.body.currentWeight !== undefined ? Number(req.body.currentWeight) : user.currentWeight;
    }
    // If a new goal is being set and goalId is not present, generate one
    if (req.body.targetWeight && req.body.targetDate && !user.goalId) {
      user.goalId = new mongoose.Types.ObjectId();
    }
    // Only update allowed goal fields to avoid wiping out required user fields
    const allowedFields = ['height', 'currentWeight', 'targetWeight', 'targetDate', 'goalStatus', 'goalCreatedAt', 'goalInitialWeight'];
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        user[key] = req.body[key];
      }
    }
    // Migrate any existing UUID goalIds to ObjectIds
    await migrateGoalIds(user);
    await user.save();
    // Check for goal expiry
    await checkAndExpireGoal(user);
    res.json({
      message: 'User profile updated successfully',
      user: { ...user.toObject(), goalId: user.goalId?.toString(), goalInitialWeight: user.goalInitialWeight }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user profile' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Get BMI analytics for a user
router.get('/:id/bmi-analytics', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentBMI = parseFloat(user.currentBMI);
    const targetBMI = parseFloat(user.targetBMI);
    
    const analytics = {
      currentBMI,
      targetBMI,
      currentCategory: user.getBMICategory(currentBMI),
      targetCategory: user.getBMICategory(targetBMI),
      bmiDifference: (currentBMI - targetBMI).toFixed(1),
      weightDifference: (user.currentWeight - user.targetWeight).toFixed(1),
      progressPercentage: calculateProgressPercentage(user.currentWeight, user.targetWeight, user.targetDate)
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching BMI analytics:', error);
    res.status(500).json({ message: 'Error fetching BMI analytics' });
  }
});

// Helper function to calculate progress percentage
function calculateProgressPercentage(currentWeight, targetWeight, targetDate) {
  const today = new Date();
  const target = new Date(targetDate);
  const totalDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  
  if (totalDays <= 0) return 100;
  
  // This is a simplified calculation - in a real app, you'd use historical data
  const weightDiff = Math.abs(currentWeight - targetWeight);
  const estimatedProgress = Math.min(weightDiff / 10, 1); // Assume 10kg is max difference
  
  return Math.round(estimatedProgress * 100);
}

// Helper function to migrate UUID goalIds to ObjectIds
async function migrateGoalIds(user) {
  if (user.pastGoals && Array.isArray(user.pastGoals)) {
    user.pastGoals.forEach(goal => {
      // If goalId is a UUID string (36 characters with hyphens), convert it to ObjectId
      if (goal.goalId && typeof goal.goalId === 'string' && goal.goalId.length === 36 && goal.goalId.includes('-')) {
        goal.goalId = new mongoose.Types.ObjectId();
      }
      // If goalId is missing, create a new one
      if (!goal.goalId) {
        goal.goalId = new mongoose.Types.ObjectId();
      }
    });
  }
  
  // Also ensure the main goalId is an ObjectId
  if (user.goalId && typeof user.goalId === 'string' && user.goalId.length === 36 && user.goalId.includes('-')) {
    user.goalId = new mongoose.Types.ObjectId();
  }
  if (!user.goalId && (user.targetWeight || user.targetDate)) {
    user.goalId = new mongoose.Types.ObjectId();
  }
}

// Discard current goal
router.post('/:id/discard-goal', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.targetWeight || !user.targetDate) return res.status(400).json({ message: 'No active goal to discard' });
    
    // Migrate any existing UUID goalIds to ObjectIds
    await migrateGoalIds(user);
    
    // Move current goal to pastGoals
    user.pastGoals.push({
      goalId: user.goalId || new mongoose.Types.ObjectId(),
      currentWeight: user.currentWeight,
      targetWeight: user.targetWeight,
      targetDate: user.targetDate,
      startedAt: user.createdAt,
      endedAt: new Date(),
      status: 'discarded'
    });
    user.targetWeight = undefined;
    user.targetDate = undefined;
    user.goalStatus = 'none';
    user.goalCreatedAt = undefined;
    user.goalId = undefined;
    
    await user.save();
    res.json({ message: 'Goal discarded', user });
  } catch (error) {
    console.error('Error discarding goal:', error);
    res.status(500).json({ message: 'Error discarding goal' });
  }
});

// Achieve current goal
router.post('/:id/achieve-goal', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.targetWeight || !user.targetDate) return res.status(400).json({ message: 'No active goal to achieve' });
    
    // Migrate any existing UUID goalIds to ObjectIds
    await migrateGoalIds(user);
    
    // Move current goal to pastGoals
    user.pastGoals.push({
      goalId: user.goalId || new mongoose.Types.ObjectId(),
      currentWeight: user.currentWeight,
      targetWeight: user.targetWeight,
      targetDate: user.targetDate,
      startedAt: user.createdAt,
      endedAt: new Date(),
      status: 'achieved'
    });
    user.targetWeight = undefined;
    user.targetDate = undefined;
    user.goalStatus = 'none';
    user.goalCreatedAt = undefined;
    user.goalId = undefined;
    
    await user.save();
    res.json({ message: 'Goal marked as achieved', user });
  } catch (error) {
    console.error('Error achieving goal:', error);
    res.status(500).json({ message: 'Error achieving goal' });
  }
});

// Middleware to check and expire goal if needed
async function checkAndExpireGoal(user) {
  if (user.targetDate && new Date(user.targetDate) < new Date()) {
    // Migrate any existing UUID goalIds to ObjectIds
    await migrateGoalIds(user);
    
    user.pastGoals.push({
      goalId: user.goalId || new mongoose.Types.ObjectId(),
      currentWeight: user.currentWeight,
      targetWeight: user.targetWeight,
      targetDate: user.targetDate,
      startedAt: user.createdAt,
      endedAt: new Date(),
      status: 'expired'
    });
    user.targetWeight = undefined;
    user.targetDate = undefined;
    user.goalStatus = 'expired';
    user.goalCreatedAt = undefined;
    user.goalId = undefined;
    
    await user.save();
  }
}

// Password Reset Routes

// Request password reset (send OTP)
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { email } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email address' });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Invalidate any existing OTPs for this email
    await PasswordReset.invalidateAllOTPs(email);
    
    // Create new password reset record
    const passwordReset = new PasswordReset({
      email: email.toLowerCase(),
      otp: otp
    });
    await passwordReset.save();
    
    // Send password reset email
    try {
      const emailResult = await sendPasswordResetEmail(email, user.name, otp);
      console.log('Email sent successfully:', emailResult);
      
      res.json({ 
        message: 'Password reset OTP sent successfully',
        email: email // Return email for frontend reference
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Delete the password reset record if email fails
      await passwordReset.deleteOne();
      return res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
    }
    
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ message: 'Failed to process password reset request' });
  }
});

// Verify OTP and reset password
router.post('/reset-password', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => value === req.body.newPassword).withMessage('Passwords do not match')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { email, otp, newPassword } = req.body;
    
    // Find valid OTP
    const passwordReset = await PasswordReset.findValidOTP(email, otp);
    if (!passwordReset) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    
    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    // Mark OTP as used
    await passwordReset.markAsUsed();
    
    res.json({ message: 'Password reset successfully' });
    
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
});

// Verify OTP (for frontend validation)
router.post('/verify-otp', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { email, otp } = req.body;
    
    // Find valid OTP
    const passwordReset = await PasswordReset.findValidOTP(email, otp);
    if (!passwordReset) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    
    res.json({ message: 'OTP verified successfully' });
    
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
});

// SMS-based Password Reset Routes

// Request SMS password reset (send OTP via SMS)
router.post('/forgot-password-sms', [
  body('mobileNumber').matches(/^\+[0-9]{1,4}[0-9]{10,15}$/).withMessage('Valid international mobile number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { mobileNumber } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ mobileNumber });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this mobile number' });
    }

    // Send SMS OTP using Twilio Verify
    try {
      const smsResult = await sendSMSOTP(mobileNumber);
      console.log('SMS OTP sent successfully:', smsResult);
      
      res.json({ 
        message: 'Password reset OTP sent successfully via SMS',
        mobileNumber: mobileNumber,
        sid: smsResult.sid
      });
    } catch (smsError) {
      console.error('SMS sending failed:', smsError);
      return res.status(500).json({ message: 'Failed to send OTP SMS. Please try again.' });
    }
    
  } catch (error) {
    console.error('SMS password reset request error:', error);
    res.status(500).json({ message: 'Failed to process SMS password reset request' });
  }
});

// Verify SMS OTP and reset password
router.post('/reset-password-sms', [
  body('mobileNumber').matches(/^\+[0-9]{1,4}[0-9]{10,15}$/).withMessage('Valid international mobile number is required'),
  body('otp').isLength({ min: 4, max: 8 }).withMessage('OTP must be between 4-8 digits'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => value === req.body.newPassword).withMessage('Passwords do not match')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { mobileNumber, otp, newPassword } = req.body;
    
    // Verify SMS OTP using Twilio Verify
    const verificationResult = await verifySMSOTP(mobileNumber, otp);
    if (!verificationResult.success) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    
    // Find user
    const user = await User.findOne({ mobileNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password reset successfully via SMS' });
    
  } catch (error) {
    console.error('SMS password reset error:', error);
    res.status(500).json({ message: 'Failed to reset password via SMS' });
  }
});

// Verify SMS OTP (for frontend validation)
router.post('/verify-sms-otp', [
  body('mobileNumber').matches(/^\+[0-9]{1,4}[0-9]{10,15}$/).withMessage('Valid international mobile number is required'),
  body('otp').isLength({ min: 4, max: 8 }).withMessage('OTP must be between 4-8 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { mobileNumber, otp } = req.body;
    
    // Verify SMS OTP using Twilio Verify
    const verificationResult = await verifySMSOTP(mobileNumber, otp);
    if (!verificationResult.success) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    
    res.json({ message: 'SMS OTP verified successfully' });
    
  } catch (error) {
    console.error('SMS OTP verification error:', error);
    res.status(500).json({ message: 'Failed to verify SMS OTP' });
  }
});

// Alternative SMS method using direct SMS API (fallback)
router.post('/forgot-password-sms-direct', [
  body('mobileNumber').matches(/^\+[0-9]{1,4}[0-9]{10,15}$/).withMessage('Valid international mobile number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { mobileNumber } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ mobileNumber });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this mobile number' });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Invalidate any existing OTPs for this mobile number
    await PasswordReset.invalidateAllOTPs(user.email);
    
    // Create new password reset record
    const passwordReset = new PasswordReset({
      email: user.email,
      otp: otp
    });
    await passwordReset.save();
    
    // Send password reset SMS
    try {
      const smsResult = await sendPasswordResetSMS(mobileNumber, user.name, otp);
      console.log('SMS sent successfully:', smsResult);
      
      res.json({ 
        message: 'Password reset OTP sent successfully via SMS',
        mobileNumber: mobileNumber
      });
    } catch (smsError) {
      console.error('SMS sending failed:', smsError);
      // Delete the password reset record if SMS fails
      await passwordReset.deleteOne();
      return res.status(500).json({ message: 'Failed to send OTP SMS. Please try again.' });
    }
    
  } catch (error) {
    console.error('Direct SMS password reset request error:', error);
    res.status(500).json({ message: 'Failed to process SMS password reset request' });
  }
});

module.exports = router; 