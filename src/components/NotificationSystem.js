import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  FiCheckCircle, 
  FiAlertCircle, 
  FiInfo, 
  FiX,
  FiBell,
  FiSettings
} from 'react-icons/fi';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 400px;
`;

const Notification = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.xl};
  animation: ${props => props.isExiting ? slideOut : slideIn} 0.3s ease-out;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => {
      switch (props.type) {
        case 'success': return props.theme.colors.success;
        case 'error': return props.theme.colors.error;
        case 'warning': return props.theme.colors.warning;
        default: return props.theme.colors.primary;
      }
    }};
  }
`;

const NotificationIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: ${props => {
    switch (props.type) {
      case 'success': return `${props.theme.colors.success}15`;
      case 'error': return `${props.theme.colors.error}15`;
      case 'warning': return `${props.theme.colors.warning}15`;
      default: return `${props.theme.colors.primary}15`;
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'success': return props.theme.colors.success;
      case 'error': return props.theme.colors.error;
      case 'warning': return props.theme.colors.warning;
      default: return props.theme.colors.primary;
    }
  }};
  flex-shrink: 0;
`;

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
`;

const NotificationMessage = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  line-height: 1.4;
`;

const NotificationClose = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.textMuted};
  cursor: pointer;
  border-radius: ${props => props.theme.borderRadius.sm};
  transition: all ${props => props.theme.transitions.fast};
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
    color: ${props => props.theme.colors.text};
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: ${props => {
    switch (props.type) {
      case 'success': return props.theme.colors.success;
      case 'error': return props.theme.colors.error;
      case 'warning': return props.theme.colors.warning;
      default: return props.theme.colors.primary;
    }
  }};
  width: ${props => props.progress}%;
  transition: width 0.1s linear;
`;

const NotificationBell = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: ${props => props.theme.shadows.lg};
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    transform: scale(1.1);
  }

  ${props => props.hasNotifications && `
    &::after {
      content: '';
      position: absolute;
      top: -2px;
      right: -2px;
      width: 0.75rem;
      height: 0.75rem;
      background: ${props.theme.colors.error};
      border-radius: 50%;
      border: 2px solid white;
    }
  `}
`;

// Hook para usar las notificaciones
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      title: 'Notificación',
      message: '',
      duration: 5000,
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove notification
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll
  };
};

// Componente principal de notificaciones
const NotificationSystem = ({ notifications, onRemove }) => {
  const [exitingIds, setExitingIds] = useState(new Set());

  const handleRemove = (id) => {
    setExitingIds(prev => new Set([...prev, id]));
    
    setTimeout(() => {
      onRemove(id);
      setExitingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 300);
  };

  return (
    <NotificationContainer>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          isExiting={exitingIds.has(notification.id)}
        >
          <NotificationIcon type={notification.type}>
            {notification.type === 'success' && <FiCheckCircle />}
            {notification.type === 'error' && <FiAlertCircle />}
            {notification.type === 'warning' && <FiAlertCircle />}
            {notification.type === 'info' && <FiInfo />}
          </NotificationIcon>
          
          <NotificationContent>
            <NotificationTitle>{notification.title}</NotificationTitle>
            <NotificationMessage>{notification.message}</NotificationMessage>
          </NotificationContent>
          
          <NotificationClose onClick={() => handleRemove(notification.id)}>
            <FiX />
          </NotificationClose>
          
          {notification.duration > 0 && (
            <ProgressBar 
              type={notification.type}
              progress={notification.progress || 100}
            />
          )}
        </Notification>
      ))}
    </NotificationContainer>
  );
};

// Componente de campana de notificaciones
export const NotificationBellComponent = ({ onClick, hasNotifications = false }) => {
  return (
    <NotificationBell onClick={onClick} hasNotifications={hasNotifications}>
      <FiBell />
    </NotificationBell>
  );
};

// Utilidades para mostrar notificaciones
export const showSuccess = (addNotification) => (title, message) => {
  addNotification({
    type: 'success',
    title,
    message
  });
};

export const showError = (addNotification) => (title, message) => {
  addNotification({
    type: 'error',
    title,
    message,
    duration: 7000
  });
};

export const showWarning = (addNotification) => (title, message) => {
  addNotification({
    type: 'warning',
    title,
    message
  });
};

export const showInfo = (addNotification) => (title, message) => {
  addNotification({
    type: 'info',
    title,
    message
  });
};

export default NotificationSystem;
