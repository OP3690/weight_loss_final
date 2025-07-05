const mongoose = require('mongoose');

const weightEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weight: {
    type: Number,
    required: [true, 'Weight is required'],
    min: [20, 'Weight must be at least 20 kg'],
    max: [500, 'Weight cannot exceed 500 kg']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  goalId: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient querying by user and date
weightEntrySchema.index({ userId: 1, date: -1 });

// Ensure only one entry per user per day
weightEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

// Virtual for BMI calculation based on user's height
weightEntrySchema.virtual('bmi').get(function() {
  // This will be populated when the entry is retrieved with user data
  return null;
});

// Method to calculate BMI if height is provided
weightEntrySchema.methods.calculateBMI = function(height) {
  if (height && this.weight) {
    const heightInMeters = height / 100;
    return (this.weight / (heightInMeters * heightInMeters)).toFixed(1);
  }
  return null;
};

// Ensure virtuals are serialized
weightEntrySchema.set('toJSON', { virtuals: true });
weightEntrySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('WeightEntry', weightEntrySchema); 