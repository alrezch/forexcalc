import React, { useState } from 'react';
import styled from 'styled-components';
import Navigation from './components/Navigation';
import LotCalculator from './components/LotCalculator';
import MarginCalculator from './components/MarginCalculator';
import RiskRewardCalculator from './components/RiskRewardCalculator';
import PipCalculator from './components/PipCalculator';
import ProfitLossCalculator from './components/ProfitLossCalculator';
import APIStatus from './components/APIStatus';

const AppContainer = styled.div`
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  background-color: #f8fafc;
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const APISection = styled.div`
  margin-bottom: 30px;
`;

function App() {
  const [activeCalculator, setActiveCalculator] = useState('lot');

  const renderCalculator = () => {
    switch (activeCalculator) {
      case 'lot':
        return <LotCalculator />;
      case 'margin':
        return <MarginCalculator />;
      case 'risk-reward':
        return <RiskRewardCalculator />;
      case 'pip':
        return <PipCalculator />;
      case 'profit-loss':
        return <ProfitLossCalculator />;
      default:
        return <LotCalculator />;
    }
  };

  return (
    <AppContainer>
      <Navigation 
        activeCalculator={activeCalculator} 
        onCalculatorChange={setActiveCalculator} 
      />
      <MainContent>
        <APISection>
          <APIStatus />
        </APISection>
        {renderCalculator()}
      </MainContent>
    </AppContainer>
  );
}

export default App;
