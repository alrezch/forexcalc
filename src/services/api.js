import axios from 'axios';
import { API_CONFIG, getApiKey, isApiEnabled, getPriorityOrder } from '../config/api-config';

// Fallback rates for demo purposes (updated with more realistic values)
const FALLBACK_RATES = {
  'AUD-USD': 0.6506,
  'EUR-AUD': 1.79766,
  'GBP-USD': 1.2500,
  'USD-JPY': 110.50,
  'EUR-USD': 1.1700,
  'AUD-EUR': 0.5564,
  'USD-AUD': 1.5372,
  'EUR-GBP': 0.9360,
  'USD-CAD': 1.3500,
  'USD-CHF': 0.8900,
  'NZD-USD': 0.6100,
  'USD-SGD': 1.3400
};

// Primary API function using priority-based fallback system
export const fetchExchangeRate = async (fromCurrency, toCurrency) => {
  const enabledApis = getPriorityOrder();
  
  for (const apiName of enabledApis) {
    try {
      let rate = null;
      
      switch (apiName) {
        case 'ALPHA_VANTAGE':
          rate = await fetchFromAlphaVantage(fromCurrency, toCurrency);
          break;
        case 'EXCHANGE_RATE_API':
          rate = await fetchFromExchangeRateAPI(fromCurrency, toCurrency);
          break;
        case 'OPEN_EXCHANGE_RATES':
          rate = await fetchFromOpenExchangeRates(fromCurrency, toCurrency);
          break;
        case 'FIXER_API':
          rate = await fetchFromFixerAPI(fromCurrency, toCurrency);
          break;
        default:
          continue;
      }
      
      if (rate !== null) {
        console.log(`✅ Successfully fetched rate from ${apiName}: ${rate}`);
        return rate;
      }
    } catch (error) {
      console.warn(`❌ ${apiName} API failed:`, error.message);
      continue;
    }
  }
  
  console.warn('⚠️ All live APIs failed, using fallback rates');
  return getFallbackRate(fromCurrency, toCurrency);
};

// Alpha Vantage API call (best for real-time forex)
const fetchFromAlphaVantage = async (fromCurrency, toCurrency) => {
  if (!isApiEnabled('ALPHA_VANTAGE')) return null;
  
  try {
    const apiKey = getApiKey('ALPHA_VANTAGE');
    const response = await axios.get(API_CONFIG.ALPHA_VANTAGE.baseUrl, {
      params: {
        function: 'CURRENCY_EXCHANGE_RATE',
        from_currency: fromCurrency,
        to_currency: toCurrency,
        apikey: apiKey
      },
      timeout: API_CONFIG.timeout
    });
    
    // Check for API limit message
    if (response.data && response.data['Note']) {
      console.warn('Alpha Vantage API limit reached:', response.data['Note']);
      return null;
    }
    
    if (response.data && response.data['Realtime Currency Exchange Rate']) {
      const rate = response.data['Realtime Currency Exchange Rate']['5. Exchange Rate'];
      return parseFloat(rate);
    }
    
    return null;
  } catch (error) {
    console.warn('Alpha Vantage API failed:', error.message);
    return null;
  }
};

// ExchangeRate-API call
const fetchFromExchangeRateAPI = async (fromCurrency, toCurrency) => {
  if (!isApiEnabled('EXCHANGE_RATE_API')) return null;
  
  try {
    const response = await axios.get(`${API_CONFIG.EXCHANGE_RATE_API.baseUrl}/${fromCurrency}`, {
      timeout: API_CONFIG.timeout
    });
    
    if (response.data && response.data.rates && response.data.rates[toCurrency]) {
      return response.data.rates[toCurrency];
    }
    
    return null;
  } catch (error) {
    console.warn('ExchangeRate-API failed:', error.message);
    return null;
  }
};

// Open Exchange Rates API call
const fetchFromOpenExchangeRates = async (fromCurrency, toCurrency) => {
  if (!isApiEnabled('OPEN_EXCHANGE_RATES')) return null;
  
  try {
    const response = await axios.get(`${API_CONFIG.OPEN_EXCHANGE_RATES.baseUrl}/${fromCurrency}`, {
      timeout: API_CONFIG.timeout
    });
    
    if (response.data && response.data.rates && response.data.rates[toCurrency]) {
      return response.data.rates[toCurrency];
    }
    
    return null;
  } catch (error) {
    console.warn('Open Exchange Rates API failed:', error.message);
    return null;
  }
};

