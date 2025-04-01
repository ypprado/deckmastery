
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the supported languages
export type Language = 'pt' | 'es' | 'en';

// Define the translations interface
export interface Translations {
  dashboard: string;
  cardLibrary: string;
  newDeck: string;
  signIn: string;
  createNewDeck: string;
  startBuildingDeck: string;
  authRequired: string;
  pleaseSignIn: string;
  welcome: string;
  welcomeDescription: string;
  getStarted: string;
  exploreCardLibrary: string;
  multipleGameSupport: string;
  trackCollection: string;
  shareDeckStrategies: string;
  version: string;
}

// Create translation objects for each language
const translations: Record<Language, Translations> = {
  pt: {
    dashboard: 'Painel',
    cardLibrary: 'Biblioteca de Cartas',
    newDeck: 'Novo Baralho',
    signIn: 'Entrar',
    createNewDeck: 'Criar Novo Baralho',
    startBuildingDeck: 'Comece a construir seu baralho perfeito!',
    authRequired: 'Autenticação necessária',
    pleaseSignIn: 'Por favor, faça login para criar um baralho',
    welcome: 'Bem-vindo ao DeckMastery',
    welcomeDescription: 'A plataforma definitiva para criar e gerenciar seus baralhos de jogos de cartas',
    getStarted: 'Começar',
    exploreCardLibrary: 'Explorar Biblioteca de Cartas',
    multipleGameSupport: 'Suporte a Múltiplos Jogos',
    trackCollection: 'Acompanhe Sua Coleção',
    shareDeckStrategies: 'Compartilhe Estratégias de Baralho',
    version: 'Versão'
  },
  es: {
    dashboard: 'Panel',
    cardLibrary: 'Biblioteca de Cartas',
    newDeck: 'Nueva Baraja',
    signIn: 'Iniciar Sesión',
    createNewDeck: 'Crear Nueva Baraja',
    startBuildingDeck: '¡Comienza a construir tu baraja perfecta!',
    authRequired: 'Autenticación requerida',
    pleaseSignIn: 'Por favor, inicia sesión para crear una baraja',
    welcome: 'Bienvenido a DeckMastery',
    welcomeDescription: 'La plataforma definitiva para crear y gestionar tus barajas de juegos de cartas',
    getStarted: 'Comenzar',
    exploreCardLibrary: 'Explorar Biblioteca de Cartas',
    multipleGameSupport: 'Soporte para Múltiples Juegos',
    trackCollection: 'Gestiona tu Colección',
    shareDeckStrategies: 'Comparte Estrategias de Baraja',
    version: 'Versión'
  },
  en: {
    dashboard: 'Dashboard',
    cardLibrary: 'Card Library',
    newDeck: 'New Deck',
    signIn: 'Sign In',
    createNewDeck: 'Create New Deck',
    startBuildingDeck: 'Start building your perfect deck strategy!',
    authRequired: 'Authentication required',
    pleaseSignIn: 'Please sign in to create a deck',
    welcome: 'Welcome to DeckMastery',
    welcomeDescription: 'The ultimate platform for creating and managing your trading card game decks',
    getStarted: 'Get Started',
    exploreCardLibrary: 'Explore Card Library',
    multipleGameSupport: 'Multiple Game Support',
    trackCollection: 'Track Your Collection',
    shareDeckStrategies: 'Share Deck Strategies',
    version: 'Version'
  }
};

// Create the language context
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Create the language provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get initial language from localStorage or use browser language or default to Portuguese
  const getInitialLanguage = (): Language => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['pt', 'es', 'en'].includes(savedLanguage)) {
      return savedLanguage;
    }
    
    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'pt') return 'pt';
    if (browserLang === 'es') return 'es';
    return 'pt'; // Default to Portuguese
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  // Translation function
  const t = (key: keyof Translations): string => {
    return translations[language][key];
  };

  // Update language and save to localStorage
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // Update the document's lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Create a hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
