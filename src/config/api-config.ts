// Simple API Configuration
export const REFETCH_INTERVALS = {
  REAL_TIME: 30000,        // 30 seconds
  STANDARD: 60000,         // 1 minute
  FREQUENT: 300000,        // 5 minutes
  HOURLY: 3600000,         // 1 hour
  DAILY: 86400000,         // 24 hours
  MANUAL: 0,               // Manual only
}

export type RefetchInterval = typeof REFETCH_INTERVALS[keyof typeof REFETCH_INTERVALS]

// Define valid API names
type APIName = 'ALPHA_VANTAGE' | 'EXCHANGE_RATE_API' | 'OPEN_EXCHANGE_RATES' | 'FIXER_API'

export const API_CONFIG = {
  ALPHA_VANTAGE: {
    enabled: true,
    apiKey: 'demo',
    baseUrl: 'https://www.alphavantage.co/query',
    freeTierLimit: 500,
    realTime: true,
    delay: '1 minute',
    coverage: '150+ forex pairs',
    refetchInterval: 60000
  },
  EXCHANGE_RATE_API: {
    enabled: true,
    apiKey: null,
    baseUrl: 'https://api.exchangerate-api.com/v4/latest',
    freeTierLimit: 1500,
    realTime: true,
    delay: '1 hour',
    coverage: '170+ currencies',
    refetchInterval: 3600000
  },
  OPEN_EXCHANGE_RATES: {
    enabled: true,
    apiKey: null,
    baseUrl: 'https://open.er-api.com/v6/latest',
    freeTierLimit: 1000,
    realTime: true,
    delay: '1 hour',
    coverage: '200+ currencies',
    refetchInterval: 3600000
  },
  FIXER_API: {
    enabled: false,
    apiKey: 'YOUR_FIXER_API_KEY',
    baseUrl: 'http://data.fixer.io/api/latest',
    freeTierLimit: 100,
    realTime: true,
    delay: '1 hour',
    coverage: '170+ currencies',
    refetchInterval: 3600000
  },
  priority: ['ALPHA_VANTAGE', 'EXCHANGE_RATE_API', 'OPEN_EXCHANGE_RATES', 'FIXER_API'] as const,
  timeout: 5000,
  maxRetries: 2,
  cacheDuration: 5 * 60 * 1000,
  defaultRefetchInterval: 60000,
  updateInterval: 60
}

export const getApiKey = (apiName: APIName): string | null => {
  return API_CONFIG[apiName]?.apiKey || null
}

export const isApiEnabled = (apiName: APIName): boolean => {
  return API_CONFIG[apiName]?.enabled || false
}

export const getApiUrl = (apiName: APIName): string | null => {
  return API_CONFIG[apiName]?.baseUrl || null
}

export const getPriorityOrder = (): APIName[] => {
  return API_CONFIG.priority.filter(api => isApiEnabled(api)) as APIName[]
}

export const getRefetchInterval = (apiName: APIName): number => {
  return API_CONFIG[apiName]?.refetchInterval || API_CONFIG.defaultRefetchInterval
}
