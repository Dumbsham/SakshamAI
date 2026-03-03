const express = require('express');
const multer = require('multer');
const { transcribeAudio } = require('../services/gcpSpeech');
const { ask } = require('../services/gemini');
const router = express.Router();
const upload = multer();

// Original route — transcribe + career suggestions
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const transcript = await transcribeAudio(req.file.buffer);

    const prompt = `
  A person described themselves in Hindi, English, or Hinglish: "${transcript}"
  Suggest 5 career paths (freelance and traditional) suitable for them.
  
  IMPORTANT: 
  - Write "title" in English (e.g. "Web Developer")
  - Write "description" in Hindi (e.g. "यह एक ऐसा career है जहाँ...")
  - Return ONLY a raw JSON array starting with [
  
  [{ "title": "...", "type": "freelance|traditional", "description": "Hindi mein likho..." }]
`;
    const careers = await ask(prompt);
    res.json({ transcript, careers });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// NEW route — sirf transcription, no Gemini (AgentChat voice loop ke liye)
router.post('/transcribe-only', upload.single('audio'), async (req, res) => {
  try {
    const language = req.body.language || 'hindi';
    const transcript = await transcribeAudio(req.file.buffer, language);
    res.json({ transcript });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;