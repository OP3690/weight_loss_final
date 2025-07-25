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

const axios = require('axios');

class StandalonePingService {
  constructor() {
    this.isRunning = false;
    this.pingInterval = null;
    this.serverUrl = 'https://gooofit.onrender.com';
    this.pingEndpoints = [
      '/api/health'
    ];
    this.pingCount = 0;
    this.startTime = new Date();
  }

  // Start the ping service
  start() {
    if (this.isRunning) {
      console.log('🔄 Ping service is already running');
      return;
    }

    console.log('🚀 Starting standalone ping service to keep server awake...');
    console.log(`📡 Target server: ${this.serverUrl}`);
    console.log(`⏰ Ping interval: 14 minutes`);
    console.log(`🕐 Started at: ${this.startTime.toLocaleString()}`);
    console.log('='.repeat(60));
    
    this.isRunning = true;

    // Ping every 14 minutes
    this.pingInterval = setInterval(() => {
      this.pingServer();
    }, 14 * 60 * 1000); // 14 minutes in milliseconds

    // Initial ping
    this.pingServer();
  }

  // Stop the ping service
  stop() {
    if (!this.isRunning) {
      console.log('🛑 Ping service is not running');
      return;
    }

    console.log('🛑 Stopping ping service...');
    this.isRunning = false;

    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  // Ping the server
  async pingServer() {
    try {
      this.pingCount++;
      const endpoint = this.pingEndpoints[Math.floor(Math.random() * this.pingEndpoints.length)];
      const url = `${this.serverUrl}${endpoint}`;
      const timestamp = new Date().toLocaleString();
      
      console.log(`\n📡 [${timestamp}] Ping #${this.pingCount}: ${url}`);
      
      const startTime = Date.now();
      const response = await axios.get(url, {
        timeout: 10000, // 10 second timeout
        headers: {
          'User-Agent': 'StandalonePingService/1.0',
          'X-Ping-Service': 'true'
        }
      });
      const responseTime = Date.now() - startTime;

      console.log(`✅ [${timestamp}] Ping #${this.pingCount} successful:`);
      console.log(`   Status: ${response.status} - ${response.statusText}`);
      console.log(`   Response time: ${responseTime}ms`);
      console.log(`   Data: ${JSON.stringify(response.data)}`);
      
      // Log uptime
      const uptime = Date.now() - this.startTime.getTime();
      const uptimeHours = Math.floor(uptime / (1000 * 60 * 60));
      const uptimeMinutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
      console.log(`   Uptime: ${uptimeHours}h ${uptimeMinutes}m`);

    } catch (error) {
      const timestamp = new Date().toLocaleString();
      console.log(`\n❌ [${timestamp}] Ping #${this.pingCount} failed:`);
      console.log(`   Error: ${error.message}`);
      
      if (error.response) {
        console.log(`   Status: ${error.response.status} - ${error.response.statusText}`);
        console.log(`   Data: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.log(`   No response received`);
      }
      
      // If it's a timeout or connection error, try again in 2 minutes
      if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        console.log('🔄 Retrying ping in 2 minutes...');
        setTimeout(() => {
          this.pingServer();
        }, 2 * 60 * 1000); // 2 minutes
      }
    }
  }

  // Get service status
  getStatus() {
    const uptime = Date.now() - this.startTime.getTime();
    const uptimeHours = Math.floor(uptime / (1000 * 60 * 60));
    const uptimeMinutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
    
    return {
      isRunning: this.isRunning,
      serverUrl: this.serverUrl,
      pingCount: this.pingCount,
      uptime: `${uptimeHours}h ${uptimeMinutes}m`,
      nextPingIn: this.pingInterval ? '14 minutes' : 'Not scheduled'
    };
  }
}

// Create and start the ping service
const pingService = new StandalonePingService();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  pingService.stop();
  console.log('👋 Ping service stopped. Goodbye!');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  pingService.stop();
  console.log('👋 Ping service stopped. Goodbye!');
  process.exit(0);
});

// Start the service
pingService.start();

// Log status every hour
setInterval(() => {
  const status = pingService.getStatus();
  console.log('\n📊 Hourly Status Report:');
  console.log(`   Running: ${status.isRunning}`);
  console.log(`   Total pings: ${status.pingCount}`);
  console.log(`   Uptime: ${status.uptime}`);
  console.log(`   Next ping: ${status.nextPingIn}`);
  console.log('='.repeat(60));
}, 60 * 60 * 1000); // Every hour

console.log('\n💡 To stop the ping service, press Ctrl+C');
console.log('💡 The service will automatically ping the server every 14 minutes');
console.log('💡 This keeps the server awake and prevents it from going to sleep'); 