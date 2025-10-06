import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiActivity, 
  FiUser, 
  FiShoppingCart, 
  FiDollarSign,
  FiSettings,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiFilter,
  FiSearch
} from 'react-icons/fi';

const ActivityContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 500;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
    transform: translateY(-1px);
  }
`;

const ActivityGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ActivityFeed = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
`;

const FeedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const FeedTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  width: 200px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActivityItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }
`;

const ActivityIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.color || props.theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color || props.theme.colors.primary};
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const ActivityDescription = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const ActivityTime = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.75rem;
`;

const ActivityStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${props => props.color || props.theme.colors.textSecondary};
`;

const StatsPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const StatsCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
`;

const StatsTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 1rem 0;
`;

const StatsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const StatValue = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const Activity = () => {
  const [activities] = useState([
    {
      id: 1,
      type: 'sale',
      title: 'Nueva venta registrada',
      description: 'Venta de $1,250 por Juan Pérez',
      time: 'Hace 5 minutos',
      icon: FiShoppingCart,
      color: '#10b981',
      status: 'success'
    },
    {
      id: 2,
      type: 'user',
      title: 'Usuario registrado',
      description: 'María García se registró en la plataforma',
      time: 'Hace 12 minutos',
      icon: FiUser,
      color: '#3b82f6',
      status: 'info'
    },
    {
      id: 3,
      type: 'payment',
      title: 'Pago procesado',
      description: 'Pago de $500 procesado exitosamente',
      time: 'Hace 25 minutos',
      icon: FiDollarSign,
      color: '#10b981',
      status: 'success'
    },
    {
      id: 4,
      type: 'system',
      title: 'Configuración actualizada',
      description: 'Configuración del sistema actualizada por admin',
      time: 'Hace 1 hora',
      icon: FiSettings,
      color: '#f59e0b',
      status: 'warning'
    },
    {
      id: 5,
      type: 'alert',
      title: 'Alerta del sistema',
      description: 'Alto tráfico detectado en el servidor',
      time: 'Hace 2 horas',
      icon: FiAlertCircle,
      color: '#ef4444',
      status: 'error'
    },
    {
      id: 6,
      type: 'success',
      title: 'Backup completado',
      description: 'Backup automático completado exitosamente',
      time: 'Hace 3 horas',
      icon: FiCheckCircle,
      color: '#10b981',
      status: 'success'
    }
  ]);

  const [stats] = useState({
    today: {
      sales: 24,
      users: 156,
      revenue: 12500,
      alerts: 3
    },
    week: {
      sales: 189,
      users: 1245,
      revenue: 89500,
      alerts: 12
    }
  });

  return (
    <ActivityContainer>
      <PageHeader>
        <Title>Actividad del Sistema</Title>
        <HeaderActions>
          <ActionButton>
            <FiFilter />
            Filtros
          </ActionButton>
          <ActionButton>
            <FiSearch />
            Buscar
          </ActionButton>
        </HeaderActions>
      </PageHeader>

      <ActivityGrid>
        <ActivityFeed>
          <FeedHeader>
            <FeedTitle>Actividad Reciente</FeedTitle>
            <SearchInput placeholder="Buscar actividad..." />
          </FeedHeader>
          
          <ActivityList>
            {activities.map((activity) => (
              <ActivityItem key={activity.id}>
                <ActivityIcon color={activity.color}>
                  <activity.icon />
                </ActivityIcon>
                <ActivityContent>
                  <ActivityTitle>{activity.title}</ActivityTitle>
                  <ActivityDescription>{activity.description}</ActivityDescription>
                  <ActivityTime>{activity.time}</ActivityTime>
                </ActivityContent>
                <ActivityStatus color={activity.color}>
                  {activity.status === 'success' && <FiCheckCircle />}
                  {activity.status === 'error' && <FiAlertCircle />}
                  {activity.status === 'warning' && <FiClock />}
                  {activity.status === 'info' && <FiActivity />}
                </ActivityStatus>
              </ActivityItem>
            ))}
          </ActivityList>
        </ActivityFeed>

        <StatsPanel>
          <StatsCard>
            <StatsTitle>Hoy</StatsTitle>
            <StatsList>
              <StatItem>
                <StatLabel>Ventas</StatLabel>
                <StatValue>{stats.today.sales}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Usuarios</StatLabel>
                <StatValue>{stats.today.users}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Ingresos</StatLabel>
                <StatValue>${stats.today.revenue.toLocaleString()}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Alertas</StatLabel>
                <StatValue>{stats.today.alerts}</StatValue>
              </StatItem>
            </StatsList>
          </StatsCard>

          <StatsCard>
            <StatsTitle>Esta Semana</StatsTitle>
            <StatsList>
              <StatItem>
                <StatLabel>Ventas</StatLabel>
                <StatValue>{stats.week.sales}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Usuarios</StatLabel>
                <StatValue>{stats.week.users}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Ingresos</StatLabel>
                <StatValue>${stats.week.revenue.toLocaleString()}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Alertas</StatLabel>
                <StatValue>{stats.week.alerts}</StatValue>
              </StatItem>
            </StatsList>
          </StatsCard>
        </StatsPanel>
      </ActivityGrid>
    </ActivityContainer>
  );
};

export default Activity;
