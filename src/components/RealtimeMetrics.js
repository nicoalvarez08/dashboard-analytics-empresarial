import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiActivity, FiClock, FiTrendingUp } from 'react-icons/fi';
import { Card } from '../styles/GlobalStyle';

const RealtimeContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const RealtimeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RealtimeTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;

  svg {
    color: ${props => props.theme.colors.success};
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const StatusDot = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: ${props => props.isActive ? props.theme.colors.success : props.theme.colors.error};
  animation: ${props => props.isActive ? 'pulse 2s infinite' : 'none'};
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const MetricCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: ${props => props.theme.colors.surfaceHover};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
`;

const MetricHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MetricLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const MetricTime = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textMuted};
`;

const MetricValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const MetricChange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: ${props => {
    const change = parseFloat(props.change);
    if (change > 0) return props.theme.colors.success;
    if (change < 0) return props.theme.colors.error;
    return props.theme.colors.textSecondary;
  }};
`;

const ActivityFeed = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  transition: background-color ${props => props.theme.transitions.fast};

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: ${props => {
    switch (props.type) {
      case 'sale': return `${props.theme.colors.success}15`;
      case 'user': return `${props.theme.colors.primary}15`;
      case 'revenue': return `${props.theme.colors.warning}15`;
      default: return `${props.theme.colors.secondary}15`;
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'sale': return props.theme.colors.success;
      case 'user': return props.theme.colors.primary;
      case 'revenue': return props.theme.colors.warning;
      default: return props.theme.colors.secondary;
    }
  }};
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const ActivityTime = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textMuted};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

const RealtimeMetrics = ({ data = [] }) => {
  const [isActive, setIsActive] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Actualizar tiempo cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simular actividad en tiempo real
  useEffect(() => {
    const activityTimer = setInterval(() => {
      setIsActive(prev => !prev);
    }, 3000);

    return () => clearInterval(activityTimer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatRelativeTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return 'hace un momento';
    if (seconds < 3600) return `hace ${Math.floor(seconds / 60)} min`;
    return `hace ${Math.floor(seconds / 3600)}h`;
  };

  const getActivityIcon = (metric) => {
    switch (metric) {
      case 'sales': return 'sale';
      case 'users': return 'user';
      case 'revenue': return 'revenue';
      default: return 'activity';
    }
  };

  const getActivityText = (item) => {
    switch (item.metric) {
      case 'sales':
        return `Nueva venta registrada: ${item.value} unidades`;
      case 'users':
        return `Nuevo usuario registrado`;
      case 'revenue':
        return `Ingreso registrado: $${item.value.toLocaleString()}`;
      case 'traffic':
        return `Pico de tráfico: ${item.value} visitas`;
      default:
        return `Nueva métrica ${item.metric}: ${item.value}`;
    }
  };

  // Datos de ejemplo para métricas en tiempo real
  const realtimeMetrics = [
    { label: 'Ventas Hoy', value: '1,247', change: '+12.5%' },
    { label: 'Usuarios Online', value: '2,891', change: '+5.2%' },
    { label: 'Ingresos Hoy', value: '$45,230', change: '+8.7%' },
    { label: 'Conversiones', value: '3.2%', change: '+0.8%' }
  ];

  return (
    <RealtimeContainer>
      <RealtimeHeader>
        <RealtimeTitle>
          <FiActivity />
          Métricas en Tiempo Real
        </RealtimeTitle>
        <StatusIndicator>
          <StatusDot isActive={isActive} />
          <span>{isActive ? 'Activo' : 'Inactivo'}</span>
          <FiClock />
          <span>{formatTime(currentTime)}</span>
        </StatusIndicator>
      </RealtimeHeader>

      <MetricsGrid>
        {realtimeMetrics.map((metric, index) => (
          <MetricCard key={index}>
            <MetricHeader>
              <MetricLabel>{metric.label}</MetricLabel>
              <MetricTime>Ahora</MetricTime>
            </MetricHeader>
            <MetricValue>{metric.value}</MetricValue>
            <MetricChange change={metric.change}>
              <FiTrendingUp />
              {metric.change}
            </MetricChange>
          </MetricCard>
        ))}
      </MetricsGrid>

      <div>
        <h4 style={{ margin: '0 0 1rem 0', color: '#64748b' }}>Actividad Reciente</h4>
        <ActivityFeed>
          {data.length > 0 ? (
            data.slice(0, 10).map((item, index) => (
              <ActivityItem key={index}>
                <ActivityIcon type={getActivityIcon(item.metric)}>
                  <FiActivity />
                </ActivityIcon>
                <ActivityContent>
                  <ActivityText>
                    {getActivityText(item)}
                  </ActivityText>
                  <ActivityTime>
                    {formatRelativeTime(item.timestamp || new Date())}
                  </ActivityTime>
                </ActivityContent>
              </ActivityItem>
            ))
          ) : (
            <EmptyState>
              <FiActivity size={48} />
              <p>No hay actividad reciente</p>
              <small>Las métricas en tiempo real aparecerán aquí</small>
            </EmptyState>
          )}
        </ActivityFeed>
      </div>
    </RealtimeContainer>
  );
};

export default RealtimeMetrics;
