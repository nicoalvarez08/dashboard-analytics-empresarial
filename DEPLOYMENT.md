# 🚀 Guía de Deployment - Dashboard de Analytics

Esta guía te ayudará a desplegar tu Dashboard de Analytics en diferentes plataformas.

## 📋 Requisitos Previos

- Node.js 16+ instalado
- MongoDB (local o en la nube)
- Cuenta en plataforma de hosting (Heroku, Railway, Vercel, etc.)

## 🗄️ Base de Datos

### Opción 1: MongoDB Atlas (Recomendado)
1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crear un cluster gratuito
3. Obtener la cadena de conexión
4. Configurar variables de entorno

### Opción 2: MongoDB Local
```bash
# Instalar MongoDB
brew install mongodb/brew/mongodb-community  # macOS
# o
sudo apt-get install mongodb  # Ubuntu

# Iniciar MongoDB
brew services start mongodb/brew/mongodb-community  # macOS
# o
sudo systemctl start mongod  # Ubuntu
```

## 🌐 Deployment del Backend

### Heroku
1. **Instalar Heroku CLI**
```bash
npm install -g heroku
heroku login
```

2. **Crear aplicación**
```bash
cd server
heroku create tu-dashboard-backend
```

3. **Configurar variables de entorno**
```bash
heroku config:set MONGODB_URI="tu-mongodb-connection-string"
heroku config:set JWT_SECRET="tu-jwt-secret-super-seguro"
heroku config:set CLIENT_URL="https://tu-frontend-url.vercel.app"
```

4. **Deploy**
```bash
git add .
git commit -m "Deploy backend"
git push heroku main
```

### Railway
1. Conectar repositorio en [Railway](https://railway.app)
2. Configurar variables de entorno en el dashboard
3. Deploy automático

### Render
1. Conectar repositorio en [Render](https://render.com)
2. Configurar build command: `npm install`
3. Configurar start command: `npm start`
4. Configurar variables de entorno

## 🎨 Deployment del Frontend

### Vercel (Recomendado)
1. **Instalar Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
cd client
vercel --prod
```

3. **Configurar variables de entorno**
```bash
vercel env add REACT_APP_API_URL
# Ingresar: https://tu-backend-url.herokuapp.com/api
```

### Netlify
1. Conectar repositorio en [Netlify](https://netlify.com)
2. Configurar build settings:
   - Build command: `cd client && npm run build`
   - Publish directory: `client/build`
3. Configurar variables de entorno

### GitHub Pages
```bash
cd client
npm install --save-dev gh-pages

# Agregar al package.json
"homepage": "https://tu-usuario.github.io/dashboard-analytics",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

# Deploy
npm run deploy
```

## 🔧 Configuración de Variables de Entorno

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/dashboard-analytics
JWT_SECRET=tu-jwt-secret-super-seguro-y-unico
CLIENT_URL=https://tu-frontend-url.vercel.app
```

### Frontend
```env
REACT_APP_API_URL=https://tu-backend-url.herokuapp.com/api
REACT_APP_SOCKET_URL=https://tu-backend-url.herokuapp.com
```

## 🗃️ Configuración de Base de Datos

### Generar datos de ejemplo
```bash
cd server
node scripts/seedData.js
```

### Credenciales por defecto
- **Admin**: admin@dashboard.com / admin123
- **Usuario**: user@dashboard.com / user123

## 🔒 Configuración de Seguridad

### HTTPS
- Vercel y Netlify proporcionan HTTPS automáticamente
- Para Heroku, configurar SSL en el dashboard

### CORS
```javascript
// En server/index.js
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
```

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 requests por IP
});
app.use(limiter);
```

## 📊 Monitoreo y Logs

### Heroku
```bash
heroku logs --tail
```

### Vercel
- Logs disponibles en el dashboard de Vercel
- Función de analytics incluida

### MongoDB Atlas
- Monitoreo incluido en el dashboard
- Alertas configurables

## 🚀 URLs de Ejemplo

### Producción
- **Frontend**: https://dashboard-analytics.vercel.app
- **Backend**: https://dashboard-backend.herokuapp.com
- **API**: https://dashboard-backend.herokuapp.com/api

### Desarrollo
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **API**: http://localhost:5000/api

## 🔧 Comandos Útiles

### Desarrollo
```bash
# Instalar dependencias
npm run install-all

# Ejecutar en desarrollo
npm run dev

# Generar datos de ejemplo
cd server && node scripts/seedData.js
```

### Producción
```bash
# Build del frontend
cd client && npm run build

# Iniciar servidor de producción
cd server && npm start
```

## 🐛 Troubleshooting

### Error de CORS
- Verificar que CLIENT_URL esté configurado correctamente
- Asegurar que las URLs no tengan trailing slashes

### Error de conexión a MongoDB
- Verificar la cadena de conexión
- Asegurar que la IP esté whitelisted en MongoDB Atlas

### Error de build en Vercel
- Verificar que todas las dependencias estén en package.json
- Revisar los logs de build en Vercel

## 📈 Optimizaciones de Producción

### Backend
- Usar PM2 para gestión de procesos
- Configurar compresión gzip
- Implementar cache con Redis

### Frontend
- Optimizar imágenes
- Implementar lazy loading
- Usar CDN para assets estáticos

## 🎯 Próximos Pasos

1. **Configurar dominio personalizado**
2. **Implementar CI/CD con GitHub Actions**
3. **Agregar tests automatizados**
4. **Configurar monitoreo con Sentry**
5. **Implementar backup automático de MongoDB**

---

¡Tu Dashboard de Analytics está listo para impresionar a las empresas! 🚀
