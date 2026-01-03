import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};

const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';

export const WebSocketProvider = ({ children }) => {
  const { token } = useAuth();
  const [ws, setWs] = useState(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    if (!token) {
      if (ws) {
        ws.close();
      }
      return;
    }

    const connectWebSocket = () => {
      const websocket = new WebSocket(WS_URL);

      websocket.onopen = () => {
        console.log('WebSocket connected');
        setConnected(true);
        websocket.send(JSON.stringify({ type: 'authenticate', token }));
      };

      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'authenticated') {
            console.log('WebSocket authenticated');
          }
          
          if (data.type === 'notification') {
            setNotifications(prev => [...prev, data.notification]);
          }

          if (data.type === 'presence-update') {
            setActiveUsers(data.activeUsers);
          }

          if (data.type === 'idea-updated' || data.type === 'new-enhancement') {
            window.dispatchEvent(new CustomEvent('ws-message', { detail: data }));
          }
        } catch (error) {
          console.error('WebSocket message parse error:', error);
        }
      };

      websocket.onclose = () => {
        console.log('WebSocket disconnected');
        setConnected(false);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Reconnecting WebSocket...');
          connectWebSocket();
        }, 3000);
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      setWs(websocket);
    };

    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws) {
        ws.close();
      }
    };
  }, [token]);

  const send = (data) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  };

  const joinIdea = (ideaId) => {
    send({ type: 'join-idea', ideaId });
  };

  const leaveIdea = (ideaId) => {
    send({ type: 'leave-idea', ideaId });
  };

  const notifyIdeaUpdate = (ideaId, idea) => {
    send({ type: 'idea-update', ideaId, idea });
  };

  const notifyEnhancementCreated = (ideaId, enhancement) => {
    send({ type: 'enhancement-created', ideaId, enhancement });
  };

  const notifyIdeaShared = (targetUserId, ideaId, ideaTitle, sharedBy) => {
    send({ 
      type: 'idea-shared', 
      targetUserId, 
      ideaId, 
      ideaTitle, 
      sharedBy 
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value = {
    ws,
    connected,
    notifications,
    activeUsers,
    joinIdea,
    leaveIdea,
    notifyIdeaUpdate,
    notifyEnhancementCreated,
    notifyIdeaShared,
    clearNotifications,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
