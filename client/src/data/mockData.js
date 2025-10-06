// Datos de ejemplo para el dashboard
export const mockOverview = {
  kpis: {
    totalRevenue: 125000,
    totalUsers: 2847,
    totalSales: 156,
    conversionRate: 3.2
  },
  growth: {
    revenue: 12.5,
    users: 8.3
  },
  todayMetrics: 45,
  lastUpdate: new Date().toISOString()
};

export const mockChartData = {
  sales: {
    metric: 'sales',
    period: '30 días',
    data: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.floor(Math.random() * 100) + 50
    })),
    total: 2340
  },
  users: {
    metric: 'users',
    period: '30 días',
    data: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.floor(Math.random() * 200) + 100
    })),
    total: 4560
  },
  revenue: {
    metric: 'revenue',
    period: '30 días',
    data: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.floor(Math.random() * 5000) + 2000
    })),
    total: 125000
  },
  traffic: {
    metric: 'traffic',
    period: '30 días',
    data: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.floor(Math.random() * 1000) + 500
    })),
    total: 23400
  }
};

export const mockRealtimeData = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  metric: ['sales', 'users', 'revenue', 'traffic'][Math.floor(Math.random() * 4)],
  value: Math.floor(Math.random() * 1000) + 100,
  category: ['electronics', 'clothing', 'books', 'total'][Math.floor(Math.random() * 4)],
  timestamp: new Date(Date.now() - i * 5 * 60 * 1000).toISOString()
}));

export const mockUsers = [
  {
    _id: '1',
    name: 'Administrador',
    email: 'admin@dashboard.com',
    role: 'admin',
    isActive: true,
    lastLogin: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'Usuario de Prueba',
    email: 'user@dashboard.com',
    role: 'user',
    isActive: true,
    lastLogin: new Date().toISOString()
  }
];

export const mockStats = {
  totalUsers: 2,
  activeUsers: 2,
  recentUsers: 1,
  byRole: [
    { _id: 'admin', count: 1 },
    { _id: 'user', count: 1 }
  ],
  lastUpdate: new Date().toISOString()
};
