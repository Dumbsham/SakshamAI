const textToSpeech = require('@google-cloud/text-to-speech');

const credentials = JSON.parse(process.env.GCP_CREDENTIALS_JSON);
const client = new textToSpeech.TextToSpeechClient({ credentials });

// Chirp3-HD female voices for all 4 languages
const voiceMap = {
  hindi:   { languageCode: 'hi-IN', name: 'hi-IN-Chirp3-HD-Aoede' },
  tamil:   { languageCode: 'ta-IN', name: 'ta-IN-Chirp3-HD-Aoede' },
  telugu:  { languageCode: 'te-IN', name: 'te-IN-Chirp3-HD-Aoede' },
  marathi: { languageCode: 'mr-IN', name: 'mr-IN-Chirp3-HD-Aoede' },
  english: { languageCode: 'en-IN', name: 'en-IN-Chirp3-HD-Aoede' }, // fallback
};

async function speak(text, language = 'hindi') {
  const voice = voiceMap[language] || voiceMap.hindi;

  const [response] = await client.synthesizeSpeech({
    input: { text },
    voice,
    audioConfig: { audioEncoding: 'MP3' }
  });

  return response.audioContent.toString('base64');
}

module.exports = { speak };