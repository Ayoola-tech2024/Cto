import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import * as api from '../services/api';
import './Modal.css';

const ShareModal = ({ ideaId, onClose, onShared }) => {
  const [userIdentifier, setUserIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { notifyIdeaShared } = useWebSocket();

  const handleShare = async (e) => {
    e.preventDefault();
    
    if (!userIdentifier.trim()) {
      setError('Please enter a username or email');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const result = await api.shareIdea(ideaId, userIdentifier.trim());
      
      const sharedUser = result.collaborators.find(
        c => c.email === userIdentifier || c.username === userIdentifier
      );
      
      if (sharedUser) {
        notifyIdeaShared(sharedUser.id, ideaId, 'Idea', user.username || user.email);
      }
      
      onShared();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to share idea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔗 Share Idea</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleShare} className="modal-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="userIdentifier">Username or Email</label>
            <input
              id="userIdentifier"
              type="text"
              value={userIdentifier}
              onChange={(e) => setUserIdentifier(e.target.value)}
              placeholder="johndoe or john@example.com"
              autoFocus
            />
            <small>Enter the username or email of the person you want to share with</small>
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="button-secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="button-primary"
              disabled={loading}
            >
              {loading ? 'Sharing...' : 'Share'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareModal;
