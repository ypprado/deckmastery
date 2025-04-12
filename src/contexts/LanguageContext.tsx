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
  // Dashboard page
  yourDecks: string;
  manageCreateDecks: string;
  searchDecks: string;
  filter: string;
  loadingDecks: string;
  noDecksFound: string;
  noResultsMatching: string;
  noDecksYet: string;
  createFirstDeck: string;
  // Card Library page
  browseSearchCards: string;
  searchCards: string;
  grid: string;
  list: string;
  filters: string;
  clearAll: string;
  colors: string;
  types: string;
  rarities: string;
  noCardsFound: string;
  adjustFilters: string;
  clearFilters: string;
  cardSets: string;
  loadingSets: string;
  noSetsFound: string;
  noSetsAvailable: string;
  viewCards: string;
  cards: string;
  card: string;
  backToSets: string;
  // Card detail popup
  priceHistory: string;
  days: string;
  price: string;
  type: string;
  cost: string;
  rarity: string;
  set: string;
  // Deck Builder page
  editDeck: string;
  deckName: string;
  enterDeckName: string;
  format: string;
  selectFormat: string;
  description: string;
  describeStrategy: string;
  saveDeck: string;
  updateDeck: string;
  yourDeck: string;
  noCardsAddedYet: string;
  browseAddCards: string;
  deckNameRequired: string;
  deckNeedsCards: string;
  deckCreated: string;
  deckUpdated: string;
  standard: string;
  modern: string;
  commander: string;
  legacy: string;
  vintage: string;
  casual: string;
  added: string;
  add: string;
  tryAdjustingFilters: string;
  // Pagination
  showing: string;
  of: string;
  page: string;
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
    version: 'Versão',
    // Dashboard page
    yourDecks: 'Seus Baralhos',
    manageCreateDecks: 'Gerencie e crie seus baralhos TCG com facilidade',
    searchDecks: 'Buscar baralhos...',
    filter: 'Filtrar',
    loadingDecks: 'Carregando seus baralhos...',
    noDecksFound: 'Nenhum baralho encontrado',
    noResultsMatching: 'Nenhum resultado para',
    noDecksYet: 'Você ainda não criou nenhum baralho',
    createFirstDeck: 'Crie Seu Primeiro Baralho',
    // Card Library page
    browseSearchCards: 'Navegue e pesquise por cartas para adicionar aos seus baralhos',
    searchCards: 'Buscar cartas...',
    grid: 'Grade',
    list: 'Lista',
    filters: 'Filtros',
    clearAll: 'Limpar Tudo',
    colors: 'Cores',
    types: 'Tipos',
    rarities: 'Raridades',
    noCardsFound: 'Nenhuma carta encontrada',
    adjustFilters: 'Ajuste seus filtros ou termo de busca para encontrar o que procura',
    clearFilters: 'Limpar Filtros',
    cardSets: 'Conjuntos de Cartas',
    loadingSets: 'Carregando conjuntos...',
    noSetsFound: 'Nenhum conjunto encontrado',
    noSetsAvailable: 'Não há conjuntos de cartas disponíveis para esta categoria de jogo',
    viewCards: 'Ver Cartas',
    cards: 'cartas',
    card: 'carta',
    backToSets: 'Voltar para Conjuntos',
    // Card detail popup
    priceHistory: 'Histórico de Preços (30 dias)',
    days: 'Dias',
    price: 'Preço ($)',
    type: 'Tipo',
    cost: 'Custo',
    rarity: 'Raridade',
    set: 'Conjunto',
    // Deck Builder page
    editDeck: 'Editar Baralho',
    deckName: 'Nome do Baralho',
    enterDeckName: 'Digite o nome do baralho',
    format: 'Formato',
    selectFormat: 'Selecione o formato',
    description: 'Descrição (Opcional)',
    describeStrategy: 'Descreva a estratégia do seu baralho...',
    saveDeck: 'Salvar Baralho',
    updateDeck: 'Atualizar Baralho',
    yourDeck: 'Seu Baralho',
    noCardsAddedYet: 'Nenhuma carta adicionada ainda',
    browseAddCards: 'Navegue e adicione cartas do painel à direita',
    deckNameRequired: 'Nome do baralho é obrigatório',
    deckNeedsCards: 'Seu baralho precisa de pelo menos uma carta',
    deckCreated: 'Baralho criado com sucesso',
    deckUpdated: 'Baralho atualizado com sucesso',
    standard: 'Standard',
    modern: 'Modern',
    commander: 'Commander',
    legacy: 'Legacy',
    vintage: 'Vintage',
    casual: 'Casual',
    added: 'Adicionada',
    add: 'Adicionar',
    tryAdjustingFilters: 'Tente ajustar seus filtros ou termo de busca para encontrar cartas',
    // Pagination
    showing: 'Mostrando',
    of: 'de',
    page: 'Página'
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
    version: 'Versión',
    // Dashboard page
    yourDecks: 'Tus Barajas',
    manageCreateDecks: 'Gestiona y crea tus barajas de TCG con facilidad',
    searchDecks: 'Buscar barajas...',
    filter: 'Filtrar',
    loadingDecks: 'Cargando tus barajas...',
    noDecksFound: 'No se encontraron barajas',
    noResultsMatching: 'Sin resultados para',
    noDecksYet: 'Aún no has creado ninguna baraja',
    createFirstDeck: 'Crea Tu Primera Baraja',
    // Card Library page
    browseSearchCards: 'Navega y busca cartas para añadir a tus barajas',
    searchCards: 'Buscar cartas...',
    grid: 'Cuadrícula',
    list: 'Lista',
    filters: 'Filtros',
    clearAll: 'Limpiar Todo',
    colors: 'Colores',
    types: 'Tipos',
    rarities: 'Rarezas',
    noCardsFound: 'No se encontraron cartas',
    adjustFilters: 'Ajusta tus filtros o término de búsqueda para encontrar lo que buscas',
    clearFilters: 'Limpiar Filtros',
    cardSets: 'Colecciones de Cartas',
    loadingSets: 'Cargando colecciones...',
    noSetsFound: 'No se encontraron colecciones',
    noSetsAvailable: 'No hay colecciones de cartas disponibles para esta categoría de juego',
    viewCards: 'Ver Cartas',
    cards: 'cartas',
    card: 'carta',
    backToSets: 'Volver a Colecciones',
    // Card detail popup
    priceHistory: 'Historial de Precios (30 días)',
    days: 'Días',
    price: 'Precio ($)',
    type: 'Tipo',
    cost: 'Coste',
    rarity: 'Rareza',
    set: 'Colección',
    // Deck Builder page
    editDeck: 'Editar Baraja',
    deckName: 'Nombre de la Baraja',
    enterDeckName: 'Introduce el nombre de la baraja',
    format: 'Formato',
    selectFormat: 'Selecciona formato',
    description: 'Descripción (Opcional)',
    describeStrategy: 'Describe la estrategia de tu baraja...',
    saveDeck: 'Guardar Baraja',
    updateDeck: 'Actualizar Baraja',
    yourDeck: 'Tu Baraja',
    noCardsAddedYet: 'Aún no se han añadido cartas',
    browseAddCards: 'Navega y añade cartas desde el panel derecho',
    deckNameRequired: 'Se requiere nombre para la baraja',
    deckNeedsCards: 'Tu baraja necesita al menos una carta',
    deckCreated: 'Baraja creada con éxito',
    deckUpdated: 'Baraja actualizada con éxito',
    standard: 'Standard',
    modern: 'Modern',
    commander: 'Commander',
    legacy: 'Legacy',
    vintage: 'Vintage',
    casual: 'Casual',
    added: 'Añadida',
    add: 'Añadir',
    tryAdjustingFilters: 'Intenta ajustar tus filtros o término de búsqueda para encontrar cartas',
    // Pagination
    showing: 'Mostrando',
    of: 'de',
    page: 'Página'
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
    version: 'Version',
    // Dashboard page
    yourDecks: 'Your Decks',
    manageCreateDecks: 'Manage and create your TCG decks with ease',
    searchDecks: 'Search decks...',
    filter: 'Filter',
    loadingDecks: 'Loading your decks...',
    noDecksFound: 'No decks found',
    noResultsMatching: 'No results matching',
    noDecksYet: 'You haven\'t created any decks yet',
    createFirstDeck: 'Create Your First Deck',
    // Card Library page
    browseSearchCards: 'Browse and search for cards to add to your decks',
    searchCards: 'Search cards...',
    grid: 'Grid',
    list: 'List',
    filters: 'Filters',
    clearAll: 'Clear All',
    colors: 'Colors',
    types: 'Types',
    rarities: 'Rarities',
    noCardsFound: 'No cards found',
    adjustFilters: 'Try adjusting your filters or search term to find what you\'re looking for',
    clearFilters: 'Clear Filters',
    cardSets: 'Card Sets',
    loadingSets: 'Loading sets...',
    noSetsFound: 'No sets found',
    noSetsAvailable: 'There are no card sets available for this game category',
    viewCards: 'View Cards',
    cards: 'cards',
    card: 'card',
    backToSets: 'Back to Sets',
    // Card detail popup
    priceHistory: 'Price History (30 days)',
    days: 'Days',
    price: 'Price ($)',
    type: 'Type',
    cost: 'Cost',
    rarity: 'Rarity',
    set: 'Set',
    // Deck Builder page
    editDeck: 'Edit Deck',
    deckName: 'Deck Name',
    enterDeckName: 'Enter deck name',
    format: 'Format',
    selectFormat: 'Select format',
    description: 'Description (Optional)',
    describeStrategy: 'Describe your deck strategy...',
    saveDeck: 'Save Deck',
    updateDeck: 'Update Deck',
    yourDeck: 'Your Deck',
    noCardsAddedYet: 'No cards added yet',
    browseAddCards: 'Browse and add cards from the right panel',
    deckNameRequired: 'Deck name required',
    deckNeedsCards: 'Your deck needs at least one card',
    deckCreated: 'Deck created successfully',
    deckUpdated: 'Deck updated successfully',
    standard: 'Standard',
    modern: 'Modern',
    commander: 'Commander',
    legacy: 'Legacy',
    vintage: 'Vintage',
    casual: 'Casual',
    added: 'Added',
    add: 'Add',
    tryAdjustingFilters: 'Try adjusting your filters or search term to find cards',
    // Pagination
    showing: 'Showing',
    of: 'of',
    page: 'Page'
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
