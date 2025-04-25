
import React, { createContext, useContext, useState } from 'react';
import { Language, Translations } from '../translations/types';
import { enTranslations } from '../translations/en';
import { esTranslations } from '../translations/es';
import { ptTranslations } from '../translations/pt';

const translations: Record<Language, Translations> = {
  en: enTranslations,
  es: esTranslations,
  pt: ptTranslations,
  fr: enTranslations, // Fallback to English for now
};

const LanguageContext = createContext({
  language: 'en' as Language,
  t: (key: keyof Translations) => translations.en[key],
  setLanguage: (language: Language) => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: keyof Translations) => {
    return translations[language]?.[key] || translations.en[key];
  };

  const contextValue = {
    language,
    t,
    setLanguage,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
