import { Language } from '../contexts/LanguageContext';

export const translations = {
  hero_title: {
    en: 'Discover Your Perfect Career',
    hi: 'अपना करियर खोजो',
  },
  hero_sub: {
    en: 'Speak your mind — AI will suggest the perfect path for you.',
    hi: 'बोलो, हम सुनेंगे — AI तुम्हारे लिए perfect career suggest करेगा',
  },
  btn_start: {
    en: 'Get Started →',
    hi: 'शुरू करो →',
  },
  step_0: {
    en: 'Tell us about yourself',
    hi: 'अपने बारे में बताओ',
  },
  step_1: {
    en: 'Choose a Career',
    hi: 'करियर चुनो',
  },
  step_2: {
    en: 'Courses & Jobs',
    hi: 'Courses & Jobs',
  },
  voice_prompt: {
    en: '👋 Click the mic and speak:',
    hi: '👋 Mic पे click करो और बताओ:',
  },
  voice_subtext: {
    en: 'Tell us about your education, interests, and career goals.',
    hi: 'अपनी education, interests, और career goals के बारे में बताओ।',
  },
  recording: {
    en: '🔴 Recording...',
    hi: '🔴 Recording...',
  },
  recording_ready: {
    en: '✅ Recording ready!',
    hi: '✅ Recording तैयार!',
  },
  record_again: {
    en: '🔄 Record Again',
    hi: '🔄 फिर से Record करो',
  },
  get_suggestions: {
    en: 'Get Suggestions →',
    hi: 'Suggestions लो →',
  },
  best_careers: {
    en: 'Best Career Options for You 🎯',
    hi: 'तुम्हारे लिए Best Career Options 🎯',
  },
  go_back: {
    en: '← Go Back',
    hi: '← वापस जाओ',
  },
  learn_courses: {
    en: '📚 Learn (Courses)',
    hi: '📚 सीखो (Courses)',
  },
  get_hired: {
    en: '💼 Get Hired (Jobs)',
    hi: '💼 नौकरी पाओ (Jobs)',
  },
  change_career: {
    en: '← Change Career',
    hi: '← Career बदलो',
  },
  start_over: {
    en: '🔄 Start Over',
    hi: '🔄 नया शुरू करो',
  },
  ai_assistant: {
    en: 'AI Assistant',
    hi: 'AI Assistant',
  },
  ask_anything: {
    en: 'Ask anything...',
    hi: 'कुछ भी पूछो...',
  },
  send: {
    en: 'Send →',
    hi: 'भेजो →',
  },
  listening: {
    en: 'Listening... 🎧',
    hi: 'सुन रहा हूँ... 🎧',
  },
  finding_courses: {
    en: 'Finding courses... 📚',
    hi: 'Best courses ढूंढ रहा हूँ... 📚',
  },
  feature_voice: {
    en: '🎤 Voice Input',
    hi: '🎤 Voice Input',
  },
  feature_voice_desc: {
    en: 'Speak naturally in your language',
    hi: 'अपनी भाषा में बोलो',
  },
  feature_ai: {
    en: '🎯 Smart AI Suggestions',
    hi: '🎯 Smart AI Suggestions',
  },
  feature_ai_desc: {
    en: 'Tailored to your unique background',
    hi: 'तुम्हारे background के लिए',
  },
  feature_courses: {
    en: '📚 Real Skilling Courses',
    hi: '📚 Real Skilling Courses',
  },
  feature_courses_desc: {
    en: 'Upskill and get hired faster',
    hi: 'सीखो और नौकरी पाओ',
  },
  you_said: {
    en: 'You said:',
    hi: 'तुमने कहा:',
  },
  level: {
    en: 'Level',
    hi: 'Level',
  },
  beginner: {
    en: 'Beginner',
    hi: 'शुरुआती',
  },
  intermediate: {
    en: 'Intermediate',
    hi: 'मध्यम',
  },
  advanced: {
    en: 'Advanced',
    hi: 'उन्नत',
  },
  freelance: {
    en: '🧑‍💻 Freelance',
    hi: '🧑‍💻 Freelance',
  },
  job: {
    en: '🏢 Job',
    hi: '🏢 नौकरी',
  },
  footer: {
    en: '© 2026 Saksham AI. Built with ❤️ for inclusive skilling.',
    hi: '© 2026 Saksham AI. ❤️ से बनाया गया।',
  },
};

export function t(key: keyof typeof translations, lang: Language): string {
  return translations[key][lang];
}
