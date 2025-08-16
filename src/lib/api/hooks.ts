'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { forexAPIService, type ExchangeRate, type InstrumentData, type APIStatus } from './forex-api'
import { REFETCH_INTERVALS, type RefetchInterval } from '@/config/api-config'
import { useState, useEffect } from 'react'

// Exchange Rate Hooks
export const useExchangeRate = (
  fromCurrency: string,
  toCurrency: string,
  refetchInterval: RefetchInterval = REFETCH_INTERVALS.STANDARD
) => {
  return useQuery({
    queryKey: ['exchangeRate', fromCurrency, toCurrency],
    queryFn: () => forexAPIService.fetchExchangeRate(fromCurrency, toCurrency),
    refetchInterval: refetchInterval === REFETCH_INTERVALS.MANUAL ? false : refetchInterval,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export const useExchangeRateRealTime = (fromCurrency: string, toCurrency: string) => {
  return useExchangeRate(fromCurrency, toCurrency, REFETCH_INTERVALS.REAL_TIME)
}

export const useExchangeRateFrequent = (fromCurrency: string, toCurrency: string) => {
  return useExchangeRate(fromCurrency, toCurrency, REFETCH_INTERVALS.FREQUENT)
}

export const useExchangeRateHourly = (fromCurrency: string, toCurrency: string) => {
  return useExchangeRate(fromCurrency, toCurrency, REFETCH_INTERVALS.HOURLY)
}

export const useExchangeRateManual = (fromCurrency: string, toCurrency: string) => {
  return useExchangeRate(fromCurrency, toCurrency, REFETCH_INTERVALS.MANUAL)
}

// Instrument Data Hooks
export const useInstrumentData = (
  instrument: string,
  refetchInterval: RefetchInterval = REFETCH_INTERVALS.STANDARD
) => {
  return useQuery({
    queryKey: ['instrumentData', instrument],
    queryFn: () => forexAPIService.fetchInstrumentData(instrument),
    refetchInterval: refetchInterval === REFETCH_INTERVALS.MANUAL ? false : refetchInterval,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export const useInstrumentDataRealTime = (instrument: string) => {
  return useInstrumentData(instrument, REFETCH_INTERVALS.REAL_TIME)
}

export const useInstrumentDataFrequent = (instrument: string) => {
  return useInstrumentData(instrument, REFETCH_INTERVALS.FREQUENT)
}

// API Status Hooks
export const useAPIStatus = (refetchInterval: RefetchInterval = REFETCH_INTERVALS.FREQUENT) => {
  return useQuery({
    queryKey: ['apiStatus'],
    queryFn: () => forexAPIService.getAPIStatus(),
    refetchInterval: refetchInterval === REFETCH_INTERVALS.MANUAL ? false : refetchInterval,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  })
}

export const useAPIStatusRealTime = () => {
  return useAPIStatus(REFETCH_INTERVALS.REAL_TIME)
}

// Manual Refresh Hooks
export const useRefreshExchangeRate = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ fromCurrency, toCurrency }: { fromCurrency: string; toCurrency: string }) => {
      return forexAPIService.fetchExchangeRate(fromCurrency, toCurrency)
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ['exchangeRate', variables.fromCurrency, variables.toCurrency],
        data
      )
      queryClient.invalidateQueries({
        queryKey: ['exchangeRate', variables.fromCurrency, variables.toCurrency]
      })
    },
  })
}

export const useRefreshInstrumentData = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (instrument: string) => {
      return forexAPIService.fetchInstrumentData(instrument)
    },
    onSuccess: (data, instrument) => {
      queryClient.setQueryData(['instrumentData', instrument], data)
      queryClient.invalidateQueries({
        queryKey: ['instrumentData', instrument]
      })
    },
  })
}

export const useRefreshAPIStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      return forexAPIService.getAPIStatus()
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['apiStatus'], data)
      queryClient.invalidateQueries({
        queryKey: ['apiStatus']
      })
    },
  })
}

