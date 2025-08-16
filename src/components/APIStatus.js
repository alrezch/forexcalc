import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAPIStatus } from '../services/api';

const StatusContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #8b5cf6;
`;

const StatusTitle = styled.h3`
  color: #374151;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 600;
`;

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
`;

const APIStatusCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 15px;
  background: ${props => {
    switch (props.status) {
      case 'active': return '#f0fdf4';
      case 'limited': return '#fef3c7';
      case 'error': return '#fef2f2';
      case 'disabled': return '#f3f4f6';
      default: return '#f9fafb';
    }
  }};
  border-left: 4px solid ${props => {
    switch (props.status) {
      case 'active': return '#22c55e';
      case 'limited': return '#f59e0b';
      case 'error': return '#ef4444';
      case 'disabled': return '#6b7280';
      default: return '#d1d5db';
    }
  }};
`;

const APIHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const APIName = styled.span`
  font-weight: 600;
  color: #374151;
  font-size: 14px;
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  color: white;
  background: ${props => {
    switch (props.status) {
      case 'active': return '#22c55e';
      case 'limited': return '#f59e0b';
      case 'error': return '#ef4444';
      case 'disabled': return '#6b7280';
      default: return '#9ca3af';
    }
  }};
`;

const StatusDetails = styled.div`
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
`;

const RefreshButton = styled.button`
  background: #8b5cf6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  margin-top: 10px;
  
  &:hover {
    background: #7c3aed;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const APIStatus = () => {
  const [apiStatuses, setApiStatuses] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const checkAPIStatus = async () => {
    setIsLoading(true);
    try {
      const statuses = await getAPIStatus();
      setApiStatuses(statuses);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to check API status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAPIStatus();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return '✅';
      case 'limited': return '⚠️';
      case 'error': return '❌';
      case 'disabled': return '🚫';
      default: return '❓';
    }
  };

  return (
    <StatusContainer>
      <StatusTitle>
        API Status Dashboard
        {lastUpdated && (
          <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'normal', marginLeft: '10px' }}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </StatusTitle>
      
      <StatusGrid>
        {Object.entries(apiStatuses).map(([apiName, status]) => (
          <APIStatusCard key={apiName} status={status.status}>
            <APIHeader>
              <APIName>{apiName.replace('_', ' ')}</APIName>
              <StatusBadge status={status.status}>
                {status.status}
              </StatusBadge>
            </APIHeader>
            
            <StatusDetails>
              <div>{getStatusIcon(status.status)} {status.message}</div>
              <div>Free Tier: {status.freeTierLimit || 'N/A'} calls</div>
              <div>Remaining: {status.remainingCalls}</div>
            </StatusDetails>
          </APIStatusCard>
        ))}
      </StatusGrid>
      
      <RefreshButton onClick={checkAPIStatus} disabled={isLoading}>
        {isLoading ? 'Checking...' : 'Refresh Status'}
      </RefreshButton>
      
      {Object.keys(apiStatuses).length === 0 && (
        <div style={{ textAlign: 'center', color: '#6b7280', marginTop: '20px' }}>
          No API status information available
        </div>
      )}
    </StatusContainer>
  );
};

export default APIStatus;
