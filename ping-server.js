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
    this.serverUrl = process.env.SERVER_URL || 'https://weight-loss-final.onrender.com';
    this.pingEndpoints = [
      '/api/health',
      '/api/users/health',
      '/api/weight-entries/health'
    ];
    this.isRunning = false;
    this.pingCount = 0;
  }

  start() {
    if (this.isRunning) {
      console.log('Ping service is already running');
      return;
    }

    console.log('🚀 Starting standalone ping service...');
    console.log(`📡 Target server: ${this.serverUrl}`);
    console.log('⏰ Ping interval: 10-14 minutes (random)');
    console.log('💤 Purpose: Keep Render server awake (prevents 15min sleep)');
    console.log('---');

    this.isRunning = true;
    this.scheduleNextPing();
  }

  stop() {
    console.log('🛑 Stopping ping service...');
    this.isRunning = false;
    process.exit(0);
  }

  scheduleNextPing() {
    if (!this.isRunning) return;

    const interval = this.getRandomInterval(10, 14); // 10-14 minutes
    const nextPingTime = new Date(Date.now() + interval);
    
    console.log(`⏰ Next ping scheduled for: ${nextPingTime.toLocaleTimeString()}`);
    
    setTimeout(() => {
      this.pingServer();
    }, interval);
  }

  async pingServer() {
    if (!this.isRunning) return;

    this.pingCount++;
    const endpoint = this.pingEndpoints[Math.floor(Math.random() * this.pingEndpoints.length)];
    const url = `${this.serverUrl}${endpoint}`;
    
    console.log(`\n📡 Ping #${this.pingCount} - ${new Date().toLocaleTimeString()}`);
    console.log(`🎯 Endpoint: ${endpoint}`);
    
    try {
      const startTime = Date.now();
      const response = await axios.get(url, {
        timeout: 15000, // 15 second timeout
        headers: {
          'User-Agent': 'StandalonePingService/1.0',
          'X-Ping-Service': 'true'
        }
      });
      
      const responseTime = Date.now() - startTime;
      
      console.log(`✅ Success: ${response.status} - ${response.statusText}`);
      console.log(`⏱️ Response time: ${responseTime}ms`);
      console.log(`📊 Server uptime: ${response.data.uptime ? Math.round(response.data.uptime / 60) + ' minutes' : 'N/A'}`);
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
      
      if (error.response) {
        console.log(`📊 Status: ${error.response.status}`);
      }
      
      // Retry in 2 minutes if it's a connection error
      if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        console.log('🔄 Retrying in 2 minutes...');
        setTimeout(() => {
          this.pingServer();
        }, 2 * 60 * 1000);
        return;
      }
    }
    
    // Schedule next ping
    this.scheduleNextPing();
  }

  getRandomInterval(minMinutes, maxMinutes) {
    const minMs = minMinutes * 60 * 1000;
    const maxMs = maxMinutes * 60 * 1000;
    return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  if (pingService) {
    pingService.stop();
  }
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  if (pingService) {
    pingService.stop();
  }
});

// Start the service
const pingService = new StandalonePingService();
pingService.start();

// Initial ping
setTimeout(() => {
  pingService.pingServer();
}, 5000); // First ping after 5 seconds 