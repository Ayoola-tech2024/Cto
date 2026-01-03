import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWebSocket } from '../context/WebSocketContext';
import * as api from '../services/api';
import Navbar from '../components/Navbar';
import IdeaEditor from '../components/IdeaEditor';
import EnhancementPanel from '../components/EnhancementPanel';
import CollaboratorsPanel from '../components/CollaboratorsPanel';
import ShareModal from '../components/ShareModal';
import './IdeaDetail.css';

const IdeaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { joinIdea, leaveIdea, notifyIdeaUpdate, activeUsers } = useWebSocket();

  const loadIdea = async () => {
    try {
      setLoading(true);
      const data = await api.getIdea(id);
      setIdea(data);
    } catch (error) {
      console.error('Failed to load idea:', error);
      alert('Failed to load idea. You may not have access.');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIdea();
    joinIdea(id);

    return () => {
      leaveIdea(id);
    };
  }, [id]);

  useEffect(() => {
    const handleWsMessage = (event) => {
      const data = event.detail;
      if (data.type === 'idea-updated' && data.ideaId === parseInt(id)) {
        loadIdea();
      }
      if (data.type === 'new-enhancement' && data.ideaId === parseInt(id)) {
        loadIdea();
      }
    };

    window.addEventListener('ws-message', handleWsMessage);
    return () => window.removeEventListener('ws-message', handleWsMessage);
  }, [id]);

  const handleSave = async (title, content) => {
    try {
      setSaving(true);
      const updated = await api.updateIdea(id, title, content);
      setIdea({ ...idea, ...updated });
      notifyIdeaUpdate(id, updated);
    } catch (error) {
      console.error('Failed to save idea:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleEnhancementCreated = () => {
    loadIdea();
  };

  const handleCollaboratorsUpdated = () => {
    loadIdea();
  };

  if (loading) {
    return (
      <div className="idea-detail">
        <Navbar />
        <div className="container" style={{ paddingTop: '100px' }}>
          <div className="loading">Loading idea...</div>
        </div>
      </div>
    );
  }

  if (!idea) {
    return null;
  }

  return (
    <div className="idea-detail">
      <Navbar />

      <div className="container idea-detail-content">
        <div className="idea-detail-header">
          <button className="back-button" onClick={() => navigate('/')}>
            ← Back to Dashboard
          </button>
          
          <div className="idea-actions">
            {saving && <span className="saving-indicator">Saving...</span>}
            {idea.is_owner && (
              <button 
                className="share-button"
                onClick={() => setShowShareModal(true)}
              >
                🔗 Share
              </button>
            )}
          </div>
        </div>

        <div className="idea-detail-grid">
          <div className="idea-main">
            <IdeaEditor
              idea={idea}
              onSave={handleSave}
              readOnly={!idea.is_owner && idea.permission_level === 'view'}
            />

            {activeUsers.length > 0 && (
              <div className="active-users">
                <div className="active-users-label">👥 Active now:</div>
                <div className="active-users-list">
                  {activeUsers.map((user, index) => (
                    <div key={index} className="active-user">
                      <span className="active-dot"></span>
                      {user.email}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="idea-sidebar">
            <EnhancementPanel
              ideaId={id}
              enhancements={idea.enhancements}
              onEnhancementCreated={handleEnhancementCreated}
            />

            {idea.is_owner && (
              <CollaboratorsPanel
                ideaId={id}
                collaborators={idea.collaborators}
                publicShare={idea.public_share}
                onUpdate={handleCollaboratorsUpdated}
              />
            )}
          </div>
        </div>
      </div>

      {showShareModal && (
        <ShareModal
          ideaId={id}
          onClose={() => setShowShareModal(false)}
          onShared={handleCollaboratorsUpdated}
        />
      )}
    </div>
  );
};

export default IdeaDetail;
