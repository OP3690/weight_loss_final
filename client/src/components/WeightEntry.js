import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Scale, Calendar, Save, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUser } from '../context/UserContext';
import { weightEntryAPI, calculateBMI, isValidObjectId } from '../services/api';
import './NoSpinner.css';

const formatDateToYYYYMMDD = (dateInput) => {
  // Handles date objects or date strings (like YYYY-MM-DD)
  const d = new Date(dateInput);
  // We need to adjust for timezone offset to prevent date shifts
  const d_adjusted = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
  const year = d_adjusted.getFullYear();
  const month = String(d_adjusted.getMonth() + 1).padStart(2, '0');
  const day = String(d_adjusted.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const WeightEntry = ({ onEntryAdded, onSuccess, defaultDate, goalId }) => {
  const { currentUser, stats } = useUser();
  const [loading, setLoading] = useState(false);
  // Show form if defaultDate is provided and not today
  const isToday = (date) => {
    const d = new Date(date);
    const t = new Date();
    return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
  };
  const [showForm, setShowForm] = useState(defaultDate && !isToday(defaultDate));

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: {
      date: defaultDate || new Date().toISOString().slice(0, 10)
    }
  });

  // Add this effect to reset the form when defaultDate changes
  useEffect(() => {
    reset({
      date: defaultDate || new Date().toISOString().slice(0, 10),
      weight: '',
      notes: ''
    });
    setShowForm(defaultDate && !isToday(defaultDate));
  }, [defaultDate, reset]);

  const watchedWeight = watch('weight');
  const watchedDate = watch('date');

  // Helper to get today's date in a readable format
  const today = new Date();
  const todayStr = today.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  // Determine base weight for quick entry (most recent entry or current weight)
  let baseWeight = currentUser?.currentWeight || 70;
  if (currentUser?.recentEntries && currentUser.recentEntries.length > 0) {
    baseWeight = currentUser.recentEntries[0].weight;
  }
  // Generate 8 weights from -1.5kg to +1.5kg around baseWeight
  const quickWeights = Array.from({ length: 8 }, (_, i) => {
    const min = baseWeight - 1.5;
    const max = baseWeight + 1.5;
    return (min + ((max - min) * i) / 7).toFixed(1);
  });

  if (!goalId || (goalId !== 'demo' && !isValidObjectId(goalId))) {
    return <div className="text-red-500">No valid active goal. Please create a goal first.</div>;
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const entryData = {
        userId: currentUser.id,
        weight: parseFloat(data.weight),
        date: formatDateToYYYYMMDD(data.date),
        notes: data.notes || '',
        goalId: goalId
      };

      // Debug: log entryData
      console.log('Submitting weight entry:', entryData);

      if (currentUser.id === 'demo') {
        // For demo, just show success message
        toast.success('Weight entry saved successfully!');
        console.log('Demo entry:', entryData);
      } else {
        // The backend now handles upsert logic, so we just POST.
        try {
          const response = await weightEntryAPI.createEntry(entryData);
          console.log('Backend response:', response);
          toast.success(response.message || 'Weight entry saved successfully!');
        } catch (err) {
          console.error('Backend error:', err);
          toast.error('Failed to add weight entry: ' + (err?.response?.data?.message || err.message));
          throw err;
        }
      }
      
      // Call onSuccess immediately after success
      if (onSuccess) onSuccess();
      reset();
      if (onEntryAdded) {
        onEntryAdded(); // Call immediately, no delay
      }
      setShowForm(false); // Always close the form after success
    } catch (error) {
      console.error('Error adding weight entry:', error);
      toast.error('Failed to add weight entry');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickEntry = (weight) => {
    reset({
      weight: weight.toString(),
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowForm(true);
  };

  const calculateBMIPreview = (weight) => {
    if (!weight || !currentUser || currentUser.id === 'demo') return null;
    
    // For demo user, use default height
    const height = currentUser.height || 170;
    return calculateBMI(parseFloat(weight), height);
  };

  const bmiPreview = calculateBMIPreview(watchedWeight);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-success-500 rounded-xl flex items-center justify-center">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Weight Entry</h1>
            <p className="text-gray-600">Track your daily weight progress</p>
          </div>
        </div>
        
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Entry</span>
          </button>
        )}
      </div>

      {/* Quick Entry Buttons: only show if not showing form and for today */}
      {!showForm && (!defaultDate || isToday(defaultDate)) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Entry</h3>
          <p className="text-gray-600 mb-4">Tap a weight to quickly add an entry for today: <span className='font-semibold text-blue-600'>{todayStr}</span></p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickWeights.map((weight) => (
              <button
                key={weight}
                onClick={() => handleQuickEntry(weight)}
                className="p-4 bg-gray-50 hover:bg-primary-50 border border-gray-200 hover:border-primary-300 rounded-lg transition-colors duration-200"
              >
                <p className="text-lg font-bold text-gray-900">{weight} kg</p>
                <p className="text-sm text-gray-600">Today</p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Entry Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="card"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Scale className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Add Weight Entry</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weight Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('weight', { 
                    required: 'Weight is required',
                    min: { value: 20, message: 'Weight must be at least 20 kg' },
                    max: { value: 500, message: 'Weight cannot exceed 500 kg' }
                  })}
                  className="input-field no-spinner"
                  placeholder="e.g., 75.5"
                  onWheel={e => e.target.blur()}
                />
                {errors.weight && (
                  <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
                )}
                {bmiPreview && (
                  <p className="mt-1 text-sm text-gray-500">
                    BMI: {bmiPreview} ({bmiPreview < 18.5 ? 'Underweight' : 
                                       bmiPreview < 25 ? 'Normal' : 
                                       bmiPreview < 30 ? 'Overweight' : 'Obese'})
                  </p>
                )}
              </div>

              {/* Date Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  {...register('date', {
                    required: 'Date is required',
                    validate: (value) => {
                      const selectedDate = new Date(value);
                      const today = new Date();
                      selectedDate.setHours(0, 0, 0, 0);
                      today.setHours(0, 0, 0, 0);
                      return selectedDate <= today || 'Date cannot be in the future';
                    }
                  })}
                  className="input-field"
                  disabled={!!defaultDate}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                {...register('notes', {
                  maxLength: { value: 500, message: 'Notes cannot exceed 500 characters' }
                })}
                rows={3}
                className="input-field resize-none"
                placeholder="Add any notes about your day, exercise, or diet..."
              />
              {errors.notes && (
                <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Entry'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  reset();
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default WeightEntry; 