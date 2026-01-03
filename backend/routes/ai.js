const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const auth = require('../middleware/auth');
const Idea = require('../models/Idea');
const Enhancement = require('../models/Enhancement');
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000;
const MAX_REQUESTS_PER_MINUTE = 15;

const checkRateLimit = (userId) => {
  const now = Date.now();
  const userRequests = rateLimitMap.get(userId) || [];
  
  const recentRequests = userRequests.filter(
    timestamp => now - timestamp < RATE_LIMIT_WINDOW
  );
  
  if (recentRequests.length >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(userId, recentRequests);
  
  return true;
};

router.post('/enhance/:ideaId', auth, async (req, res) => {
  try {
    const { ideaId } = req.params;

    const hasAccess = await Idea.hasAccess(ideaId, req.userId);
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!checkRateLimit(req.userId)) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please wait a moment before trying again.',
        retryAfter: 60 
      });
    }

    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are an AI assistant helping to enhance and expand ideas. Given the following idea, provide an enhanced, more detailed, and refined version. Make it more comprehensive, add relevant insights, and improve clarity while maintaining the original intent.

Title: ${idea.title}
Content: ${idea.content}

Please provide an enhanced version that:
1. Expands on the core concept
2. Adds relevant details and examples
3. Improves structure and clarity
4. Suggests potential next steps or considerations

Enhanced version:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const enhancedContent = response.text();

    const enhancement = await Enhancement.create(
      ideaId,
      idea.content,
      enhancedContent
    );

    res.json(enhancement);
  } catch (error) {
    console.error('AI enhancement error:', error);
    
    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return res.status(429).json({ 
        error: 'API rate limit reached. Please try again in a few moments.',
        retryAfter: 60 
      });
    }
    
    res.status(500).json({ error: 'Failed to enhance idea with AI' });
  }
});

router.get('/enhancements/:ideaId', auth, async (req, res) => {
  try {
    const { ideaId } = req.params;

    const hasAccess = await Idea.hasAccess(ideaId, req.userId);
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const enhancements = await Enhancement.findByIdeaId(ideaId);
    res.json(enhancements);
  } catch (error) {
    console.error('Get enhancements error:', error);
    res.status(500).json({ error: 'Failed to fetch enhancements' });
  }
});

module.exports = router;
