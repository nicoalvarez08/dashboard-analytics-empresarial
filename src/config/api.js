// Configuración de la API
const API_CONFIG = {
  // URL base de la API
  BASE_URL: process.env.REACT_APP_API_URL || 'https://dashboard-analytics-backend.herokuapp.com/api',
  
  // URL del WebSocket
  SOCKET_URL: process.env.REACT_APP_SOCKET_URL || 'https://dashboard-analytics-backend.herokuapp.com',
  
  // Configuración de timeouts
  TIMEOUT: 10000,
  
  // Configuración de reintentos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // Endpoints principales
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      ME: '/auth/me',
      LOGOUT: '/auth/logout'
    },
    DASHBOARD: {
      OVERVIEW: '/dashboard/overview',
      CHARTS: '/dashboard/charts',
      REALTIME: '/dashboard/realtime'
    },
    USERS: {
      LIST: '/users',
      CREATE: '/users',
      UPDATE: '/users',
      DELETE: '/users',
      STATS: '/users/stats'
    },
    ANALYTICS: {
      LIST: '/analytics',
      CREATE: '/analytics',
      SUMMARY: '/analytics/summary',
      DELETE: '/analytics'
    }
  }
};

export default API_CONFIG;
