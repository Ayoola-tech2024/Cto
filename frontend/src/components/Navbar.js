import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { connected } = useWebSocket();

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <div className="navbar-brand">
          <h1>✨ Ideate</h1>
          {connected && (
            <span className="connection-status">
              <span className="status-dot"></span>
              Connected
            </span>
          )}
        </div>

        <div className="navbar-user">
          <span className="user-email">{user?.email}</span>
          <button className="logout-button" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
