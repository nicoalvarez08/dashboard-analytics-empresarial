import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { mockOverview, mockChartData, mockRealtimeData } from '../data/mockData';

const DashboardContext = createContext();

const initialState = {
  overview: null,
  charts: {},
  realtimeData: [],
  loading: {
    overview: false,
    charts: {},
    realtime: false
  },
  error: null,
  socket: null
};

const dashboardReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value
        }
      };
    case 'SET_OVERVIEW':
      return {
        ...state,
        overview: action.payload,
        loading: {
          ...state.loading,
          overview: false
        }
      };
    case 'SET_CHART_DATA':
      return {
        ...state,
        charts: {
          ...state.charts,
          [action.payload.metric]: action.payload.data
        },
        loading: {
          ...state.loading,
          charts: {
            ...state.loading.charts,
            [action.payload.metric]: false
          }
        }
      };
    case 'SET_REALTIME_DATA':
      return {
        ...state,
        realtimeData: action.payload,
        loading: {
          ...state.loading,
          realtime: false
        }
      };
    case 'ADD_REALTIME_UPDATE':
      return {
        ...state,
        realtimeData: [action.payload, ...state.realtimeData.slice(0, 49)] // Mantener solo los últimos 50
      };
    case 'SET_SOCKET':
      return {
        ...state,
        socket: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: {
          overview: false,
          charts: {},
          realtime: false
        }
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const DashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  // Inicializar WebSocket
  useEffect(() => {
    const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');
    
    socket.on('connect', () => {
      console.log('🔌 Conectado al servidor WebSocket');
    });

    socket.on('realtime-update', (data) => {
      dispatch({
        type: 'ADD_REALTIME_UPDATE',
        payload: data
      });
    });

    socket.on('new-metric', (data) => {
      // Actualizar datos en tiempo real cuando llega una nueva métrica
      dispatch({
        type: 'ADD_REALTIME_UPDATE',
        payload: data
      });
    });

    dispatch({
      type: 'SET_SOCKET',
      payload: socket
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchOverview = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'overview', value: true } });
      
      const response = await axios.get('/dashboard/overview');
      dispatch({
        type: 'SET_OVERVIEW',
        payload: response.data
      });
    } catch (error) {
      console.log('Usando datos de ejemplo para overview');
      dispatch({
        type: 'SET_OVERVIEW',
        payload: mockOverview
      });
    }
  };

  const fetchChartData = async (metric, options = {}) => {
    try {
      dispatch({ 
        type: 'SET_LOADING', 
        payload: { key: 'charts', value: { [metric]: true } } 
      });
      
      const params = new URLSearchParams(options);
      const response = await axios.get(`/dashboard/charts/${metric}?${params}`);
      
      dispatch({
        type: 'SET_CHART_DATA',
        payload: {
          metric,
          data: response.data
        }
      });
    } catch (error) {
      console.log(`Usando datos de ejemplo para ${metric}`);
      dispatch({
        type: 'SET_CHART_DATA',
        payload: {
          metric,
          data: mockChartData[metric] || mockChartData.sales
        }
      });
    }
  };

  const fetchRealtimeData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'realtime', value: true } });
      
      const response = await axios.get('/dashboard/realtime');
      dispatch({
        type: 'SET_REALTIME_DATA',
        payload: response.data.data
      });
    } catch (error) {
      console.log('Usando datos de ejemplo para tiempo real');
      dispatch({
        type: 'SET_REALTIME_DATA',
        payload: mockRealtimeData
      });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchOverview();
    fetchRealtimeData();
    
    // Cargar gráficos principales
    const mainMetrics = ['sales', 'users', 'revenue', 'traffic'];
    mainMetrics.forEach(metric => {
      fetchChartData(metric, { days: 30 });
    });
  }, []);

  const value = {
    ...state,
    fetchOverview,
    fetchChartData,
    fetchRealtimeData,
    clearError
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard debe ser usado dentro de DashboardProvider');
  }
  return context;
};
