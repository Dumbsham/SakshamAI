import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'hi' | 'ta' | 'te' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'hi';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

// Helper — frontend language code → backend language name
export function toBackendLanguage(lang: Language): string {
  const map: Record<Language, string> = {
    hi: 'hindi',
    ta: 'tamil',
    te: 'telugu',
    mr: 'marathi',
  };
  return map[lang] || 'hindi';
}