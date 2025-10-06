import React, { useEffect } from 'react';
import { useDashboard } from '../contexts/DashboardContext';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { 
  FiTrendingUp, 
  FiUsers, 
  FiDollarSign, 
  FiShoppingCart,
  FiActivity,
  FiRefreshCw
} from 'react-icons/fi';
import { Card, Button, LoadingSpinner } from '../styles/GlobalStyle';
import KPICard from '../components/KPICard';
import ChartCard from '../components/ChartCard';
import AdvancedChart from '../components/AdvancedChart';
import RealtimeMetrics from '../components/RealtimeMetrics';
import ExportReports from '../components/ExportReports';
import NotificationSystem, { useNotifications, showSuccess, showError } from '../components/NotificationSystem';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0.5rem 0 0 0;
`;

const RefreshButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RealtimeSection = styled.div`
  margin-top: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

const Dashboard = () => {
  const { 
    overview, 
    charts, 
    realtimeData, 
    loading, 
    error,
    fetchOverview, 
    fetchChartData,
    fetchRealtimeData,
    clearError 
  } = useDashboard();
  
  const { user } = useAuth();
  const { notifications, addNotification, removeNotification } = useNotifications();

  useEffect(() => {
    // Los datos se cargan automáticamente en el contexto
    // Solo necesitamos limpiar errores si los hay
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  const handleRefresh = () => {
    showSuccess(addNotification)('Actualizando', 'Refrescando datos del dashboard...');
    
    fetchOverview();
    fetchRealtimeData();
    
    // Refrescar gráficos principales
    const mainMetrics = ['sales', 'users', 'revenue', 'traffic'];
    mainMetrics.forEach(metric => {
      fetchChartData(metric, { days: 30 });
    });
    
    setTimeout(() => {
      showSuccess(addNotification)('Actualizado', 'Datos del dashboard actualizados correctamente');
    }, 1000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('es-AR').format(num);
  };

  if (loading.overview) {
    return (
      <LoadingContainer>
        <LoadingSpinner size="40px" />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <h3>Error cargando el dashboard</h3>
        <p>{error}</p>
        <Button onClick={handleRefresh} variant="primary">
          Reintentar
        </Button>
      </ErrorContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <div>
          <Title>Dashboard de Analytics</Title>
          <Subtitle>
            Bienvenido, {user?.name}. Aquí tienes un resumen de tus métricas empresariales.
          </Subtitle>
        </div>
        <RefreshButton onClick={handleRefresh} variant="secondary">
          <FiRefreshCw />
          Actualizar
        </RefreshButton>
      </DashboardHeader>

      {/* KPIs Principales */}
      <KPIGrid>
        <KPICard
          title="Ingresos Totales"
          value={formatCurrency(overview?.kpis?.totalRevenue || 0)}
          change={overview?.growth?.revenue || 0}
          icon={FiDollarSign}
          color="success"
        />
        <KPICard
          title="Usuarios Activos"
          value={formatNumber(overview?.kpis?.totalUsers || 0)}
          change={overview?.growth?.users || 0}
          icon={FiUsers}
          color="primary"
        />
        <KPICard
          title="Ventas Totales"
          value={formatNumber(overview?.kpis?.totalSales || 0)}
          change={5.2}
          icon={FiShoppingCart}
          color="warning"
        />
        <KPICard
          title="Tasa de Conversión"
          value={`${(overview?.kpis?.conversionRate || 0).toFixed(1)}%`}
          change={2.1}
          icon={FiTrendingUp}
          color="error"
        />
      </KPIGrid>

      {/* Gráficos */}
      <ChartsGrid>
        <ChartCard
          title="Ventas por Día"
          metric="sales"
          data={charts.sales}
          type="line"
          color="#3b82f6"
        />
        <ChartCard
          title="Usuarios Registrados"
          metric="users"
          data={charts.users}
          type="bar"
          color="#10b981"
        />
        <ChartCard
          title="Ingresos Mensuales"
          metric="revenue"
          data={charts.revenue}
          type="area"
          color="#f59e0b"
        />
        <ChartCard
          title="Tráfico Web"
          metric="traffic"
          data={charts.traffic}
          type="line"
          color="#ef4444"
        />
      </ChartsGrid>

      {/* Métricas en Tiempo Real */}
      <RealtimeSection>
        <RealtimeMetrics data={realtimeData} />
      </RealtimeSection>

      {/* Exportación de Reportes */}
      <RealtimeSection>
        <ExportReports dashboardData={{ overview, charts, realtimeData }} />
      </RealtimeSection>

      {/* Sistema de Notificaciones */}
      <NotificationSystem 
        notifications={notifications}
        onRemove={removeNotification}
      />
    </DashboardContainer>
  );
};

export default Dashboard;
