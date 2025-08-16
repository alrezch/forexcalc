'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calculator, TrendingUp, Target, AlertTriangle, BarChart3 } from 'lucide-react'

export function RiskRewardCalculator() {
  const [formData, setFormData] = useState({
    entryPrice: '',
    stopLoss: '',
    takeProfit: '',
    positionSize: ''
  })

  const [results, setResults] = useState<{
    riskAmount: number
    rewardAmount: number
    riskRewardRatio: number
    winRateNeeded: number
  } | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const calculateRiskReward = () => {
    const entryPrice = parseFloat(formData.entryPrice)
    const stopLoss = parseFloat(formData.stopLoss)
    const takeProfit = parseFloat(formData.takeProfit)
    const positionSize = parseFloat(formData.positionSize)

    if (entryPrice && stopLoss && takeProfit && positionSize) {
      const riskPips = Math.abs(entryPrice - stopLoss)
      const rewardPips = Math.abs(takeProfit - entryPrice)
      const riskAmount = riskPips * positionSize * 10 // Assuming $10 per pip
      const rewardAmount = rewardPips * positionSize * 10
      const riskRewardRatio = rewardAmount / riskAmount
      const winRateNeeded = 1 / (1 + riskRewardRatio)

      setResults({
        riskAmount: Math.round(riskAmount * 100) / 100,
        rewardAmount: Math.round(rewardAmount * 100) / 100,
        riskRewardRatio: Math.round(riskRewardRatio * 100) / 100,
        winRateNeeded: Math.round(winRateNeeded * 10000) / 100
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            Risk-Reward Calculator
          </CardTitle>
          <CardDescription>
            Calculate risk-reward ratios and determine optimal position sizing
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
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
                <Label htmlFor="stopLoss">Stop Loss</Label>
                <Input
                  id="stopLoss"
                  type="number"
                  step="0.00001"
                  placeholder="1.1650"
                  value={formData.stopLoss}
                  onChange={(e) => handleInputChange('stopLoss', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="takeProfit">Take Profit</Label>
                <Input
                  id="takeProfit"
                  type="number"
                  step="0.00001"
                  placeholder="1.1800"
                  value={formData.takeProfit}
                  onChange={(e) => handleInputChange('takeProfit', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="positionSize">Position Size (Lots)</Label>
                <Input
                  id="positionSize"
                  type="number"
                  step="0.01"
                  placeholder="0.1"
                  value={formData.positionSize}
                  onChange={(e) => handleInputChange('positionSize', e.target.value)}
                />
              </div>

              <Button 
                onClick={calculateRiskReward} 
                className="w-full"
                disabled={!formData.entryPrice || !formData.stopLoss || !formData.takeProfit || !formData.positionSize}
              >
                Calculate Risk-Reward
              </Button>
            </div>
          </div>

          {/* Results */}
          {results && (
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-800">Risk-Reward Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                    <AlertTriangle className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">
                      ${results.riskAmount}
                    </div>
                    <div className="text-sm text-purple-600">Risk Amount</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                    <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">
                      ${results.rewardAmount}
                    </div>
                    <div className="text-sm text-purple-600">Reward Amount</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                    <BarChart3 className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">
                      {results.riskRewardRatio}:1
                    </div>
                    <div className="text-sm text-purple-600">Risk-Reward Ratio</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                    <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">
                      {results.winRateNeeded}%
                    </div>
                    <div className="text-sm text-purple-600">Win Rate Needed</div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="mt-6 p-4 bg-white rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">Risk Assessment</h4>
                  <div className="space-y-2">
                    {results.riskRewardRatio >= 2 && (
                      <div className="flex items-center gap-2 text-green-600">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Excellent risk-reward ratio (≥2:1)</span>
                      </div>
                    )}
                    {results.riskRewardRatio >= 1.5 && results.riskRewardRatio < 2 && (
                      <div className="flex items-center gap-2 text-yellow-600">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Good risk-reward ratio (≥1.5:1)</span>
                      </div>
                    )}
                    {results.riskRewardRatio < 1.5 && (
                      <div className="flex items-center gap-2 text-red-600">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Poor risk-reward ratio (&lt;1.5:1)</span>
                      </div>
                    )}
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
