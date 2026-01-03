import React, { useState } from 'react';
import * as api from '../services/api';
import './CollaboratorsPanel.css';

const CollaboratorsPanel = ({ ideaId, collaborators, publicShare, onUpdate }) => {
  const [showPublicLink, setShowPublicLink] = useState(false);
  const [publicLink, setPublicLink] = useState(
    publicShare ? `${window.location.origin}/share/${publicShare.share_token}` : null
  );

  const handleGeneratePublicLink = async () => {
    try {
      const share = await api.createPublicShare(ideaId);
      const link = `${window.location.origin}/share/${share.share_token}`;
      setPublicLink(link);
      setShowPublicLink(true);
      onUpdate();
    } catch (error) {
      alert('Failed to generate public link');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicLink);
    alert('Link copied to clipboard!');
  };

  const handleRevokeLink = async () => {
    if (window.confirm('Are you sure you want to revoke this public link?')) {
      try {
        await api.deletePublicShare(ideaId);
        setPublicLink(null);
        setShowPublicLink(false);
        onUpdate();
      } catch (error) {
        alert('Failed to revoke link');
      }
    }
  };

  const handleRemoveCollaborator = async (userId) => {
    if (window.confirm('Remove this collaborator?')) {
      try {
        await api.removeCollaborator(ideaId, userId);
        onUpdate();
      } catch (error) {
        alert('Failed to remove collaborator');
      }
    }
  };

  return (
    <div className="collaborators-panel">
      <h3>👥 Collaborators</h3>

      {collaborators && collaborators.length > 0 ? (
        <div className="collaborators-list">
          {collaborators.map((collaborator) => (
            <div key={collaborator.id} className="collaborator-item">
              <div className="collaborator-info">
                <div className="collaborator-name">{collaborator.username}</div>
                <div className="collaborator-email">{collaborator.email}</div>
              </div>
              <button
                className="remove-button"
                onClick={() => handleRemoveCollaborator(collaborator.id)}
                title="Remove collaborator"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-collaborators">No collaborators yet</p>
      )}

      <div className="public-link-section">
        <h4>🔗 Public Link</h4>
        
        {publicLink ? (
          <div className="public-link-container">
            <input
              type="text"
              value={publicLink}
              readOnly
              className="public-link-input"
            />
            <div className="link-actions">
              <button className="copy-button" onClick={handleCopyLink}>
                📋 Copy
              </button>
              <button className="revoke-button" onClick={handleRevokeLink}>
                🗑️ Revoke
              </button>
            </div>
          </div>
        ) : (
          <button 
            className="generate-link-button"
            onClick={handleGeneratePublicLink}
          >
            Generate Public Link
          </button>
        )}
      </div>
    </div>
  );
};

export default CollaboratorsPanel;
