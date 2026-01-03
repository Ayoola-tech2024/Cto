import React from 'react';
import './IdeaCard.css';

const IdeaCard = ({ idea, onDelete, onClick }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(idea.id);
  };

  const truncateContent = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="idea-card" onClick={onClick}>
      <div className="idea-card-header">
        <h3>{idea.title}</h3>
        {!idea.is_owner && (
          <span className="shared-badge">Shared</span>
        )}
      </div>

      <p className="idea-card-content">
        {truncateContent(idea.content)}
      </p>

      <div className="idea-card-footer">
        <div className="idea-card-meta">
          <span>
            {new Date(idea.updated_at).toLocaleDateString()}
          </span>
          {idea.owner_username && idea.owner_username !== idea.email && (
            <span className="idea-owner">by {idea.owner_username}</span>
          )}
        </div>

        {idea.is_owner && (
          <button 
            className="delete-button"
            onClick={handleDelete}
            title="Delete idea"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
};

export default IdeaCard;
