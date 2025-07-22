const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true,
    length: 6
  },
  expiresAt: {
    type: Date,
    required: true,
    default: function() {
      // OTP expires in 10 minutes
      return new Date(Date.now() + 10 * 60 * 1000);
    }
  },
  used: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for automatic cleanup of expired OTPs
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Method to check if OTP is valid and not expired
passwordResetSchema.methods.isValid = function() {
  return !this.used && this.expiresAt > new Date();
};

// Method to mark OTP as used
passwordResetSchema.methods.markAsUsed = function() {
  this.used = true;
  return this.save();
};

// Static method to find valid OTP for email
passwordResetSchema.statics.findValidOTP = function(email, otp) {
  return this.findOne({
    email: email.toLowerCase(),
    otp: otp,
    used: false,
    expiresAt: { $gt: new Date() }
  });
};

// Static method to invalidate all OTPs for an email
passwordResetSchema.statics.invalidateAllOTPs = function(email) {
  return this.updateMany(
    { email: email.toLowerCase() },
    { used: true }
  );
};

module.exports = mongoose.model('PasswordReset', passwordResetSchema); 