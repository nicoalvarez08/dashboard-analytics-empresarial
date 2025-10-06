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

// @route   POST /api/analytics
// @desc    Crear nueva métrica
// @access  Private (solo admin)
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const { metric, value, category, metadata } = req.body;

    const analytics = new Analytics({
      metric,
      value,
      category,
      metadata: metadata || {},
      source: 'manual'
    });

    await analytics.save();

    // Emitir actualización en tiempo real
    if (req.io) {
      req.io.emit('new-metric', {
        metric: analytics.metric,
        value: analytics.value,
        category: analytics.category,
        timestamp: analytics.date
      });
    }

    res.status(201).json({
      message: 'Métrica creada exitosamente',
      data: analytics
    });
  } catch (error) {
    console.error('Error creando métrica:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// @route   GET /api/analytics
// @desc    Obtener métricas con filtros
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { 
      metric, 
      category, 
      startDate, 
      endDate, 
      page = 1, 
      limit = 50,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    let query = {};

    if (metric) query.metric = metric;
    if (category) query.category = category;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [analytics, total] = await Promise.all([
      Analytics.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Analytics.countDocuments(query)
    ]);

    res.json({
      data: analytics,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error obteniendo métricas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// @route   GET /api/analytics/summary
// @desc    Obtener resumen de métricas
// @access  Private
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const summary = await Analytics.getMetricsSummary(parseInt(days));
    
    // Obtener métricas por categoría
    const categorySummary = await Analytics.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$value' },
          count: { $sum: 1 },
          average: { $avg: '$value' }
        }
      }
    ]);

    // Obtener tendencias
    const trends = await Analytics.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: {
            metric: '$metric',
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }
          },
          total: { $sum: '$value' }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);

    res.json({
      metrics: summary,
      categories: categorySummary,
      trends,
      period: `${days} días`
    });
  } catch (error) {
    console.error('Error obteniendo resumen:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// @route   DELETE /api/analytics/:id
// @desc    Eliminar métrica
// @access  Private (solo admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const analytics = await Analytics.findByIdAndDelete(req.params.id);
    
    if (!analytics) {
      return res.status(404).json({ error: 'Métrica no encontrada' });
    }

    res.json({ message: 'Métrica eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminando métrica:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
