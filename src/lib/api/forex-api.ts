import axios from 'axios'
import { API_CONFIG, getApiKey, isApiEnabled, getPriorityOrder, getRefetchInterval, REFETCH_INTERVALS } from '@/config/api-config'

// Types
export interface ExchangeRate {
  fromCurrency: string
  toCurrency: string
  rate: number
  timestamp: string
  source: string
}

export interface InstrumentData {
  currentPrice: number
  pipValue: number
  unitsPerLot: number
  spread: number
  lastUpdated: string
  source: string
}

export interface APIStatus {
  status: 'active' | 'limited' | 'error' | 'disabled'
  message: string
  remainingCalls: string
  freeTierLimit: number
  lastChecked: string
}

// Fallback rates for demo purposes
const FALLBACK_RATES: Record<string, number> = {
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
}

// API Service Class
class ForexAPIService {
  private async fetchFromAlphaVantage(fromCurrency: string, toCurrency: string): Promise<number | null> {
    if (!isApiEnabled('ALPHA_VANTAGE')) return null
    
    try {
      const apiKey = getApiKey('ALPHA_VANTAGE')
      const response = await axios.get(API_CONFIG.ALPHA_VANTAGE.baseUrl, {
        params: {
          function: 'CURRENCY_EXCHANGE_RATE',
          from_currency: fromCurrency,
          to_currency: toCurrency,
          apikey: apiKey
        },
        timeout: API_CONFIG.timeout
      })
      
      // Check for API limit message
      if (response.data && response.data['Note']) {
        console.warn('Alpha Vantage API limit reached:', response.data['Note'])
        return null
      }
      
      if (response.data && response.data['Realtime Currency Exchange Rate']) {
        const rate = response.data['Realtime Currency Exchange Rate']['5. Exchange Rate']
        return parseFloat(rate)
      }
      
      return null
    } catch (error) {
      console.warn('Alpha Vantage API failed:', error)
      return null
    }
  }

  private async fetchFromExchangeRateAPI(fromCurrency: string, toCurrency: string): Promise<number | null> {
    if (!isApiEnabled('EXCHANGE_RATE_API')) return null
    
    try {
      const response = await axios.get(`${API_CONFIG.EXCHANGE_RATE_API.baseUrl}/${fromCurrency}`, {
        timeout: API_CONFIG.timeout
      })
      
      if (response.data && response.data.rates && response.data.rates[toCurrency]) {
        return response.data.rates[toCurrency]
      }
      
      return null
    } catch (error) {
      console.warn('ExchangeRate-API failed:', error)
      return null
    }
  }

  private async fetchFromOpenExchangeRates(fromCurrency: string, toCurrency: string): Promise<number | null> {
    if (!isApiEnabled('OPEN_EXCHANGE_RATES')) return null
    
    try {
      const response = await axios.get(`${API_CONFIG.OPEN_EXCHANGE_RATES.baseUrl}/${fromCurrency}`, {
        timeout: API_CONFIG.timeout
      })
      
      if (response.data && response.data.rates && response.data.rates[toCurrency]) {
        return response.data.rates[toCurrency]
      }
      
      return null
    } catch (error) {
      console.warn('Open Exchange Rates API failed:', error)
      return null
    }
  }

  private async fetchFromFixerAPI(fromCurrency: string, toCurrency: string): Promise<number | null> {
    if (!isApiEnabled('FIXER_API')) return null
    
    try {
      const apiKey = getApiKey('FIXER_API')
      if (!apiKey || apiKey === 'YOUR_FIXER_API_KEY') {
        return null
      }
      
      const response = await axios.get(API_CONFIG.FIXER_API.baseUrl, {
        params: {
          access_key: apiKey,
          base: fromCurrency,
          symbols: toCurrency
        },
        timeout: API_CONFIG.timeout
      })
      
      if (response.data && response.data.success && response.data.rates && response.data.rates[toCurrency]) {
        return response.data.rates[toCurrency]
      }
      
      return null
    } catch (error) {
      console.warn('Fixer.io API failed:', error)
      return null
    }
  }

  private getFallbackRate(fromCurrency: string, toCurrency: string): number {
    const fallbackKey = `${fromCurrency}-${toCurrency}`
    const reverseKey = `${toCurrency}-${fromCurrency}`
    
    if (FALLBACK_RATES[fallbackKey]) {
      return FALLBACK_RATES[fallbackKey]
    } else if (FALLBACK_RATES[reverseKey]) {
      return 1 / FALLBACK_RATES[reverseKey]
    } else {
      return 1.0
    }
  }

