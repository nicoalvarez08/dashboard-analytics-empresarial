# 📊 Dashboard de Analytics Empresarial

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)

## 🚀 **Demo en Vivo**
**[Ver Dashboard Online](https://dashboard-analytics-nicoalvarez08.netlify.app/)**

## 📋 **Descripción**

Dashboard profesional de analytics empresarial desarrollado con tecnologías modernas. Incluye métricas en tiempo real, gráficos interactivos, sistema de autenticación y panel administrativo completo.

## ✨ **Características Principales**

- 📈 **Métricas en Tiempo Real** - Actualizaciones automáticas con WebSockets
- 📊 **Gráficos Interactivos** - Chart.js y Recharts para visualizaciones avanzadas
- 🔐 **Sistema de Autenticación** - JWT con roles de usuario
- 📱 **Diseño Responsivo** - Optimizado para móviles y desktop
- 🎨 **UI Moderna** - Styled Components con tema personalizable
- 📤 **Exportación de Reportes** - PDF y Excel
- 🔔 **Sistema de Notificaciones** - Alertas en tiempo real
- 👥 **Panel Administrativo** - Gestión de usuarios y datos

## 🛠️ **Tecnologías Utilizadas**

### **Frontend**
- **React 18** - Framework principal
- **React Router** - Navegación
- **Styled Components** - Estilos
- **Chart.js & Recharts** - Gráficos
- **Socket.io Client** - Tiempo real
- **Axios** - HTTP Client

### **Backend**
- **Node.js & Express** - Servidor
- **MongoDB & Mongoose** - Base de datos
- **JWT** - Autenticación
- **Socket.io** - WebSockets
- **Bcrypt** - Encriptación

## 🚀 **Instalación y Uso**

### **Prerrequisitos**
- Node.js 18+
- MongoDB
- npm o yarn

### **Instalación**
```bash
# Clonar el repositorio
git clone https://github.com/nicoalvarez08/dashboard-analytics-empresarial.git
cd dashboard-analytics-empresarial

# Instalar dependencias
npm run install-all

# Configurar variables de entorno
cp server/env.example server/.env
# Editar server/.env con tus credenciales

# Ejecutar en desarrollo
npm run dev
```

### **Credenciales de Demo**
- **Administrador:** `admin@dashboard.com` / `admin123`
- **Usuario:** `user@dashboard.com` / `user123`
- **Visitantes:** Cualquier email/contraseña (acceso como Usuario)

## 📁 **Estructura del Proyecto**

```
dashboard-analytics-empresarial/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/         # Páginas principales
│   │   ├── contexts/      # Context API
│   │   ├── config/        # Configuración
│   │   └── utils/         # Utilidades
├── server/                # Backend Node.js
│   ├── routes/           # Rutas de la API
│   ├── models/           # Modelos de MongoDB
│   └── scripts/          # Scripts de utilidad
└── docs/                 # Documentación
```

## 🌐 **Deploy**

### **Netlify (Frontend)**
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/nicoalvarez08/dashboard-analytics-empresarial)

### **Heroku (Backend)**
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/nicoalvarez08/dashboard-analytics-empresarial)

## 📊 **Características del Sistema**

El dashboard incluye visualizaciones avanzadas, métricas en tiempo real y un panel administrativo completo para la gestión de usuarios y datos. Todas las funcionalidades están optimizadas para proporcionar una experiencia de usuario fluida tanto en dispositivos móviles como en desktop.

## 🔧 **API Endpoints**

### **Autenticación**
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registro
- `GET /api/auth/me` - Perfil del usuario

### **Dashboard**
- `GET /api/dashboard/overview` - Resumen general
- `GET /api/dashboard/charts/:metric` - Datos de gráficos
- `GET /api/dashboard/realtime` - Métricas en tiempo real

### **Usuarios**
- `GET /api/users` - Lista de usuarios
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario

## 🤝 **Contribuciones**

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 **Autor**

**Nico Alvarez**
- GitHub: [@nicoalvarez08](https://github.com/nicoalvarez08)
- LinkedIn: [Nico Alvarez](https://linkedin.com/in/nicoalvarez08)

## 🙏 **Agradecimientos**

- React Team por el framework
- Chart.js por las librerías de gráficos
- MongoDB por la base de datos
- Netlify y Heroku por el hosting

---

⭐ **¡Dale una estrella si te gusta el proyecto!** ⭐
