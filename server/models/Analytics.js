const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  metric: {
    type: String,
    required: true,
    enum: ['sales', 'users', 'revenue', 'conversion', 'traffic', 'engagement']
  },
  value: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  source: {
    type: String,
    default: 'system'
  }
}, {
  timestamps: true
});

// Índices para optimizar consultas
analyticsSchema.index({ metric: 1, date: -1 });
analyticsSchema.index({ category: 1, date: -1 });
analyticsSchema.index({ date: -1 });

// Método estático para obtener métricas por rango de fechas
analyticsSchema.statics.getMetricsByDateRange = function(startDate, endDate, metric = null) {
  const query = {
    date: {
      $gte: startDate,
      $lte: endDate
    }
  };
  
  if (metric) {
    query.metric = metric;
  }
  
  return this.find(query).sort({ date: -1 });
};

// Método estático para obtener resumen de métricas
analyticsSchema.statics.getMetricsSummary = function(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        date: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$metric',
        total: { $sum: '$value' },
        average: { $avg: '$value' },
        count: { $sum: 1 },
        max: { $max: '$value' },
        min: { $min: '$value' }
      }
    }
  ]);
};

module.exports = mongoose.model('Analytics', analyticsSchema);
