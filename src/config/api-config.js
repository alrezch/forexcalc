// API Configuration File
// Update these values with your preferred API keys and settings

export const API_CONFIG = {
  // Alpha Vantage (Recommended - Best free real-time forex data)
  ALPHA_VANTAGE: {
    enabled: true,
    apiKey: 'demo', // Get free key from: https://www.alphavantage.co/support/#api-key
    baseUrl: 'https://www.alphavantage.co/query',
    freeTierLimit: 500, // API calls per day
    realTime: true,
    delay: '1 minute', // Market data delay
    coverage: '150+ forex pairs'
  },

  // ExchangeRate-API (Good backup option)
  EXCHANGE_RATE_API: {
    enabled: true,
    apiKey: null, // No API key required
    baseUrl: 'https://api.exchangerate-api.com/v4/latest',
    freeTierLimit: 1500, // API calls per month
    realTime: true,
    delay: '1 hour', // Update frequency
    coverage: '170+ currencies'
  },

  // Open Exchange Rates
  OPEN_EXCHANGE_RATES: {
    enabled: true,
    apiKey: null, // No API key required for basic usage
    baseUrl: 'https://open.er-api.com/v6/latest',
    freeTierLimit: 1000, // API calls per month
    realTime: true,
    delay: '1 hour', // Update frequency
    coverage: '200+ currencies'
  },

  // Fixer.io (More reliable but requires API key)
  FIXER_API: {
    enabled: false, // Set to true if you have an API key
    apiKey: 'YOUR_FIXER_API_KEY', // Get free key from: https://fixer.io/
    baseUrl: 'http://data.fixer.io/api/latest',
    freeTierLimit: 100, // API calls per month
    realTime: true,
    delay: '1 hour', // Update frequency
    coverage: '170+ currencies'
  },

  // API Priority Order (first one will be tried first)
  priority: [
    'ALPHA_VANTAGE',
    'EXCHANGE_RATE_API', 
    'OPEN_EXCHANGE_RATES',
    'FIXER_API'
  ],

  // Request timeout in milliseconds
  timeout: 5000,

  // Retry attempts for failed API calls
  maxRetries: 2,

  // Cache duration for rates (in milliseconds)
  cacheDuration: 5 * 60 * 1000, // 5 minutes

  // Update frequency for live data (in seconds)
  updateInterval: 60, // 1 minute
};

// How to get free API keys:

// 1. Alpha Vantage (Recommended):
//    - Go to: https://www.alphavantage.co/support/#api-key
//    - Sign up for free
//    - Get 500 API calls per day
//    - Best real-time forex data

// 2. Fixer.io:
//    - Go to: https://fixer.io/
//    - Sign up for free plan
//    - Get 100 API calls per month
//    - More reliable but limited

// 3. ExchangeRate-API:
//    - No signup required
//    - 1500 API calls per month
//    - Good backup option

// 4. Open Exchange Rates:
//    - No signup required
//    - 1000 API calls per month
//    - Reliable service

export const getApiKey = (apiName) => {
  return API_CONFIG[apiName]?.apiKey || null;
};

export const isApiEnabled = (apiName) => {
  return API_CONFIG[apiName]?.enabled || false;
};

export const getApiUrl = (apiName) => {
  return API_CONFIG[apiName]?.baseUrl || null;
};

export const getPriorityOrder = () => {
  return API_CONFIG.priority.filter(api => isApiEnabled(api));
};
