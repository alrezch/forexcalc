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
import { Calculator, TrendingUp, DollarSign, Coins } from 'lucide-react'

export function LotCalculator() {
  const [formData, setFormData] = useState({
    accountSize: '',
    riskPercentage: '',
    stopLossPips: '',
    fromCurrency: 'EUR',
    toCurrency: 'USD'
  })

  const [results, setResults] = useState<{
    positionSize: number
    lotSize: number
    riskAmount: number
    pipValue: number
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

  const calculateLotSize = () => {
    const accountSize = parseFloat(formData.accountSize)
    const riskPercentage = parseFloat(formData.riskPercentage)
    const stopLossPips = parseFloat(formData.stopLossPips)
    const currentRate = exchangeRate?.rate || 1.17

    if (accountSize && riskPercentage && stopLossPips && currentRate) {
      const riskAmount = (accountSize * riskPercentage) / 100
      const pipValue = 0.0001 * 100000 // Standard lot pip value
      const positionSize = riskAmount / (stopLossPips * pipValue)
      const lotSize = positionSize / 100000

      setResults({
        positionSize: Math.round(positionSize),
        lotSize: Math.round(lotSize * 100) / 100,
        riskAmount: Math.round(riskAmount * 100) / 100,
        pipValue: Math.round(pipValue * 100) / 100
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
            Lot Size Calculator
          </CardTitle>
          <CardDescription>
            Calculate the optimal lot size based on your account size, risk tolerance, and stop loss
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
                <Label htmlFor="accountSize">Account Size</Label>
                <Input
                  id="accountSize"
                  type="number"
                  placeholder="10000"
                  value={formData.accountSize}
                  onChange={(e) => handleInputChange('accountSize', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="riskPercentage">Risk Percentage (%)</Label>
                <Input
                  id="riskPercentage"
                  type="number"
                  placeholder="2"
                  value={formData.riskPercentage}
                  onChange={(e) => handleInputChange('riskPercentage', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="stopLossPips">Stop Loss (Pips)</Label>
                <Input
                  id="stopLossPips"
                  type="number"
                  placeholder="50"
                  value={formData.stopLossPips}
                  onChange={(e) => handleInputChange('stopLossPips', e.target.value)}
                />
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
                onClick={calculateLotSize} 
                className="w-full"
                disabled={!formData.accountSize || !formData.riskPercentage || !formData.stopLossPips}
              >
                Calculate Lot Size
              </Button>
            </div>
          </div>

          {/* Results */}
          {results && (
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Calculation Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                    <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      ${results.riskAmount}
                    </div>
                    <div className="text-sm text-green-600">Risk Amount</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                    <Coins className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      {results.positionSize.toLocaleString()}
                    </div>
                    <div className="text-sm text-green-600">Position Size</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                    <Calculator className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      {results.lotSize}
                    </div>
                    <div className="text-sm text-green-600">Lot Size</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                    <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      ${results.pipValue}
                    </div>
                    <div className="text-sm text-green-600">Pip Value</div>
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
