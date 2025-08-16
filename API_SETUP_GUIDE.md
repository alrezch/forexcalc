# 🚀 Real-Time Forex API Setup Guide

## 🎯 **Best Free Real-Time Forex APIs**

### **1. Alpha Vantage (HIGHLY RECOMMENDED)**
- **✅ Best for real-time forex data**
- **✅ 500 free API calls per day**
- **✅ 1-minute delay market data**
- **✅ 150+ forex pairs coverage**
- **✅ No credit card required**

**Setup Steps:**
1. Go to [https://www.alphavantage.co/support/#api-key](https://www.alphavantage.co/support/#api-key)
2. Click "Get a free API key today"
3. Fill out the form (name, email)
4. Copy your API key
5. Update `src/config/api-config.js`:
   ```javascript
   ALPHA_VANTAGE: {
     enabled: true,
     apiKey: 'YOUR_ACTUAL_API_KEY_HERE', // Replace 'demo'
     // ... rest of config
   }
   ```

### **2. ExchangeRate-API (Great Backup)**
- **✅ 1,500 free API calls per month**
- **✅ No signup required**
- **✅ 170+ currencies**
- **✅ Hourly updates**
- **✅ Already configured and working**

**Setup:** No setup needed - works out of the box!

### **3. Open Exchange Rates**
- **✅ 1,000 free API calls per month**
- **✅ No signup required**
- **✅ 200+ currencies**
- **✅ Hourly updates**
- **✅ Already configured and working**

**Setup:** No setup needed - works out of the box!

### **4. Fixer.io (Premium Option)**
- **✅ More reliable service**
- **✅ 100 free API calls per month**
- **✅ Requires API key**
- **✅ Better uptime**

**Setup Steps:**
1. Go to [https://fixer.io/](https://fixer.io/)
2. Sign up for free plan
3. Get your API key
4. Update `src/config/api-config.js`:
   ```javascript
   FIXER_API: {
     enabled: true, // Change from false to true
     apiKey: 'YOUR_FIXER_API_KEY_HERE',
     // ... rest of config
   }
   ```

## 🔧 **Configuration File**

The main configuration is in `src/config/api-config.js`. You can:

- **Enable/disable APIs** by setting `enabled: true/false`
- **Set API keys** for services that require them
- **Change priority order** of APIs
- **Adjust timeouts** and retry settings

## 📊 **API Priority System**

The app uses a smart fallback system:

1. **Alpha Vantage** (best real-time data)
2. **ExchangeRate-API** (good backup)
3. **Open Exchange Rates** (reliable fallback)
4. **Fixer.io** (if enabled and configured)
5. **Fallback rates** (if all APIs fail)

## 🚀 **Getting Started (Recommended)**

### **Quick Start (No Setup Required)**
1. The app works immediately with ExchangeRate-API and Open Exchange Rates
2. You'll get live forex data with hourly updates
3. No API keys needed

### **Best Experience (With Alpha Vantage)**
1. Get free API key from Alpha Vantage (5 minutes)
2. Update the config file
3. Get real-time forex data with 1-minute delay
4. 500 API calls per day (plenty for personal use)

## 📱 **API Status Dashboard**

The app includes a real-time API status dashboard that shows:
- ✅ Which APIs are working
- ⚠️ Which APIs have reached limits
- ❌ Which APIs are failing
- 📊 Free tier limits and remaining calls

## 💡 **Pro Tips**

### **For Personal Use:**
- Alpha Vantage (500 calls/day) is perfect
- ExchangeRate-API as backup (1,500 calls/month)

### **For Development/Testing:**
- Use ExchangeRate-API (no limits for testing)
- Enable fallback rates for offline development

### **For Production:**
- Consider paid plans for higher limits
- Use multiple APIs for redundancy
- Implement rate limiting to stay within free tiers

## 🔍 **Testing Your APIs**

1. **Start the app**: `npm start`
2. **Check API Status**: Look at the dashboard at the top
3. **Test Calculators**: Use "Update Prices" buttons
4. **Check Console**: Look for success/error messages

## 🚨 **Common Issues & Solutions**

### **"API limit reached"**
- Wait for daily/monthly reset
- Use backup APIs
- Consider upgrading to paid plan

### **"Network error"**
- Check internet connection
- Try different API
- Use fallback rates

### **"Invalid API key"**
- Double-check your API key
- Ensure API is enabled in config
- Verify API key format

## 📈 **API Performance Comparison**

| API | Real-time | Delay | Free Calls | Reliability | Setup |
|-----|-----------|-------|------------|-------------|-------|
| Alpha Vantage | ✅ | 1 min | 500/day | ⭐⭐⭐⭐⭐ | Easy |
| ExchangeRate-API | ✅ | 1 hour | 1,500/month | ⭐⭐⭐⭐ | None |
| Open Exchange Rates | ✅ | 1 hour | 1,000/month | ⭐⭐⭐⭐ | None |
| Fixer.io | ✅ | 1 hour | 100/month | ⭐⭐⭐⭐⭐ | Easy |

## 🎉 **You're All Set!**

With this setup, you'll have:
- **Real-time forex data** from multiple sources
- **Automatic fallbacks** if any API fails
- **Professional-grade** forex calculations
- **No monthly costs** (within free tier limits)
- **Reliable service** with multiple backup options

The app will automatically use the best available API and fall back to others if needed. You'll see live market data in all your calculators!
