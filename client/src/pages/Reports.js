import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiFileText, 
  FiDownload, 
  FiCalendar, 
  FiFilter,
  FiEye,
  FiShare2,
  FiTrendingUp,
  FiBarChart2,
  FiPieChart
} from 'react-icons/fi';

const ReportsContainer = styled.div`
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

const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ReportCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  transition: all ${props => props.theme.transitions.fast};
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ReportIcon = styled.div`
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

const ReportTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.5rem 0;
`;

const ReportDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  margin: 0 0 1rem 0;
  line-height: 1.5;
`;

const ReportMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ReportDate = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const ReportStatus = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => props.status === 'completed' ? '#10b98120' : '#f59e0b20'};
  color: ${props => props.status === 'completed' ? '#10b981' : '#f59e0b'};
`;

const ReportActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ReportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.surfaceHover};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    background: ${props => props.theme.colors.border};
  }
`;

const TemplateSection = styled.div`
  margin-top: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const TemplateCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
`;

const TemplateIcon = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.color || props.theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color || props.theme.colors.primary};
  font-size: 2rem;
  margin: 0 auto 1rem auto;
`;

const TemplateTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.5rem 0;
`;

const TemplateDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  margin: 0;
`;

const Reports = () => {
  const [reports] = useState([
    {
      id: 1,
      title: 'Reporte de Ventas Mensual',
      description: 'Análisis completo de ventas del mes de octubre con comparativas y tendencias.',
      date: '2024-10-06',
      status: 'completed',
      icon: FiBarChart2,
      color: '#3b82f6'
    },
    {
      id: 2,
      title: 'Análisis de Usuarios',
      description: 'Estudio detallado del comportamiento de usuarios y patrones de uso.',
      date: '2024-10-05',
      status: 'completed',
      icon: FiTrendingUp,
      color: '#10b981'
    },
    {
      id: 3,
      title: 'Reporte de Performance',
      description: 'Métricas de rendimiento del sistema y tiempos de respuesta.',
      date: '2024-10-04',
      status: 'generating',
      icon: FiPieChart,
      color: '#f59e0b'
    },
    {
      id: 4,
      title: 'Análisis de Conversiones',
      description: 'Estudio de tasas de conversión y optimización de embudos.',
      date: '2024-10-03',
      status: 'completed',
      icon: FiFileText,
      color: '#8b5cf6'
    }
  ]);

  const templates = [
    {
      title: 'Reporte de Ventas',
      description: 'Plantilla estándar para análisis de ventas',
      icon: FiBarChart2,
      color: '#3b82f6'
    },
    {
      title: 'Análisis de Usuarios',
      description: 'Plantilla para estudios de comportamiento',
      icon: FiTrendingUp,
      color: '#10b981'
    },
    {
      title: 'Reporte Financiero',
      description: 'Plantilla para análisis financiero completo',
      icon: FiFileText,
      color: '#f59e0b'
    },
    {
      title: 'Análisis de Marketing',
      description: 'Plantilla para métricas de marketing',
      icon: FiPieChart,
      color: '#8b5cf6'
    }
  ];

  return (
    <ReportsContainer>
      <PageHeader>
        <Title>Reportes y Análisis</Title>
        <HeaderActions>
          <ActionButton>
            <FiFilter />
            Filtros
          </ActionButton>
          <ActionButton>
            <FiCalendar />
            Programar
          </ActionButton>
          <ActionButton primary>
            <FiFileText />
            Nuevo Reporte
          </ActionButton>
        </HeaderActions>
      </PageHeader>

      <ReportsGrid>
        {reports.map((report) => (
          <ReportCard key={report.id}>
            <ReportHeader>
              <div>
                <ReportTitle>{report.title}</ReportTitle>
                <ReportDescription>{report.description}</ReportDescription>
              </div>
              <ReportIcon color={report.color}>
                <report.icon />
              </ReportIcon>
            </ReportHeader>
            
            <ReportMeta>
              <ReportDate>{new Date(report.date).toLocaleDateString('es-ES')}</ReportDate>
              <ReportStatus status={report.status}>
                {report.status === 'completed' ? 'Completado' : 'Generando'}
              </ReportStatus>
            </ReportMeta>
            
            <ReportActions>
              <ReportButton>
                <FiEye />
                Ver
              </ReportButton>
              <ReportButton>
                <FiDownload />
                Descargar
              </ReportButton>
              <ReportButton>
                <FiShare2 />
                Compartir
              </ReportButton>
            </ReportActions>
          </ReportCard>
        ))}
      </ReportsGrid>

      <TemplateSection>
        <SectionTitle>Plantillas de Reportes</SectionTitle>
        <TemplateGrid>
          {templates.map((template, index) => (
            <TemplateCard key={index}>
              <TemplateIcon color={template.color}>
                <template.icon />
              </TemplateIcon>
              <TemplateTitle>{template.title}</TemplateTitle>
              <TemplateDescription>{template.description}</TemplateDescription>
            </TemplateCard>
          ))}
        </TemplateGrid>
      </TemplateSection>
    </ReportsContainer>
  );
};

export default Reports;
