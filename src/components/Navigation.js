import React from 'react';
import styled from 'styled-components';

const NavContainer = styled.nav`
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px 0;
`;

const NavItem = styled.button`
  background: ${props => props.active ? '#3b82f6' : 'transparent'};
  color: ${props => props.active ? 'white' : '#64748b'};
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? '#3b82f6' : '#f1f5f9'};
    color: ${props => props.active ? 'white' : '#475569'};
  }
`;

const Navigation = ({ activeCalculator, onCalculatorChange }) => {
  const calculators = [
    { id: 'lot', label: 'Lot Calculator' },
    { id: 'margin', label: 'Margin calculator' },
    { id: 'risk-reward', label: 'Risk-Reward Ratio Calculator' },
    { id: 'pip', label: 'Pip Calculator' },
    { id: 'profit-loss', label: 'Profit and Loss Calculator' }
  ];

  return (
    <NavContainer>
      <NavContent>
        {calculators.map(calculator => (
          <NavItem
            key={calculator.id}
            active={activeCalculator === calculator.id}
            onClick={() => onCalculatorChange(calculator.id)}
          >
            {calculator.label}
          </NavItem>
        ))}
      </NavContent>
    </NavContainer>
  );
};

export default Navigation;
