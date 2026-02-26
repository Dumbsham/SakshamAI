import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../i18n/translations';
import { Sparkles } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-orange-500/20 dark:bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="text-center animate-fadeUp">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/20 dark:border-orange-500/30 mb-8">
              <Sparkles className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-medium bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                AI Career Guide
              </span>
            </div>

            <h1
              className={`text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 ${
                language === 'hi' ? 'font-hindi' : 'font-outfit'
              }`}
            >
              <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
                {t('hero_title', language)}
              </span>
            </h1>

            <p
              className={`text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto ${
                language === 'hi' ? 'font-hindi' : 'font-outfit'
              }`}
            >
              {t('hero_sub', language)}
            </p>

            <button
              onClick={() => navigate('/guide')}
              className={`group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl text-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all ${
                language === 'hi' ? 'font-hindi' : 'font-outfit'
              }`}
            >
              <span className="relative z-10">{t('btn_start', language)}</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-24 animate-fadeUp">
            {[
              {
                icon: '🎤',
                title: t('feature_voice', language),
                desc: t('feature_voice_desc', language),
              },
              {
                icon: '🎯',
                title: t('feature_ai', language),
                desc: t('feature_ai_desc', language),
              },
              {
                icon: '📚',
                title: t('feature_courses', language),
                desc: t('feature_courses_desc', language),
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group relative p-8 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-black/5 dark:border-white/10 hover:border-orange-500/50 dark:hover:border-orange-500/50 transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3
                  className={`text-xl font-bold text-gray-900 dark:text-white mb-2 ${
                    language === 'hi' ? 'font-hindi' : 'font-outfit'
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`text-gray-600 dark:text-gray-400 ${
                    language === 'hi' ? 'font-hindi' : 'font-outfit'
                  }`}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <footer className="py-8 text-center text-gray-600 dark:text-gray-400 text-sm border-t border-black/5 dark:border-white/10">
          <p className={language === 'hi' ? 'font-hindi' : 'font-outfit'}>
            {t('footer', language)}
          </p>
        </footer>
      </div>
    </div>
  );
}
