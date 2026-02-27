const { ask } = require('./gemini');
const { speak } = require('./tts');
const UserProfile = require('../models/UserProfile');

const languageNames = {
  hindi: 'Hindi', tamil: 'Tamil', telugu: 'Telugu', marathi: 'Marathi', english: 'English'
};

const openingMessages = {
  hindi:   'नमस्ते! मैं आपकी AI career guide हूँ। आपका नाम क्या है?',
  tamil:   'வணக்கம்! நான் உங்கள் AI career guide. உங்கள் பெயர் என்ன?',
  telugu:  'నమస్కారం! నేను మీ AI career guide ని. మీ పేరు ఏమిటి?',
  marathi: 'नमस्कार! मी तुमची AI career guide आहे. तुमचं नाव काय आहे?',
  english: 'Hello! I am your AI career guide. What is your name?'
};

async function processConversationTurn(userId, userTranscript, conversationHistory, language = 'hindi') {
  const langName = languageNames[language] || 'Hindi';

  // Load existing profile to know what's already collected
  const existingProfile = await UserProfile.findOne({ userId });
  const alreadyCollected = {
    name: existingProfile?.name || null,
    age: existingProfile?.age || null,
    education: existingProfile?.education || null,
    digitalLiteracy: existingProfile?.digitalLiteracy ?? null,
    englishLevel: existingProfile?.englishLevel || null,
  };

  // Figure out what's still missing
  const missing = Object.entries(alreadyCollected)
    .filter(([, v]) => v === null || v === undefined)
    .map(([k]) => k);

  // All collected — mark complete
  if (missing.length === 0) {
    const closingMsgs = {
      hindi: `शुक्रिया ${alreadyCollected.name}! आपकी profile save हो गई। अब career guide शुरू करते हैं!`,
      tamil: `நன்றி ${alreadyCollected.name}! உங்கள் profile சேமிக்கப்பட்டது.`,
      telugu: `ధన్యవాదాలు ${alreadyCollected.name}! మీ profile సేవ్ అయింది.`,
      marathi: `धन्यवाद ${alreadyCollected.name}! तुमची profile save झाली.`,
      english: `Thank you ${alreadyCollected.name}! Your profile is saved. Let's start!`,
    };
    const msg = closingMsgs[language] || closingMsgs.hindi;
    await UserProfile.findOneAndUpdate(
      { userId },
      { $set: { profileComplete: true, preferredLanguage: language } },
      { upsert: true }
    );
    const audioBase64 = await speak(msg, language);
    return { aiText: msg, aiAudio: audioBase64, profileComplete: true, conversationDone: true };
  }

  // Format conversation history for context
  const historyText = conversationHistory.length > 0
    ? conversationHistory.map(h => `${h.role === 'ai' ? 'AI' : 'User'}: ${h.text}`).join('\n')
    : 'Abhi conversation shuru hua hai';

  const prompt = `
You are a warm AI career counselor for Indian women.
Respond ONLY in ${langName}. No other language.

Already collected from this user:
- name: ${alreadyCollected.name || 'NOT YET'}
- age: ${alreadyCollected.age || 'NOT YET'}
- education: ${alreadyCollected.education || 'NOT YET'}
- digitalLiteracy (smartphone use kar sakti hain?): ${alreadyCollected.digitalLiteracy === null ? 'NOT YET' : alreadyCollected.digitalLiteracy}
- englishLevel: ${alreadyCollected.englishLevel || 'NOT YET'}

Still need to collect: ${missing.join(', ')}

Recent conversation:
${historyText}

User just said: "${userTranscript}"

Instructions:
1. Extract ONLY the next missing field from what user just said
2. Ask the NEXT missing field in ONE warm short sentence
3. Do NOT re-ask anything already collected
4. If user's answer is unclear, gently rephrase the same question once

Field asking guide (in ${langName}):
- name: "Aapka naam kya hai?" 
- age: "Aapki umar kitni hai?" (approximate fine)
- education: "Aapne kitna padha hai? — bilkul nahi / 5th tak / 10th tak / 12th ya college"
- digitalLiteracy: "Kya aap smartphone use karti hain?"
- englishLevel: "Aapki English kaisi hai? — bilkul nahi / thoda / achha"

Respond ONLY in this exact JSON:
{
  "aiResponse": "next question in ${langName}",
  "extractedData": {
    "name": null,
    "age": null,
    "education": null,
    "digitalLiteracy": null,
    "englishLevel": null
  }
}`;

  const parsed = await ask(prompt);

  // Save only non-null extracted fields
  const updateData = {};
  if (parsed.extractedData) {
    Object.entries(parsed.extractedData).forEach(([key, val]) => {
      if (val !== null && val !== undefined) {
        updateData[key] = val;
      }
    });
  }

  if (Object.keys(updateData).length > 0) {
    await UserProfile.findOneAndUpdate(
      { userId },
      { $set: { ...updateData, preferredLanguage: language } },
      { upsert: true }
    );
  }

  // Check if all collected now
  const updatedCollected = { ...alreadyCollected, ...updateData };
  const stillMissing = Object.values(updatedCollected).filter(v => v === null || v === undefined);
  const profileComplete = stillMissing.length === 0;

  if (profileComplete) {
    await UserProfile.findOneAndUpdate(
      { userId },
      { $set: { profileComplete: true } },
      { upsert: true }
    );
  }

  const audioBase64 = await speak(parsed.aiResponse, language);

  return {
    aiText: parsed.aiResponse,
    aiAudio: audioBase64,
    profileComplete,
    conversationDone: profileComplete,
  };
}

