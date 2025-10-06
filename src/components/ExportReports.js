import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiDownload, 
  FiFileText, 
  FiFile, 
  FiPrinter,
  FiLoader
} from 'react-icons/fi';
import { Button, LoadingSpinner } from '../styles/GlobalStyle';
import { generateFullReport, printReport } from '../utils/exportUtils';

const ExportContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ExportHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ExportTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const ExportOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const ExportCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  text-align: center;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-2px);
  }
`;

const ExportIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary}15;
  color: ${props => props.theme.colors.primary};

  svg {
    font-size: 1.5rem;
  }
`;

const ExportCardTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const ExportCardDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  line-height: 1.4;
`;

const ExportButton = styled(Button)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const LoadingButton = styled(Button)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0.7;
  cursor: not-allowed;
`;

const ExportReports = ({ dashboardData }) => {
  const [loading, setLoading] = useState({
    pdf: false,
    excel: false,
    csv: false,
    print: false
  });

  const handleExport = async (format) => {
    setLoading(prev => ({ ...prev, [format]: true }));
    
    try {
      switch (format) {
        case 'pdf':
          await generateFullReport(dashboardData, 'pdf');
          break;
        case 'excel':
          await generateFullReport(dashboardData, 'excel');
          break;
        case 'csv':
          await generateFullReport(dashboardData, 'csv');
          break;
        case 'print':
          printReport(dashboardData);
          break;
        default:
          throw new Error('Formato no soportado');
      }
    } catch (error) {
      console.error('Error exportando reporte:', error);
      // Aquí podrías mostrar una notificación de error
    } finally {
      setLoading(prev => ({ ...prev, [format]: false }));
    }
  };

  const exportOptions = [
    {
      id: 'pdf',
      title: 'Exportar PDF',
      description: 'Reporte completo en formato PDF con gráficos y tablas',
      icon: FiFileText,
      color: '#ef4444'
    },
    {
      id: 'excel',
      title: 'Exportar Excel',
      description: 'Datos en formato Excel con múltiples hojas de cálculo',
      icon: FiFile,
      color: '#10b981'
    },
    {
      id: 'csv',
      title: 'Exportar CSV',
      description: 'Datos en formato CSV para análisis externo',
      icon: FiDownload,
      color: '#3b82f6'
    },
    {
      id: 'print',
      title: 'Imprimir',
      description: 'Imprimir reporte directamente desde el navegador',
      icon: FiPrinter,
      color: '#f59e0b'
    }
  ];

  return (
    <ExportContainer>
      <ExportHeader>
        <FiDownload />
        <ExportTitle>Exportar Reportes</ExportTitle>
      </ExportHeader>
      
      <ExportOptions>
        {exportOptions.map((option) => (
          <ExportCard key={option.id}>
            <ExportIcon style={{ background: `${option.color}15`, color: option.color }}>
              <option.icon />
            </ExportIcon>
            
            <div>
              <ExportCardTitle>{option.title}</ExportCardTitle>
              <ExportCardDescription>{option.description}</ExportCardDescription>
            </div>
            
            {loading[option.id] ? (
              <LoadingButton disabled>
                <LoadingSpinner size="16px" />
                Generando...
              </LoadingButton>
            ) : (
              <ExportButton
                variant="primary"
                onClick={() => handleExport(option.id)}
              >
                <option.icon />
                {option.title}
              </ExportButton>
            )}
          </ExportCard>
        ))}
      </ExportOptions>
    </ExportContainer>
  );
};

export default ExportReports;