// Fixer.io API call
const fetchFromFixerAPI = async (fromCurrency, toCurrency) => {
  if (!isApiEnabled('FIXER_API')) return null;
  
  try {
    const apiKey = getApiKey('FIXER_API');
    if (!apiKey || apiKey === 'YOUR_FIXER_API_KEY') {
      return null;
    }
    
    const response = await axios.get(API_CONFIG.FIXER_API.baseUrl, {
      params: {
        access_key: apiKey,
        base: fromCurrency,
        symbols: toCurrency
      },
      timeout: API_CONFIG.timeout
    });
    
    if (response.data && response.data.success && response.data.rates && response.data.rates[toCurrency]) {
      return response.data.rates[toCurrency];
    }
    
    return null;
  } catch (error) {
    console.warn('Fixer.io API failed:', error.message);
    return null;
  }
};

// Get fallback rate from predefined values
const getFallbackRate = (fromCurrency, toCurrency) => {
  const fallbackKey = `${fromCurrency}-${toCurrency}`;
  const reverseKey = `${toCurrency}-${fromCurrency}`;
  
  if (FALLBACK_RATES[fallbackKey]) {
    return FALLBACK_RATES[fallbackKey];
  } else if (FALLBACK_RATES[reverseKey]) {
    // Calculate inverse rate
    return 1 / FALLBACK_RATES[reverseKey];
  } else {
    // Default fallback
    return 1.0;
  }
};

// Function to get multiple exchange rates at once
export const fetchMultipleRates = async (baseCurrency, targetCurrencies) => {
  const enabledApis = getPriorityOrder();
  
  for (const apiName of enabledApis) {
    try {
      let rates = null;
      
      switch (apiName) {
        case 'ALPHA_VANTAGE':
          rates = await fetchMultipleFromAlphaVantage(baseCurrency, targetCurrencies);
          break;
        case 'EXCHANGE_RATE_API':
          rates = await fetchMultipleFromExchangeRateAPI(baseCurrency, targetCurrencies);
          break;
        case 'OPEN_EXCHANGE_RATES':
          rates = await fetchMultipleFromOpenExchangeRates(baseCurrency, targetCurrencies);
          break;
        default:
          continue;
      }
      
      if (rates && Object.keys(rates).length > 0) {
        console.log(`✅ Successfully fetched multiple rates from ${apiName}`);
        return rates;
      }
    } catch (error) {
      console.warn(`❌ ${apiName} multiple rates failed:`, error.message);
      continue;
    }
  }
  
  console.warn('⚠️ All live APIs failed for multiple rates, using fallbacks');
  const fallbackRates = {};
  targetCurrencies.forEach(currency => {
    fallbackRates[currency] = getFallbackRate(baseCurrency, currency);
  });
  
  return fallbackRates;
};

// Fetch multiple rates from Alpha Vantage
const fetchMultipleFromAlphaVantage = async (baseCurrency, targetCurrencies) => {
  if (!isApiEnabled('ALPHA_VANTAGE')) return null;
  
  try {
    const rates = {};
    
    // Alpha Vantage doesn't support bulk requests, so we make individual calls
    // Note: This will consume multiple API calls from your daily limit
    for (const targetCurrency of targetCurrencies) {
      const rate = await fetchFromAlphaVantage(baseCurrency, targetCurrency);
      if (rate) {
        rates[targetCurrency] = rate;
      }
    }
    
    return rates;
  } catch (error) {
    console.warn('Alpha Vantage multiple rates failed:', error.message);
    return null;
  }
};

// Fetch multiple rates from ExchangeRate-API
const fetchMultipleFromExchangeRateAPI = async (baseCurrency, targetCurrencies) => {
  if (!isApiEnabled('EXCHANGE_RATE_API')) return null;
  
  try {
    const response = await axios.get(`${API_CONFIG.EXCHANGE_RATE_API.baseUrl}/${baseCurrency}`, {
      timeout: API_CONFIG.timeout
    });
    
    if (response.data && response.data.rates) {
      const rates = {};
      targetCurrencies.forEach(currency => {
        if (response.data.rates[currency]) {
          rates[currency] = response.data.rates[currency];
        }
      });
      return rates;
    }
    
    return null;
  } catch (error) {
    console.warn('ExchangeRate-API multiple rates failed:', error.message);
    return null;
  }
};

