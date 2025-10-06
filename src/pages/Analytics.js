import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiEye, 
  FiUsers, 
  FiDollarSign,
  FiActivity,
  FiBarChart2,
  FiPieChart,
  FiDownload,
  FiFilter
} from 'react-icons/fi';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsContainer = styled.div`
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

const AnalyticsTitle = styled.h1`
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
  background: ${props => props.primary ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${props => props.primary ? 'white' : props.theme.colors.text};
  border: 1px solid ${props => props.primary ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 500;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    background: ${props => props.primary ? props.theme.colors.primaryDark : props.theme.colors.surfaceHover};
    transform: translateY(-1px);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.color || props.theme.colors.primary};
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const StatIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.color || props.theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color || props.theme.colors.primary};
  font-size: 1.5rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const StatChange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.positive ? '#10b981' : '#ef4444'};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
`;

const ChartTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');

  // Datos de ejemplo para los gráficos
  const trafficData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Usuarios Únicos',
        data: [1200, 1900, 3000, 5000, 2000, 3000],
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f620',
        tension: 0.4,
      },
      {
        label: 'Sesiones',
        data: [800, 1200, 2000, 3500, 1500, 2500],
        borderColor: '#10b981',
        backgroundColor: '#10b98120',
        tension: 0.4,
      }
    ]
  };

  const conversionData = {
    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    datasets: [
      {
        label: 'Conversiones',
        data: [12, 19, 3, 5, 2, 3, 8],
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
          '#06b6d4',
          '#84cc16'
        ],
      }
    ]
  };

  const deviceData = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
        borderWidth: 0,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f3f4f6',
        },
      },
      x: {
        grid: {
          color: '#f3f4f6',
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <AnalyticsContainer>
      <PageHeader>
        <AnalyticsTitle>Analytics Avanzado</AnalyticsTitle>
        <HeaderActions>
          <ActionButton>
            <FiFilter />
            Filtros
          </ActionButton>
          <ActionButton primary>
            <FiDownload />
            Exportar
          </ActionButton>
        </HeaderActions>
      </PageHeader>

      <StatsGrid>
        <StatCard color="#3b82f6">
          <StatHeader>
            <div>
              <StatLabel>Usuarios Únicos</StatLabel>
              <StatValue>24,567</StatValue>
              <StatChange positive>
                <FiTrendingUp />
                +12.5% vs mes anterior
              </StatChange>
            </div>
            <StatIcon color="#3b82f6">
              <FiUsers />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard color="#10b981">
          <StatHeader>
            <div>
              <StatLabel>Tasa de Conversión</StatLabel>
              <StatValue>3.24%</StatValue>
              <StatChange positive>
                <FiTrendingUp />
                +0.8% vs mes anterior
              </StatChange>
            </div>
            <StatIcon color="#10b981">
              <FiTrendingUp />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard color="#f59e0b">
          <StatHeader>
            <div>
              <StatLabel>Páginas Vistas</StatLabel>
              <StatValue>89,432</StatValue>
              <StatChange positive>
                <FiTrendingUp />
                +5.2% vs mes anterior
              </StatChange>
            </div>
            <StatIcon color="#f59e0b">
              <FiEye />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard color="#8b5cf6">
          <StatHeader>
            <div>
              <StatLabel>Ingresos</StatLabel>
              <StatValue>$12,450</StatValue>
              <StatChange>
                <FiTrendingDown />
                -2.1% vs mes anterior
              </StatChange>
            </div>
            <StatIcon color="#8b5cf6">
              <FiDollarSign />
            </StatIcon>
          </StatHeader>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>Tráfico y Conversiones</ChartTitle>
          <div style={{ height: '300px' }}>
            <Line data={trafficData} options={chartOptions} />
          </div>
        </ChartCard>

        <ChartCard>
          <ChartTitle>Conversiones por Día</ChartTitle>
          <div style={{ height: '300px' }}>
            <Bar data={conversionData} options={chartOptions} />
          </div>
        </ChartCard>
      </ChartsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>Distribución por Dispositivos</ChartTitle>
          <div style={{ height: '300px' }}>
            <Doughnut data={deviceData} options={pieOptions} />
          </div>
        </ChartCard>

        <ChartCard>
          <ChartTitle>Fuentes de Tráfico</ChartTitle>
          <div style={{ height: '300px' }}>
            <Pie data={{
              labels: ['Directo', 'Google', 'Facebook', 'Email', 'Otros'],
              datasets: [{
                data: [40, 30, 15, 10, 5],
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                borderWidth: 0,
              }]
            }} options={pieOptions} />
          </div>
        </ChartCard>
      </ChartsGrid>
    </AnalyticsContainer>
  );
};

export default Analytics;
