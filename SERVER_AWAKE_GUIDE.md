# 🚀 Server Awake Guide - Prevent Render Free Tier Sleep

## 📋 Overview
Render's free tier puts your server to sleep after 15 minutes of inactivity. This guide provides multiple solutions to keep your server awake and responsive.

## 🔧 Built-in Solutions

### 1. **Integrated Ping Service** (Recommended)
The server now includes an automatic ping service that runs in production:

```javascript
// Automatically starts when NODE_ENV=production
const pingService = new PingService();
pingService.start();
```

**Features:**
- ✅ Pings every 10-14 minutes (random interval)
- ✅ Uses multiple endpoints for variety
- ✅ Automatic retry on failures
- ✅ Detailed logging
- ✅ Only runs in production

### 2. **Health Check Endpoints**
Added health check endpoints for monitoring:

- `GET /api/health` - Main health check
- `GET /api/users/health` - Users service health
- `GET /api/weight-entries/health` - Weight entries service health

## 🛠️ External Solutions

### 3. **Standalone Ping Script**
Run the standalone script on your local machine or another server:

```bash
# Install dependencies
npm install axios

# Run the ping script
node ping-server.js
```

**Features:**
- ✅ Independent of main server
- ✅ Can run on any machine
- ✅ Detailed logging and statistics
- ✅ Graceful shutdown handling

### 4. **Free External Services**

#### **UptimeRobot** (Recommended)
1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Create free account
3. Add new monitor:
   - **URL**: `https://weight-loss-final.onrender.com/api/health`
   - **Type**: HTTP(s)
   - **Interval**: 5 minutes
   - **Alert**: Email notifications

#### **Cron-job.org**
1. Go to [cron-job.org](https://cron-job.org)
2. Create free account
3. Add new cron job:
   - **URL**: `https://weight-loss-final.onrender.com/api/health`
   - **Schedule**: Every 10 minutes
   - **Method**: GET

#### **GitHub Actions** (Free)
Create `.github/workflows/ping-server.yml`:

```yaml
name: Ping Server
on:
  schedule:
    - cron: '*/10 * * * *'  # Every 10 minutes
  workflow_dispatch:  # Manual trigger

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Server
        run: |
          curl -X GET https://weight-loss-final.onrender.com/api/health
          echo "Server pinged at $(date)"
```

## 📊 Monitoring & Logs

### Server Logs
The ping service logs all activity:

```
🚀 Starting ping service to keep server awake...
📡 Pinging server: https://weight-loss-final.onrender.com/api/health
✅ Server ping successful: 200 - OK
⏱️ Response time: 1.2s
```

### Health Check Response
```json
{
  "status": "healthy",
  "service": "weight-management-api",
  "timestamp": "2025-07-24T15:30:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "version": "1.0.0"
}
```

## ⚙️ Configuration

### Environment Variables
```bash
# Server URL (optional, defaults to your Render URL)
SERVER_URL=https://weight-loss-final.onrender.com

# Node environment (required for auto-start)
NODE_ENV=production
```

### Customization
Edit `services/pingService.js` to modify:
- Ping intervals (currently 10-14 minutes)
- Endpoints to ping
- Retry logic
- Logging format

## 🚨 Troubleshooting

### Server Still Sleeping?
1. **Check logs**: Look for ping service startup messages
2. **Verify endpoints**: Test health endpoints manually
3. **Use external service**: Set up UptimeRobot as backup
4. **Check Render logs**: Verify server is receiving requests

### Common Issues
- **CORS errors**: Health endpoints don't require CORS
- **Timeout errors**: Increased timeout to 15 seconds
- **Connection refused**: Server might be starting up

### Manual Testing
```bash
# Test health endpoints
curl https://weight-loss-final.onrender.com/api/health
curl https://weight-loss-final.onrender.com/api/users/health
curl https://weight-loss-final.onrender.com/api/weight-entries/health
```

## 💡 Best Practices

1. **Multiple Solutions**: Use both built-in and external services
2. **Random Intervals**: Prevents predictable patterns
3. **Monitoring**: Set up alerts for failures
4. **Logging**: Keep track of ping success/failure rates
5. **Graceful Handling**: Proper error handling and retries

## 🔄 Deployment

The ping service automatically starts when you deploy to Render:

1. **Push changes** to your repository
2. **Render auto-deploys** the new code
3. **Ping service starts** automatically in production
4. **Monitor logs** to confirm it's working

## 📈 Performance Impact

- **Minimal overhead**: Lightweight HTTP requests
- **No database impact**: Health checks don't query database
- **Efficient logging**: Only logs essential information
- **Smart retries**: Only retries on connection errors

## 🎯 Success Metrics

Your server should now:
- ✅ Stay awake 24/7
- ✅ Respond quickly to requests
- ✅ Have minimal cold start delays
- ✅ Provide reliable uptime

---

**Note**: This solution is specifically designed for Render's free tier limitations. If you upgrade to a paid plan, you can disable the ping service as it won't be needed. 