// Fetch multiple rates from Open Exchange Rates
const fetchMultipleFromOpenExchangeRates = async (baseCurrency, targetCurrencies) => {
  if (!isApiEnabled('OPEN_EXCHANGE_RATES')) return null;
  
  try {
    const response = await axios.get(`${API_CONFIG.OPEN_EXCHANGE_RATES.baseUrl}/${baseCurrency}`, {
      timeout: API_CONFIG.timeout
    });
    
    if (response.data && response.data.rates) {
      const rates = {};
      targetCurrencies.forEach(currency => {
        if (response.data.rates[currency]) {
          rates[currency] = response.data.rates[currency];
        }
      });
      return rates;
    }
    
    return null;
  } catch (error) {
    console.warn('Open Exchange Rates multiple rates failed:', error.message);
    return null;
  }
};

// Function to get instrument-specific data with real-time prices
export const fetchInstrumentData = async (instrument) => {
  try {
    // Try to get real-time data from Alpha Vantage
    const realTimeData = await fetchInstrumentFromAlphaVantage(instrument);
    if (realTimeData) {
      return realTimeData;
    }
    
    // Fallback to mock data
    return getMockInstrumentData(instrument);
  } catch (error) {
    console.error('Failed to fetch instrument data:', error);
    return getMockInstrumentData(instrument);
  }
};

