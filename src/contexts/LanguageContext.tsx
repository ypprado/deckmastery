import React, { createContext, useContext, useState } from 'react';

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
  backToSets: string;
  card: string;
  cards: string;
  loadingSets: string;
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
  showing: string;  // Added missing translation key
  of: string;       // Added missing translation key
  page: string;     // Added missing translation key
  selected: string; // Added missing translation key
  selectTypes: string; // Added missing translation key
  searchTypes: string; // Added missing translation key
  noTypesFound: string; // Added missing translation key
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
    backToSets: 'Back to Sets',
    card: 'Card',
    cards: 'Cards',
    loadingSets: 'Loading sets...',
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
    showing: 'Showing', // Added missing translation
    of: 'of', // Added missing translation
    page: 'Page', // Added missing translation
    selected: 'selected', // Added missing translation
    selectTypes: 'Select types', // Added missing translation
    searchTypes: 'Search types...', // Added missing translation
    noTypesFound: 'No types found' // Added missing translation
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
    backToSets: 'Retour aux séries',
    card: 'Carte',
    cards: 'Cartes',
    loadingSets: 'Chargement des séries...',
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
    noTypesFound: 'Aucun type trouvé'
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
    backToSets: 'Volver a los sets',
    card: 'Carta',
    cards: 'Cartas',
    loadingSets: 'Cargando sets...',
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
    noTypesFound: 'No se encontraron tipos'
  },
};

const LanguageContext = createContext({
  language: 'en',
  t: (key: keyof Translations) => defaultTranslations.en[key],
  setLanguage: (language: string) => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key: keyof Translations) => {
    return defaultTranslations[language][key] || defaultTranslations.en[key];
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
