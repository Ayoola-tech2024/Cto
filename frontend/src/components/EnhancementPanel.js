import React, { useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import * as api from '../services/api';
import './EnhancementPanel.css';

const EnhancementPanel = ({ ideaId, enhancements, onEnhancementCreated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { notifyEnhancementCreated } = useWebSocket();

  const handleEnhance = async () => {
    try {
      setLoading(true);
      setError('');
      const enhancement = await api.enhanceIdea(ideaId);
      notifyEnhancementCreated(ideaId, enhancement);
      onEnhancementCreated();
    } catch (err) {
      setError(err.message || 'Failed to enhance idea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="enhancement-panel">
      <div className="panel-header">
        <h3>🤖 AI Enhancements</h3>
        <button 
          className="enhance-button"
          onClick={handleEnhance}
          disabled={loading}
        >
          {loading ? 'Enhancing...' : '✨ Enhance'}
        </button>
      </div>

      {error && (
        <div className="enhancement-error">{error}</div>
      )}

      {loading && (
        <div className="enhancement-loading">
          <div className="loading-spinner"></div>
          <p>AI is analyzing and enhancing your idea...</p>
        </div>
      )}

      <div className="enhancements-list">
        {enhancements && enhancements.length > 0 ? (
          enhancements.map((enhancement) => (
            <div key={enhancement.id} className="enhancement-item">
              <div className="enhancement-date">
                {new Date(enhancement.created_at).toLocaleString()}
              </div>
              <div className="enhancement-content">
                {enhancement.enhanced_content}
              </div>
            </div>
          ))
        ) : (
          <div className="no-enhancements">
            <p>No AI enhancements yet.</p>
            <p>Click "Enhance" to get AI-powered suggestions!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancementPanel;
