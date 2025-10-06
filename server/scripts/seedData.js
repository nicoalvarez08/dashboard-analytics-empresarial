const mongoose = require('mongoose');
const User = require('../models/User');
const Analytics = require('../models/Analytics');
require('dotenv').config();

// Datos de ejemplo para el dashboard
const sampleMetrics = [
  { metric: 'sales', category: 'electronics', baseValue: 1000 },
  { metric: 'sales', category: 'clothing', baseValue: 800 },
  { metric: 'sales', category: 'books', baseValue: 300 },
  { metric: 'users', category: 'new', baseValue: 50 },
  { metric: 'users', category: 'returning', baseValue: 200 },
  { metric: 'revenue', category: 'total', baseValue: 5000 },
  { metric: 'conversion', category: 'checkout', baseValue: 3.5 },
  { metric: 'traffic', category: 'organic', baseValue: 1000 },
  { metric: 'traffic', category: 'paid', baseValue: 500 },
  { metric: 'engagement', category: 'likes', baseValue: 200 },
  { metric: 'engagement', category: 'shares', baseValue: 50 },
  { metric: 'engagement', category: 'comments', baseValue: 100 }
];

// Generar datos aleatorios con tendencias realistas
function generateRandomData(baseValue, days = 30) {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Agregar variación diaria (más actividad en fines de semana)
    const dayOfWeek = date.getDay();
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.2 : 1.0;
    
    // Agregar tendencia de crecimiento
    const growthFactor = 1 + (days - i) * 0.01;
    
    // Agregar variación aleatoria
    const randomFactor = 0.8 + Math.random() * 0.4; // 80% a 120%
    
    const value = Math.round(baseValue * weekendMultiplier * growthFactor * randomFactor);
    
    data.push({
      value,
      date: new Date(date)
    });
  }
  
  return data;
}

// Crear usuario administrador por defecto
async function createAdminUser() {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@dashboard.com' });
    
    if (!existingAdmin) {
      const admin = new User({
        name: 'Administrador',
        email: 'admin@dashboard.com',
        password: 'admin123',
        role: 'admin',
        preferences: {
          theme: 'dark',
          language: 'es',
          notifications: true
        }
      });
      
      await admin.save();
      console.log('✅ Usuario administrador creado: admin@dashboard.com / admin123');
    } else {
      console.log('ℹ️  Usuario administrador ya existe');
    }
  } catch (error) {
    console.error('❌ Error creando usuario administrador:', error);
  }
}

// Crear usuario de prueba
async function createTestUser() {
  try {
    const existingUser = await User.findOne({ email: 'user@dashboard.com' });
    
    if (!existingUser) {
      const user = new User({
        name: 'Usuario de Prueba',
        email: 'user@dashboard.com',
        password: 'user123',
        role: 'user',
        preferences: {
          theme: 'light',
          language: 'es',
          notifications: true
        }
      });
      
      await user.save();
      console.log('✅ Usuario de prueba creado: user@dashboard.com / user123');
    } else {
      console.log('ℹ️  Usuario de prueba ya existe');
    }
  } catch (error) {
    console.error('❌ Error creando usuario de prueba:', error);
  }
}

// Generar datos de analytics
async function generateAnalyticsData() {
  try {
    // Limpiar datos existentes
    await Analytics.deleteMany({});
    console.log('🧹 Datos de analytics limpiados');
    
    const analyticsData = [];
    
    // Generar datos para cada métrica
    for (const metric of sampleMetrics) {
      const dailyData = generateRandomData(metric.baseValue, 90); // 90 días de datos
      
      for (const day of dailyData) {
        analyticsData.push({
          metric: metric.metric,
          value: day.value,
          category: metric.category,
          date: day.date,
          metadata: {
            source: 'seed',
            generated: true
          }
        });
      }
    }
    
    // Insertar datos en lotes
    const batchSize = 1000;
    for (let i = 0; i < analyticsData.length; i += batchSize) {
      const batch = analyticsData.slice(i, i + batchSize);
      await Analytics.insertMany(batch);
    }
    
    console.log(`✅ ${analyticsData.length} registros de analytics generados`);
  } catch (error) {
    console.error('❌ Error generando datos de analytics:', error);
  }
}

// Función principal
async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seed de la base de datos...');
    
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dashboard-analytics', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Conectado a MongoDB');
    
    // Crear usuarios
    await createAdminUser();
    await createTestUser();
    
    // Generar datos de analytics
    await generateAnalyticsData();
    
    console.log('🎉 Seed completado exitosamente!');
    console.log('\n📋 Credenciales de acceso:');
    console.log('👨‍💼 Admin: admin@dashboard.com / admin123');
    console.log('👤 Usuario: user@dashboard.com / user123');
    
  } catch (error) {
    console.error('❌ Error en el seed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión a MongoDB cerrada');
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
