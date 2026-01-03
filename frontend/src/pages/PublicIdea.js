import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as api from '../services/api';
import './PublicIdea.css';

const PublicIdea = () => {
  const { token } = useParams();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadIdea = async () => {
      try {
        const data = await api.getPublicIdea(token);
        setIdea(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadIdea();
  }, [token]);

  if (loading) {
    return (
      <div className="public-idea">
        <div className="container">
          <div className="loading">Loading shared idea...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="public-idea">
        <div className="container">
          <div className="error-state">
            <h2>❌ Link not found</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="public-idea">
      <div className="public-header">
        <div className="container">
          <h1>✨ Ideate</h1>
          <p>Shared by {idea.owner_username}</p>
        </div>
      </div>

      <div className="container public-content">
        <div className="idea-box">
          <h2>{idea.title}</h2>
          <div className="idea-meta">
            Created {new Date(idea.created_at).toLocaleDateString()}
          </div>
          <div className="idea-content">
            {idea.content}
          </div>
        </div>

        {idea.enhancements && idea.enhancements.length > 0 && (
          <div className="enhancements-section">
            <h3>🤖 AI Enhancements</h3>
            {idea.enhancements.map((enhancement) => (
              <div key={enhancement.id} className="enhancement-box">
                <div className="enhancement-date">
                  {new Date(enhancement.created_at).toLocaleString()}
                </div>
                <div className="enhancement-content">
                  {enhancement.enhanced_content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicIdea;
