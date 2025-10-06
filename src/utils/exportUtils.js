import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Configuración de colores para PDF
const COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  text: '#1f2937',
  light: '#f8fafc'
};

// Función para exportar a PDF
export const exportToPDF = (data, options = {}) => {
  const {
    title = 'Reporte de Analytics',
    filename = 'reporte-analytics.pdf',
    includeCharts = false,
    includeData = true
  } = options;

  const doc = new jsPDF();
  
  // Configurar fuente
  doc.setFont('helvetica');
  
  // Título principal
  doc.setFontSize(20);
  doc.setTextColor(COLORS.primary);
  doc.text(title, 20, 20);
  
  // Fecha de generación
  doc.setFontSize(10);
  doc.setTextColor(COLORS.text);
  doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, 20, 30);
  
  let yPosition = 50;
  
  // Resumen ejecutivo
  if (data.summary) {
    doc.setFontSize(16);
    doc.setTextColor(COLORS.primary);
    doc.text('Resumen Ejecutivo', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(COLORS.text);
    
    const summaryText = `
• Total de ingresos: $${data.summary.totalRevenue?.toLocaleString() || '0'}
• Usuarios activos: ${data.summary.totalUsers?.toLocaleString() || '0'}
• Ventas totales: ${data.summary.totalSales?.toLocaleString() || '0'}
• Tasa de conversión: ${(data.summary.conversionRate || 0).toFixed(2)}%
    `;
    
    const lines = doc.splitTextToSize(summaryText, 170);
    doc.text(lines, 20, yPosition);
    yPosition += lines.length * 5 + 10;
  }
  
  // KPIs principales
  if (data.kpis && data.kpis.length > 0) {
    doc.setFontSize(16);
    doc.setTextColor(COLORS.primary);
    doc.text('KPIs Principales', 20, yPosition);
    yPosition += 10;
    
    const kpiData = data.kpis.map(kpi => [
      kpi.title,
      kpi.value,
      `${kpi.change > 0 ? '+' : ''}${kpi.change}%`
    ]);
    
    doc.autoTable({
      startY: yPosition,
      head: [['Métrica', 'Valor', 'Cambio']],
      body: kpiData,
      theme: 'striped',
      headStyles: {
        fillColor: COLORS.primary,
        textColor: 255
      },
      styles: {
        fontSize: 10
      }
    });
    
    yPosition = doc.lastAutoTable.finalY + 20;
  }
  
  // Datos detallados
  if (includeData && data.detailedData) {
    doc.setFontSize(16);
    doc.setTextColor(COLORS.primary);
    doc.text('Datos Detallados', 20, yPosition);
    yPosition += 10;
    
    // Verificar si hay espacio suficiente
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    const detailedData = data.detailedData.map(item => [
      new Date(item.date).toLocaleDateString('es-ES'),
      item.metric,
      item.value.toLocaleString(),
      item.category
    ]);
    
    doc.autoTable({
      startY: yPosition,
      head: [['Fecha', 'Métrica', 'Valor', 'Categoría']],
      body: detailedData,
      theme: 'striped',
      headStyles: {
        fillColor: COLORS.primary,
        textColor: 255
      },
      styles: {
        fontSize: 8
      }
    });
  }
  
  // Pie de página
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(COLORS.text);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width - 40,
      doc.internal.pageSize.height - 10
    );
  }
  
  // Guardar el PDF
  doc.save(filename);
};

// Función para exportar a Excel
export const exportToExcel = (data, options = {}) => {
  const {
    filename = 'reporte-analytics.xlsx',
    sheetName = 'Analytics'
  } = options;
  
  const workbook = XLSX.utils.book_new();
  
  // Hoja de resumen
  if (data.summary) {
    const summaryData = [
      ['Métrica', 'Valor'],
      ['Total de Ingresos', data.summary.totalRevenue || 0],
      ['Usuarios Activos', data.summary.totalUsers || 0],
      ['Ventas Totales', data.summary.totalSales || 0],
      ['Tasa de Conversión', `${(data.summary.conversionRate || 0).toFixed(2)}%`]
    ];
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumen');
  }
  
  // Hoja de KPIs
  if (data.kpis && data.kpis.length > 0) {
    const kpiData = [
      ['Métrica', 'Valor', 'Cambio (%)', 'Estado']
    ];
    
    data.kpis.forEach(kpi => {
      kpiData.push([
        kpi.title,
        kpi.value,
        kpi.change,
        kpi.change > 0 ? 'Positivo' : kpi.change < 0 ? 'Negativo' : 'Neutral'
      ]);
    });
    
    const kpiSheet = XLSX.utils.aoa_to_sheet(kpiData);
    XLSX.utils.book_append_sheet(workbook, kpiSheet, 'KPIs');
  }
  
  // Hoja de datos detallados
  if (data.detailedData) {
    const detailedData = [
      ['Fecha', 'Métrica', 'Valor', 'Categoría', 'Fuente']
    ];
    
    data.detailedData.forEach(item => {
      detailedData.push([
        new Date(item.date).toLocaleDateString('es-ES'),
        item.metric,
        item.value,
        item.category,
        item.source || 'Sistema'
      ]);
    });
    
    const detailedSheet = XLSX.utils.aoa_to_sheet(detailedData);
    XLSX.utils.book_append_sheet(workbook, detailedSheet, 'Datos Detallados');
  }
  
  // Hoja de gráficos (datos para gráficos)
  if (data.chartData) {
    const chartData = [
      ['Fecha', 'Ventas', 'Usuarios', 'Ingresos', 'Tráfico']
    ];
    
    // Agrupar datos por fecha
    const groupedData = {};
    data.chartData.forEach(item => {
      const date = new Date(item.date).toLocaleDateString('es-ES');
      if (!groupedData[date]) {
        groupedData[date] = { date, sales: 0, users: 0, revenue: 0, traffic: 0 };
      }
      groupedData[date][item.metric] = item.value;
    });
    
    Object.values(groupedData).forEach(item => {
      chartData.push([
        item.date,
        item.sales,
        item.users,
        item.revenue,
        item.traffic
      ]);
    });
    
    const chartSheet = XLSX.utils.aoa_to_sheet(chartData);
    XLSX.utils.book_append_sheet(workbook, chartSheet, 'Datos para Gráficos');
  }
  
  // Guardar el archivo Excel
  XLSX.writeFile(workbook, filename);
};

