import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
import { DashboardProvider } from './contexts/DashboardContext';
import { GlobalStyle, lightTheme, darkTheme } from './styles/GlobalStyle';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <GlobalStyle />
      <AuthProvider>
        <DashboardProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Ruta pública */}
                <Route path="/login" element={<Login />} />
                
                {/* Rutas protegidas */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="admin" element={<AdminPanel />} />
                  <Route path="profile" element={<Profile />} />
                </Route>
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
        </DashboardProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
