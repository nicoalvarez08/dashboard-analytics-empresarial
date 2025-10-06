// Configuración de entorno
const ENV_CONFIG = {
  development: {
    API_URL: 'http://localhost:5000/api',
    SOCKET_URL: 'http://localhost:5000',
    DEBUG: true,
    MOCK_DATA: true
  },
  production: {
    API_URL: process.env.REACT_APP_API_URL || 'https://tu-backend-url.herokuapp.com/api',
    SOCKET_URL: process.env.REACT_APP_SOCKET_URL || 'https://tu-backend-url.herokuapp.com',
    DEBUG: false,
    MOCK_DATA: false
  }
};

const currentEnv = process.env.NODE_ENV || 'development';
export const config = ENV_CONFIG[currentEnv];

// Configuración de features
export const FEATURES = {
  NOTIFICATIONS: true,
  EXPORT_REPORTS: true,
  REAL_TIME_METRICS: true,
  ADVANCED_CHARTS: true,
  ADMIN_PANEL: true,
  THEME_SWITCHER: true,
  RESPONSIVE_DESIGN: true
};

// Configuración de la aplicación
export const APP_CONFIG = {
  name: 'Dashboard Analytics Pro',
  version: '1.0.0',
  description: 'Dashboard profesional de analytics empresarial',
  author: 'Tu Nombre',
  supportEmail: 'support@dashboard.com',
  
  // Configuración de paginación
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100]
  },
  
  // Configuración de cache
  cache: {
    defaultTTL: 5 * 60 * 1000, // 5 minutos
    maxSize: 100
  },
  
  // Configuración de notificaciones
  notifications: {
    defaultDuration: 5000,
    maxNotifications: 5,
    position: 'top-right'
  },
  
  // Configuración de gráficos
  charts: {
    defaultColors: [
      '#3b82f6', // Azul
      '#10b981', // Verde
      '#f59e0b', // Amarillo
      '#ef4444', // Rojo
      '#8b5cf6', // Púrpura
      '#06b6d4', // Cian
      '#84cc16', // Lima
      '#f97316'  // Naranja
    ],
    animationDuration: 1000,
    responsive: true
  }
};

export default config;
