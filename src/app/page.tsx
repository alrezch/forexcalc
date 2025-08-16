'use client'

import { useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { APIStatus } from '@/components/APIStatus'
import { LotCalculator } from '@/components/calculators/LotCalculator'
import { MarginCalculator } from '@/components/calculators/MarginCalculator'
import { RiskRewardCalculator } from '@/components/calculators/RiskRewardCalculator'
import { PipCalculator } from '@/components/calculators/PipCalculator'
import { ProfitLossCalculator } from '@/components/calculators/ProfitLossCalculator'

export default function Home() {
  const [activeCalculator, setActiveCalculator] = useState<'lot' | 'margin' | 'risk-reward' | 'pip' | 'profit-loss'>('lot')

  const renderCalculator = () => {
    switch (activeCalculator) {
      case 'lot':
        return <LotCalculator />
      case 'margin':
        return <MarginCalculator />
      case 'risk-reward':
        return <RiskRewardCalculator />
      case 'pip':
        return <PipCalculator />
      case 'profit-loss':
        return <ProfitLossCalculator />
      default:
        return <LotCalculator />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        activeCalculator={activeCalculator} 
        onCalculatorChange={setActiveCalculator} 
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <APIStatus />
        </div>
        
        {renderCalculator()}
      </main>
    </div>
  )
}
