'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useExchangeRate, useRefetchIntervalPreference } from '@/lib/api/hooks'
import { REFETCH_INTERVALS } from '@/config/api-config'
import { Calculator, TrendingUp, DollarSign, Coins, BarChart3 } from 'lucide-react'

export function PipCalculator() {
  const [formData, setFormData] = useState({
    lotSize: '',
    fromCurrency: 'EUR',
    toCurrency: 'USD',
    pipValue: ''
  })

  const [results, setResults] = useState<{
    pipValue: number
    pipCost: number
    totalPipValue: number
    profitPerPip: number
  } | null>(null)

  const { preference, updatePreference } = useRefetchIntervalPreference()
  
  const { data: exchangeRate, isLoading, isError } = useExchangeRate(
    formData.fromCurrency,
    formData.toCurrency,
    preference
  )

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const calculatePipValue = () => {
    const lotSize = parseFloat(formData.lotSize)
    const customPipValue = parseFloat(formData.pipValue)
    const currentRate = exchangeRate?.rate || 1.17

    if (lotSize && currentRate) {
      let pipValue = 0.0001 // Default pip value for most pairs
      
      // Adjust pip value for JPY pairs
      if (formData.toCurrency === 'JPY') {
        pipValue = 0.01
      }
      
      // Use custom pip value if provided
      if (customPipValue) {
        pipValue = customPipValue
      }

      const pipCost = pipValue * 100000 * lotSize
      const totalPipValue = pipCost * currentRate
      const profitPerPip = totalPipValue

      setResults({
        pipValue: Math.round(pipValue * 100000) / 100000,
        pipCost: Math.round(pipCost * 100) / 100,
        totalPipValue: Math.round(totalPipValue * 100) / 100,
        profitPerPip: Math.round(profitPerPip * 100) / 100
      })
    }
  }

  const currencies = ['EUR', 'USD', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD']

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            Pip Calculator
          </CardTitle>
          <CardDescription>
            Calculate pip values, costs, and potential profits for your forex positions
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Refetch Interval Configuration */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <Label className="text-sm font-medium mb-2 block">Data Update Frequency</Label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(REFETCH_INTERVALS).map(([key, interval]) => (
                <Button
                  key={key}
                  variant={preference === interval ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updatePreference(interval)}
                  className="text-xs"
                >
                  {key === 'REAL_TIME' && 'Real-time (30s)'}
                  {key === 'STANDARD' && 'Standard (1m)'}
                  {key === 'FREQUENT' && 'Frequent (5m)'}
                  {key === 'HOURLY' && 'Hourly (1h)'}
                  {key === 'DAILY' && 'Daily (24h)'}
                  {key === 'MANUAL' && 'Manual only'}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Current: {preference === REFETCH_INTERVALS.MANUAL ? 'Manual refresh only' : 
                `Auto-refresh every ${Math.round(preference / 1000)} seconds`}
            </p>
          </div>

          {/* Exchange Rate Display */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Current Exchange Rate</Label>
                <div className="text-2xl font-bold text-primary">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      Loading...
                    </div>
                  ) : isError ? (
                    <span className="text-destructive">Error loading rate</span>
                  ) : (
                    `${formData.fromCurrency}/${formData.toCurrency}: ${exchangeRate?.rate?.toFixed(5)}`
                  )}
                </div>
                {exchangeRate && (
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      Source: {exchangeRate.source}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Updated: {new Date(exchangeRate.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
              <TrendingUp className="h-8 w-8 text-primary/60" />
            </div>
          </div>

          {/* Calculator Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="lotSize">Lot Size</Label>
                <Input
                  id="lotSize"
                  type="number"
                  step="0.01"
                  placeholder="0.1"
                  value={formData.lotSize}
                  onChange={(e) => handleInputChange('lotSize', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="pipValue">Custom Pip Value (Optional)</Label>
                <Input
                  id="pipValue"
                  type="number"
                  step="0.00001"
                  placeholder="0.0001"
                  value={formData.pipValue}
                  onChange={(e) => handleInputChange('pipValue', e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty for standard pip values
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fromCurrency">From Currency</Label>
                <Select
                  value={formData.fromCurrency}
                  onValueChange={(value) => handleInputChange('fromCurrency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="toCurrency">To Currency</Label>
                <Select
                  value={formData.toCurrency}
                  onValueChange={(value) => handleInputChange('toCurrency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={calculatePipValue} 
                className="w-full"
                disabled={!formData.lotSize}
              >
                Calculate Pip Value
              </Button>
            </div>
          </div>

          {/* Results */}
          {results && (
            <Card className="bg-orange-50 border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-800">Pip Calculation Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg border border-orange-200">
                    <BarChart3 className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600">
                      {results.pipValue}
                    </div>
                    <div className="text-sm text-orange-600">Pip Value</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border border-orange-200">
                    <Coins className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600">
                      ${results.pipCost}
                    </div>
                    <div className="text-sm text-orange-600">Pip Cost</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border border-orange-200">
                    <DollarSign className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600">
                      ${results.totalPipValue}
                    </div>
                    <div className="text-sm text-orange-600">Total Pip Value</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border border-orange-200">
                    <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-600">
                      ${results.profitPerPip}
                    </div>
                    <div className="text-sm text-orange-600">Profit Per Pip</div>
                  </div>
                </div>

                {/* Pip Information */}
                <div className="mt-6 p-4 bg-white rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2">Pip Information</h4>
                  <div className="text-sm text-orange-700 space-y-1">
                    <p>• Standard pip value for most pairs: 0.0001</p>
                    <p>• JPY pairs pip value: 0.01</p>
                    <p>• 1 standard lot = 100,000 units</p>
                    <p>• Pip value increases with lot size</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
