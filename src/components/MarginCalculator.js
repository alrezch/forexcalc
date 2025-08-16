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

const MarginCalculator = () => {
  const [formData, setFormData] = useState({
    instrument: 'EURUSD',
    forex: true,
    crypto: true,
    depositCurrency: 'AUD',
    leverage: 100,
    tradeSize: 1,
    tradeSizeType: 'lots',
    eurAudPrice: 1.79766,
    unitsPerLot: 100000
  });

  const [results, setResults] = useState({
    requiredMargin: '----'
  });

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Fetch initial exchange rate
    updatePrices();
  }, []);

  const updatePrices = async () => {
    setIsUpdating(true);
    try {
      const rate = await fetchExchangeRate('EUR', 'AUD');
      setFormData(prev => ({
        ...prev,
        eurAudPrice: rate
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
    const { tradeSize, leverage, eurAudPrice, unitsPerLot } = formData;
    
    // Calculate required margin
    // Margin = (Trade Size × Units per Lot × Price) / Leverage
    const requiredMargin = (tradeSize * unitsPerLot * eurAudPrice) / leverage;
    
    setResults({
      requiredMargin: `$${requiredMargin.toFixed(2)}`
    });
  };

  return (
    <CalculatorContainer>
      <Title>Determine Your Required Margin</Title>
      <Description>
        The ePlanet margin calculator automatically calculates the margin required to open a new position to cover trades in your trading account, so you know the size of your trading position and determine the leverage you should use as a result Calculate the required margin for your position relative to your trade volume.
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
            <Label>Leverage</Label>
            <Input
              type="text"
              value={formData.leverage}
              onChange={(e) => handleInputChange('leverage', e.target.value)}
              placeholder="100:1"
            />
          </InputGroup>
        </FormSection>

        <FormSection>
          <InputGroup>
            <Label>Trade Size (Lots)</Label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Input
                type="number"
                value={formData.tradeSize}
                onChange={(e) => handleInputChange('tradeSize', parseFloat(e.target.value))}
                style={{ flex: 1 }}
              />
              <ToggleGroup>
                <ToggleButton
                  active={formData.tradeSizeType === 'lots'}
                  onClick={() => handleInputChange('tradeSizeType', 'lots')}
                >
                  Lots
                </ToggleButton>
                <ToggleButton
                  active={formData.tradeSizeType === 'units'}
                  onClick={() => handleInputChange('tradeSizeType', 'units')}
                >
                  Units
                </ToggleButton>
              </ToggleGroup>
            </div>
          </InputGroup>

          <InputGroup>
            <Label>EUR/AUD Price</Label>
            <Input
              type="number"
              value={formData.eurAudPrice}
              onChange={(e) => handleInputChange('eurAudPrice', parseFloat(e.target.value))}
              step="0.00001"
            />
            <UpdateButton onClick={updatePrices} disabled={isUpdating}>
              Update Prices {isUpdating ? '...' : '(19)'}
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
        </FormSection>
      </FormGrid>

      <CalculateButton onClick={calculate}>Calculate</CalculateButton>

      <ResultsContainer>
        <ResultLabel>Required Margin</ResultLabel>
        <ResultValue>{results.requiredMargin}</ResultValue>
      </ResultsContainer>
    </CalculatorContainer>
  );
};

export default MarginCalculator;
