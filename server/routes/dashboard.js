const express = require('express');
const Analytics = require('../models/Analytics');
const router = express.Router();

// Middleware de autenticación
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    const User = require('../models/User');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// @route   GET /api/dashboard/overview
// @desc    Obtener resumen general del dashboard
// @access  Private
router.get('/overview', authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    const last30Days = new Date();
    last30Days.setDate(today.getDate() - 30);

    // Obtener métricas de los últimos 30 días
    const metrics = await Analytics.getMetricsSummary(30);
    
    // Obtener métricas de hoy
    const todayMetrics = await Analytics.find({
      date: {
        $gte: new Date(today.setHours(0, 0, 0, 0)),
        $lt: new Date(today.setHours(23, 59, 59, 999))
      }
    });

    // Calcular KPIs principales
    const kpis = {
      totalRevenue: metrics.find(m => m._id === 'revenue')?.total || 0,
      totalUsers: metrics.find(m => m._id === 'users')?.total || 0,
      totalSales: metrics.find(m => m._id === 'sales')?.total || 0,
      conversionRate: metrics.find(m => m._id === 'conversion')?.average || 0
    };

    // Calcular crecimiento vs mes anterior
    const last60Days = new Date();
    last60Days.setDate(today.getDate() - 60);
    
    const previousMonthMetrics = await Analytics.getMetricsSummary(30, last60Days);
    const currentMonthMetrics = await Analytics.getMetricsSummary(30);

    const growth = {
      revenue: calculateGrowth(
        previousMonthMetrics.find(m => m._id === 'revenue')?.total || 0,
        currentMonthMetrics.find(m => m._id === 'revenue')?.total || 0
      ),
      users: calculateGrowth(
        previousMonthMetrics.find(m => m._id === 'users')?.total || 0,
        currentMonthMetrics.find(m => m._id === 'users')?.total || 0
      )
    };

    res.json({
      kpis,
      growth,
      todayMetrics: todayMetrics.length,
      lastUpdate: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error obteniendo overview:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// @route   GET /api/dashboard/charts/:metric
// @desc    Obtener datos para gráficos
// @access  Private
router.get('/charts/:metric', authenticateToken, async (req, res) => {
  try {
    const { metric } = req.params;
    const { days = 30, category } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    let query = {
      date: { $gte: startDate }
    };

    if (metric !== 'all') {
      query.metric = metric;
    }

    if (category) {
      query.category = category;
    }

    const data = await Analytics.find(query)
      .sort({ date: 1 })
      .select('value date category metadata');

    // Agrupar datos por día para el gráfico
    const chartData = groupDataByDate(data, parseInt(days));

    res.json({
      metric,
      period: `${days} días`,
      data: chartData,
      total: data.reduce((sum, item) => sum + item.value, 0)
    });
  } catch (error) {
    console.error('Error obteniendo datos de gráfico:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// @route   GET /api/dashboard/realtime
// @desc    Obtener métricas en tiempo real
// @access  Private
router.get('/realtime', authenticateToken, async (req, res) => {
  try {
    const now = new Date();
    const last5Minutes = new Date(now.getTime() - 5 * 60 * 1000);

    const realtimeData = await Analytics.find({
      date: { $gte: last5Minutes }
    }).sort({ date: -1 }).limit(50);

    // Emitir datos en tiempo real via WebSocket
    if (req.io) {
      req.io.emit('realtime-update', {
        data: realtimeData,
        timestamp: now.toISOString()
      });
    }

    res.json({
      data: realtimeData,
      timestamp: now.toISOString(),
      count: realtimeData.length
    });
  } catch (error) {
    console.error('Error obteniendo datos en tiempo real:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Función auxiliar para calcular crecimiento
function calculateGrowth(previous, current) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous * 100).toFixed(2);
}

// Función auxiliar para agrupar datos por fecha
function groupDataByDate(data, days) {
  const grouped = {};
  const now = new Date();
  
  // Inicializar todos los días con 0
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    grouped[dateKey] = 0;
  }
  
  // Agrupar datos existentes
  data.forEach(item => {
    const dateKey = item.date.toISOString().split('T')[0];
    if (grouped[dateKey] !== undefined) {
      grouped[dateKey] += item.value;
    }
  });
  
  // Convertir a array para el gráfico
  return Object.entries(grouped).map(([date, value]) => ({
    date,
    value
  }));
}

module.exports = router;
