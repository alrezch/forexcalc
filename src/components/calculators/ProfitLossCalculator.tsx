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
import { Calculator, TrendingUp, DollarSign, TrendingDown, BarChart3 } from 'lucide-react'

export function ProfitLossCalculator() {
  const [formData, setFormData] = useState({
    entryPrice: '',
    exitPrice: '',
    lotSize: '',
    fromCurrency: 'EUR',
    toCurrency: 'USD',
    positionType: 'buy'
  })

  const [results, setResults] = useState<{
    pips: number
    profitLoss: number
    profitLossPercent: number
    totalValue: number
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

  const calculateProfitLoss = () => {
    const entryPrice = parseFloat(formData.entryPrice)
    const exitPrice = parseFloat(formData.exitPrice)
    const lotSize = parseFloat(formData.lotSize)
    const currentRate = exchangeRate?.rate || 1.17

    if (entryPrice && exitPrice && lotSize && currentRate) {
      let pips = 0
      let profitLoss = 0

      if (formData.positionType === 'buy') {
        pips = (exitPrice - entryPrice) * 10000 // Convert to pips
        profitLoss = pips * lotSize * 10 // Assuming $10 per pip
      } else {
        pips = (entryPrice - exitPrice) * 10000 // Convert to pips
        profitLoss = pips * lotSize * 10 // Assuming $10 per pip
      }

      const totalValue = 10000 + profitLoss // Assuming $10,000 account
      const profitLossPercent = (profitLoss / 10000) * 100

      setResults({
        pips: Math.round(pips * 100) / 100,
        profitLoss: Math.round(profitLoss * 100) / 100,
        profitLossPercent: Math.round(profitLossPercent * 100) / 100,
        totalValue: Math.round(totalValue * 100) / 100
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
            Profit & Loss Calculator
          </CardTitle>
          <CardDescription>
            Calculate potential profits and losses for your forex positions
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
                <Label htmlFor="entryPrice">Entry Price</Label>
                <Input
                  id="entryPrice"
                  type="number"
                  step="0.00001"
                  placeholder="1.1700"
                  value={formData.entryPrice}
                  onChange={(e) => handleInputChange('entryPrice', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="exitPrice">Exit Price</Label>
                <Input
                  id="exitPrice"
                  type="number"
                  step="0.00001"
                  placeholder="1.1750"
                  value={formData.exitPrice}
                  onChange={(e) => handleInputChange('exitPrice', e.target.value)}
                />
              </div>

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
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="positionType">Position Type</Label>
                <Select
                  value={formData.positionType}
                  onValueChange={(value) => handleInputChange('positionType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Buy (Long)</SelectItem>
                    <SelectItem value="sell">Sell (Short)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                onClick={calculateProfitLoss} 
                className="w-full"
                disabled={!formData.entryPrice || !formData.exitPrice || !formData.lotSize}
              >
                Calculate Profit/Loss
              </Button>
            </div>
          </div>

          {/* Results */}
          {results && (
            <Card className={`${results.profitLoss >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <CardHeader>
                <CardTitle className={results.profitLoss >= 0 ? 'text-green-800' : 'text-red-800'}>
                  {results.profitLoss >= 0 ? 'Profit Calculation' : 'Loss Calculation'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg border border-current">
                    <BarChart3 className={`h-6 w-6 mx-auto mb-2 ${results.pips >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                    <div className={`text-2xl font-bold ${results.pips >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {results.pips >= 0 ? '+' : ''}{results.pips}
                    </div>
                    <div className={`text-sm ${results.pips >= 0 ? 'text-green-600' : 'text-red-600'}`}>Pips</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border border-current">
                    {results.profitLoss >= 0 ? (
                      <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-red-600 mx-auto mb-2" />
                    )}
                    <div className={`text-2xl font-bold ${results.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {results.profitLoss >= 0 ? '+' : ''}${results.profitLoss}
                    </div>
                    <div className={`text-sm ${results.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {results.profitLoss >= 0 ? 'Profit' : 'Loss'}
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border border-current">
                    <DollarSign className={`h-6 w-6 mx-auto mb-2 ${results.profitLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                    <div className={`text-2xl font-bold ${results.profitLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {results.profitLossPercent >= 0 ? '+' : ''}{results.profitLossPercent}%
                    </div>
                    <div className={`text-sm ${results.profitLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Return %
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border border-current">
                    <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      ${results.totalValue}
                    </div>
                    <div className="text-sm text-blue-600">Total Value</div>
                  </div>
                </div>

                {/* Position Analysis */}
                <div className="mt-6 p-4 bg-white rounded-lg border border-current">
                  <h4 className="font-semibold mb-2">Position Analysis</h4>
                  <div className="text-sm space-y-1">
                    <p>• Position Type: <span className="font-medium">{formData.positionType === 'buy' ? 'Long (Buy)' : 'Short (Sell)'}</span></p>
                    <p>• Entry Price: <span className="font-medium">{formData.entryPrice}</span></p>
                    <p>• Exit Price: <span className="font-medium">{formData.exitPrice}</span></p>
                    <p>• Price Movement: <span className="font-medium">{Math.abs(parseFloat(formData.exitPrice) - parseFloat(formData.entryPrice)).toFixed(5)}</span></p>
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