// Función para exportar a CSV
export const exportToCSV = (data, options = {}) => {
  const {
    filename = 'reporte-analytics.csv',
    delimiter = ','
  } = options;
  
  let csvContent = '';
  
  // Encabezados
  const headers = ['Fecha', 'Métrica', 'Valor', 'Categoría', 'Fuente'];
  csvContent += headers.join(delimiter) + '\n';
  
  // Datos
  if (data.detailedData) {
    data.detailedData.forEach(item => {
      const row = [
        new Date(item.date).toLocaleDateString('es-ES'),
        item.metric,
        item.value,
        item.category,
        item.source || 'Sistema'
      ];
      csvContent += row.join(delimiter) + '\n';
    });
  }
  
  // Crear y descargar archivo
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Función para generar reporte completo
export const generateFullReport = async (dashboardData, format = 'pdf') => {
  const reportData = {
    summary: dashboardData.overview,
    kpis: [
      {
        title: 'Ingresos Totales',
        value: `$${dashboardData.overview?.kpis?.totalRevenue?.toLocaleString() || '0'}`,
        change: dashboardData.overview?.growth?.revenue || 0
      },
      {
        title: 'Usuarios Activos',
        value: dashboardData.overview?.kpis?.totalUsers?.toLocaleString() || '0',
        change: dashboardData.overview?.growth?.users || 0
      },
      {
        title: 'Ventas Totales',
        value: dashboardData.overview?.kpis?.totalSales?.toLocaleString() || '0',
        change: 5.2
      },
      {
        title: 'Tasa de Conversión',
        value: `${(dashboardData.overview?.kpis?.conversionRate || 0).toFixed(1)}%`,
        change: 2.1
      }
    ],
    detailedData: dashboardData.realtimeData || [],
    chartData: Object.values(dashboardData.charts || {}).flat()
  };
  
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `reporte-analytics-${timestamp}`;
  
  switch (format) {
    case 'pdf':
      exportToPDF(reportData, { filename: `${filename}.pdf` });
      break;
    case 'excel':
      exportToExcel(reportData, { filename: `${filename}.xlsx` });
      break;
    case 'csv':
      exportToCSV(reportData, { filename: `${filename}.csv` });
      break;
    default:
      throw new Error('Formato no soportado');
  }
};

// Función para imprimir reporte
export const printReport = (data) => {
  const printWindow = window.open('', '_blank');
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Reporte de Analytics</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { margin-bottom: 30px; }
        .kpis { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
        .kpi-card { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
        .kpi-title { font-weight: bold; color: #3b82f6; }
        .kpi-value { font-size: 24px; font-weight: bold; margin: 10px 0; }
        .kpi-change { color: #10b981; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Reporte de Analytics</h1>
        <p>Generado el: ${new Date().toLocaleDateString('es-ES')}</p>
      </div>
      
      <div class="summary">
        <h2>Resumen Ejecutivo</h2>
        <p>Este reporte contiene un análisis completo de las métricas empresariales.</p>
      </div>
      
      <div class="kpis">
        ${data.kpis?.map(kpi => `
          <div class="kpi-card">
            <div class="kpi-title">${kpi.title}</div>
            <div class="kpi-value">${kpi.value}</div>
            <div class="kpi-change">${kpi.change > 0 ? '+' : ''}${kpi.change}%</div>
          </div>
        `).join('') || ''}
      </div>
      
      <h2>Datos Detallados</h2>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Métrica</th>
            <th>Valor</th>
            <th>Categoría</th>
          </tr>
        </thead>
        <tbody>
          ${data.detailedData?.map(item => `
            <tr>
              <td>${new Date(item.date).toLocaleDateString('es-ES')}</td>
              <td>${item.metric}</td>
              <td>${item.value}</td>
              <td>${item.category}</td>
            </tr>
          `).join('') || ''}
        </tbody>
      </table>
    </body>
    </html>
  `;
  
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.print();
};
