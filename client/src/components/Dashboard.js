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
  Plus
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { calculateBMI, getBMICategory, userAPI, weightEntryAPI, isValidObjectId } from '../services/api';
import WeightEntry from './WeightEntry';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';

console.log('DASHBOARD FILE LOADED');

function formatGridDate(date) {
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Timezone-safe date formatter
const formatDateToYYYYMMDD = (dateInput) => {
  const d = new Date(dateInput);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Dashboard = () => {
  console.log('DASHBOARD COMPONENT START');
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

  // Helper: check if today's weight is logged (local date comparison)
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
  const [showViewToday, setShowViewToday] = useState(false);

  // Helper: get last 30 days with weights
  function getLast30DaysGrid(entries) {
    const today = new Date();
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10); // 'YYYY-MM-DD' in UTC
      days.push({
        date: dateStr, // always string
        weight: null,
        notes: '',
      });
    }
    // Debug: print all entries and grid days
    console.log('[DEBUG] Entries for grid mapping:', entries);
    console.log('[DEBUG] Grid days:', days.map(day => day.date));
    // Map entries to days using robust UTC date comparison
    entries.forEach(entry => {
      const entryDateStr = new Date(entry.date).toISOString().slice(0, 10);
      days.forEach(day => {
        if (entryDateStr === day.date) {
          day.weight = entry.weight;
          day.notes = entry.notes || '';
          // Debug: print mapping
          console.log(`[DEBUG] Mapped entry ${entry.weight} to day ${day.date}`);
        }
      });
    });
    return days;
  }

  // Helper: get color class for % change
  function getWeightChangeColor(pct, idx, days) {
    if (pct === null) return 'bg-gray-100';

    // Consistent weight: between -0.2% and +0.2%
    if (pct >= -0.2 && pct <= 0.2) return 'bg-green-100'; // light green

    // Check for 3 consecutive >1% decrease (dark red)
    let darkRed = true;
    let count = 0;
    let checkIdx = idx;
    let prevIdx;
    while (count < 3 && checkIdx < days.length) {
      // Find previous entry
      prevIdx = checkIdx + 1;
      while (prevIdx < days.length && days[prevIdx].weight === null) prevIdx++;
      if (prevIdx >= days.length || days[checkIdx].weight === null || days[prevIdx].weight === null) {
        darkRed = false;
        break;
      }
      const change = ((days[checkIdx].weight - days[prevIdx].weight) / days[prevIdx].weight) * 100;
      if (change > -1) {
        darkRed = false;
        break;
      }
      checkIdx = prevIdx;
      count++;
    }
    if (darkRed && count === 3) return 'bg-red-900 text-white';

    // Increase
    if (pct > 0.001 && pct <= 0.3) return 'bg-yellow-100'; // light yellow
    if (pct > 0.3 && pct <= 0.5) return 'bg-red-100'; // light red
    if (pct > 0.5) return 'bg-red-500 text-white'; // red

    // Decrease
    if (pct < -0.001 && pct >= -0.3) return 'bg-green-50'; // lightest green
    if (pct < -0.3 && pct >= -0.5) return 'bg-green-200'; // light green
    if (pct < -0.5 && pct >= -1) return 'bg-green-500 text-white'; // green

    return 'bg-gray-100';
  }

  // Helper: find entry by date (now using simple string comparison)
  function findEntryByDate(entries, date) {
    return entries?.find(e => e.date === date);
  }

  // Helper: get weight at or before a given date
  function getWeightAtOrBefore(date) {
    // Entries are sorted descending by date
    const entry = stats.recentEntries.find(e => new Date(e.date) <= date);
    return entry ? entry.weight : null;
  }

  // Helper: get median weight in a date range
  function getMedianWeightInRange(start, end) {
    const s = toDateOnly(start);
    const e = toDateOnly(end);
    const weights = stats.recentEntries
      .filter(ei => {
        const d = toDateOnly(ei.date);
        return d >= s && d <= e;
      })
      .map(ei => ei.weight)
      .sort((a, b) => a - b);
    if (weights.length === 0) return null;
    const mid = Math.floor(weights.length / 2);
    return weights.length % 2 !== 0 ? weights[mid] : (weights[mid - 1] + weights[mid]) / 2;
  }

  // Helper: get latest entry before or at a given date
  function getLatestWeightBeforeOrAt(date) {
    const d = toDateOnly(date);
    const entry = stats.recentEntries.find(ei => toDateOnly(ei.date) <= d);
    return entry ? entry.weight : null;
  }

  // Helper: convert to date-only (strip time)
  function toDateOnly(date) {
    return new Date(new Date(date).toISOString().slice(0, 10));
  }

  // Helper: get latest entry at or before a given date (date-only)
  function getLatestEntryAtOrBefore(date) {
    const d = toDateOnly(date);
    return stats.recentEntries.find(ei => toDateOnly(ei.date) <= d) || null;
  }

  // When mapping entries to days, use only the date part for comparison
  const getEntryForDate = (date) => {
    const dateStr = date.toISOString().slice(0, 10); // 'YYYY-MM-DD'
    return (stats?.recentEntries || []).find(entry => {
      const entryDateStr = new Date(entry.date).toISOString().slice(0, 10);
      return entryDateStr === dateStr;
    });
  };

  // Always use userProfile.goalId as the active goalId, but validate it
  const activeGoalId = userProfile && userProfile.goalId && (userProfile.goalId === 'demo' || isValidObjectId(userProfile.goalId)) ? userProfile.goalId : null;

  // Filter entries for the current goalId
  const goalEntries = stats.recentEntries.filter(entry => !activeGoalId || entry.goalId === activeGoalId);

  // Define loadUserProfile function
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

  useEffect(() => {
    if (currentUser && currentUser.id === 'demo') {
      // Generate demo userProfile and stats
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
      // Generate 30 days of demo entries
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

  useEffect(() => {
    if (!currentUser || !userProfile) return;
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 29);
    // Fetch analytics for the active goal
    weightEntryAPI.getAnalytics(currentUser.id, {
      period: 30,
      startDate: startDate.toISOString().slice(0, 10),
      goalId: activeGoalId
    })
      .then(response => {
        console.log('[ANALYTICS API RESPONSE]', response);
        if (response.analytics) {
          setStats({
            currentWeight: response.analytics.currentWeight,
            targetWeight: response.analytics.targetWeight,
            height: userProfile.height,
            targetDate: new Date(userProfile.targetDate),
            goalStartDate: userProfile.goalCreatedAt ? new Date(userProfile.goalCreatedAt) : (userProfile.createdAt ? new Date(userProfile.createdAt) : new Date()),
            recentEntries: (response.analytics.entries || []).map(entry => ({
              id: entry.id || entry._id,
              date: entry.date,
              weight: entry.weight,
              notes: entry.notes || '',
              goalId: entry.goalId,
              createdAt: entry.createdAt
            })),
            initialWeight: response.analytics.initialWeight || userProfile.currentWeight
          });
        } else {
          setStats({
            currentWeight: userProfile.currentWeight,
            targetWeight: userProfile.targetWeight,
            height: userProfile.height,
            targetDate: new Date(userProfile.targetDate),
            goalStartDate: userProfile.goalCreatedAt ? new Date(userProfile.goalCreatedAt) : (userProfile.createdAt ? new Date(userProfile.createdAt) : new Date()),
            recentEntries: [],
            initialWeight: userProfile.currentWeight
          });
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('[ANALYTICS API ERROR]', error);
        setStats({
          currentWeight: userProfile.currentWeight,
          targetWeight: userProfile.targetWeight,
          height: userProfile.height,
          targetDate: new Date(userProfile.targetDate),
          goalStartDate: userProfile.goalCreatedAt ? new Date(userProfile.goalCreatedAt) : (userProfile.createdAt ? new Date(userProfile.createdAt) : new Date()),
          recentEntries: [],
          initialWeight: userProfile.currentWeight
        });
        setLoading(false);
      });
  }, [currentUser, userProfile, activeGoalId]);

  const handleEntryAdded = () => {
    setShowWeightEntry(false);
    if (currentUser && userProfile) {
      userAPI.getUser(currentUser.id).then((profile) => {
        setUserProfile(profile);
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 29);
        weightEntryAPI.getUserEntries(currentUser.id, {
          startDate: startDate.toISOString().slice(0, 10),
          endDate: today.toISOString().slice(0, 10),
          goalId: activeGoalId
        }).then((weightEntriesResponse) => {
          try {
            setLoading(true);
            // Sort entries by date descending
            const sortedEntries = weightEntriesResponse.entries.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
            // Filter out duplicates: keep only the latest entry for each date
            const uniqueEntriesMap = new Map();
            for (const entry of sortedEntries) {
              const dateStr = formatDateToYYYYMMDD(entry.date);
              if (!uniqueEntriesMap.has(dateStr)) {
                uniqueEntriesMap.set(dateStr, entry);
              }
            }
            const uniqueEntries = Array.from(uniqueEntriesMap.values());
            const goalStartDate = profile.goalCreatedAt ? new Date(profile.goalCreatedAt) : (profile.createdAt ? new Date(profile.createdAt) : new Date());
            const filteredEntries = uniqueEntries;
            const initialWeight = profile.goalInitialWeight !== undefined ? profile.goalInitialWeight : (filteredEntries.length > 0 ? filteredEntries[filteredEntries.length - 1].weight : profile.currentWeight);
            const currentWeight = filteredEntries.length > 0 ? filteredEntries[0].weight : profile.currentWeight;
            setStats({
              currentWeight,
              targetWeight: profile.targetWeight,
              height: profile.height,
              targetDate: new Date(profile.targetDate),
              goalStartDate,
              recentEntries: filteredEntries.map(entry => ({
                id: entry.id || entry._id,
                date: formatDateToYYYYMMDD(entry.date),
                weight: entry.weight,
                notes: entry.notes || '',
                goalId: entry.goalId
              })),
              initialWeight
            });
            console.log('[ANALYTICS API RESPONSE]', weightEntriesResponse.analytics);
          } catch (error) {
            console.error('Error loading dashboard data:', error);
          } finally {
            setLoading(false);
          }
        });
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!userProfile || userProfile.goalStatus !== 'active') {
    if (currentUser && currentUser.id === 'demo') {
      // Never show No Active Goal for demo
      return null;
    }
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Active Goal</h2>
        <p className="text-gray-600 mb-6">To see your dashboard analytics, milestones, and progress, please create a weight loss goal in your Profile.</p>
        <a href="/profile" className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition">Go to Profile &amp; Create Goal</a>
      </div>
    );
  }

  const currentBMI = calculateBMI(stats.currentWeight, stats.height);
  const targetBMI = calculateBMI(stats.targetWeight, stats.height);
  const weightDifference = stats.currentWeight - stats.targetWeight;
  const daysRemaining = Math.max(0, Math.ceil((stats.targetDate - new Date()) / (1000 * 60 * 60 * 24)));
  
  const recentWeightChange = stats.recentEntries.length >= 2 
    ? stats.recentEntries[0].weight - stats.recentEntries[stats.recentEntries.length - 1].weight
    : 0;

  const getTrendIcon = () => {
    if (recentWeightChange < -0.5) return <ArrowDown className="w-4 h-4 text-success-600" />;
    if (recentWeightChange > 0.5) return <ArrowUp className="w-4 h-4 text-danger-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendText = () => {
    if (recentWeightChange < -0.5) return 'Losing weight';
    if (recentWeightChange > 0.5) return 'Gaining weight';
    return 'Stable';
  };

  const getTrendColor = () => {
    if (recentWeightChange < -0.5) return 'text-success-600';
    if (recentWeightChange > 0.5) return 'text-danger-600';
    return 'text-gray-600';
  };

  // Updated BMI Segments: Extreme Underweight and Obese-3 are 7% each, rest distributed proportionally
  const bmiSegments = [
    { label: 'Underweight', min: 0, max: 18.5, width: 14.7 },    // 7% + 7.7% = 14.7%
    { label: 'Normal', min: 18.5, max: 25.0, width: 20.2 },      // unchanged
    { label: 'Overweight', min: 25.0, max: 30.0, width: 15.0 },  // unchanged
    { label: 'Obese-1', min: 30.0, max: 35.0, width: 15.0 },     // unchanged
    { label: 'Obese-2', min: 35.0, max: 40.0, width: 15.0 },     // unchanged
    { label: 'Obese-3', min: 40.0, max: 45.0, width: 20.1 },     // 15% + 7% = 22%, but fudge to 20.1% for 100%
  ];
  const totalWidth = bmiSegments.reduce((sum, seg) => sum + seg.width, 0);
  function getBMIMarkerPixelPosition(bmi) {
    if (!barWidth) return 2;
    let leftPx = 0;
    for (let i = 0; i < bmiSegments.length; i++) {
      const seg = bmiSegments[i];
      const segWidthPx = (seg.width / totalWidth) * barWidth;
      if (bmi < seg.max || i === bmiSegments.length - 1) {
        const segRange = seg.max - seg.min;
        const withinSeg = Math.max(0, Math.min(1, (bmi - seg.min) / (segRange === 0 ? 1 : segRange)));
        let pos = leftPx + withinSeg * segWidthPx;
        // Clamp position to bar, inset by 2px from each side
        pos = Math.max(2, Math.min(barWidth - 5, pos));
        console.log('[BMI Marker]', {
          bmi,
          segmentIndex: i,
          segMin: seg.min,
          segMax: seg.max,
          segWidthPx,
          leftPx,
          withinSeg,
          markerPosPx: pos,
          barWidth
        });
        return pos;
      }
      leftPx += segWidthPx;
    }
    return barWidth - 5;
  }

  // Enhanced milestone logic
  const today = new Date();
  const totalDays = Math.max(1, Math.ceil((stats.targetDate - today) / (1000 * 60 * 60 * 24)));
  // Calculate total weight to lose and total goal days ONCE
  const totalWeightToLose = stats.initialWeight - stats.targetWeight;
  const totalGoalDays = Math.max(1, Math.ceil((stats.targetDate - stats.goalStartDate) / (1000 * 60 * 60 * 24)));
  const months = 3;
  const daysPerMonth = Math.round((Math.ceil((stats.targetDate - today) / (1000 * 60 * 60 * 24))) / months);
  const milestonePercents = [0.4, 0.35, 0.25];
  const milestoneLabels = ['Milestone-1', 'Milestone-2', 'Milestone-3'];
  const milestoneWeights = milestonePercents.map(p => +(p * totalWeightToLose).toFixed(1));
  const milestoneCumulative = milestoneWeights.reduce((arr, w, i) => {
    arr.push((arr[i - 1] || 0) + w);
    return arr;
  }, []);
  const milestoneDeficits = milestoneWeights.map((w, i) => {
    const waterLoss = i === 0 ? 1.5 : 0;
    return Math.round(((w - waterLoss) * 7700) / 30);
  });
  // Calculate milestone start/end dates based on milestonePercents
  let milestoneDates = [];
  let runningDays = 0;
  for (let i = 0; i < milestonePercents.length; i++) {
    runningDays += Math.round(milestonePercents[i] * totalGoalDays);
    const d = new Date(stats.goalStartDate);
    d.setDate(d.getDate() + runningDays);
    milestoneDates.push(d);
  }
  // Milestone start dates
  const milestoneStartDates = [stats.goalStartDate, ...milestoneDates.slice(0, -1)];
  // Determine achieved/current/future
  const currentLost = Math.max(0, stats.initialWeight - stats.currentWeight);
  const achievedMilestoneIdx = milestoneCumulative.findIndex(w => currentLost < w);
  const currentMilestoneIdx = achievedMilestoneIdx === -1 ? months - 1 : achievedMilestoneIdx;

  // Use analytics data for progress calculation - no local recalculation
  const weightLost = stats.initialWeight - stats.currentWeight;
  // Expected progress: how much should have been lost by now
  const daysSinceStart = Math.max(0, Math.floor((new Date() - new Date(stats.goalStartDate)) / (1000 * 60 * 60 * 24)));
  const expectedProgress = totalWeightToLose * (daysSinceStart / totalGoalDays);
  // Initial weight date (for display)
  const initialWeightDate = userProfile && userProfile.goalCreatedAt ? userProfile.goalCreatedAt : (goalEntries.length > 0 ? goalEntries[goalEntries.length - 1].date : null);

  // Color logic
  let progressColor = 'bg-green-500';
  if (weightLost < expectedProgress * 0.8) progressColor = 'bg-red-500';
  else if (weightLost < expectedProgress) progressColor = 'bg-yellow-400';

  // Milestone marker positions (as % of bar)
  const milestonePositions = milestoneCumulative.map(w => totalWeightToLose > 0 ? (w / totalWeightToLose) * 100 : 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {currentUser.name}! Here's your progress overview.</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-12 h-12 bg-gradient-to-r from-primary-500 to-success-500 rounded-xl flex items-center justify-center"
        >
          <Activity className="w-6 h-6 text-white" />
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Current Weight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-hover"
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
          className="card-hover"
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
              {Math.abs(weightDifference).toFixed(1)} kg to go
            </p>
          </div>
        </motion.div>

        {/* Current BMI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-hover"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current BMI</p>
              <p className="text-2xl font-bold text-gray-900">{currentBMI}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              {getBMICategory(currentBMI)?.category}
            </p>
          </div>
        </motion.div>

        {/* Days Remaining */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-hover"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Days Remaining</p>
              <p className="text-2xl font-bold text-gray-900">{daysRemaining}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Target: {stats.targetDate.toLocaleDateString()}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight Progress */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight Progress</h3>
          <div className="space-y-4">
            <div className="flex flex-nowrap justify-between items-center mb-1 text-[12px] text-gray-500 gap-x-4">
              <span>Initial Weight: <span className="font-semibold text-gray-700">{stats.initialWeight} kg</span>{initialWeightDate ? ` (on ${new Date(initialWeightDate).toLocaleDateString()})` : ''}</span>
              <span>Goal Start Date: <span className="font-semibold text-gray-700">{stats.goalStartDate ? new Date(stats.goalStartDate).toLocaleDateString() : 'N/A'}</span></span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Progress to Target</span>
              <span className="text-sm font-medium text-primary-600">
                {Math.abs(weightDifference).toFixed(1)} kg remaining
              </span>
            </div>
            {/* After Progress to Target, add an overall weight progress bar */}
            <div className="w-full h-4 rounded-full bg-gray-200 mb-2 mt-1 relative overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
                style={{ width: `${(weightLost / totalWeightToLose * 100).toFixed(1)}%` }}
              />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[11px] font-semibold text-gray-700 whitespace-nowrap pointer-events-none">
                {weightLost > 0 ? `-${weightLost.toFixed(1)} kg lost` : '0.0 kg'}
              </span>
            </div>
            {/* Milestone Progress (moved here, chart removed) */}
            <div className="mt-2 space-y-2">
              <h4 className="text-sm font-semibold text-gray-800 mb-1">Milestone Progress</h4>
              {milestoneLabels.map((label, i) => {
                // Milestone info
                const milestoneTarget = milestoneWeights[i];
                const milestoneStart = milestoneStartDates[i];
                const milestoneEnd = milestoneDates[i];
                const daysLeft = Math.max(0, Math.ceil((milestoneEnd - new Date()) / (1000 * 60 * 60 * 24)));
                const kcalPerDay = milestoneDeficits[i];
                
                // Calculate achieved weight loss for this milestone using analytics data
                let achieved = 0;
                let achievedPct = 0;
                
                if (i === 0) {
                  // First milestone: from initial weight to current weight
                  achieved = Math.max(0, stats.initialWeight - stats.currentWeight);
                } else {
                  // Other milestones: calculate based on milestone targets
                  const previousMilestoneWeight = milestoneCumulative[i - 1];
                  const currentLost = Math.max(0, stats.initialWeight - stats.currentWeight);
                  achieved = Math.max(0, currentLost - previousMilestoneWeight);
                }
                
                achievedPct = milestoneTarget > 0 ? Math.max(0, Math.min(100, (achieved / milestoneTarget) * 100)) : 0;
                
                // Improved milestone background color logic
                const now = new Date();
                const milestoneHasStarted = now >= milestoneStart;
                const milestoneBg = achievedPct >= 100
                  ? 'bg-green-100'
                  : (milestoneHasStarted && achievedPct < 100)
                    ? 'bg-red-100'
                    : 'bg-gray-50';
                    
                // Data for BarChart
                const data = [
                  { name: label, Required: milestoneTarget, Achieved: achieved > 0 ? achieved : 0 }
                ];
                
                return (
                  <div key={label} className={`rounded-lg p-2 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between ${milestoneBg}`}>
                    <div className="flex-1 mb-1 md:mb-0 min-w-[110px]">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700 text-xs whitespace-nowrap">{label}</span>
                        <span className="text-gray-500 text-xs">Target: <span className="font-bold text-gray-700">{milestoneTarget} kg</span></span>
                        <span className="text-gray-500 text-xs">{kcalPerDay} kcal/day</span>
                        <span className="text-gray-500 text-xs">{daysLeft} days left</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-[90px] max-w-[160px]">
                      <ResponsiveContainer width="100%" height={16}>
                        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 0, top: 0, bottom: 0 }} barCategoryGap={2}>
                          <XAxis type="number" hide domain={[0, Math.max(milestoneTarget, achieved)]} />
                          <YAxis type="category" dataKey="name" hide />
                          <Bar dataKey="Required" fill="#d1d5db" barSize={7} radius={[4, 4, 4, 4]} />
                          <Bar dataKey="Achieved" fill={achievedPct >= 100 ? '#22c55e' : '#f59e42'} barSize={7} radius={[4, 4, 4, 4]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col items-end min-w-[50px]">
                      <span className="text-xs font-semibold text-gray-700">{achieved > 0 ? `-${achieved.toFixed(1)} kg` : '0.0 kg'}</span>
                      <span className="text-[11px] text-gray-500">{achievedPct.toFixed(1)}% achieved</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* BMI Progress */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">BMI Progress</h3>
          {/* BMI Classification Bar */}
          <div className="mb-6">
            <div ref={bmiBarRef} className="relative w-full h-8 flex rounded-full overflow-hidden shadow-sm">
              {/* Segments */}
              {bmiSegments.map((seg, idx) => {
                const segWidth = `${seg.width}%`;
                const isCurrent = currentBMI >= seg.min && currentBMI < seg.max;
                const isTarget = targetBMI >= seg.min && targetBMI < seg.max;
                let redLine = null;
                let greenLine = null;
                if (isCurrent) {
                  const segRange = seg.max - seg.min;
                  const withinSeg = Math.max(0, Math.min(1, (currentBMI - seg.min) / (segRange === 0 ? 1 : segRange)));
                  redLine = (
                    <div
                      className="absolute top-0 bottom-0"
                      style={{ left: `calc(${withinSeg * 100}% - 1px)`, width: '2px', background: 'red', borderRadius: '2px', zIndex: 10 }}
                    />
                  );
                }
                if (isTarget) {
                  const segRange = seg.max - seg.min;
                  const withinSeg = Math.max(0, Math.min(1, (targetBMI - seg.min) / (segRange === 0 ? 1 : segRange)));
                  greenLine = (
                    <div
                      className="absolute top-0 bottom-0"
                      style={{ left: `calc(${withinSeg * 100}% - 1px)`, width: '2px', background: '#065f46', borderRadius: '2px', zIndex: 10 }}
                    />
                  );
                }
                // Determine border color for target BMI
                let borderClass = '';
                if (isCurrent) borderClass = 'border-4 border-black';
                else if (isTarget) {
                  borderClass = 'border-4 ' + (
                    seg.label === 'Underweight' ? 'border-blue-400' :
                    seg.label === 'Normal' ? 'border-green-500' :
                    seg.label === 'Overweight' ? 'border-yellow-400' :
                    seg.label === 'Obese-1' ? 'border-orange-400' :
                    seg.label === 'Obese-2' ? 'border-red-400' :
                    'border-red-700'
                  );
                }
                return (
                  <div
                    key={seg.label}
                    className={`h-full relative ${borderClass}`}
                    style={{ width: segWidth, background: seg.label === 'Underweight' ? '#38bdf8' :
                                                         seg.label === 'Normal' ? '#22c55e' :
                                                         seg.label === 'Overweight' ? '#facc15' :
                                                         seg.label === 'Obese-1' ? '#fb923c' :
                                                         seg.label === 'Obese-2' ? '#f87171' :
                                                         '#dc2626' }}
                    title={`${seg.label} (${seg.min}–${seg.max === 45.0 ? '40.0+' : seg.max})`}
                  >
                    {redLine}
                    {greenLine}
                  </div>
                );
              })}
            </div>
            {/* BMI Scale Labels */}
            <div className="flex w-full mt-2" style={{ fontSize: '0.7rem' }}>
              <span className="text-gray-700 text-center" style={{ flexBasis: '14.7%' }}>Underweight</span>
              <span className="text-gray-700 text-center" style={{ flexBasis: '20.2%' }}>Normal</span>
              <span className="text-gray-700 text-center" style={{ flexBasis: '15.0%' }}>Overweight</span>
              <span className="text-gray-700 text-center" style={{ flexBasis: '15.0%' }}>Obese-1</span>
              <span className="text-gray-700 text-center" style={{ flexBasis: '15.0%' }}>Obese-2</span>
              <span className="text-gray-700 text-center" style={{ flexBasis: '20.1%' }}>Obese-3</span>
            </div>
            <div className="flex w-full" style={{ fontSize: '0.7rem' }}>
              <span className="text-gray-400 text-center" style={{ flexBasis: '14.7%' }}>&lt;18.5</span>
              <span className="text-gray-400 text-center" style={{ flexBasis: '20.2%' }}>18.5</span>
              <span className="text-gray-400 text-center" style={{ flexBasis: '15.0%' }}>25.0</span>
              <span className="text-gray-400 text-center" style={{ flexBasis: '15.0%' }}>30.0</span>
              <span className="text-gray-400 text-center" style={{ flexBasis: '15.0%' }}>35.0</span>
              <span className="text-gray-400 text-center" style={{ flexBasis: '20.1%' }}>40.0+</span>
            </div>
          </div>
          {/* Existing BMI cards and points to go */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{currentBMI}</p>
                <p className="text-sm text-gray-600">Current BMI</p>
                <p className="text-xs text-gray-500 mt-1">
                  {getBMICategory(currentBMI)?.category}
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{targetBMI}</p>
                <p className="text-sm text-gray-600">Target BMI</p>
                <p className="text-xs text-gray-500 mt-1">
                  {getBMICategory(targetBMI)?.category}
                </p>
              </div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-lg font-semibold text-gray-900">
                {(currentBMI - targetBMI).toFixed(1)} BMI points to go
              </p>
              <p className="text-sm text-gray-600">
                {currentBMI > targetBMI ? 'Need to lose weight' : 'Need to gain weight'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Weight Entries Grid (30 Days) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Weight Entries (30 Days)</h3>
        <div className="grid grid-cols-6 gap-2">
          {(() => {
            const days = getLast30DaysGrid(goalEntries).reverse();
            console.log('DAYS GRID FINAL:', days);
            console.log('RECENT ENTRIES DEBUG:', goalEntries);
            let prevWeight = null;
            return days.map((day, idx) => {
              let pct = null;
              if (day.weight !== null) {
                // Find the most recent previous day with a weight entry
                let prevIdx = idx + 1;
                while (prevIdx < days.length && days[prevIdx].weight === null) {
                  prevIdx++;
                }
                if (prevIdx < days.length && days[prevIdx].weight !== null) {
                  pct = ((day.weight - days[prevIdx].weight) / days[prevIdx].weight) * 100;
                }
              }
              const color = getWeightChangeColor(pct, idx, days);
              const tooltip = day.weight !== null && days[idx + 1] && days[idx + 1].weight !== null
                ? `${pct > 0 ? '+' : ''}${pct?.toFixed(1)}%\n${day.weight} kg` :
                (day.weight !== null ? `${day.weight} kg` : 'No entry');
              if (day.weight !== null) prevWeight = day.weight;

              // Pencil icon for last 7 days
              const isRecent7 = idx < 7;
              const entryForDay = day.entry;
              return (
                <div
                  key={idx}
                  className={`h-20 flex flex-col items-start justify-start rounded-lg border text-xs font-semibold cursor-pointer relative ${color} p-2`}
                  data-tooltip-id={`weight-tooltip-${idx}`}
                  data-tooltip-content={tooltip}
                >
                  <span className="mb-1 mt-0.5 text-gray-700">{formatGridDate(new Date(day.date))}</span>
                  <span className="mt-auto text-lg font-bold text-gray-900">{day.weight !== null ? `${day.weight} Kg` : '-'}</span>
                  {/* Pencil icon for last 7 days */}
                  {isRecent7 && (
                    entryForDay ? (
                      <button
                        className={`absolute bottom-1 right-1 p-1 rounded-full bg-blue-100 hover:bg-blue-200`}
                        title="Edit Entry"
                        onClick={() => setEditEntry(entryForDay)}
                        style={{ lineHeight: 0 }}
                      >
                        <Pencil className="w-3 h-3 text-blue-600" />
                      </button>
                    ) : (
                      <button
                        className={`absolute bottom-1 right-1 p-1 rounded-full bg-gray-100 hover:bg-green-100`}
                        title="Add Entry"
                        onClick={() => { setAddEntryDate(day.date); setShowWeightEntry(true); }}
                        style={{ lineHeight: 0 }}
                      >
                        <Plus className="w-3 h-3 text-green-600" />
                      </button>
                    )
                  )}
                  <ReactTooltip id={`weight-tooltip-${idx}`} place="top" effect="solid" />
                </div>
              );
            });
          })()}
        </div>
      </motion.div>

      {/* Floating Add Weight Button */}
      <button
        className={`fixed bottom-8 right-8 z-50 ${hasLoggedToday ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'} text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl transition-all duration-200 focus:outline-none focus:ring-4 ${hasLoggedToday ? 'focus:ring-blue-300' : 'focus:ring-red-300'}`}
        title={hasLoggedToday ? "View Today's Entry" : "Add Weight Entry"}
        onClick={() => hasLoggedToday ? setShowViewToday(true) : setShowWeightEntry(true)}
      >
        <Scale className="w-8 h-8" />
        <span className="sr-only">{hasLoggedToday ? "View Today's Entry" : "Add Weight Entry"}</span>
      </button>
      {/* Weight Entry Modal */}
      {showWeightEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="bg-gradient-to-br from-white via-blue-50 to-cyan-50 rounded-2xl shadow-2xl border border-blue-200 px-0 py-0 max-w-2xl w-full relative flex flex-col items-center"
            style={{ boxShadow: '0 8px 40px 0 rgba(16, 112, 202, 0.10), 0 1.5px 8px 0 rgba(0,0,0,0.04)' }}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-3xl font-bold focus:outline-none bg-white/70 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition"
              onClick={() => setShowWeightEntry(false)}
              aria-label="Close"
              style={{ lineHeight: 1 }}
            >
              &times;
            </button>
            <div className="w-full flex flex-col items-center pt-8 pb-2 px-8 border-b border-blue-100 mb-2">
              <div className="flex items-center space-x-3 mb-2">
                <span className="bg-blue-100 text-blue-600 rounded-full p-2 flex items-center justify-center shadow-sm">
                  <Scale className="w-7 h-7" />
                </span>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Weight Entry</h2>
              </div>
              <p className="text-gray-500 text-sm text-center">Track your daily weight progress</p>
            </div>
            <div className="w-full px-8 pb-8 pt-2">
              <WeightEntry
                key={addEntryDate ? new Date(addEntryDate).toISOString() : 'default'}
                onEntryAdded={handleEntryAdded}
                onSuccess={handleEntryAdded}
                defaultDate={addEntryDate}
                goalId={activeGoalId}
              />
            </div>
          </motion.div>
        </div>
      )}
      {/* View Today's Entry Modal */}
      {showViewToday && todaysEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="bg-gradient-to-br from-white via-blue-50 to-cyan-50 rounded-2xl shadow-2xl border border-blue-200 px-0 py-0 max-w-md w-full relative flex flex-col items-center"
            style={{ boxShadow: '0 8px 40px 0 rgba(16, 112, 202, 0.10), 0 1.5px 8px 0 rgba(0,0,0,0.04)' }}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-3xl font-bold focus:outline-none bg-white/70 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition"
              onClick={() => setShowViewToday(false)}
              aria-label="Close"
              style={{ lineHeight: 1 }}
            >
              &times;
            </button>
            <div className="w-full flex flex-col items-center pt-8 pb-2 px-8 border-b border-blue-100 mb-2">
              <div className="flex items-center space-x-3 mb-2">
                <span className="bg-blue-100 text-blue-600 rounded-full p-2 flex items-center justify-center shadow-sm">
                  <Scale className="w-7 h-7" />
                </span>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Today's Weight Entry</h2>
              </div>
            </div>
            <div className="w-full px-8 pb-8 pt-2 flex flex-col items-center">
              <div className="text-4xl font-extrabold text-blue-700 mb-2">{todaysEntry.weight} kg</div>
              <div className="text-lg text-gray-700 mb-1">{new Date(todaysEntry.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</div>
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                onClick={() => { setEditEntry(todaysEntry); setShowViewToday(false); }}
              >
                Edit
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {/* Edit Entry Modal */}
      {editEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl shadow-2xl border border-blue-200 px-8 py-8 max-w-md w-full relative flex flex-col items-center"
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-3xl font-bold focus:outline-none bg-white/70 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition"
              onClick={() => setEditEntry(null)}
              aria-label="Close"
              style={{ lineHeight: 1 }}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Weight Entry</h2>
            <EditWeightEntryForm entry={editEntry} onClose={() => { setEditEntry(null); }} userProfile={userProfile} />
          </motion.div>
        </div>
      )}
    </div>
  );
};

function EditWeightEntryForm({ entry, onClose, userProfile }) {
  const { currentUser } = useUser();
  const [weight, setWeight] = useState(entry.weight);
  const [notes, setNotes] = useState(entry.notes || '');
  const [loading, setLoading] = useState(false);
  const isNew = !entry.id;
  const { stats } = useUser() || {};
  function findEntryByDate(entries, date) {
    return entries?.find(e => {
      const d = new Date(e.date);
      const t = new Date(date);
      return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
    });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let existing = entry.id ? entry : findEntryByDate(stats?.recentEntries, entry.date);
      // Always send date as 'YYYY-MM-DD'
      const dateStr = typeof entry.date === 'string' ? entry.date : new Date(entry.date).toISOString().slice(0, 10);
      if (existing && existing.id) {
        // Get the goalId from the userProfile context or from the entry itself
        const goalId = userProfile?.goalId || entry.goalId;
        if (!goalId || (goalId !== 'demo' && !isValidObjectId(goalId))) {
          alert('Cannot update: No valid goal ID found.');
          return;
        }
        await weightEntryAPI.updateEntry(existing.id, { weight, notes, userId: currentUser.id, date: dateStr, goalId });
        onClose();
      } else {
        alert('Cannot update: No existing entry for this date.');
      }
    } catch (err) {
      alert('Failed to save entry.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-4">
      <h2 className="text-lg font-semibold text-center text-gray-900 mb-2">
        Edit Weight Entry for: {formatGridDate(new Date(entry.date))}
      </h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
        <input
          type="number"
          step="0.1"
          className="input-field w-full"
          value={weight}
          onChange={e => setWeight(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          className="input-field w-full"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={2}
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60"
        disabled={loading}
      >
        {loading ? (isNew ? 'Adding...' : 'Saving...') : (isNew ? 'Add Entry' : 'Save Changes')}
      </button>
    </form>
  );
}

export default Dashboard; 