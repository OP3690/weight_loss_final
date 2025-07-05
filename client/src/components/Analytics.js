import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Target,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { calculateBMI, getBMICategory, weightEntryAPI, userAPI, isValidObjectId } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Analytics = () => {
  const { currentUser } = useUser();
  const [selectedPeriod, setSelectedPeriod] = useState('90');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const ENTRIES_PER_PAGE = 7;
  const [userProfile, setUserProfile] = useState(null);

  // Get active goalId from userProfile
  const activeGoalId = userProfile && userProfile.goalId && (userProfile.goalId === 'demo' || isValidObjectId(userProfile.goalId)) ? userProfile.goalId : null;

  useEffect(() => {
    if (currentUser && currentUser.id !== 'demo') {
      loadUserProfileAndAnalytics();
    } else if (currentUser && currentUser.id === 'demo') {
      // Demo user - generate sample analytics data
      generateSampleAnalytics();
    }
  }, [selectedPeriod, currentUser]);

  const loadUserProfileAndAnalytics = async () => {
    try {
      setLoading(true);
      const profile = await userAPI.getUser(currentUser.id);
      setUserProfile(profile);
      
      // Get active goalId from userProfile
      const activeGoalId = profile && profile.goalId && (profile.goalId === 'demo' || isValidObjectId(profile.goalId)) ? profile.goalId : null;
      
      // Pass goalCreatedAt as startDate if present, and goalId for goal-level analytics
      const params = { period: selectedPeriod };
      if (profile.goalCreatedAt) {
        params.startDate = profile.goalCreatedAt;
      }
      if (activeGoalId) {
        params.goalId = activeGoalId;
      }
      
      const response = await weightEntryAPI.getAnalytics(currentUser.id, params);
      if (response.analytics) {
        setAnalytics(response.analytics);
      } else {
        // No data available, show empty state
        setAnalytics({
          totalEntries: 0,
          averageWeight: 0,
          weightChange: 0,
          trend: 'stable',
          entries: [],
          currentWeight: profile.currentWeight || 0,
          targetWeight: profile.targetWeight || 0,
          progressToTarget: 0,
          initialWeight: profile.currentWeight || 0
        });
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      setAnalytics({
        totalEntries: 0,
        averageWeight: 0,
        weightChange: 0,
        trend: 'stable',
        entries: [],
        currentWeight: 0,
        targetWeight: 0,
        progressToTarget: 0,
        initialWeight: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSampleAnalytics = () => {
    const days = parseInt(selectedPeriod);
    const entries = [];
    const startWeight = 76;
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const baseWeight = startWeight - (days - i) * 0.1;
      const fluctuation = (Math.random() - 0.5) * 0.5;
      const weight = Math.round((baseWeight + fluctuation) * 10) / 10;
      entries.push({
        date,
        weight,
        bmi: calculateBMI(weight, 170),
        notes: i % 7 === 0 ? 'Weekly check-in' : '',
        goalId: 'demo-goal-123',
        createdAt: date
      });
    }
    const weights = entries.map(entry => entry.weight);
    const averageWeight = weights.reduce((sum, weight) => sum + weight, 0) / weights.length;
    const weightChange = weights[weights.length - 1] - weights[0];
    let trend = 'stable';
    if (weightChange < -0.5) trend = 'decreasing';
    else if (weightChange > 0.5) trend = 'increasing';
    setAnalytics({
      totalEntries: entries.length,
      averageWeight: averageWeight.toFixed(1),
      weightChange: weightChange.toFixed(1),
      trend,
      entries,
      currentWeight: weights[weights.length - 1],
      targetWeight: 70,
      progressToTarget: Math.max(0, Math.min(100, ((startWeight - weights[weights.length - 1]) / (startWeight - 70)) * 100)),
      initialWeight: startWeight
    });
    setUserProfile({
      id: 'demo',
      name: 'Demo User',
      email: 'demo@example.com',
      mobile: '+1234567890',
      gender: 'male',
      age: 30,
      height: 170,
      currentWeight: weights[weights.length - 1],
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
    setLoading(false);
  };

  const getTrendIcon = () => {
    if (!analytics) return <Minus className="w-4 h-4 text-gray-600" />;
    
    if (analytics.trend === 'decreasing') return <ArrowDown className="w-4 h-4 text-success-600" />;
    if (analytics.trend === 'increasing') return <ArrowUp className="w-4 h-4 text-danger-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = () => {
    if (!analytics) return 'text-gray-600';
    
    if (analytics.trend === 'decreasing') return 'text-success-600';
    if (analytics.trend === 'increasing') return 'text-danger-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!analytics || !userProfile || userProfile.goalStatus !== 'active') {
    if (currentUser && currentUser.id === 'demo') {
      // Never show No Active Goal for demo
      return null;
    }
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Active Goal</h2>
        <p className="text-gray-600 mb-6">To see analytics and insights, please create a weight loss goal in your Profile.</p>
        <a href="/profile" className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition">Go to Profile &amp; Create Goal</a>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No analytics data available</p>
      </div>
    );
  }

  // Use analytics.entries if present, otherwise fallback to analytics.bmiTrend
  const entries = analytics.entries || analytics.bmiTrend || [];
  
  // Sort entries by date in descending order (most recent first)
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-success-500 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Detailed insights into your weight journey</p>
          </div>
        </div>
        
        {/* Period Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Period:</span>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input-field w-24"
          >
            <option value="7">7 days</option>
            <option value="14">14 days</option>
            <option value="30">30 days</option>
            <option value="90" selected>90 days</option>
          </select>
          <button
            onClick={loadUserProfileAndAnalytics}
            className="ml-2 px-3 py-1 rounded bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition"
            title="Refresh Analytics"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Entries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-hover"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalEntries}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Last {selectedPeriod} days
            </p>
          </div>
        </motion.div>

        {/* Average Weight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-hover"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Weight</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.averageWeight} kg</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Over {selectedPeriod} days
            </p>
          </div>
        </motion.div>

        {/* Weight Change */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-hover"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Weight Change</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.weightChange} kg</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              {getTrendIcon()}
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {analytics.trend === 'decreasing' ? 'Losing' : 
               analytics.trend === 'increasing' ? 'Gaining' : 'Stable'}
            </span>
          </div>
        </motion.div>

        {/* Progress to Target */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-hover"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Progress to Target</p>
              <p className="text-2xl font-bold text-gray-900">{typeof analytics.progressToTarget === 'number' && !isNaN(analytics.progressToTarget) ? analytics.progressToTarget.toFixed(1) : '0'}%</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                style={{ width: `${Math.min(analytics.progressToTarget, 100)}%` }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      {entries && entries.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {/* Combined Weight & BMI Trend Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight & BMI Trend (90 Days)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={entries} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleDateString()} />
                <YAxis yAxisId="left" domain={['auto', 'auto']} tickFormatter={v => `${v} kg`} />
                <YAxis yAxisId="right" orientation="right" domain={['auto', 'auto']} tickFormatter={v => v} />
                <Tooltip 
                  labelFormatter={d => new Date(d).toLocaleDateString()} 
                  formatter={(value, name) => [
                    name === 'Weight (kg)' ? `${value} kg` : value,
                    name
                  ]}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#2563eb" 
                  strokeWidth={3} 
                  dot={{ r: 4 }} 
                  name="Weight (kg)" 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="bmi" 
                  stroke="#059669" 
                  strokeWidth={3} 
                  dot={{ r: 4 }} 
                  name="BMI" 
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-600">Start adding weight entries to see your analytics</p>
          </div>
        </motion.div>
      )}

      {/* Historical Weight Logs Table */}
      {entries && entries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Historical Weight Logs</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Weight (kg)</th>
                  <th className="px-4 py-2 text-left">BMI</th>
                  <th className="px-4 py-2 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                {sortedEntries.slice((page - 1) * ENTRIES_PER_PAGE, page * ENTRIES_PER_PAGE).map((entry, idx) => (
                  <tr key={idx} className="border-b last:border-0">
                    <td className="px-4 py-2">{new Date(entry.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2 font-semibold">{entry.weight}</td>
                    <td className="px-4 py-2">{entry.bmi}</td>
                    <td className="px-4 py-2 text-gray-500 italic">{entry.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-end items-center mt-2 space-x-2">
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 text-xs font-semibold disabled:opacity-50"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="text-xs text-gray-600">Page {page} of {Math.ceil(sortedEntries.length / ENTRIES_PER_PAGE)}</span>
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 text-xs font-semibold disabled:opacity-50"
              onClick={() => setPage(p => Math.min(Math.ceil(sortedEntries.length / ENTRIES_PER_PAGE), p + 1))}
              disabled={page === Math.ceil(sortedEntries.length / ENTRIES_PER_PAGE)}
            >
              Next
            </button>
          </div>
        </motion.div>
      )}

      {/* Detailed Stats */}
      {analytics.entries && analytics.entries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Statistics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{analytics.currentWeight}</p>
              <p className="text-sm text-gray-600">Current Weight (kg)</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{analytics.targetWeight}</p>
              <p className="text-sm text-gray-600">Target Weight (kg)</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {typeof analytics.currentWeight === 'number' && typeof analytics.targetWeight === 'number' && !isNaN(analytics.currentWeight) && !isNaN(analytics.targetWeight) ? Math.abs(analytics.currentWeight - analytics.targetWeight).toFixed(1) : '-'}
              </p>
              <p className="text-sm text-gray-600">Remaining (kg)</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Analytics; 