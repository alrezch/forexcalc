import React, { useState } from 'react';
import styled from 'styled-components';

const CalculatorContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #3b82f6;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 15px;
  text-align: center;
`;

const Description = styled.p`
  color: #64748b;
  text-align: center;
  margin-bottom: 30px;
  line-height: 1.6;
`;

const CalculatorForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  align-items: center;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 300px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 14px;
  text-align: center;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  
  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }
`;

const AdjustButton = styled.button`
  background: #8b5cf6;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: #7c3aed;
  }
`;

const CalculateButton = styled.button`
  background: #8b5cf6;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
  
  &:hover {
    background: #7c3aed;
  }
`;

const ResultsContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const ResultLabel = styled.div`
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const ResultValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #8b5cf6;
  padding: 15px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RiskRewardCalculator = () => {
  const [formData, setFormData] = useState({
    riskRewardRatio: 1
  });

  const [results, setResults] = useState({
    winRateBreakeven: '----'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const adjustRatio = (direction) => {
    const currentRatio = formData.riskRewardRatio;
    const newRatio = direction === 'up' ? currentRatio + 0.1 : currentRatio - 0.1;
    
    if (newRatio > 0) {
      setFormData(prev => ({
        ...prev,
        riskRewardRatio: Math.round(newRatio * 10) / 10
      }));
    }
  };

  const calculate = () => {
    const { riskRewardRatio } = formData;
    
    // Calculate win rate breakeven
    // Win Rate = Risk / (Risk + Reward) × 100
    const winRate = (1 / (1 + riskRewardRatio)) * 100;
    
    setResults({
      winRateBreakeven: `${winRate.toFixed(1)}%`
    });
  };

  return (
    <CalculatorContainer>
      <Title>Take The Quality Of Your Trade To A New Level</Title>
      <Description>
        The ePlanet risk-reward ratio calculator emerges as an essential tool for traders alike, offering a clear insight into the potential risks and rewards associated with their investment decisions, thereby empowering investors with the knowledge to make more informed choices.
      </Description>
      
      <CalculatorForm>
        <InputGroup>
          <Label>Risk/Reward Ratio</Label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px', fontWeight: '600' }}>1:</span>
            <Input
              type="number"
              value={formData.riskRewardRatio}
              onChange={(e) => handleInputChange('riskRewardRatio', parseFloat(e.target.value))}
              step="0.1"
              min="0.1"
            />
          </div>
        </InputGroup>

        <AdjustButton onClick={() => adjustRatio('up')}>
          ↑↓ Adjust
        </AdjustButton>

        <InputGroup>
          <Label>Win Rate Breakeven</Label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Input
              type="text"
              value={results.winRateBreakeven}
              readOnly
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: '18px', fontWeight: '600' }}>%</span>
          </div>
        </InputGroup>

        <CalculateButton onClick={calculate}>Calculate</CalculateButton>
      </CalculatorForm>

      <ResultsContainer>
        <ResultLabel>Win Rate Breakeven</ResultLabel>
        <ResultValue>{results.winRateBreakeven}</ResultValue>
      </ResultsContainer>
    </CalculatorContainer>
  );
};

export default RiskRewardCalculator;
