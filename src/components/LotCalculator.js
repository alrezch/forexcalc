import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchExchangeRate } from '../services/api';

const CalculatorContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  max-width: 800px;
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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  margin-bottom: 30px;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoIcon = styled.span`
  color: #6b7280;
  font-size: 12px;
  cursor: help;
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const Checkbox = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  
  input {
    width: 18px;
    height: 18px;
    accent-color: #8b5cf6;
  }
  
  span {
    font-size: 14px;
    color: #374151;
  }
`;

const ToggleGroup = styled.div`
  display: flex;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: 12px;
  border: none;
  background: ${props => props.active ? '#8b5cf6' : '#f9fafb'};
  color: ${props => props.active ? 'white' : '#6b7280'};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? '#8b5cf6' : '#f3f4f6'};
  }
`;

const UpdateButton = styled.button`
  background: #8b5cf6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  margin-top: 5px;
  
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
  margin-bottom: 20px;
  
  &:hover {
    background: #7c3aed;
  }
`;

const ResultsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const ResultItem = styled.div`
  text-align: center;
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

const LotCalculator = () => {
  const [formData, setFormData] = useState({
    instrument: 'EURUSD',
    forex: true,
    crypto: true,
    depositCurrency: 'AUD',
    accountBalance: 1000,
    risk: 2,
    riskType: '%',
    stopLoss: 80,
    stopLossType: 'pips',
    audUsdPrice: 0.6506,
    unitsPerLot: 100000,
    pipValue: 0.0001
  });

  const [results, setResults] = useState({
    positionSize: '----',
    moneyAtRisk: '----'
  });

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Fetch initial exchange rate
    updatePrices();
  }, []);

  const updatePrices = async () => {
    setIsUpdating(true);
    try {
      const rate = await fetchExchangeRate('AUD', 'USD');
      setFormData(prev => ({
        ...prev,
        audUsdPrice: rate
      }));
    } catch (error) {
      console.error('Failed to update prices:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculate = () => {
    const { accountBalance, risk, stopLoss, audUsdPrice, unitsPerLot, pipValue } = formData;
    
    // Calculate money at risk
    const moneyAtRisk = (accountBalance * risk) / 100;
    
    // Calculate position size in lots
    const stopLossInPrice = stopLoss * pipValue;
    const positionSize = moneyAtRisk / (stopLossInPrice * unitsPerLot);
    
    setResults({
      positionSize: positionSize.toFixed(4),
      moneyAtRisk: `$${moneyAtRisk.toFixed(2)}`
    });
  };

  return (
    <CalculatorContainer>
      <Title>Determine Your Position Size</Title>
      <Description>
        The ePlanet lot calculation machine calculates the desired lot amount. It helps traders to know before entering their position that based on their balance and determined risk percentage, what volume of their capital to enter the trade.
      </Description>
      
      <FormGrid>
        <FormSection>
          <InputGroup>
            <Label>Instrument</Label>
            <Select 
              value={formData.instrument}
              onChange={(e) => handleInputChange('instrument', e.target.value)}
            >
              <option value="EURUSD">EURUSD</option>
              <option value="GBPUSD">GBPUSD</option>
              <option value="USDJPY">USDJPY</option>
              <option value="AUDUSD">AUDUSD</option>
            </Select>
            <CheckboxGroup>
              <Checkbox>
                <input
                  type="checkbox"
                  checked={formData.forex}
                  onChange={(e) => handleInputChange('forex', e.target.checked)}
                />
                <span>Forex</span>
              </Checkbox>
              <Checkbox>
                <input
                  type="checkbox"
                  checked={formData.crypto}
                  onChange={(e) => handleInputChange('crypto', e.target.checked)}
                />
                <span>Crypto</span>
              </Checkbox>
            </CheckboxGroup>
          </InputGroup>

          <InputGroup>
            <Label>Deposit Currency <InfoIcon>ⓘ</InfoIcon></Label>
            <Select 
              value={formData.depositCurrency}
              onChange={(e) => handleInputChange('depositCurrency', e.target.value)}
            >
              <option value="AUD">AUD</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </Select>
          </InputGroup>

          <InputGroup>
            <Label>Account Balance</Label>
            <Input
              type="number"
              value={formData.accountBalance}
              onChange={(e) => handleInputChange('accountBalance', parseFloat(e.target.value))}
            />
          </InputGroup>

          <InputGroup>
            <Label>Risk</Label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Input
                type="number"
                value={formData.risk}
                onChange={(e) => handleInputChange('risk', parseFloat(e.target.value))}
                style={{ flex: 1 }}
              />
              <Select 
                value={formData.riskType}
                onChange={(e) => handleInputChange('riskType', e.target.value)}
                style={{ width: '80px' }}
              >
                <option value="%">%</option>
                <option value="$">$</option>
              </Select>
            </div>
          </InputGroup>
        </FormSection>

        <FormSection>
          <InputGroup>
            <Label>Stop Loss (Pips)</Label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Input
                type="number"
                value={formData.stopLoss}
                onChange={(e) => handleInputChange('stopLoss', parseFloat(e.target.value))}
                style={{ flex: 1 }}
              />
              <ToggleGroup>
                <ToggleButton
                  active={formData.stopLossType === 'pips'}
                  onClick={() => handleInputChange('stopLossType', 'pips')}
                >
                  Pips
                </ToggleButton>
                <ToggleButton
                  active={formData.stopLossType === 'price'}
                  onClick={() => handleInputChange('stopLossType', 'price')}
                >
                  Price
                </ToggleButton>
              </ToggleGroup>
            </div>
          </InputGroup>

          <InputGroup>
            <Label>AUD/USD Price</Label>
            <Input
              type="number"
              value={formData.audUsdPrice}
              onChange={(e) => handleInputChange('audUsdPrice', parseFloat(e.target.value))}
              step="0.0001"
            />
            <UpdateButton onClick={updatePrices} disabled={isUpdating}>
              Update Prices {isUpdating ? '...' : '(5)'}
            </UpdateButton>
          </InputGroup>

          <InputGroup>
            <Label>Units of 1 Lot</Label>
            <Input
              type="number"
              value={formData.unitsPerLot}
              onChange={(e) => handleInputChange('unitsPerLot', parseFloat(e.target.value))}
            />
          </InputGroup>

          <InputGroup>
            <Label>1 Pips</Label>
            <Input
              type="number"
              value={formData.pipValue}
              onChange={(e) => handleInputChange('pipValue', parseFloat(e.target.value))}
              step="0.0001"
            />
          </InputGroup>
        </FormSection>
      </FormGrid>

      <CalculateButton onClick={calculate}>Calculate</CalculateButton>

      <ResultsContainer>
        <ResultItem>
          <ResultLabel>Position Size</ResultLabel>
          <ResultValue>{results.positionSize}</ResultValue>
        </ResultItem>
        <ResultItem>
          <ResultLabel>Money at Risk</ResultLabel>
          <ResultValue>{results.moneyAtRisk}</ResultValue>
        </ResultItem>
      </ResultsContainer>
    </CalculatorContainer>
  );
};

export default LotCalculator;
