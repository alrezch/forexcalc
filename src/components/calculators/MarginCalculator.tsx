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
import { Calculator, TrendingUp, DollarSign, Percent, Scale } from 'lucide-react'

export function MarginCalculator() {
  const [formData, setFormData] = useState({
    lotSize: '',
    leverage: '',
    fromCurrency: 'EUR',
    toCurrency: 'USD'
  })

  const [results, setResults] = useState<{
    requiredMargin: number
    freeMargin: number
    marginLevel: number
    maxLots: number
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

  const calculateMargin = () => {
    const lotSize = parseFloat(formData.lotSize)
    const leverage = parseFloat(formData.leverage)
    const currentRate = exchangeRate?.rate || 1.17

    if (lotSize && leverage && currentRate) {
      const contractSize = lotSize * 100000 // Standard lot size
      const requiredMargin = (contractSize * currentRate) / leverage
      const freeMargin = 10000 - requiredMargin // Assuming $10,000 account
      const marginLevel = (freeMargin / requiredMargin) * 100
      const maxLots = (10000 * leverage) / (currentRate * 100000)

      setResults({
        requiredMargin: Math.round(requiredMargin * 100) / 100,
        freeMargin: Math.round(freeMargin * 100) / 100,
        marginLevel: Math.round(marginLevel * 100) / 100,
        maxLots: Math.round(maxLots * 100) / 100
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
            Margin Calculator
          </CardTitle>
          <CardDescription>
            Calculate required margin, leverage, and margin level for your forex positions
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
                <Label htmlFor="leverage">Leverage</Label>
                <Input
                  id="leverage"
                  type="number"
                  placeholder="100"
                  value={formData.leverage}
                  onChange={(e) => handleInputChange('leverage', e.target.value)}
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
                onClick={calculateMargin} 
                className="w-full"
                disabled={!formData.lotSize || !formData.leverage}
              >
                Calculate Margin
              </Button>
            </div>
          </div>

          {/* Results */}
          {results && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Margin Calculation Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                    <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      ${results.requiredMargin}
                    </div>
                    <div className="text-sm text-blue-600">Required Margin</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                    <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      ${results.freeMargin}
                    </div>
                    <div className="text-sm text-blue-600">Free Margin</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                    <Percent className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      {results.marginLevel}%
                    </div>
                    <div className="text-sm text-blue-600">Margin Level</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                    <Scale className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      {results.maxLots}
                    </div>
                    <div className="text-sm text-blue-600">Max Lots</div>
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
