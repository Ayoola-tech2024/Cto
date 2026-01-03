const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const signup = async (email, username, password) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Signup failed');
  }
  
  return response.json();
};

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }
  
  return response.json();
};

export const verifyToken = async (token) => {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  if (!response.ok) {
    throw new Error('Token verification failed');
  }
  
  return response.json();
};

export const getIdeas = async (filter = 'all') => {
  const response = await fetch(`${API_URL}/ideas?filter=${filter}`, {
    headers: getAuthHeader(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch ideas');
  }
  
  return response.json();
};

export const getIdea = async (id) => {
  const response = await fetch(`${API_URL}/ideas/${id}`, {
    headers: getAuthHeader(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch idea');
  }
  
  return response.json();
};

export const createIdea = async (title, content) => {
  const response = await fetch(`${API_URL}/ideas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ title, content }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create idea');
  }
  
  return response.json();
};

export const updateIdea = async (id, title, content) => {
  const response = await fetch(`${API_URL}/ideas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ title, content }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update idea');
  }
  
  return response.json();
};

export const deleteIdea = async (id) => {
  const response = await fetch(`${API_URL}/ideas/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete idea');
  }
  
  return response.json();
};

export const shareIdea = async (ideaId, userIdentifier, permissionLevel = 'edit') => {
  const response = await fetch(`${API_URL}/ideas/${ideaId}/share`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ userIdentifier, permissionLevel }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to share idea');
  }
  
  return response.json();
};

export const removeCollaborator = async (ideaId, userId) => {
  const response = await fetch(`${API_URL}/ideas/${ideaId}/share/${userId}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to remove collaborator');
  }
  
  return response.json();
};

export const createPublicShare = async (ideaId) => {
  const response = await fetch(`${API_URL}/ideas/${ideaId}/public-share`, {
    method: 'POST',
    headers: getAuthHeader(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create public share link');
  }
  
  return response.json();
};

export const deletePublicShare = async (ideaId) => {
  const response = await fetch(`${API_URL}/ideas/${ideaId}/public-share`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to revoke public share link');
  }
  
  return response.json();
};

export const getPublicIdea = async (token) => {
  const response = await fetch(`${API_URL}/ideas/public/${token}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch shared idea');
  }
  
  return response.json();
};

export const enhanceIdea = async (ideaId) => {
  const response = await fetch(`${API_URL}/ai/enhance/${ideaId}`, {
    method: 'POST',
    headers: getAuthHeader(),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to enhance idea');
  }
  
  return response.json();
};

export const getEnhancements = async (ideaId) => {
  const response = await fetch(`${API_URL}/ai/enhancements/${ideaId}`, {
    headers: getAuthHeader(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch enhancements');
  }
  
  return response.json();
};
