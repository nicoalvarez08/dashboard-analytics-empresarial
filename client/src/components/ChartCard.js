import React, { useMemo } from 'react';
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
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import styled from 'styled-components';
import { Card, LoadingSpinner } from '../styles/GlobalStyle';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartCardContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChartTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const ChartActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ChartButton = styled.button`
  padding: 0.25rem 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.textSecondary};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 0.75rem;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.surfaceHover};
  }
`;

const ChartContainer = styled.div`
  position: relative;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
`;

const ChartCard = ({ 
  title, 
  metric, 
  data, 
  type = 'line', 
  color = '#3b82f6',
  loading = false 
}) => {
  const [timeRange, setTimeRange] = React.useState('30');

  const chartData = useMemo(() => {
    if (!data?.data || data.data.length === 0) {
      return null;
    }

    const labels = data.data.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('es-ES', { 
        month: 'short', 
        day: 'numeric' 
      });
    });

    const values = data.data.map(item => item.value);

    return {
      labels,
      datasets: [
        {
          label: title,
          data: values,
          borderColor: color,
          backgroundColor: type === 'area' ? `${color}20` : color,
          fill: type === 'area',
          tension: 0.4,
          pointBackgroundColor: color,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        }
      ]
    };
  }, [data, title, color, type]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: color,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            const value = context.parsed.y;
            return `${title}: ${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: '#f1f5f9'
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12
          },
          callback: function(value) {
            return value.toLocaleString();
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      point: {
        hoverBackgroundColor: color
      }
    }
  }), [title, color]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    // Aquí podrías hacer una nueva llamada a la API con el nuevo rango
    // fetchChartData(metric, { days: range });
  };

  if (loading) {
    return (
      <ChartCardContainer>
        <ChartHeader>
          <ChartTitle>{title}</ChartTitle>
        </ChartHeader>
        <ChartContainer>
          <LoadingContainer>
            <LoadingSpinner size="24px" />
            <span>Cargando datos...</span>
          </LoadingContainer>
        </ChartContainer>
      </ChartCardContainer>
    );
  }

  if (!chartData) {
    return (
      <ChartCardContainer>
        <ChartHeader>
          <ChartTitle>{title}</ChartTitle>
        </ChartHeader>
        <ChartContainer>
          <EmptyState>
            <span>No hay datos disponibles</span>
            <small>Los datos aparecerán aquí una vez que estén disponibles</small>
          </EmptyState>
        </ChartContainer>
      </ChartCardContainer>
    );
  }

  return (
    <ChartCardContainer>
      <ChartHeader>
        <ChartTitle>{title}</ChartTitle>
        <ChartActions>
          <ChartButton 
            active={timeRange === '7'} 
            onClick={() => handleTimeRangeChange('7')}
          >
            7D
          </ChartButton>
          <ChartButton 
            active={timeRange === '30'} 
            onClick={() => handleTimeRangeChange('30')}
          >
            30D
          </ChartButton>
          <ChartButton 
            active={timeRange === '90'} 
            onClick={() => handleTimeRangeChange('90')}
          >
            90D
          </ChartButton>
        </ChartActions>
      </ChartHeader>
      
      <ChartContainer>
        {type === 'line' || type === 'area' ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </ChartContainer>
    </ChartCardContainer>
  );
};

export default ChartCard;