  // Main method to fetch exchange rate with fallback
  async fetchExchangeRate(fromCurrency: string, toCurrency: string): Promise<ExchangeRate> {
    const enabledApis = getPriorityOrder()
    
    for (const apiName of enabledApis) {
      try {
        let rate: number | null = null
        
        switch (apiName) {
          case 'ALPHA_VANTAGE':
            rate = await this.fetchFromAlphaVantage(fromCurrency, toCurrency)
            break
          case 'EXCHANGE_RATE_API':
            rate = await this.fetchFromExchangeRateAPI(fromCurrency, toCurrency)
            break
          case 'OPEN_EXCHANGE_RATES':
            rate = await this.fetchFromOpenExchangeRates(fromCurrency, toCurrency)
            break
          case 'FIXER_API':
            rate = await this.fetchFromFixerAPI(fromCurrency, toCurrency)
            break
          default:
            continue
        }
        
        if (rate !== null) {
          // Rate fetched successfully from ${apiName}
          return {
            fromCurrency,
            toCurrency,
            rate,
            timestamp: new Date().toISOString(),
            source: apiName
          }
        }
      } catch (error) {
        console.warn(`❌ ${apiName} API failed:`, error)
        continue
      }
    }
    
    console.warn('⚠️ All live APIs failed, using fallback rates')
    return {
      fromCurrency,
      toCurrency,
      rate: this.getFallbackRate(fromCurrency, toCurrency),
      timestamp: new Date().toISOString(),
      source: 'fallback'
    }
  }

  // Get instrument data
  async fetchInstrumentData(instrument: string): Promise<InstrumentData> {
    try {
      // Try to get real-time data from Alpha Vantage
      if (instrument.includes('USD')) {
        const baseCurrency = instrument.replace('USD', '')
        const rate = await this.fetchFromAlphaVantage(baseCurrency, 'USD')
        
        if (rate) {
          return {
            currentPrice: rate,
            pipValue: 0.0001,
            unitsPerLot: 100000,
            spread: 0.0002,
            lastUpdated: new Date().toISOString(),
            source: 'Alpha Vantage'
          }
        }
      }
      
      // Fallback to mock data
      return this.getMockInstrumentData(instrument)
    } catch (error) {
      // Failed to fetch instrument data
      return this.getMockInstrumentData(instrument)
    }
  }

  private getMockInstrumentData(instrument: string): InstrumentData {
    const mockData: Record<string, InstrumentData> = {
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
    }
    
    return mockData[instrument] || mockData['EURUSD']
  }

  // Get API status
  async getAPIStatus(): Promise<Record<string, APIStatus>> {
    const statuses: Record<string, APIStatus> = {}
    
    for (const apiName of getPriorityOrder()) {
      try {
        let status: APIStatus | null = null
        
        switch (apiName) {
          case 'ALPHA_VANTAGE':
            status = await this.checkAlphaVantageStatus()
            break
          case 'EXCHANGE_RATE_API':
            status = await this.checkExchangeRateAPIStatus()
            break
          case 'OPEN_EXCHANGE_RATES':
            status = await this.checkOpenExchangeRatesStatus()
            break
          case 'FIXER_API':
            status = await this.checkFixerAPIStatus()
            break
          default:
            continue
        }
        
        if (status) {
          statuses[apiName] = status
        }
      } catch (error) {
        statuses[apiName] = {
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
          remainingCalls: 'N/A',
          freeTierLimit: (API_CONFIG[apiName as keyof typeof API_CONFIG] as any)?.freeTierLimit || 0,
          lastChecked: new Date().toISOString()
        }
      }
    }
    
    return statuses
  }