async function startConversation(userId, language = 'hindi') {
  const existing = await UserProfile.findOne({ userId });

  if (existing?.profileComplete) {
    const msgs = {
      hindi:   'आपकी profile पहले से saved है! Career guide पर जाएं।',
      tamil:   'உங்கள் profile ஏற்கனவே சேமிக்கப்பட்டது!',
      telugu:  'మీ profile ఇప్పటికే సేవ్ చేయబడింది!',
      marathi: 'तुमची profile आधीच saved आहे!',
      english: 'Your profile is already saved! Go to career guide.'
    };
    const msg = msgs[language] || msgs.hindi;
    const audioBase64 = await speak(msg, language);
    return { aiText: msg, aiAudio: audioBase64, profileComplete: true, alreadyDone: true };
  }

  // Resume from where left off
  const collected = {
    name: existing?.name,
    age: existing?.age,
    education: existing?.education,
    digitalLiteracy: existing?.digitalLiteracy,
    englishLevel: existing?.englishLevel,
  };
  const firstMissing = Object.entries(collected).find(([, v]) => v === null || v === undefined)?.[0];

  const resumeMsgs = {
    name: openingMessages,
    age: {
      hindi: `नमस्ते ${collected.name || ''}! आपकी उमर कितनी है?`,
      tamil: `வணக்கம் ${collected.name || ''}! உங்கள் வயது என்ன?`,
      telugu: `నమస్కారం ${collected.name || ''}! మీ వయస్సు ఎంత?`,
      marathi: `नमस्कार ${collected.name || ''}! तुमची उमर किती आहे?`,
      english: `Hello ${collected.name || ''}! How old are you?`,
    },
    education: {
      hindi: 'आपने कितना पढ़ा है? — बिल्कुल नहीं / 5th तक / 10th तक / 12th या college',
      tamil: 'நீங்கள் எவ்வளவு படித்தீர்கள்?',
      telugu: 'మీరు ఎంత చదివారు?',
      marathi: 'तुम्ही किती शिकलात?',
      english: 'How much education do you have?',
    },
    digitalLiteracy: {
      hindi: 'क्या आप smartphone use करती हैं?',
      tamil: 'நீங்கள் smartphone பயன்படுத்துகிறீர்களா?',
      telugu: 'మీరు smartphone వాడతారా?',
      marathi: 'तुम्ही smartphone वापरता का?',
      english: 'Do you use a smartphone?',
    },
    englishLevel: {
      hindi: 'आपकी English कैसी है? — बिल्कुल नहीं / थोड़ा / अच्छा',
      tamil: 'உங்கள் ஆங்கிலம் எப்படி உள்ளது?',
      telugu: 'మీ ఆంగ్లం ఎలా ఉంది?',
      marathi: 'तुमची इंग्रजी कशी आहे?',
      english: 'How is your English?',
    },
  };

  const msgMap = firstMissing && resumeMsgs[firstMissing] ? resumeMsgs[firstMissing] : openingMessages;
  const openingMsg = msgMap[language] || msgMap.hindi;
  const audioBase64 = await speak(openingMsg, language);

  return { aiText: openingMsg, aiAudio: audioBase64, profileComplete: false, alreadyDone: false };
}

module.exports = { processConversationTurn, startConversation };