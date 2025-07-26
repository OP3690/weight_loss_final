#!/usr/bin/env node

/**
 * Standalone Ping Script for Render Server
 * 
 * This script can be run independently to keep your Render server awake.
 * Run it with: node ping-server.js
 * 
 * You can also set up a cron job or use services like:
 * - UptimeRobot (free)
 * - Cron-job.org (free)
 * - GitHub Actions (free)
 */

const https = require('https');
const http = require('http');

// Configuration
const SERVER_URL = process.env.SERVER_URL || 'https://gooofit.onrender.com';
const PING_INTERVAL_MIN = 14; // Base interval in minutes
const RANDOM_VARIATION_MIN = 2; // Random variation in minutes
const MAX_RETRIES = 3;
const RETRY_DELAY = 30000; // 30 seconds

// User agent rotation to appear more realistic
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/120.0.0.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
];

// Realistic endpoints to ping
const ENDPOINTS = [
  '/api/user-success?limit=5',
  '/api/user-success/random',
  '/api/user-success/stats',
  '/api/health',
  '/api/status',
  '/',
  '/health',
  '/status'
];

// Random delay function
function getRandomDelay() {
  const baseDelay = PING_INTERVAL_MIN * 60 * 1000; // Convert to milliseconds
  const variation = (Math.random() - 0.5) * 2 * RANDOM_VARIATION_MIN * 60 * 1000;
  return Math.max(baseDelay + variation, 60000); // Minimum 1 minute
}

// Get random user agent
function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

// Get random endpoint
function getRandomEndpoint() {
  return ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)];
}

// Add random query parameters
function addRandomParams(url) {
  const params = new URLSearchParams();
  
  // Add random parameters to make requests look more realistic
  const randomParams = [
    ['_t', Date.now()],
    ['v', Math.random().toString(36).substring(7)],
    ['cache', Math.random().toString(36).substring(7)],
    ['r', Math.random().toString(36).substring(7)]
  ];
  
  // Randomly add 1-3 parameters
  const numParams = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < numParams; i++) {
    params.append(randomParams[i][0], randomParams[i][1]);
  }
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${params.toString()}`;
}

// Ping server function
function pingServer(retryCount = 0) {
  const endpoint = getRandomEndpoint();
  const fullUrl = addRandomParams(`${SERVER_URL}${endpoint}`);
  const userAgent = getRandomUserAgent();
  
  const url = new URL(fullUrl);
  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname + url.search,
    method: 'GET',
    headers: {
      'User-Agent': userAgent,
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin'
    },
    timeout: 30000 // 30 second timeout
  };

  const protocol = url.protocol === 'https:' ? https : http;
  
  console.log(`🔄 [${new Date().toISOString()}] Pinging: ${fullUrl}`);
  console.log(`👤 User-Agent: ${userAgent.substring(0, 50)}...`);
  
  const req = protocol.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      const status = res.statusCode;
      const success = status >= 200 && status < 300;
      
      if (success) {
        console.log(`✅ [${new Date().toISOString()}] Ping successful! Status: ${status}`);
        console.log(`📊 Response size: ${data.length} bytes`);
        
        // Schedule next ping with random delay
        const nextDelay = getRandomDelay();
        const nextTime = new Date(Date.now() + nextDelay);
        console.log(`⏰ Next ping scheduled for: ${nextTime.toISOString()}`);
        console.log(`⏱️  Delay: ${Math.round(nextDelay / 1000 / 60 * 100) / 100} minutes`);
        console.log('─'.repeat(80));
        
        setTimeout(pingServer, nextDelay);
      } else {
        console.log(`⚠️  [${new Date().toISOString()}] Ping returned status: ${status}`);
        handleRetry(retryCount);
      }
    });
  });

  req.on('error', (error) => {
    console.log(`❌ [${new Date().toISOString()}] Ping failed: ${error.message}`);
    handleRetry(retryCount);
  });

  req.on('timeout', () => {
    console.log(`⏰ [${new Date().toISOString()}] Ping timeout`);
    req.destroy();
    handleRetry(retryCount);
  });

  req.end();
}

// Handle retry logic
function handleRetry(retryCount) {
  if (retryCount < MAX_RETRIES) {
    console.log(`🔄 Retrying in ${RETRY_DELAY / 1000} seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
    setTimeout(() => pingServer(retryCount + 1), RETRY_DELAY);
  } else {
    console.log(`💀 Max retries reached. Server might be down.`);
    console.log(`🔄 Restarting ping cycle in 5 minutes...`);
    setTimeout(() => pingServer(0), 5 * 60 * 1000);
  }
}

// Start the ping service
console.log('🚀 Starting GoooFit Server Keep-Alive Service...');
console.log(`🎯 Target server: ${SERVER_URL}`);
console.log(`⏱️  Base interval: ${PING_INTERVAL_MIN} minutes`);
console.log(`🎲 Random variation: ±${RANDOM_VARIATION_MIN} minutes`);
console.log(`🔄 Max retries: ${MAX_RETRIES}`);
console.log('─'.repeat(80));

// Initial ping after a short delay
setTimeout(() => {
  pingServer();
}, 5000);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down ping service...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down ping service...');
  process.exit(0);
});

// Keep the process alive
process.on('uncaughtException', (error) => {
  console.log(`💥 Uncaught Exception: ${error.message}`);
  console.log('🔄 Restarting ping service in 1 minute...');
  setTimeout(() => pingServer(), 60000);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log(`💥 Unhandled Rejection at: ${promise}, reason: ${reason}`);
  console.log('🔄 Restarting ping service in 1 minute...');
  setTimeout(() => pingServer(), 60000);
}); 