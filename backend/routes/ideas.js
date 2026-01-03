const express = require('express');
const auth = require('../middleware/auth');
const Idea = require('../models/Idea');
const Enhancement = require('../models/Enhancement');
const PublicShare = require('../models/PublicShare');
const User = require('../models/User');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const idea = await Idea.create(req.userId, title, content || '');
    res.status(201).json(idea);
  } catch (error) {
    console.error('Create idea error:', error);
    res.status(500).json({ error: 'Failed to create idea' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { filter } = req.query;

    if (filter === 'shared') {
      const sharedIdeas = await Idea.findSharedWithUser(req.userId);
      return res.json(sharedIdeas);
    }

    if (filter === 'owned') {
      const ownedIdeas = await Idea.findByUserId(req.userId);
      return res.json(ownedIdeas);
    }

    const ownedIdeas = await Idea.findByUserId(req.userId);
    const sharedIdeas = await Idea.findSharedWithUser(req.userId);
    
    const allIdeas = [...ownedIdeas.map(i => ({ ...i, is_owner: true })), 
                      ...sharedIdeas.map(i => ({ ...i, is_owner: false }))];
    
    allIdeas.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    res.json(allIdeas);
  } catch (error) {
    console.error('Get ideas error:', error);
    res.status(500).json({ error: 'Failed to fetch ideas' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const idea = await Idea.findById(id);

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    const hasAccess = await Idea.hasAccess(id, req.userId);
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const isOwner = await Idea.isOwner(id, req.userId);
    const collaborators = await Idea.getCollaborators(id);
    const enhancements = await Enhancement.findByIdeaId(id);
    const publicShare = await PublicShare.findByIdeaId(id);

    res.json({
      ...idea,
      is_owner: isOwner,
      collaborators,
      enhancements,
      public_share: publicShare,
    });
  } catch (error) {
    console.error('Get idea error:', error);
    res.status(500).json({ error: 'Failed to fetch idea' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const hasAccess = await Idea.hasAccess(id, req.userId);
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const idea = await Idea.update(id, title, content || '');
    res.json(idea);
  } catch (error) {
    console.error('Update idea error:', error);
    res.status(500).json({ error: 'Failed to update idea' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const isOwner = await Idea.isOwner(id, req.userId);
    if (!isOwner) {
      return res.status(403).json({ error: 'Only the owner can delete this idea' });
    }

    await Idea.delete(id);
    res.json({ message: 'Idea deleted successfully' });
  } catch (error) {
    console.error('Delete idea error:', error);
    res.status(500).json({ error: 'Failed to delete idea' });
  }
});

router.post('/:id/share', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { userIdentifier, permissionLevel } = req.body;

    const isOwner = await Idea.isOwner(id, req.userId);
    if (!isOwner) {
      return res.status(403).json({ error: 'Only the owner can share this idea' });
    }

    let targetUser = await User.findByEmail(userIdentifier);
    if (!targetUser) {
      targetUser = await User.findByUsername(userIdentifier);
    }

    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (targetUser.id === req.userId) {
      return res.status(400).json({ error: 'Cannot share with yourself' });
    }

    await Idea.addCollaborator(id, targetUser.id, permissionLevel || 'edit');
    
    const collaborators = await Idea.getCollaborators(id);
    res.json({ message: 'Idea shared successfully', collaborators });
  } catch (error) {
    console.error('Share idea error:', error);
    res.status(500).json({ error: 'Failed to share idea' });
  }
});

router.delete('/:id/share/:userId', auth, async (req, res) => {
  try {
    const { id, userId } = req.params;

    const isOwner = await Idea.isOwner(id, req.userId);
    if (!isOwner) {
      return res.status(403).json({ error: 'Only the owner can remove collaborators' });
    }

    await Idea.removeCollaborator(id, userId);
    
    const collaborators = await Idea.getCollaborators(id);
    res.json({ message: 'Collaborator removed successfully', collaborators });
  } catch (error) {
    console.error('Remove collaborator error:', error);
    res.status(500).json({ error: 'Failed to remove collaborator' });
  }
});

router.post('/:id/public-share', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const isOwner = await Idea.isOwner(id, req.userId);
    if (!isOwner) {
      return res.status(403).json({ error: 'Only the owner can create public links' });
    }

    const publicShare = await PublicShare.create(id);
    res.json(publicShare);
  } catch (error) {
    console.error('Create public share error:', error);
    res.status(500).json({ error: 'Failed to create public share link' });
  }
});

router.delete('/:id/public-share', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const isOwner = await Idea.isOwner(id, req.userId);
    if (!isOwner) {
      return res.status(403).json({ error: 'Only the owner can revoke public links' });
    }

    await PublicShare.delete(id);
    res.json({ message: 'Public share link revoked' });
  } catch (error) {
    console.error('Delete public share error:', error);
    res.status(500).json({ error: 'Failed to revoke public share link' });
  }
});

router.get('/public/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const share = await PublicShare.findByToken(token);

    if (!share) {
      return res.status(404).json({ error: 'Share link not found or expired' });
    }

    const enhancements = await Enhancement.findByIdeaId(share.idea_id);

    res.json({
      id: share.idea_id,
      title: share.title,
      content: share.content,
      owner_username: share.owner_username,
      created_at: share.created_at,
      updated_at: share.updated_at,
      enhancements,
      is_public: true,
    });
  } catch (error) {
    console.error('Get public share error:', error);
    res.status(500).json({ error: 'Failed to fetch shared idea' });
  }
});

module.exports = router;
