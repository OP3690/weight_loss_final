import React, { useState, useEffect, useCallback } from 'react';
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
import { calculateBMI, weightEntryAPI, userAPI, isValidObjectId } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, ReferenceLine } from 'recharts';

const Analytics = () => {
  const { currentUser } = useUser();
  const [selectedPeriod, setSelectedPeriod] = useState('90');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const ENTRIES_PER_PAGE = 7;
  const [userProfile, setUserProfile] = useState(null);
  const [showGoalNotification, setShowGoalNotification] = useState(true);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  // ENABLED: For real user data loading
  const loadUserProfileAndAnalytics = useCallback(async () => {
    if (!currentUser?.id) return;
    
    try {
      setLoading(true);
      
      // Load user profile
      const profile = await userAPI.getUser(currentUser.id);
      setUserProfile(profile);
      
      // Load analytics data
      const analyticsResponse = await weightEntryAPI.getAnalytics(currentUser.id, {
        period: selectedPeriod,
        goalId: profile.goalId
      });
      
      if (analyticsResponse.analytics) {
        setAnalytics(analyticsResponse.analytics);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      // Don't show toast error for data loading
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id, selectedPeriod]);

  const generateSampleAnalytics = useCallback(() => {
    const days = parseInt(selectedPeriod);
    const entries = [];
    const startWeight = 76;
    
    // Use deterministic seed for consistent demo data
    // This prevents numbers from "moving" on every page refresh/re-render
    const seed = 12345; // Fixed seed for consistent results
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const baseWeight = startWeight - (days - i) * 0.1;
      
      // Deterministic fluctuation based on day and seed
      const deterministicRandom = ((seed + i) * 9301 + 49297) % 233280;
      const normalizedRandom = deterministicRandom / 233280;
      const fluctuation = (normalizedRandom - 0.5) * 0.3; // Reduced fluctuation range
      
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
  }, [selectedPeriod]);

  useEffect(() => {
    if (!currentUser?.id) return;
    
    if (currentUser.id === 'demo') {
      // Demo user - generate sample analytics data
      generateSampleAnalytics();
    } else {
      // For real users, load actual data from backend
      console.log('Real user - loading actual data from backend');
      loadUserProfileAndAnalytics();
    }
  }, [currentUser?.id, selectedPeriod]);

  // Reset attempt flag when user changes
  useEffect(() => {
    setHasAttemptedLoad(false);
  }, [currentUser?.id]);

  const getTrendIcon = () => {
    if (!analytics || !analytics.trend) return <Minus className="w-4 h-4 text-gray-600" />;
    
    if (analytics.trend === 'decreasing') return <ArrowDown className="w-4 h-4 text-success-600" />;
    if (analytics.trend === 'increasing') return <ArrowUp className="w-4 h-4 text-danger-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = () => {
    if (!analytics || !analytics.trend) return 'text-gray-600';
    
    if (analytics.trend === 'decreasing') return 'text-success-600';
    if (analytics.trend === 'increasing') return 'text-danger-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your analytics...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  // Check if analytics data is available
  if (!analytics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No analytics data available</p>
        <p className="text-sm text-gray-500 mt-2">Try refreshing the page or check your connection</p>
      </div>
    );
  }

  // Check if user has no active goal
  const hasNoActiveGoal = !userProfile || userProfile.goalStatus !== 'active';

  // Use analytics.entries if present, otherwise fallback to analytics.bmiTrend
  const entries = analytics?.entries || analytics?.bmiTrend || [];
  
  // Calculate BMI for all entries if user has height
  const entriesWithBMI = entries.map(entry => ({
    ...entry,
    bmi: userProfile?.height ? calculateBMI(entry.weight, userProfile.height) : null
  }));
  
  // Sort entries by date in ascending order (oldest first) for proper graph display
  const sortedEntries = [...entriesWithBMI].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Calculate median weight for trend line (using last 90 days)
  const calculateMedianWeight = (data) => {
    if (data.length === 0) return null;
    const weights = data.map(entry => entry.weight).filter(w => w && typeof w === 'number');
    if (weights.length === 0) return null;
    
    weights.sort((a, b) => a - b);
    const mid = Math.floor(weights.length / 2);
    return weights.length % 2 === 0 
      ? (weights[mid - 1] + weights[mid]) / 2 
      : weights[mid];
  };
  
  const last90Days = sortedEntries.slice(-90);
  const medianWeight = calculateMedianWeight(last90Days);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Goal Creation Notification */}
      {hasNoActiveGoal && showGoalNotification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl p-6 shadow-xl border border-indigo-400/20 relative"
        >
          {/* Close button */}
          <button
            onClick={() => setShowGoalNotification(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex items-center justify-between pr-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">No Active Goal Found</h3>
                <p className="text-indigo-100 text-lg">
                  Create a weight loss goal to unlock detailed analytics and progress insights!
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/profile'}
              className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Create Goal
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Analytics</h1>
                <p className="text-blue-100">Detailed insights into your weight journey</p>
              </div>
            </div>
            
            {/* Period Selector */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-white">Period:</span>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-white/20 text-white border-white/30 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="7" className="text-gray-900">7 days</option>
                <option value="14" className="text-gray-900">14 days</option>
                <option value="30" className="text-gray-900">30 days</option>
                <option value="90" className="text-gray-900">90 days</option>
              </select>
              <button
                onClick={loadUserProfileAndAnalytics}
                className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                title="Refresh Analytics"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Summary Statistics</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Entries */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Entries</p>
                  <p className="text-3xl font-bold text-blue-900">{analytics?.totalEntries || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-blue-600">
                  Last {selectedPeriod} days
                </p>
              </div>
            </motion.div>

            {/* Average Weight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Average Weight</p>
                  <p className="text-3xl font-bold text-green-900">{analytics?.averageWeight || '0.0'} kg</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-green-600">
                  Over {selectedPeriod} days
                </p>
              </div>
            </motion.div>

            {/* Weight Change */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Weight Change</p>
                  <p className="text-3xl font-bold text-purple-900">{analytics?.weightChange || '0.0'} kg</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  {getTrendIcon()}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-purple-600">
                  {analytics?.trend || 'Stable'}
                </p>
              </div>
            </motion.div>

            {/* Progress to Target */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Progress to Target</p>
                  <p className="text-3xl font-bold text-orange-900">{analytics?.progressToTarget?.toFixed(1) || '0.0'}%</p>
                </div>
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-orange-600">
                  Goal Progress
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Progress Trend Analysis Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Progress Trend Analysis</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Last 7 Days */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 text-center"
            >
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowUp className="w-8 h-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-blue-900 mb-2">0.0 kg</p>
              <p className="text-sm text-blue-600">Last 7 Days</p>
            </motion.div>

            {/* Last 30 Days */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 text-center"
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-green-900 mb-2">0.0 kg</p>
              <p className="text-sm text-green-600">Last 30 Days</p>
            </motion.div>

            {/* Total Change */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 text-center"
            >
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-purple-900 mb-2">0.0 kg</p>
              <p className="text-sm text-purple-600">Total Change</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {entries && entries.length > 0 ? (
        <div className="space-y-6">
          {/* Enhanced Weight & BMI Trend Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Weight & BMI Trend ({selectedPeriod} Days)</h3>
                    <p className="text-indigo-100 text-sm">Track your weight and BMI changes over time</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                    <span className="text-white">Weight (kg)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-300 rounded-full"></div>
                    <span className="text-white">BMI</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <ResponsiveContainer width="100%" height={450}>
                <LineChart 
                  data={sortedEntries} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    yAxisId="left"
                    label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280' } }}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    label={{ value: 'BMI', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#6b7280' } }}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="bmi" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Weight Distribution and BMI Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weight Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Weight Distribution</h3>
                </div>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sortedEntries} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      tick={{ fontSize: 10, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280' } }}
                      tick={{ fontSize: 10, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Bar dataKey="weight" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <ReferenceLine 
                      y={medianWeight} 
                      stroke="#ef4444" 
                      strokeDasharray="3 3" 
                      label={{ value: 'Median Weight', position: 'top', fill: '#ef4444' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* BMI Trends */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">BMI Trends</h3>
                </div>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sortedEntries} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      tick={{ fontSize: 10, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      label={{ value: 'BMI', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280' } }}
                      tick={{ fontSize: 10, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="bmi" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                    />
                    <ReferenceLine 
                      y={25} 
                      stroke="#f59e0b" 
                      strokeDasharray="3 3" 
                      label={{ value: 'Overweight', position: 'top', fill: '#f59e0b' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-500 to-gray-600 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">No Data Available</h3>
            </div>
          </div>
          <div className="p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Weight Entries Found</h3>
            <p className="text-gray-600">Start tracking your weight to see analytics and trends.</p>
          </div>
        </div>
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

      {/* BMI Category Breakdown */}
      {entries && entries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">BMI Category Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(() => {
              const latestBMI = sortedEntries[sortedEntries.length - 1]?.bmi;
              const getBMICategory = (bmi) => {
                if (!bmi || typeof bmi !== 'number') return { name: 'Unknown', color: 'gray', bg: 'from-gray-400 to-gray-500', text: 'text-gray-700' };
                if (bmi < 18.5) return { name: 'Underweight', color: 'yellow', bg: 'from-yellow-400 to-yellow-500', text: 'text-yellow-700' };
                if (bmi < 25) return { name: 'Normal', color: 'green', bg: 'from-green-400 to-green-500', text: 'text-green-700' };
                if (bmi < 30) return { name: 'Overweight', color: 'orange', bg: 'from-orange-400 to-orange-500', text: 'text-orange-700' };
                return { name: 'Obese', color: 'red', bg: 'from-red-400 to-red-500', text: 'text-red-700' };
              };
              
              const currentCategory = getBMICategory(latestBMI);
              const categories = [
                { name: 'Underweight', range: '< 18.5', color: 'yellow', bg: 'from-yellow-50 to-yellow-100', border: 'border-yellow-200' },
                { name: 'Normal', range: '18.5 - 24.9', color: 'green', bg: 'from-green-50 to-green-100', border: 'border-green-200' },
                { name: 'Overweight', range: '25.0 - 29.9', color: 'orange', bg: 'from-orange-50 to-orange-100', border: 'border-orange-200' },
                { name: 'Obese', range: '≥ 30.0', color: 'red', bg: 'from-red-50 to-red-100', border: 'border-red-200' }
              ];
              
              return categories.map((category, index) => {
                const isCurrent = category.name === currentCategory.name;
                return (
                  <div 
                    key={index}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      isCurrent 
                        ? `bg-gradient-to-br ${category.bg} ${category.border} shadow-lg scale-105` 
                        : `bg-gradient-to-br ${category.bg} ${category.border} opacity-75`
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-semibold ${isCurrent ? category.text : 'text-gray-600'}`}>
                        {category.name}
                      </h4>
                      {isCurrent && (
                        <div className={`w-3 h-3 bg-${category.color}-500 rounded-full animate-pulse`}></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{category.range}</p>
                    {isCurrent && (
                      <p className={`text-lg font-bold ${category.text}`}>
                        Current: {latestBMI && typeof latestBMI === 'number' ? latestBMI.toFixed(1) : '0.0'}
                      </p>
                    )}
                  </div>
                );
              });
            })()}
          </div>
          
          {/* BMI Trend Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">BMI Trend Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Starting BMI: </span>
                <span className="font-semibold">{sortedEntries[0]?.bmi && typeof sortedEntries[0].bmi === 'number' ? sortedEntries[0].bmi.toFixed(1) : '0.0'}</span>
              </div>
              <div>
                <span className="text-gray-600">Current BMI: </span>
                <span className="font-semibold">{sortedEntries[sortedEntries.length - 1]?.bmi && typeof sortedEntries[sortedEntries.length - 1].bmi === 'number' ? sortedEntries[sortedEntries.length - 1].bmi.toFixed(1) : '0.0'}</span>
            </div>
              <div>
                <span className="text-gray-600">BMI Change: </span>
                <span className={`font-semibold ${sortedEntries[sortedEntries.length - 1]?.bmi < sortedEntries[0]?.bmi ? 'text-green-600' : 'text-red-600'}`}>
                  {sortedEntries[sortedEntries.length - 1]?.bmi && sortedEntries[0]?.bmi && typeof sortedEntries[sortedEntries.length - 1].bmi === 'number' && typeof sortedEntries[0].bmi === 'number' ? (sortedEntries[sortedEntries.length - 1].bmi - sortedEntries[0].bmi).toFixed(1) : '0.0'}
                </span>
            </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Analytics; 