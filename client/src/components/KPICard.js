import React from 'react';
import styled from 'styled-components';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { Card } from '../styles/GlobalStyle';

const KPICardContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => {
      switch (props.color) {
        case 'success': return props.theme.colors.success;
        case 'warning': return props.theme.colors.warning;
        case 'error': return props.theme.colors.error;
        default: return props.theme.colors.primary;
      }
    }};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const CardInfo = styled.div`
  flex: 1;
`;

const CardTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 0.5rem 0;
`;

const CardValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  line-height: 1;
`;

const CardIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => {
    switch (props.color) {
      case 'success': return `${props.theme.colors.success}15`;
      case 'warning': return `${props.theme.colors.warning}15`;
      case 'error': return `${props.theme.colors.error}15`;
      default: return `${props.theme.colors.primary}15`;
    }
  }};
  color: ${props => {
    switch (props.color) {
      case 'success': return props.theme.colors.success;
      case 'warning': return props.theme.colors.warning;
      case 'error': return props.theme.colors.error;
      default: return props.theme.colors.primary;
    }
  }};

  svg {
    font-size: 1.5rem;
  }
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChangeIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => {
    const change = parseFloat(props.change);
    if (change > 0) return props.theme.colors.success;
    if (change < 0) return props.theme.colors.error;
    return props.theme.colors.textSecondary;
  }};
`;

const ChangeText = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textMuted};
`;

const KPICard = ({ title, value, change, icon: Icon, color = 'primary' }) => {
  const isPositive = parseFloat(change) > 0;
  const isNegative = parseFloat(change) < 0;

  return (
    <KPICardContainer color={color}>
      <CardHeader>
        <CardInfo>
          <CardTitle>{title}</CardTitle>
          <CardValue>{value}</CardValue>
        </CardInfo>
        <CardIcon color={color}>
          <Icon />
        </CardIcon>
      </CardHeader>
      
      <CardFooter>
        <ChangeIndicator change={change}>
          {isPositive && <FiTrendingUp />}
          {isNegative && <FiTrendingDown />}
          {Math.abs(change)}%
        </ChangeIndicator>
        <ChangeText>
          vs mes anterior
        </ChangeText>
      </CardFooter>
    </KPICardContainer>
  );
};

export default KPICard;
