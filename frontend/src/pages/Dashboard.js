import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import * as api from '../services/api';
import Navbar from '../components/Navbar';
import IdeaCard from '../components/IdeaCard';
import CreateIdeaModal from '../components/CreateIdeaModal';
import NotificationToast from '../components/NotificationToast';
import './Dashboard.css';

const Dashboard = () => {
  const [ideas, setIdeas] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuth();
  const { notifications, clearNotifications } = useWebSocket();
  const navigate = useNavigate();

  const loadIdeas = async () => {
    try {
      setLoading(true);
      const data = await api.getIdeas(filter);
      setIdeas(data);
    } catch (error) {
      console.error('Failed to load ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIdeas();
  }, [filter]);

  useEffect(() => {
    const handleWsMessage = (event) => {
      const data = event.detail;
      if (data.type === 'idea-updated') {
        loadIdeas();
      }
    };

    window.addEventListener('ws-message', handleWsMessage);
    return () => window.removeEventListener('ws-message', handleWsMessage);
  }, []);

  const handleCreateIdea = async (title, content) => {
    try {
      await api.createIdea(title, content);
      setShowCreateModal(false);
      loadIdeas();
    } catch (error) {
      console.error('Failed to create idea:', error);
      throw error;
    }
  };

  const handleDeleteIdea = async (id) => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      try {
        await api.deleteIdea(id);
        loadIdeas();
      } catch (error) {
        console.error('Failed to delete idea:', error);
      }
    }
  };

  const filteredIdeas = ideas;

  return (
    <div className="dashboard">
      <Navbar />

      <div className="container dashboard-content">
        <div className="dashboard-header">
          <h1>Your Ideas</h1>
          <button 
            className="create-button"
            onClick={() => setShowCreateModal(true)}
          >
            ✨ New Idea
          </button>
        </div>

        <div className="filter-tabs">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All Ideas
          </button>
          <button
            className={filter === 'owned' ? 'active' : ''}
            onClick={() => setFilter('owned')}
          >
            My Ideas
          </button>
          <button
            className={filter === 'shared' ? 'active' : ''}
            onClick={() => setFilter('shared')}
          >
            Shared with Me
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading ideas...</div>
        ) : filteredIdeas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💡</div>
            <h2>No ideas yet</h2>
            <p>Start by creating your first idea!</p>
            <button 
              className="create-button"
              onClick={() => setShowCreateModal(true)}
            >
              Create Idea
            </button>
          </div>
        ) : (
          <div className="ideas-grid">
            {filteredIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onDelete={handleDeleteIdea}
                onClick={() => navigate(`/idea/${idea.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateIdeaModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateIdea}
        />
      )}

      {notifications.map((notification, index) => (
        <NotificationToast
          key={index}
          notification={notification}
          onClose={clearNotifications}
        />
      ))}
    </div>
  );
};

export default Dashboard;
