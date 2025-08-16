'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface NavigationProps {
  activeCalculator: string
  onCalculatorChange: (calculator: 'lot' | 'margin' | 'risk-reward' | 'pip' | 'profit-loss') => void
}

const calculators = [
  { id: 'lot', label: 'Lot Calculator', description: 'Calculate position size and lot values' },
  { id: 'margin', label: 'Margin Calculator', description: 'Calculate required margin and leverage' },
  { id: 'risk-reward', label: 'Risk-Reward Calculator', description: 'Calculate risk-reward ratios' },
  { id: 'pip', label: 'Pip Calculator', description: 'Calculate pip values and costs' },
  { id: 'profit-loss', label: 'Profit & Loss Calculator', description: 'Calculate potential profits and losses' }
]

export function Navigation({ activeCalculator, onCalculatorChange }: NavigationProps) {
  return (
    <nav className="bg-card border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-foreground">Forex Calculator</h1>
            
            <div className="hidden md:flex space-x-1">
              {calculators.map((calculator) => (
                <Button
                  key={calculator.id}
                  variant={activeCalculator === calculator.id ? 'default' : 'ghost'}
                  onClick={() => onCalculatorChange(calculator.id as 'lot' | 'margin' | 'risk-reward' | 'pip' | 'profit-loss')}
                  className={cn(
                    'px-4 py-2 text-sm font-medium transition-colors',
                    activeCalculator === calculator.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {calculator.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden py-4">
          <div className="grid grid-cols-2 gap-2">
            {calculators.map((calculator) => (
              <Card
                key={calculator.id}
                className={cn(
                  'cursor-pointer transition-all hover:shadow-md',
                  activeCalculator === calculator.id && 'ring-2 ring-primary'
                )}
                onClick={() => onCalculatorChange(calculator.id as 'lot' | 'margin' | 'risk-reward' | 'pip' | 'profit-loss')}
              >
                <CardContent className="p-3">
                  <h3 className="font-medium text-sm">{calculator.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {calculator.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
