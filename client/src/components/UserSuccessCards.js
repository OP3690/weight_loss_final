import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const UserSuccessCards = () => {
  const [currentStories, setCurrentStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  // Fetch user success stories from API
  const fetchUserSuccessStories = async () => {
    try {
      // Fetch all stories to have maximum variety
      const response = await api.get('/user-success?limit=500');
      
      if (response.data.success) {
        setCurrentStories(response.data.data);
        setError(null);
      } else {
        setError('Failed to fetch user success stories');
        setCurrentStories([]);
      }
    } catch (err) {
      console.error('Error fetching user success stories:', err);
      setError('An error occurred while fetching data');
      setCurrentStories([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback to default stories if API fails
  const showDefaultStories = () => {
    const defaultStories = [
      {
        _id: 'default1',
        name: 'Sarah Johnson',
        country: 'USA',
        flag: '🇺🇸',
        weightLost: 8.5,
        duration: '6 months',
        isActive: true
      },
      {
        _id: 'default2',
        name: 'Priya Patel',
        country: 'India',
        flag: '🇮🇳',
        weightLost: 6.2,
        duration: '4 months',
        isActive: true
      },
      {
        _id: 'default3',
        name: 'Carlos Rodriguez',
        country: 'Spain',
        flag: '🇪🇸',
        weightLost: 5.8,
        duration: '3 months',
        isActive: true
      },
      {
        _id: 'default4',
        name: 'Emma Wilson',
        country: 'UK',
        flag: '🇬🇧',
        weightLost: 7.1,
        duration: '5 months',
        isActive: true
      },
      {
        _id: 'default5',
        name: 'Yuki Tanaka',
        country: 'Japan',
        flag: '🇯🇵',
        weightLost: 4.3,
        duration: '2 months',
        isActive: true
      },
      {
        _id: 'default6',
        name: 'Maria Silva',
        country: 'Brazil',
        flag: '🇧🇷',
        weightLost: 9.2,
        duration: '7 months',
        isActive: true
      }
    ];
    
    setCurrentStories(defaultStories);
    setError(null);
    setIsLoading(false);
  };

  useEffect(() => {
    // Set a timeout for API call
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log('API timeout - showing default stories');
        showDefaultStories();
      }
    }, 5000); // 5 second timeout

    fetchUserSuccessStories();
    
    // Set up interval for rotating stories every 4 seconds
    intervalRef.current = setInterval(() => {
      // Force re-render to show new random stories
      setCurrentIndex(prevIndex => prevIndex + 1);
    }, 4000);

    return () => {
      clearTimeout(timeoutId);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); // Remove dependency on currentStories.length

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Error state - Show default success stories
  if (error) {
    const defaultStories = [
      {
        _id: 'default1',
        name: 'Sarah Johnson',
        country: 'USA',
        flag: '🇺🇸',
        weightLost: 8.5,
        duration: '6 months',
        isActive: true
      },
      {
        _id: 'default2',
        name: 'Priya Patel',
        country: 'India',
        flag: '🇮🇳',
        weightLost: 6.2,
        duration: '4 months',
        isActive: true
      },
      {
        _id: 'default3',
        name: 'Carlos Rodriguez',
        country: 'Spain',
        flag: '🇪🇸',
        weightLost: 5.8,
        duration: '3 months',
        isActive: true
      },
      {
        _id: 'default4',
        name: 'Emma Wilson',
        country: 'UK',
        flag: '🇬🇧',
        weightLost: 7.1,
        duration: '5 months',
        isActive: true
      }
    ];
    
    setCurrentStories(defaultStories);
    setError(null);
    return null; // Let the component render with default stories
  }

  // No stories state
  if (!currentStories || currentStories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No success stories available at the moment.</p>
      </div>
    );
  }

  // Get achievement badge based on weight lost
  const getAchievementBadge = (weightLost) => {
    if (weightLost >= 8) {
      return { text: 'Elite', icon: '💎', color: 'from-purple-500 to-indigo-600' };
    } else if (weightLost >= 5) {
      return { text: 'Champion', icon: '🏆', color: 'from-yellow-500 to-orange-600' };
    } else if (weightLost >= 3) {
      return { text: 'Warrior', icon: '⚡', color: 'from-blue-500 to-cyan-600' };
    } else {
      return { text: 'Starter', icon: '⭐', color: 'from-green-500 to-emerald-600' };
    }
  };

  // Get card gradient based on weight lost
  const getCardGradient = (weightLost) => {
    if (weightLost >= 8) return 'from-purple-500 via-purple-600 to-indigo-700';
    if (weightLost >= 5) return 'from-orange-500 via-orange-600 to-amber-700';
    if (weightLost >= 3) return 'from-blue-500 via-blue-600 to-cyan-700';
    return 'from-green-500 via-green-600 to-emerald-700';
  };

  // Get progress bar color based on weight lost
  const getProgressBarColor = (weightLost) => {
    if (weightLost >= 8) return 'bg-purple-400';
    if (weightLost >= 5) return 'bg-amber-400';
    if (weightLost >= 3) return 'bg-blue-400';
    return 'bg-green-400';
  };

  // Get current stories to display (2 at a time) with random selection
  const getCurrentStories = () => {
    if (currentStories.length === 0) return [];
    
    // Get 2 random stories from the available pool
    // Use currentIndex to ensure different stories each time
    const randomSeed = currentIndex + Date.now();
    const shuffled = [...currentStories].sort(() => {
      // Use a more random approach with multiple factors
      return Math.sin(randomSeed + Math.random()) * Math.cos(randomSeed + Math.random());
    });
    return shuffled.slice(0, 2);
  };

  const currentDisplayStories = getCurrentStories();

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={`stories-${currentIndex}`}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {currentDisplayStories.map((story, idx) => {
            const badge = getAchievementBadge(story.weightLost);
            const gradient = getCardGradient(story.weightLost);
            const progressColor = getProgressBarColor(story.weightLost);
            
            return (
              <motion.div
                key={`${story._id}-${currentIndex}`}
                className="relative group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {/* Main Card */}
                <div 
                  className={`relative overflow-hidden rounded-2xl shadow-xl h-48 bg-gradient-to-br ${gradient} transform transition-all duration-300 group-hover:shadow-2xl`}
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to))`,
                  }}
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 p-6 h-full flex flex-col justify-between text-black">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{story.flag}</span>
                        <div>
                          <h3 className="text-lg font-bold drop-shadow-lg">{story.name}</h3>
                          <p className="text-sm opacity-90">from {story.country}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl">{badge.icon}</span>
                        <p className="text-xs font-medium">{badge.text}</p>
                      </div>
                    </div>

                    {/* Achievement Message */}
                    <div className="text-center py-4">
                      <p className="text-xl font-bold drop-shadow-lg">
                        Lost <span className="text-2xl font-extrabold text-orange-600">{story.weightLost} kg</span>
                      </p>
                      <p className="text-lg opacity-90">in {story.duration}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className={`h-full ${progressColor} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((story.weightLost / 10) * 100, 100)}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* 3D Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Floating Badge */}
                <motion.div
                  className={`absolute -top-3 -right-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${badge.color} shadow-lg`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {badge.text}
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Simple indicator */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default UserSuccessCards; 