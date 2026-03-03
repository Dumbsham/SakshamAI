const speech = require('@google-cloud/speech');

const credentials = JSON.parse(process.env.GCP_CREDENTIALS_JSON);
const client = new speech.SpeechClient({ credentials });

// Primary + alternative language codes for each language
const languageConfig = {
  hindi:   { languageCode: 'hi-IN', alternativeLanguageCodes: ['en-IN'] },
  tamil:   { languageCode: 'ta-IN', alternativeLanguageCodes: ['en-IN'] },
  telugu:  { languageCode: 'te-IN', alternativeLanguageCodes: ['en-IN'] },
  marathi: { languageCode: 'mr-IN', alternativeLanguageCodes: ['en-IN'] },
  english: { languageCode: 'en-IN', alternativeLanguageCodes: ['hi-IN'] },
};

async function transcribeAudio(audioBuffer, language = 'hindi') {
  const langConf = languageConfig[language] || languageConfig.hindi;

  const [response] = await client.recognize({
    audio: { content: audioBuffer.toString('base64') },
    config: {
      encoding: 'WEBM_OPUS',
      sampleRateHertz: 48000,
      languageCode: langConf.languageCode,
      alternativeLanguageCodes: langConf.alternativeLanguageCodes,
      enableAutomaticPunctuation: true,
    },
  });

  return response.results.map(r => r.alternatives[0].transcript).join(' ');
}

module.exports = { transcribeAudio };