// Multiple Exchange Rates Hook
export const useMultipleExchangeRates = (
  pairs: Array<{ fromCurrency: string; toCurrency: string }>,
  refetchInterval: RefetchInterval = REFETCH_INTERVALS.STANDARD
) => {
  const queries = pairs.map(pair => 
    useExchangeRate(pair.fromCurrency, pair.toCurrency, refetchInterval)
  )
  
  const isLoading = queries.some(query => query.isLoading)
  const isError = queries.some(query => query.isError)
  const data = queries.map(query => query.data).filter(Boolean) as ExchangeRate[]
  
  return {
    data,
    isLoading,
    isError,
    queries,
    refetch: () => queries.forEach(query => query.refetch())
  }
}

// Custom Hook for Configurable Refetch Intervals
export const useConfigurableExchangeRate = (
  fromCurrency: string,
  toCurrency: string,
  customRefetchInterval: number
) => {
  return useQuery({
    queryKey: ['exchangeRate', fromCurrency, toCurrency, customRefetchInterval],
    queryFn: () => forexAPIService.fetchExchangeRate(fromCurrency, toCurrency),
    refetchInterval: customRefetchInterval > 0 ? customRefetchInterval : false,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

// Hook for getting available refetch intervals
export const useAvailableRefetchIntervals = () => {
  return {
    intervals: forexAPIService.getAvailableRefetchIntervals(),
    getIntervalLabel: (interval: number) => {
      if (interval === REFETCH_INTERVALS.REAL_TIME) return 'Real-time (30s)'
      if (interval === REFETCH_INTERVALS.STANDARD) return 'Standard (1m)'
      if (interval === REFETCH_INTERVALS.FREQUENT) return 'Frequent (5m)'
      if (interval === REFETCH_INTERVALS.HOURLY) return 'Hourly (1h)'
      if (interval === REFETCH_INTERVALS.DAILY) return 'Daily (24h)'
      if (interval === REFETCH_INTERVALS.MANUAL) return 'Manual only'
      return `Custom (${Math.round(interval / 1000)}s)`
    }
  }
}

// Hook for managing refetch interval preferences
export const useRefetchIntervalPreference = () => {
  const [preference, setPreference] = useState<RefetchInterval>(REFETCH_INTERVALS.STANDARD)
  
  const updatePreference = (newInterval: RefetchInterval) => {
    setPreference(newInterval)
    // You could also save this to localStorage or a database
    localStorage.setItem('forex-refetch-interval', newInterval.toString())
  }
  
  useEffect(() => {
    const saved = localStorage.getItem('forex-refetch-interval')
    if (saved) {
      const parsed = parseInt(saved)
      const validIntervals = Object.values(REFETCH_INTERVALS)
      if (validIntervals.includes(parsed as any)) {
        setPreference(parsed as RefetchInterval)
      }
    }
  }, [])
  
  return {
    preference,
    updatePreference,
    availableIntervals: forexAPIService.getAvailableRefetchIntervals()
  }
}

// Utility hook for getting the best available refetch interval
export const useOptimalRefetchInterval = (apiName: string) => {
  const optimalInterval = forexAPIService.getRefetchIntervalForAPI(apiName)
  
  return {
    optimalInterval,
    isOptimal: (currentInterval: number) => currentInterval === optimalInterval,
    getOptimalLabel: () => {
      if (optimalInterval === REFETCH_INTERVALS.REAL_TIME) return 'Real-time (30s)'
      if (optimalInterval === REFETCH_INTERVALS.STANDARD) return 'Standard (1m)'
      if (optimalInterval === REFETCH_INTERVALS.FREQUENT) return 'Frequent (5m)'
      if (optimalInterval === REFETCH_INTERVALS.HOURLY) return 'Hourly (1h)'
      if (optimalInterval === REFETCH_INTERVALS.DAILY) return 'Daily (24h)'
      return `Custom (${Math.round(optimalInterval / 1000)}s)`
    }
  }
}
