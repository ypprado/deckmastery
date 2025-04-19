
import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'fr' | 'es' | 'pt';

export interface Translations {
  language: string;
  dashboard: string;
  deckBuilder: string;
  cardLibrary: string;
  staticData: string;
  admin: string;
  profile: string;
  logout: string;
  login: string;
  register: string;
  magicTheGathering: string;
  pokemon: string;
  yugioh: string;
  onepiece: string;
  grid: string;
  list: string;
  searchCards: string;
  filters: string;
  clearAll: string;
  colors: string;
  types: string;
  rarities: string;
  parallels: string;
  backToSets: string;
  card: string;
  cards: string;
  loadingCards: string;
  noCardsFound: string;
  adjustFilters: string;
  clearFilters: string;
  noSetsFound: string;
  noSetsAvailable: string;
  viewCards: string;
  type: string;
  cost: string;
  set: string;
  rarity: string;
  priceHistory: string;
  price: string;
  days: string;
  browseSearchCards: string;
  cardSets: string;
  showing: string;
  of: string;
  page: string;
  selected: string;
  selectTypes: string;
  searchTypes: string;
  noTypesFound: string;
  selectSet: string;
  allSets: string;
  loading: string;
  // Dashboard translations
  yourDecks: string;
  manageCreateDecks: string;
  createNewDeck: string;
  searchDecks: string;
  filter: string;
  loadingDecks: string;
  noDecksFound: string;
  noResultsMatching: string;
  noDecksYet: string;
  startBuildingDeck: string;
  createFirstDeck: string;
  // DeckBuilder translations
  deckNameRequired: string;
  deckNeedsCards: string;
  deckUpdated: string;
  deckCreated: string;
  standard: string;
  modern: string;
  commander: string;
  legacy: string;
  vintage: string;
  casual: string;
  editDeck: string;
  deckName: string;
  enterDeckName: string;
  format: string;
  selectFormat: string;
  description: string;
  describeStrategy: string;
  updateDeck: string;
  saveDeck: string;
  yourDeck: string;
  noCardsAddedYet: string;
  browseAddCards: string;
  tryAdjustingFilters: string;
  added: string;
  add: string;
  // Index translations
  welcome: string;
  welcomeDescription: string;
  getStarted: string;
  exploreCardLibrary: string;
  multipleGameSupport: string;
  trackCollection: string;
  shareDeckStrategies: string;
  // Layout translations
  authRequired: string;
  pleaseSignIn: string;
  newDeck: string;
  signIn: string;
  version: string;
}