  private async checkAlphaVantageStatus(): Promise<APIStatus> {
    try {
      const apiKey = getApiKey('ALPHA_VANTAGE')
      const response = await axios.get(API_CONFIG.ALPHA_VANTAGE.baseUrl, {
        params: {
          function: 'CURRENCY_EXCHANGE_RATE',
          from_currency: 'USD',
          to_currency: 'EUR',
          apikey: apiKey
        },
        timeout: 3000
      })
      
      if (response.data && response.data['Note']) {
        return {
          status: 'limited',
          message: response.data['Note'],
          remainingCalls: 'Check Alpha Vantage dashboard',
          freeTierLimit: API_CONFIG.ALPHA_VANTAGE.freeTierLimit,
          lastChecked: new Date().toISOString()
        }
      }
      
      return {
        status: 'active',
        message: 'API is working',
        remainingCalls: 'Unknown',
        freeTierLimit: API_CONFIG.ALPHA_VANTAGE.freeTierLimit,
        lastChecked: new Date().toISOString()
      }
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        remainingCalls: 'N/A',
        freeTierLimit: API_CONFIG.ALPHA_VANTAGE.freeTierLimit,
        lastChecked: new Date().toISOString()
      }
    }
  }

  private async checkExchangeRateAPIStatus(): Promise<APIStatus> {
    try {
      const response = await axios.get(`${API_CONFIG.EXCHANGE_RATE_API.baseUrl}/USD`, {
        timeout: 3000
      })
      
      if (response.data && response.data.rates) {
        return {
          status: 'active',
          message: 'API is working',
          remainingCalls: 'Unknown',
          freeTierLimit: API_CONFIG.EXCHANGE_RATE_API.freeTierLimit,
          lastChecked: new Date().toISOString()
        }
      }
      
      return {
        status: 'error',
        message: 'Invalid response format',
        remainingCalls: 'N/A',
        freeTierLimit: API_CONFIG.EXCHANGE_RATE_API.freeTierLimit,
        lastChecked: new Date().toISOString()
      }
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        remainingCalls: 'N/A',
        freeTierLimit: API_CONFIG.EXCHANGE_RATE_API.freeTierLimit,
        lastChecked: new Date().toISOString()
      }
    }
  }

  private async checkOpenExchangeRatesStatus(): Promise<APIStatus> {
    try {
      const response = await axios.get(`${API_CONFIG.OPEN_EXCHANGE_RATES.baseUrl}/USD`, {
        timeout: 3000
      })
      
      if (response.data && response.data.rates) {
        return {
          status: 'active',
          message: 'API is working',
          remainingCalls: 'Unknown',
          freeTierLimit: API_CONFIG.OPEN_EXCHANGE_RATES.freeTierLimit,
          lastChecked: new Date().toISOString()
        }
      }
      
      return {
        status: 'error',
        message: 'Invalid response format',
        remainingCalls: 'N/A',
        freeTierLimit: API_CONFIG.OPEN_EXCHANGE_RATES.freeTierLimit,
        lastChecked: new Date().toISOString()
      }
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        remainingCalls: 'N/A',
        freeTierLimit: API_CONFIG.OPEN_EXCHANGE_RATES.freeTierLimit,
        lastChecked: new Date().toISOString()
      }
    }
  }

  private async checkFixerAPIStatus(): Promise<APIStatus> {
    try {
      const apiKey = getApiKey('FIXER_API')
      if (!apiKey || apiKey === 'YOUR_FIXER_API_KEY') {
        return {
          status: 'disabled',
          message: 'API key not configured',
          remainingCalls: 'N/A',
          freeTierLimit: API_CONFIG.FIXER_API.freeTierLimit,
          lastChecked: new Date().toISOString()
        }
      }
      
      const response = await axios.get(API_CONFIG.FIXER_API.baseUrl, {
        params: {
          access_key: apiKey,
          base: 'USD',
          symbols: 'EUR'
        },
        timeout: 3000
      })
      
      if (response.data && response.data.success) {
        return {
          status: 'active',
          message: 'API is working',
          remainingCalls: 'Unknown',
          freeTierLimit: API_CONFIG.FIXER_API.freeTierLimit,
          lastChecked: new Date().toISOString()
        }
      } else if (response.data && response.data.error) {
        return {
          status: 'error',
          message: response.data.error.info,
          remainingCalls: 'N/A',
          freeTierLimit: API_CONFIG.FIXER_API.freeTierLimit,
          lastChecked: new Date().toISOString()
        }
      }
      
      return {
        status: 'error',
        message: 'Invalid response format',
        remainingCalls: 'N/A',
        freeTierLimit: API_CONFIG.FIXER_API.freeTierLimit,
        lastChecked: new Date().toISOString()
      }
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        remainingCalls: 'N/A',
        freeTierLimit: API_CONFIG.FIXER_API.freeTierLimit,
        lastChecked: new Date().toISOString()
      }
    }
  }

  // Get refetch interval for a specific API
  getRefetchIntervalForAPI(apiName: string): number {
    if (apiName === 'ALPHA_VANTAGE' || apiName === 'EXCHANGE_RATE_API' || 
        apiName === 'OPEN_EXCHANGE_RATES' || apiName === 'FIXER_API') {
      return getRefetchInterval(apiName as 'ALPHA_VANTAGE' | 'EXCHANGE_RATE_API' | 'OPEN_EXCHANGE_RATES' | 'FIXER_API')
    }
    return API_CONFIG.defaultRefetchInterval
  }

  // Get all available refetch intervals
  getAvailableRefetchIntervals(): typeof REFETCH_INTERVALS {
    return REFETCH_INTERVALS
  }
}

// Export singleton instance
export const forexAPIService = new ForexAPIService()
