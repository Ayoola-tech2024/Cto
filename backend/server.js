const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const ideasRoutes = require('./routes/ideas');
const aiRoutes = require('./routes/ai');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideasRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const clients = new Map();
const ideaRooms = new Map();

wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'authenticate') {
        try {
          const decoded = jwt.verify(data.token, process.env.JWT_SECRET);
          ws.userId = decoded.userId;
          ws.userEmail = decoded.email;
          clients.set(ws.userId, ws);
          
          ws.send(JSON.stringify({ 
            type: 'authenticated', 
            userId: ws.userId 
          }));
        } catch (error) {
          ws.send(JSON.stringify({ 
            type: 'error', 
            message: 'Authentication failed' 
          }));
          ws.close();
        }
      }

      if (data.type === 'join-idea') {
        if (!ws.userId) {
          ws.send(JSON.stringify({ 
            type: 'error', 
            message: 'Not authenticated' 
          }));
          return;
        }

        const ideaId = data.ideaId;
        ws.currentIdeaId = ideaId;

        if (!ideaRooms.has(ideaId)) {
          ideaRooms.set(ideaId, new Set());
        }
        ideaRooms.get(ideaId).add(ws);

        const activeUsers = Array.from(ideaRooms.get(ideaId))
          .filter(client => client.userId)
          .map(client => ({
            userId: client.userId,
            email: client.userEmail,
          }));

        ideaRooms.get(ideaId).forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'presence-update',
              ideaId,
              activeUsers,
            }));
          }
        });
      }

      if (data.type === 'leave-idea') {
        if (ws.currentIdeaId && ideaRooms.has(ws.currentIdeaId)) {
          ideaRooms.get(ws.currentIdeaId).delete(ws);
          
          const activeUsers = Array.from(ideaRooms.get(ws.currentIdeaId))
            .filter(client => client.userId)
            .map(client => ({
              userId: client.userId,
              email: client.userEmail,
            }));

          ideaRooms.get(ws.currentIdeaId).forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'presence-update',
                ideaId: ws.currentIdeaId,
                activeUsers,
              }));
            }
          });
        }
        ws.currentIdeaId = null;
      }

      if (data.type === 'idea-update') {
        if (!ws.userId || !ws.currentIdeaId) return;

        const ideaId = data.ideaId;
        if (ideaRooms.has(ideaId)) {
          ideaRooms.get(ideaId).forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'idea-updated',
                ideaId,
                idea: data.idea,
                updatedBy: ws.userId,
              }));
            }
          });
        }
      }

      if (data.type === 'enhancement-created') {
        if (!ws.userId) return;

        const ideaId = data.ideaId;
        if (ideaRooms.has(ideaId)) {
          ideaRooms.get(ideaId).forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'new-enhancement',
                ideaId,
                enhancement: data.enhancement,
              }));
            }
          });
        }
      }

      if (data.type === 'idea-shared') {
        const targetUserId = data.targetUserId;
        const targetClient = clients.get(targetUserId);
        
        if (targetClient && targetClient.readyState === WebSocket.OPEN) {
          targetClient.send(JSON.stringify({
            type: 'notification',
            notification: {
              type: 'idea-shared',
              message: `${data.sharedBy} shared an idea with you: "${data.ideaTitle}"`,
              ideaId: data.ideaId,
              timestamp: new Date().toISOString(),
            },
          }));
        }
      }

    } catch (error) {
      console.error('WebSocket message error:', error);
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: 'Invalid message format' 
      }));
    }
  });

  ws.on('close', () => {
    if (ws.currentIdeaId && ideaRooms.has(ws.currentIdeaId)) {
      ideaRooms.get(ws.currentIdeaId).delete(ws);
      
      const activeUsers = Array.from(ideaRooms.get(ws.currentIdeaId))
        .filter(client => client.userId)
        .map(client => ({
          userId: client.userId,
          email: client.userEmail,
        }));

      ideaRooms.get(ws.currentIdeaId).forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'presence-update',
            ideaId: ws.currentIdeaId,
            activeUsers,
          }));
        }
      });
    }

    if (ws.userId) {
      clients.delete(ws.userId);
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready`);
});
