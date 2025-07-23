import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Scale, 
  Calendar,
  Activity,
  ArrowUp,
  ArrowDown,
  Minus,
  Pencil,
  Plus,
  BarChart3
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { calculateBMI, getBMICategory, userAPI, weightEntryAPI, isValidObjectId } from '../services/api';
import WeightEntry from './WeightEntry';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';

const Dashboard = () => {
  const { currentUser, setCurrentUser } = useUser();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    currentWeight: 0,
    targetWeight: 0,
    height: 0,
    targetDate: new Date(),
    goalStartDate: new Date(),
    recentEntries: []
  });
  const [showWeightEntry, setShowWeightEntry] = useState(false);
  const [addEntryDate, setAddEntryDate] = useState(null);
  const [editEntry, setEditEntry] = useState(null);

  const bmiBarRef = useRef(null);
  const [barWidth, setBarWidth] = useState(0);

  // Helper: check if today's weight is logged
  function isSameDay(dateA, dateB) {
    const a = new Date(dateA);
    const b = new Date(dateB);
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  const todaysEntry = stats.recentEntries.find(entry => isSameDay(entry.date, new Date()));
  const hasLoggedToday = Boolean(todaysEntry);

  // Helper: get last 30 days with weights
  function getLast30DaysGrid(entries) {
    const today = new Date();
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      days.push({
        date: dateStr,
        weight: null,
        notes: '',
      });
    }
    
    entries.forEach(entry => {
      const entryDateStr = new Date(entry.date).toISOString().slice(0, 10);
      days.forEach(day => {
        if (entryDateStr === day.date) {
          day.weight = entry.weight;
          day.notes = entry.notes || '';
        }
      });
    });
    return days;
  }

  function getWeightChangeColor(pct, idx, days) {
    if (pct === 0) return 'bg-gray-200';
    if (pct > 0) return 'bg-red-400';
    return 'bg-green-400';
  }

  function findEntryByDate(entries, date) {
    return entries?.find(e => {
      const d = new Date(e.date);
      const t = new Date(date);
      return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
    });
  }

  function getWeightAtOrBefore(date) {
    const entries = stats.recentEntries.filter(e => new Date(e.date) <= new Date(date));
    if (entries.length === 0) return null;
    return entries[entries.length - 1].weight;
  }

  function getMedianWeightInRange(start, end) {
    const entries = stats.recentEntries.filter(e => {
      const d = new Date(e.date);
      return d >= new Date(start) && d <= new Date(end);
    });
    if (entries.length === 0) return null;
    const weights = entries.map(e => e.weight).sort((a, b) => a - b);
    const mid = Math.floor(weights.length / 2);
    return weights.length % 2 === 0 ? (weights[mid - 1] + weights[mid]) / 2 : weights[mid];
  }

  function getLatestWeightBeforeOrAt(date) {
    const entries = stats.recentEntries.filter(e => new Date(e.date) <= new Date(date));
    if (entries.length === 0) return null;
    return entries[entries.length - 1].weight;
  }

  function toDateOnly(date) {
    return new Date(date).toISOString().slice(0, 10);
  }

  function getLatestEntryAtOrBefore(date) {
    const entries = stats.recentEntries.filter(e => new Date(e.date) <= new Date(date));
    if (entries.length === 0) return null;
    return entries[entries.length - 1];
  }

  const getEntryForDate = (date) => {
    const dateStr = toDateOnly(date);
    return stats.recentEntries.find(entry => toDateOnly(entry.date) === dateStr);
  };

  // Load user profile
  const loadUserProfile = async () => {
    if (!currentUser || currentUser.id === 'demo') return;
    try {
      const profile = await userAPI.getUser(currentUser.id);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadUserProfile();
    }
  }, [currentUser]);

  useEffect(() => {
    function updateBarWidth() {
      if (bmiBarRef.current) {
        setBarWidth(bmiBarRef.current.offsetWidth);
      }
    }
    updateBarWidth();
    window.addEventListener('resize', updateBarWidth);
    return () => window.removeEventListener('resize', updateBarWidth);
  }, []);

  // Demo data setup
  useEffect(() => {
    if (currentUser && currentUser.id === 'demo') {
      const demoProfile = {
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
      };
      
      const demoEntries = [];
      const today = new Date();
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const baseWeight = 76 - i * 0.1;
        const fluctuation = (Math.random() - 0.5) * 0.3;
        const weight = Math.round((baseWeight + fluctuation) * 10) / 10;
        demoEntries.push({
          id: `demo-entry-${i}`,
          date: date.toISOString().slice(0, 10),
          weight,
          notes: i % 7 === 0 ? 'Weekly check-in' : ''
        });
      }
      
      setUserProfile(demoProfile);
      setStats({
        currentWeight: demoProfile.currentWeight,
        targetWeight: demoProfile.targetWeight,
        height: demoProfile.height,
        targetDate: new Date(demoProfile.targetDate),
        goalStartDate: new Date(demoProfile.goalCreatedAt),
        recentEntries: demoEntries,
        initialWeight: demoEntries[demoEntries.length - 1].weight
      });
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && currentUser.id === 'demo') {
      setLoading(false);
    }
  }, [currentUser]);

  // Fetch analytics for real users
  useEffect(() => {
    if (!currentUser || !userProfile || currentUser.id === 'demo') return;
    
    const fetchAnalytics = async () => {
      try {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 29);
        
        const analytics = await weightEntryAPI.getAnalytics(currentUser.id, {
          period: 30,
          startDate: startDate.toISOString().slice(0, 10),
          endDate: today.toISOString().slice(0, 10)
        });
        
        if (analytics && analytics.entries) {
          setStats(prev => ({
            ...prev,
            recentEntries: analytics.entries,
            currentWeight: analytics.currentWeight || prev.currentWeight,
            initialWeight: analytics.initialWeight || prev.initialWeight
          }));
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [currentUser, userProfile]);

  const handleEntryAdded = () => {
    setShowWeightEntry(false);
    setAddEntryDate(null);
    // Refresh data
    if (currentUser && currentUser.id !== 'demo') {
      loadUserProfile();
    }
  };

  const getTrendIcon = () => {
    if (stats.recentEntries.length < 2) return <Minus className="w-4 h-4 text-gray-500" />;
    const recent = stats.recentEntries.slice(-7);
    if (recent.length < 2) return <Minus className="w-4 h-4 text-gray-500" />;
    
    const first = recent[0].weight;
    const last = recent[recent.length - 1].weight;
    const change = last - first;
    
    if (change > 0.1) return <ArrowUp className="w-4 h-4 text-red-500" />;
    if (change < -0.1) return <ArrowDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getTrendText = () => {
    if (stats.recentEntries.length < 2) return 'No data';
    const recent = stats.recentEntries.slice(-7);
    if (recent.length < 2) return 'No data';
    
    const first = recent[0].weight;
    const last = recent[recent.length - 1].weight;
    const change = last - first;
    
    if (change > 0.1) return 'Gaining weight';
    if (change < -0.1) return 'Losing weight';
    return 'Stable';
  };

  const getTrendColor = () => {
    if (stats.recentEntries.length < 2) return 'text-gray-500';
    const recent = stats.recentEntries.slice(-7);
    if (recent.length < 2) return 'text-gray-500';
    
    const first = recent[0].weight;
    const last = recent[recent.length - 1].weight;
    const change = last - first;
    
    if (change > 0.1) return 'text-red-500';
    if (change < -0.1) return 'text-green-500';
    return 'text-gray-500';
  };

  function getBMIMarkerPixelPosition(bmi) {
    if (!barWidth) return 0;
    const minBMI = 16;
    const maxBMI = 45;
    const clampedBMI = Math.max(minBMI, Math.min(maxBMI, bmi));
    return ((clampedBMI - minBMI) / (maxBMI - minBMI)) * barWidth;
  }

  // Check if user has an active goal
  if (!userProfile || !userProfile.goalStatus || userProfile.goalStatus !== 'active') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {currentUser?.name || 'User'}! Here's your progress overview.
            </p>
          </div>
          
          {/* No active goal state */}
          <div className="flex flex-col items-center justify-center min-h-[500px] bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="text-center">
              <Target className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">No Active Goal</h3>
              <p className="text-gray-600 mb-8 max-w-md">
                Create a weight goal to start tracking your progress and unlock all dashboard features.
              </p>
              <button 
                onClick={() => window.location.href = '/profile'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
              >
                Create Your First Goal
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {currentUser?.name || 'User'}! Here's your progress overview.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Current Weight */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Weight</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.currentWeight} kg</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Scale className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  {getTrendIcon()}
                  <span className={`text-sm font-medium ${getTrendColor()}`}>
                    {getTrendText()}
                  </span>
                </div>
              </motion.div>

              {/* Target Weight */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Target Weight</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.targetWeight} kg</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    {Math.abs(stats.currentWeight - stats.targetWeight).toFixed(1)} kg to go
                  </p>
                </div>
              </motion.div>

              {/* Current BMI */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current BMI</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.height && stats.currentWeight
                        ? calculateBMI(stats.currentWeight, stats.height).toFixed(2)
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    {stats.height && stats.currentWeight
                      ? getBMICategory(calculateBMI(stats.currentWeight, stats.height))
                      : 'Enter height & weight'}
                  </p>
                </div>
              </motion.div>

              {/* Days Remaining */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Days Remaining</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.targetDate && stats.targetDate > new Date()
                        ? Math.ceil((stats.targetDate - new Date()) / (1000 * 60 * 60 * 24))
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    {stats.targetDate
                      ? `Target: ${stats.targetDate.toLocaleDateString()}`
                      : 'Set target date'}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Progress Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Weight Progress */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  Weight Progress
                </h3>
                
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <p>Initial Weight: {stats.initialWeight} kg (on {stats.goalStartDate.toLocaleDateString()})</p>
                    <p>Goal Start Date: {stats.goalStartDate.toLocaleDateString()}</p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to Target</span>
                      <span>{Math.abs(stats.currentWeight - stats.initialWeight).toFixed(1)} kg</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(100, Math.max(0, 
                            (Math.abs(stats.currentWeight - stats.initialWeight) / 
                             Math.abs(stats.targetWeight - stats.initialWeight)) * 100
                          ))}%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500">
                      {Math.abs(stats.currentWeight - stats.targetWeight).toFixed(1)} kg remaining
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* BMI Progress */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-purple-600" />
                  BMI Progress
                </h3>
                
                {stats.height && stats.currentWeight ? (
                  <div className="space-y-4">
                    {/* BMI Scale */}
                    <div className="relative" ref={bmiBarRef}>
                      <div className="flex h-8 rounded-lg overflow-hidden">
                        <div className="flex-1 bg-blue-400"></div>
                        <div className="flex-1 bg-green-400"></div>
                        <div className="flex-1 bg-yellow-400"></div>
                        <div className="flex-1 bg-orange-400"></div>
                        <div className="flex-1 bg-red-500"></div>
                        <div className="flex-1 bg-red-700"></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 mt-1">
                        <span>16</span>
                        <span>18.5</span>
                        <span>25</span>
                        <span>30</span>
                        <span>35</span>
                        <span>40+</span>
                      </div>
                      {/* BMI Marker */}
                      <div 
                        className="absolute top-0 w-1 h-8 bg-black transform -translate-x-1/2"
                        style={{ left: `${getBMIMarkerPixelPosition(calculateBMI(stats.currentWeight, stats.height))}px` }}
                      ></div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">
                        {calculateBMI(stats.currentWeight, stats.height).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">Current BMI</p>
                      <p className="text-sm font-medium text-gray-800">
                        {getBMICategory(calculateBMI(stats.currentWeight, stats.height))}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-2" />
                    <p>Enter your height and weight to see BMI analytics</p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Recent Weight Entries */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Recent Weight Entries (30 Days)</h3>
                <button
                  onClick={() => setShowWeightEntry(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Entry
                </button>
              </div>
              
              <div className="grid grid-cols-7 md:grid-cols-15 lg:grid-cols-30 gap-2">
                {getLast30DaysGrid(stats.recentEntries).map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-gray-500 mb-1">
                      {new Date(day.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </div>
                    <div className="bg-gray-100 rounded-lg p-2 min-h-[60px] flex flex-col justify-center">
                      {day.weight ? (
                        <div className="space-y-1">
                          <div className="text-sm font-semibold">{day.weight} kg</div>
                          <div className="flex justify-center space-x-1">
                            <button
                              onClick={() => setEditEntry({ ...day, date: day.date })}
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-400 text-xs">No entry</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* Weight Entry Modal */}
        {showWeightEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl shadow-2xl border border-blue-200 px-8 py-8 max-w-md w-full relative"
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-3xl font-bold focus:outline-none"
                onClick={() => setShowWeightEntry(false)}
              >
                &times;
              </button>
              <WeightEntry
                onEntryAdded={handleEntryAdded}
                onSuccess={handleEntryAdded}
                defaultDate={addEntryDate}
                goalId={userProfile?.goalId}
              />
            </motion.div>
          </div>
        )}

        {/* Edit Entry Modal */}
        {editEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl shadow-2xl border border-blue-200 px-8 py-8 max-w-md w-full relative"
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-3xl font-bold focus:outline-none"
                onClick={() => setEditEntry(null)}
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Weight Entry</h2>
              <WeightEntry
                onEntryAdded={() => setEditEntry(null)}
                onSuccess={() => setEditEntry(null)}
                defaultDate={editEntry.date}
                goalId={userProfile?.goalId}
                editEntry={editEntry}
              />
            </motion.div>
          </div>
        )}

        {/* Floating Action Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowWeightEntry(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-40"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
};

export default Dashboard; 