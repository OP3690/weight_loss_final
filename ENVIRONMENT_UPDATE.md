# Environment Variables Update Required

## 🚨 **URGENT: Update Production Environment Variables**

The GoDaddy email authentication is failing on production. We need to switch back to Gmail.

### **Step 1: Update Render Environment Variables**

**Go to your Render Dashboard:**
1. Visit: https://dashboard.render.com
2. Select your `gooofit-final` service
3. Go to **Environment** tab
4. **Update these variables:**

**EMAIL_USER:**
- **From**: `support@gooofit.com`
- **To**: `onboarding.gooofit@gmail.com`

**EMAIL_PASSWORD:**
- **From**: `Fortune$$336699`
- **To**: `comk mmlv lycy ibjk`

### **Step 2: Save and Wait**
1. Click **Save Changes**
2. Server will auto-redeploy
3. Wait 2-3 minutes

### **Step 3: Test**
After deployment, try password reset again.

## 🎯 **Why This Fixes the Issue**

- ❌ **GoDaddy authentication failing** on production
- ✅ **Gmail authentication working** locally
- ✅ **Gmail app password** is valid
- ✅ **No authentication issues** with Gmail

## 📧 **Expected Result**

After updating environment variables:
- ✅ **Password reset emails sent** via Gmail
- ✅ **No more 500 errors**
- ✅ **No more authentication failures**
- ⚠️ **Note**: Gmail has daily sending limits (500 emails/day)

## 🔄 **Deployment Status**

- ✅ **Code changes**: Pushed to repository
- ❌ **Environment variables**: Need to be updated
- ⏳ **Server restart**: Will happen automatically after env var update 