const defaultTranslations: Record<string, Translations> = {
  en: {
    language: 'English',
    dashboard: 'Dashboard',
    deckBuilder: 'Deck Builder',
    cardLibrary: 'Card Library',
    staticData: 'Static Data',
    admin: 'Admin',
    profile: 'Profile',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    magicTheGathering: 'Magic: The Gathering',
    pokemon: 'Pokemon',
    yugioh: 'Yu-Gi-Oh!',
    onepiece: 'One Piece',
    grid: 'Grid',
    list: 'List',
    searchCards: 'Search cards...',
    filters: 'Filters',
    clearAll: 'Clear All',
    colors: 'Colors',
    types: 'Types',
    rarities: 'Rarities',
    parallels: 'Parallels',
    backToSets: 'Back to Sets',
    card: 'Card',
    cards: 'Cards',
    loadingCards: 'Loading cards...',
    loading: 'Loading...',
    noCardsFound: 'No Cards Found',
    adjustFilters: 'Try adjusting your filters or search query to find what you\'re looking for.',
    clearFilters: 'Clear Filters',
    noSetsFound: 'No Sets Found',
    noSetsAvailable: 'There are no card sets available for this game category.',
    viewCards: 'View Cards',
    type: 'Type',
    cost: 'Cost',
    set: 'Set',
    rarity: 'Rarity',
    priceHistory: 'Price History',
    price: 'Price',
    days: 'Days',
    browseSearchCards: 'Browse and search for cards across all supported game categories.',
    cardSets: 'Card Sets',
    showing: 'Showing',
    of: 'of',
    page: 'Page',
    selected: 'selected',
    selectTypes: 'Select types',
    searchTypes: 'Search types...',
    noTypesFound: 'No types found',
    selectSet: 'Select set',
    allSets: 'All Sets',
    // Dashboard translations
    yourDecks: 'Your Decks',
    manageCreateDecks: 'Manage your existing decks or create new ones.',
    createNewDeck: 'Create New Deck',
    searchDecks: 'Search decks...',
    filter: 'Filter',
    loadingDecks: 'Loading decks...',
    noDecksFound: 'No Decks Found',
    noResultsMatching: 'No results matching',
    noDecksYet: 'You haven\'t created any decks for',
    startBuildingDeck: 'Start building your first deck now!',
    createFirstDeck: 'Create your first deck',
    // DeckBuilder translations
    deckNameRequired: 'Deck name is required',
    deckNeedsCards: 'Deck needs at least one card',
    deckUpdated: 'Deck updated successfully',
    deckCreated: 'Deck created successfully',
    standard: 'Standard',
    modern: 'Modern',
    commander: 'Commander',
    legacy: 'Legacy',
    vintage: 'Vintage',
    casual: 'Casual',
    editDeck: 'Edit Deck',
    deckName: 'Deck Name',
    enterDeckName: 'Enter a name for your deck',
    format: 'Format',
    selectFormat: 'Select a format',
    description: 'Description',
    describeStrategy: 'Describe your deck strategy...',
    updateDeck: 'Update Deck',
    saveDeck: 'Save Deck',
    yourDeck: 'Your Deck',
    noCardsAddedYet: 'No cards added yet',
    browseAddCards: 'Browse and add cards from the right side',
    tryAdjustingFilters: 'Try adjusting your filters to find what you\'re looking for',
    added: 'Added',
    add: 'Add',
    // Index translations
    welcome: 'Welcome to DeckMastery',
    welcomeDescription: 'Build and manage decks for popular card games in one place',
    getStarted: 'Get Started',
    exploreCardLibrary: 'Explore Card Library',
    multipleGameSupport: 'Multiple Game Support',
    trackCollection: 'Track Your Collection',
    shareDeckStrategies: 'Share Deck Strategies',
    // Layout translations
    authRequired: 'Authentication Required',
    pleaseSignIn: 'Please sign in to access this feature',
    newDeck: 'New Deck',
    signIn: 'Sign In',
    version: 'Version'
  },
  fr: {
    language: 'Français',
    dashboard: 'Tableau de bord',
    deckBuilder: 'Constructeur de deck',
    cardLibrary: 'Bibliothèque de cartes',
    staticData: 'Données statiques',
    admin: 'Admin',
    profile: 'Profil',
    logout: 'Déconnexion',
    login: 'Connexion',
    register: 'Inscription',
    magicTheGathering: 'Magic: The Gathering',
    pokemon: 'Pokemon',
    yugioh: 'Yu-Gi-Oh!',
    onepiece: 'One Piece',
    grid: 'Grille',
    list: 'Liste',
    searchCards: 'Rechercher des cartes...',
    filters: 'Filtres',
    clearAll: 'Tout effacer',
    colors: 'Couleurs',
    types: 'Types',
    rarities: 'Raretés',
    parallels: 'Parallèles',
    backToSets: 'Retour aux séries',
    card: 'Carte',
    cards: 'Cartes',
    loadingCards: 'Chargement des cartes...',
    loading: 'Chargement...',
    noCardsFound: 'Aucune carte trouvée',
    adjustFilters: 'Essayez d\'ajuster vos filtres ou votre requête de recherche pour trouver ce que vous cherchez.',
    clearFilters: 'Effacer les filtres',
    noSetsFound: 'Aucune série trouvée',
    noSetsAvailable: 'Il n\'y a pas de séries de cartes disponibles pour cette catégorie de jeu.',
    viewCards: 'Voir les cartes',
    type: 'Type',
    cost: 'Coût',
    set: 'Série',
    rarity: 'Rareté',
    priceHistory: 'Historique des prix',
    price: 'Prix',
    days: 'Jours',
    browseSearchCards: 'Parcourez et recherchez des cartes dans toutes les catégories de jeux prises en charge.',
    cardSets: 'Séries de cartes',
    showing: 'Montrant',
    of: 'de',
    page: 'Page',
    selected: 'sélectionné',
    selectTypes: 'Sélectionner des types',
    searchTypes: 'Rechercher des types...',
    noTypesFound: 'Aucun type trouvé',
    selectSet: 'Sélectionner une série',
    allSets: 'Toutes les séries',
    // Dashboard translations
    yourDecks: 'Vos Decks',
    manageCreateDecks: 'Gérez vos decks existants ou créez-en de nouveaux.',
    createNewDeck: 'Créer un Nouveau Deck',
    searchDecks: 'Rechercher des decks...',
    filter: 'Filtrer',
    loadingDecks: 'Chargement des decks...',
    noDecksFound: 'Aucun Deck Trouvé',
    noResultsMatching: 'Aucun résultat correspondant',
    noDecksYet: 'Vous n\'avez créé aucun deck pour',
    startBuildingDeck: 'Commencez à construire votre premier deck maintenant!',
    createFirstDeck: 'Créer votre premier deck',
    // DeckBuilder translations
    deckNameRequired: 'Le nom du deck est requis',
    deckNeedsCards: 'Le deck a besoin d\'au moins une carte',
    deckUpdated: 'Deck mis à jour avec succès',
    deckCreated: 'Deck créé avec succès',
    standard: 'Standard',
    modern: 'Modern',
    commander: 'Commander',
    legacy: 'Legacy',
    vintage: 'Vintage',
    casual: 'Casual',
    editDeck: 'Modifier le Deck',
    deckName: 'Nom du Deck',
    enterDeckName: 'Entrez un nom pour votre deck',
    format: 'Format',
    selectFormat: 'Sélectionnez un format',
    description: 'Description',
    describeStrategy: 'Décrivez votre stratégie de deck...',
    updateDeck: 'Mettre à jour le Deck',
    saveDeck: 'Sauvegarder le Deck',
    yourDeck: 'Votre Deck',
    noCardsAddedYet: 'Aucune carte ajoutée',
    browseAddCards: 'Parcourez et ajoutez des cartes depuis la droite',
    tryAdjustingFilters: 'Essayez d\'ajuster vos filtres pour trouver ce que vous cherchez',
    added: 'Ajouté',
    add: 'Ajouter',
    // Index translations
    welcome: 'Bienvenue sur DeckMastery',
    welcomeDescription: 'Construisez et gérez des decks pour les jeux de cartes populaires en un seul endroit',
    getStarted: 'Commencer',
    exploreCardLibrary: 'Explorer la Bibliothèque de Cartes',
    multipleGameSupport: 'Support Multi-Jeux',
    trackCollection: 'Suivez Votre Collection',
    shareDeckStrategies: 'Partagez vos Stratégies de Deck',
    // Layout translations
    authRequired: 'Authentification Requise',
    pleaseSignIn: 'Veuillez vous connecter pour accéder à cette fonctionnalité',
    newDeck: 'Nouveau Deck',
    signIn: 'Se Connecter',
    version: 'Version'
  },
  es: {
    language: 'Español',
    dashboard: 'Tablero',
    deckBuilder: 'Constructor de mazos',
    cardLibrary: 'Librería de cartas',
    staticData: 'Datos estáticos',
    admin: 'Admin',
    profile: 'Perfil',
    logout: 'Cerrar sesión',
    login: 'Iniciar sesión',
    register: 'Registrarse',
    magicTheGathering: 'Magic: The Gathering',
    pokemon: 'Pokemon',
    yugioh: 'Yu-Gi-Oh!',
    onepiece: 'One Piece',
    grid: 'Cuadrícula',
    list: 'Lista',
    searchCards: 'Buscar cartas...',
    filters: 'Filtros',
    clearAll: 'Borrar todo',
    colors: 'Colores',
    types: 'Tipos',
    rarities: 'Rarezas',
    parallels: 'Paralelos',
    backToSets: 'Volver a los sets',
    card: 'Carta',
    cards: 'Cartas',
    loadingCards: 'Cargando cartas...',
    loading: 'Cargando...',
    noCardsFound: 'No se encontraron cartas',
    adjustFilters: 'Intenta ajustar tus filtros o la búsqueda para encontrar lo que buscas.',
    clearFilters: 'Borrar filtros',
    noSetsFound: 'No se encontraron sets',
    noSetsAvailable: 'No hay sets de cartas disponibles para esta categoría de juego.',
    viewCards: 'Ver cartas',
    type: 'Tipo',
    cost: 'Costo',
    set: 'Set',
    rarity: 'Rareza',
    priceHistory: 'Historial de precios',
    price: 'Precio',
    days: 'Días',
    browseSearchCards: 'Navega y busca cartas en todas las categorías de juegos compatibles.',
    cardSets: 'Sets de cartas',
    showing: 'Mostrando',
    of: 'de',
    page: 'Página',
    selected: 'seleccionado',
    selectTypes: 'Seleccionar tipos',
    searchTypes: 'Buscar tipos...',
    noTypesFound: 'No se encontraron tipos',
    selectSet: 'Seleccionar set',
    allSets: 'Todos los sets',
    // Dashboard translations
    yourDecks: 'Tus Mazos',
    manageCreateDecks: 'Administra tus mazos existentes o crea nuevos.',
    createNewDeck: 'Crear Nuevo Mazo',
    searchDecks: 'Buscar mazos...',
    filter: 'Filtrar',
    loadingDecks: 'Cargando mazos...',
    noDecksFound: 'No Se Encontraron Mazos',
    noResultsMatching: 'No hay resultados que coincidan',
    noDecksYet: 'No has creado ningún mazo para',
    startBuildingDeck: '¡Comienza a construir tu primer mazo ahora!',
    createFirstDeck: 'Crea tu primer mazo',
    // DeckBuilder translations
    deckNameRequired: 'El nombre del mazo es obligatorio',
    deckNeedsCards: 'El mazo necesita al menos una carta',
    deckUpdated: 'Mazo actualizado con éxito',
    deckCreated: 'Mazo creado con éxito',
    standard: 'Estándar',
    modern: 'Moderno',
    commander: 'Comandante',
    legacy: 'Legado',
    vintage: 'Vintage',
    casual: 'Casual',
    editDeck: 'Editar Mazo',
    deckName: 'Nombre del Mazo',
    enterDeckName: 'Ingrese un nombre para su mazo',
    format: 'Formato',
    selectFormat: 'Seleccione un formato',
    description: 'Descripción',
    describeStrategy: 'Describa la estrategia de su mazo...',
    updateDeck: 'Actualizar Mazo',
    saveDeck: 'Guardar Mazo',
    yourDeck: 'Tu Mazo',
    noCardsAddedYet: 'Aún no se han añadido cartas',
    browseAddCards: 'Navega y añade cartas desde la derecha',
    tryAdjustingFilters: 'Intenta ajustar tus filtros para encontrar lo que buscas',
    added: 'Añadido',
    add: 'Añadir',
    // Index translations
    welcome: 'Bienvenido a DeckMastery',
    welcomeDescription: 'Construye y administra mazos para juegos de cartas populares en un solo lugar',
    getStarted: 'Comenzar',
    exploreCardLibrary: 'Explorar Biblioteca de Cartas',
    multipleGameSupport: 'Soporte para Múltiples Juegos',
    trackCollection: 'Rastrea Tu Colección',
    shareDeckStrategies: 'Comparte Estrategias de Mazos',
    // Layout translations
    authRequired: 'Autenticación Requerida',
    pleaseSignIn: 'Por favor inicia sesión para acceder a esta función',
    newDeck: 'Nuevo Mazo',
    signIn: 'Iniciar Sesión',
    version: 'Versión'
  },
};

const LanguageContext = createContext({
  language: 'en' as Language,
  t: (key: keyof Translations) => defaultTranslations.en[key],
  setLanguage: (language: Language) => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: keyof Translations) => {
    return defaultTranslations[language]?.[key] || defaultTranslations.en[key];
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
