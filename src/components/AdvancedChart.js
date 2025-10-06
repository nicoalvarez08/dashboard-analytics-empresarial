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
  Filler,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
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
  Filler,
  ArcElement
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
  height: ${props => props.height || '300px'};
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

const AdvancedChart = ({ 
  title, 
  data, 
  type = 'line', 
  height = '300px',
  loading = false,
  timeRange = '30',
  onTimeRangeChange
}) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return null;
    }

    switch (type) {
      case 'doughnut':
        return {
          labels: data.map(item => item.label),
          datasets: [
            {
              data: data.map(item => item.value),
              backgroundColor: [
                '#3b82f6',
                '#10b981',
                '#f59e0b',
                '#ef4444',
                '#8b5cf6',
                '#06b6d4',
                '#84cc16',
                '#f97316'
              ],
              borderWidth: 2,
              borderColor: '#fff'
            }
          ]
        };

      case 'radar':
        return {
          labels: data.map(item => item.label),
          datasets: [
            {
              label: title,
              data: data.map(item => item.value),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              pointBackgroundColor: '#3b82f6',
              pointBorderColor: '#fff',
              pointBorderWidth: 2
            }
          ]
        };

      case 'multiLine':
        const labels = data[0]?.data?.map(item => {
          const date = new Date(item.date);
          return date.toLocaleDateString('es-ES', { 
            month: 'short', 
            day: 'numeric' 
          });
        }) || [];

        return {
          labels,
          datasets: data.map((dataset, index) => ({
            label: dataset.label,
            data: dataset.data.map(item => item.value),
            borderColor: dataset.color || `hsl(${index * 60}, 70%, 50%)`,
            backgroundColor: dataset.color ? `${dataset.color}20` : `hsla(${index * 60}, 70%, 50%, 0.2)`,
            fill: false,
            tension: 0.4
          }))
        };

      default:
        const chartLabels = data.map(item => {
          const date = new Date(item.date);
          return date.toLocaleDateString('es-ES', { 
            month: 'short', 
            day: 'numeric' 
          });
        });

        const chartValues = data.map(item => item.value);

        return {
          labels: chartLabels,
          datasets: [
            {
              label: title,
              data: chartValues,
              borderColor: '#3b82f6',
              backgroundColor: type === 'area' ? 'rgba(59, 130, 246, 0.2)' : '#3b82f6',
              fill: type === 'area',
              tension: 0.4,
              pointBackgroundColor: '#3b82f6',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
            }
          ]
        };
    }
  }, [data, title, type]);

  const chartOptions = useMemo(() => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: type === 'doughnut' ? 'bottom' : 'top',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#3b82f6',
          borderWidth: 1,
          cornerRadius: 8,
          callbacks: {
            title: function(context) {
              return context[0].label;
            },
            label: function(context) {
              const value = context.parsed.y || context.parsed;
              return `${context.dataset.label}: ${value.toLocaleString()}`;
            }
          }
        }
      }
    };

    if (type === 'doughnut') {
      return {
        ...baseOptions,
        cutout: '60%',
        plugins: {
          ...baseOptions.plugins,
          legend: {
            position: 'bottom'
          }
        }
      };
    }

    if (type === 'radar') {
      return {
        ...baseOptions,
        scales: {
          r: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            pointLabels: {
              font: {
                size: 12
              }
            }
          }
        }
      };
    }

    return {
      ...baseOptions,
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
      }
    };
  }, [type]);

  const handleTimeRangeChange = (range) => {
    if (onTimeRangeChange) {
      onTimeRangeChange(range);
    }
  };

  if (loading) {
    return (
      <ChartCardContainer>
        <ChartHeader>
          <ChartTitle>{title}</ChartTitle>
        </ChartHeader>
        <ChartContainer height={height}>
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
        <ChartContainer height={height}>
          <EmptyState>
            <span>No hay datos disponibles</span>
            <small>Los datos aparecerán aquí una vez que estén disponibles</small>
          </EmptyState>
        </ChartContainer>
      </ChartCardContainer>
    );
  }

  const renderChart = () => {
    switch (type) {
      case 'line':
      case 'area':
        return <Line data={chartData} options={chartOptions} />;
      case 'bar':
        return <Bar data={chartData} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={chartOptions} />;
      case 'radar':
        return <Radar data={chartData} options={chartOptions} />;
      case 'multiLine':
        return <Line data={chartData} options={chartOptions} />;
      default:
        return <Line data={chartData} options={chartOptions} />;
    }
  };

  return (
    <ChartCardContainer>
      <ChartHeader>
        <ChartTitle>{title}</ChartTitle>
        {onTimeRangeChange && (
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
        )}
      </ChartHeader>
      
      <ChartContainer height={height}>
        {renderChart()}
      </ChartContainer>
    </ChartCardContainer>
  );
};

export default AdvancedChart;
