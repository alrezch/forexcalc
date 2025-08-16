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

const ProfitLossCalculator = () => {
  const [formData, setFormData] = useState({
    instrument: 'EURUSD',
    forex: true,
    crypto: true,
    positionDirection: 'buy',
    openPrice: 1.17071,
    closePrice: 1.17871,
    depositCurrency: 'AUD',
    tradeSize: 1,
    tradeSizeType: 'lots',
    audUsdPrice: 0.6506,
    unitsPerLot: 100000
  });

  const [results, setResults] = useState({
    profitLoss: '----'
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
    const { positionDirection, openPrice, closePrice, tradeSize, audUsdPrice, unitsPerLot } = formData;
    
    // Calculate profit/loss
    let priceDifference;
    if (positionDirection === 'buy') {
      priceDifference = closePrice - openPrice;
    } else {
      priceDifference = openPrice - closePrice;
    }
    
    // Convert to deposit currency
    const profitLossInDepositCurrency = (priceDifference * tradeSize * unitsPerLot) / audUsdPrice;
    
    setResults({
      profitLoss: `$${profitLossInDepositCurrency.toFixed(2)}`
    });
  };

  return (
    <CalculatorContainer>
      <Title>Manage Risk In Every Trade</Title>
      <Description>
        The ePlanet profit and loss calculator can help you plan potential profits and losses so that you can calculate the potential outcome for each of your positions and enter trades considering your risk management.
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
            <Label>Position Direction</Label>
            <Select 
              value={formData.positionDirection}
              onChange={(e) => handleInputChange('positionDirection', e.target.value)}
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </Select>
          </InputGroup>

          <InputGroup>
            <Label>Open Price</Label>
            <Input
              type="number"
              value={formData.openPrice}
              onChange={(e) => handleInputChange('openPrice', parseFloat(e.target.value))}
              step="0.00001"
            />
          </InputGroup>

          <InputGroup>
            <Label>Close Price</Label>
            <Input
              type="number"
              value={formData.closePrice}
              onChange={(e) => handleInputChange('closePrice', parseFloat(e.target.value))}
              step="0.00001"
            />
          </InputGroup>

          <CalculateButton onClick={calculate}>Calculate</CalculateButton>
        </FormSection>

        <FormSection>
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
            <Label>AUD/USD Price</Label>
            <Input
              type="number"
              value={formData.audUsdPrice}
              onChange={(e) => handleInputChange('audUsdPrice', parseFloat(e.target.value))}
              step="0.0001"
            />
            <UpdateButton onClick={updatePrices} disabled={isUpdating}>
              Update Prices {isUpdating ? '...' : '(15)'}
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

      <ResultsContainer>
        <ResultLabel>Profit/Loss</ResultLabel>
        <ResultValue>{results.profitLoss}</ResultValue>
      </ResultsContainer>
    </CalculatorContainer>
  );
};

export default ProfitLossCalculator;