// Fetch real-time instrument data from Alpha Vantage
const fetchInstrumentFromAlphaVantage = async (instrument) => {
  if (!isApiEnabled('ALPHA_VANTAGE')) return null;
  
  try {
    // For forex pairs, we can get real-time rates
    if (instrument.includes('USD')) {
      const baseCurrency = instrument.replace('USD', '');
      const rate = await fetchFromAlphaVantage(baseCurrency, 'USD');
      
      if (rate) {
        return {
          currentPrice: rate,
          pipValue: 0.0001,
          unitsPerLot: 100000,
          spread: 0.0002,
          lastUpdated: new Date().toISOString(),
          source: 'Alpha Vantage'
        };
      }
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to fetch real-time instrument data:', error.message);
    return null;
  }
};

// Get mock instrument data (fallback)
const getMockInstrumentData = (instrument) => {
  const mockData = {
    'EURUSD': {
      currentPrice: 1.17071,
      pipValue: 0.0001,
      unitsPerLot: 100000,
      spread: 0.0002,
      lastUpdated: new Date().toISOString(),
      source: 'Mock Data'
    },
    'GBPUSD': {
      currentPrice: 1.2500,
      pipValue: 0.0001,
      unitsPerLot: 100000,
      spread: 0.0003,
      lastUpdated: new Date().toISOString(),
      source: 'Mock Data'
    },
    'USDJPY': {
      currentPrice: 110.50,
      pipValue: 0.01,
      unitsPerLot: 100000,
      spread: 0.02,
      lastUpdated: new Date().toISOString(),
      source: 'Mock Data'
    },
    'AUDUSD': {
      currentPrice: 0.6506,
      pipValue: 0.0001,
      unitsPerLot: 100000,
      spread: 0.0002,
      lastUpdated: new Date().toISOString(),
      source: 'Mock Data'
    }
  };
  
  return mockData[instrument] || mockData['EURUSD'];
};

// Function to update prices with a countdown
export const updatePricesWithCountdown = async (callback, countdown = 15) => {
  let count = countdown;
  
  const interval = setInterval(() => {
    count--;
    if (count <= 0) {
      clearInterval(interval);
      callback();
    }
  }, 1000);
  
  return () => clearInterval(interval);
};

// Function to get API status and remaining calls
export const getAPIStatus = async () => {
  const statuses = {};
  
  for (const apiName of getPriorityOrder()) {
    try {
      let status = null;
      
      switch (apiName) {
        case 'ALPHA_VANTAGE':
          status = await checkAlphaVantageStatus();
          break;
        case 'EXCHANGE_RATE_API':
          status = await checkExchangeRateAPIStatus();
          break;
        case 'OPEN_EXCHANGE_RATES':
          status = await checkOpenExchangeRatesStatus();
          break;
        case 'FIXER_API':
          status = await checkFixerAPIStatus();
          break;
        default:
          continue;
      }
      
      if (status) {
        statuses[apiName] = status;
      }
    } catch (error) {
      statuses[apiName] = {
        status: 'error',
        message: error.message,
        remainingCalls: 'N/A'
      };
    }
  }
  
  return statuses;
};

// Check Alpha Vantage status
const checkAlphaVantageStatus = async () => {
  try {
    const apiKey = getApiKey('ALPHA_VANTAGE');
    const response = await axios.get(API_CONFIG.ALPHA_VANTAGE.baseUrl, {
      params: {
        function: 'CURRENCY_EXCHANGE_RATE',
        from_currency: 'USD',
        to_currency: 'EUR',
        apikey: apiKey
      },
      timeout: 3000
    });
    
    if (response.data && response.data['Note']) {
      return {
        status: 'limited',
        message: response.data['Note'],
        remainingCalls: 'Check Alpha Vantage dashboard',
        freeTierLimit: API_CONFIG.ALPHA_VANTAGE.freeTierLimit
      };
    }
    
    return {
      status: 'active',
      message: 'API is working',
      remainingCalls: 'Unknown',
      freeTierLimit: API_CONFIG.ALPHA_VANTAGE.freeTierLimit
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message,
      remainingCalls: 'N/A',
      freeTierLimit: API_CONFIG.ALPHA_VANTAGE.freeTierLimit
    };
  }
};

// Check ExchangeRate-API status
const checkExchangeRateAPIStatus = async () => {
  try {
    const response = await axios.get(`${API_CONFIG.EXCHANGE_RATE_API.baseUrl}/USD`, {
      timeout: 3000
    });
    
    if (response.data && response.data.rates) {
      return {
        status: 'active',
        message: 'API is working',
        remainingCalls: 'Unknown',
        freeTierLimit: API_CONFIG.EXCHANGE_RATE_API.freeTierLimit
      };
    }
    
    return {
      status: 'error',
      message: 'Invalid response format',
      remainingCalls: 'N/A',
      freeTierLimit: API_CONFIG.EXCHANGE_RATE_API.freeTierLimit
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message,
      remainingCalls: 'N/A',
      freeTierLimit: API_CONFIG.EXCHANGE_RATE_API.freeTierLimit
    };
  }
};

// Check Open Exchange Rates status
const checkOpenExchangeRatesStatus = async () => {
  try {
    const response = await axios.get(`${API_CONFIG.OPEN_EXCHANGE_RATES.baseUrl}/USD`, {
      timeout: 3000
    });
    
    if (response.data && response.data.rates) {
      return {
        status: 'active',
        message: 'API is working',
        remainingCalls: 'Unknown',
        freeTierLimit: API_CONFIG.OPEN_EXCHANGE_RATES.freeTierLimit
      };
    }
    
    return {
      status: 'error',
      message: 'Invalid response format',
      remainingCalls: 'N/A',
      freeTierLimit: API_CONFIG.OPEN_EXCHANGE_RATES.freeTierLimit
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message,
      remainingCalls: 'N/A',
      freeTierLimit: API_CONFIG.OPEN_EXCHANGE_RATES.freeTierLimit
    };
  }
};

// Check Fixer.io status
const checkFixerAPIStatus = async () => {
  try {
    const apiKey = getApiKey('FIXER_API');
    if (!apiKey || apiKey === 'YOUR_FIXER_API_KEY') {
      return {
        status: 'disabled',
        message: 'API key not configured',
        remainingCalls: 'N/A',
        freeTierLimit: API_CONFIG.FIXER_API.freeTierLimit
      };
    }
    
    const response = await axios.get(API_CONFIG.FIXER_API.baseUrl, {
      params: {
        access_key: apiKey,
        base: 'USD',
        symbols: 'EUR'
      },
      timeout: 3000
    });
    
    if (response.data && response.data.success) {
      return {
        status: 'active',
        message: 'API is working',
        remainingCalls: 'Unknown',
        freeTierLimit: API_CONFIG.FIXER_API.freeTierLimit
      };
    } else if (response.data && response.data.error) {
      return {
        status: 'error',
        message: response.data.error.info,
        remainingCalls: 'N/A',
        freeTierLimit: API_CONFIG.FIXER_API.freeTierLimit
      };
    }
    
    return {
      status: 'error',
      message: 'Invalid response format',
      remainingCalls: 'N/A',
      freeTierLimit: API_CONFIG.FIXER_API.freeTierLimit
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message,
      remainingCalls: 'N/A',
      freeTierLimit: API_CONFIG.FIXER_API.freeTierLimit
    };
  }
};
