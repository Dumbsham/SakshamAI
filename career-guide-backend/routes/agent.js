const express = require('express');
const { requireAuth, getAuth } = require('@clerk/express');
const router = express.Router();

const PYTHON_AGENT_URL = process.env.PYTHON_AGENT_URL || 'http://localhost:8000';

router.post('/chat', requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { message, history, context, courses, jobs, schemes } = req.body;

    // Forward to Python LangGraph agent
    console.log('Calling Python agent at:', `${PYTHON_AGENT_URL}/chat`);
    const response = await fetch(`${PYTHON_AGENT_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: history || [],
        context: { ...context, userId },
        courses: courses || [],
        jobs: jobs || [],
        schemes: schemes || [],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Python agent error: ${err}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (e) {
    console.error('Agent route error:', e.message, e.cause);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;