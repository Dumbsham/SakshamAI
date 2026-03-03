require('dotenv').config();
const textToSpeech = require('@google-cloud/text-to-speech');
const credentials = JSON.parse(process.env.GCP_CREDENTIALS_JSON);
const client = new textToSpeech.TextToSpeechClient({ credentials });

async function checkVoices() {
  const langs = ['ta-IN', 'te-IN', 'mr-IN'];
  for (const lang of langs) {
    const [result] = await client.listVoices({ languageCode: lang });
    console.log(`\n=== ${lang} ===`);
    if (result.voices.length === 0) {
      console.log('No voices found');
    } else {
      result.voices.forEach(v => console.log(`${v.name} — ${v.ssmlGender}`));
    }
  }
}
checkVoices().catch(console.error);