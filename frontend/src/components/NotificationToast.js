import React, { useEffect } from 'react';
import './NotificationToast.css';

const NotificationToast = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="notification-toast">
      <div className="notification-content">
        <div className="notification-icon">🔔</div>
        <div className="notification-message">{notification.message}</div>
      </div>
      <button className="notification-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default NotificationToast;
