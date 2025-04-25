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
  loading: string;
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
  cardDetails: string;
  collection: string;
  manageCards: string;
  // New advanced filter translations
  category: string;
  power: string;
  life: string;
  counter: string;
  attribute: string;
  all: string;
  any: string;
  advancedFilters: string;
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
  // Card sorting translations
  cardNumber: string;
  name: string;
  sort: string;

  // About & Contact translations
  aboutTitle: string;
  aboutDescription: string;
  contactUs: string;
  contactEmail: string;
  contactWhatsApp: string;
  yourName: string;
  yourEmail: string;
  yourMessage: string;
  sendMessage: string;
  messageSent: string;
  messageSentDescription: string;

  // Products translations
  ourProducts: string;
  basicMembership: string;
  basicMembershipDescription: string;
  proMembership: string;
  proMembershipDescription: string;
  teamPackage: string;
  teamPackageDescription: string;
  getStartedProducts: string;

  // Legal translations
  termsOfUse: string;
  termsDescription: string;
  privacyPolicy: string;
  privacyTitle: string;
  dataCollection: string;
  dataCollectionList: string;
  userRights: string;
  userRightsList: string;
  dataUsage: string;
  dataUsageDescription: string;
  cookiePolicy: string;
  cookieDescription: string;
  cookieTypes: string;
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
    cardDetails: 'Card details',
    collection: 'Collection',
    manageCards: 'Manage and track your card collection',
    // New advanced filter translations
    category: 'Category',
    power: 'Power',
    life: 'Life',
    counter: 'Counter',
    attribute: 'Attribute',
    all: 'All',
    any: 'Any',
    advancedFilters: 'Advanced',
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
    version: 'Version',
    // Card sorting translations
    cardNumber: 'Card Number',
    name: 'Name',
    sort: 'Sort',

    // About & Contact translations
    aboutTitle: "About DeckMastery",
    aboutDescription: "DeckMastery is your ultimate companion for building, managing, and mastering your trading card game collections.",
    contactUs: "Contact Us",
    contactEmail: "Email",
    contactWhatsApp: "WhatsApp",
    yourName: "Your Name",
    yourEmail: "Your Email",
    yourMessage: "Your Message",
    sendMessage: "Send Message",
    messageSent: "Message sent!",
    messageSentDescription: "We'll get back to you soon.",

    // Products translations
    ourProducts: "Our Products",
    basicMembership: "Basic Membership",
    basicMembershipDescription: "Perfect for casual players. Access to basic deck building tools and card management.",
    proMembership: "Pro Membership",
    proMembershipDescription: "Advanced deck analysis, unlimited deck storage, and premium features.",
    teamPackage: "Team Package",
    teamPackageDescription: "Perfect for gaming groups. Includes team collaboration features and shared deck libraries.",
    getStartedProducts: "Get Started",

    // Legal translations
    termsOfUse: "Terms of Use",
    termsDescription: "By using DeckMastery, you agree to these terms",
    privacyPolicy: "Privacy Policy (LGPD Compliant)",
    privacyTitle: "Data Protection",
    dataCollection: "Data Collection",
    dataCollectionList: "Account information,Usage data,Device information",
    userRights: "Your Rights (LGPD)",
    userRightsList: "Right to access,Right to correct,Right to delete,Right to data portability,Right to withdraw consent",
    dataUsage: "Data Usage",
    dataUsageDescription: "We use your data to provide and improve our services. We do not sell your data.",
    cookiePolicy: "Cookie Policy",
    cookieDescription: "We use cookies and similar technologies for:",
    cookieTypes: "Essential functions,Analytics,Performance optimization,Marketing",
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
    searchTypes: 'Rechercher des types...',
    noTypesFound: 'No se encontraron tipos',
    selectSet: 'Seleccionar set',
    allSets: 'Todos los sets',
    cardDetails: 'Detalles de la carta',
    collection: 'Colección',
    manageCards: 'Administra y rastrea tu colección de cartas',
    // New advanced filter translations
    category: 'Categoría',
    power: 'Poder',
    life: 'Vida',
    counter: 'Counter',
    attribute: 'Atributo',
    all: 'Todos',
    any: 'Cualquiera',
    advancedFilters: 'Avanzado',
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
    version: 'Versión',
    // Card sorting translations
    cardNumber: 'Número de Carta',
    name: 'Nombre',
    sort: 'Ordenar',

    // About & Contact translations
    aboutTitle: "Sobre DeckMastery",
    aboutDescription: "DeckMastery es tu compañero definitivo para construir, gestionar y dominar tus colecciones de juegos de cartas.",
    contactUs: "Contáctanos",
    contactEmail: "Correo",
    contactWhatsApp: "WhatsApp",
    yourName: "Tu Nombre",
    yourEmail: "Tu Correo",
    yourMessage: "Tu Mensaje",
    sendMessage: "Enviar Mensaje",
    messageSent: "¡Mensaje enviado!",
    messageSentDescription: "Nos pondremos en contacto contigo pronto.",

    // Products translations
    ourProducts: "Nuestros Productos",
    basicMembership: "Membresía Básica",
    basicMembershipDescription: "Perfecto para jugadores casuales. Acceso a herramientas básicas de construcción de mazos y gestión de cartas.",
    proMembership: "Membresía Pro",
    proMembershipDescription: "Análisis avanzado de mazos, almacenamiento ilimitado y características premium.",
    teamPackage: "Paquete de Equipo",
    teamPackageDescription: "Perfecto para grupos de juego. Incluye funciones de colaboración en equipo y bibliotecas compartidas.",
    getStartedProducts: "Comenzar",

    // Legal translations
    termsOfUse: "Términos de Uso",
    termsDescription: "Al usar DeckMastery, aceptas estos términos",
    privacyPolicy: "Política de Privacidad (Compatible con LGPD)",
    privacyTitle: "Protección de Datos",
    dataCollection: "Recolección de Datos",
    dataCollectionList: "Información de cuenta,Datos de uso,Información del dispositivo",
    userRights: "Tus Derechos (LGPD)",
    userRightsList: "Derecho de acceso,Derecho de corrección,Derecho de eliminación,Derecho de portabilidad,Derecho de retirar consentimiento",
    dataUsage: "Uso de Datos",
    dataUsageDescription: "Usamos tus datos para proporcionar y mejorar nuestros servicios. No vendemos tus datos.",
    cookiePolicy: "Política de Cookies",
    cookieDescription: "Utilizamos cookies y tecnologías similares para:",
    cookieTypes: "Funciones esenciales,Analíticas,Optimización de rendimiento,Marketing",
  },
  pt: {
    language: 'Português',
    dashboard: 'Painel',
    deckBuilder: 'Construtor de Decks',
    cardLibrary: 'Biblioteca de Cartas',
    staticData: 'Dados Estáticos',
    admin: 'Administração',
    profile: 'Perfil',
    logout: 'Sair',
    login: 'Entrar',
    register: 'Registrar',
    magicTheGathering: 'Magic: The Gathering',
    pokemon: 'Pokémon',
    yugioh: 'Yu-Gi-Oh!',
    onepiece: 'One Piece',
    grid: 'Grade',
    list: 'Lista',
    searchCards: 'Pesquisar cartas...',
    filters: 'Filtros',
    clearAll: 'Limpar Tudo',
    colors: 'Cores',
    types: 'Tipos',
    rarities: 'Raridades',
    parallels: 'Paralelos',
    backToSets: 'Voltar aos Conjuntos',
    card: 'Carta',
    cards: 'Cartas',
    loadingCards: 'Carregando cartas...',
    loading: 'Carregando...',
    noCardsFound: 'Nenhuma Carta Encontrada',
    adjustFilters: 'Tente ajustar seus filtros ou a consulta de busca para encontrar o que procura.',
    clearFilters: 'Limpar Filtros',
    noSetsFound: 'Nenhum Conjunto Encontrado',
    noSetsAvailable: 'Não há conjuntos de cartas disponíveis para esta categoria de jogo.',
    viewCards: 'Ver Cartas',
    type: 'Tipo',
    cost: 'Custo',
    set: 'Conjunto',
    rarity: 'Raridade',
    priceHistory: 'Histórico de Preços',
    price: 'Preço',
    days: 'Dias',
    browseSearchCards: 'Navegue e pesquise por cartas em todas as categorias de jogos suportadas.',
    cardSets: 'Conjuntos de Cartas',
    showing: 'Mostrando',
    of: 'de',
    page: 'Página',
    selected: 'selecionado',
    selectTypes: 'Selecionar tipos',
    searchTypes: 'Pesquisar tipos...',
    noTypesFound: 'Nenhum tipo encontrado',
    selectSet: 'Selecionar conjunto',
    allSets: 'Todos os Conjuntos',
    cardDetails: 'Detalhes da carta',
    collection: 'Coleção',
    manageCards: 'Gerencie e acompanhe sua coleção de cartas',
    // New advanced filter translations
    category: 'Categoria',
    power: 'Poder',
    life: 'Vida',
    counter: 'Counter',
    attribute: 'Atributo',
    all: 'Todos',
    any: 'Qualquer',
    advancedFilters: 'Avançado',
    // Dashboard translations
    yourDecks: 'Seus Decks',
    manageCreateDecks: 'Gerencie seus decks existentes ou crie novos.',
    createNewDeck: 'Criar Novo Deck',
    searchDecks: 'Pesquisar decks...',
    filter: 'Filtrar',
    loadingDecks: 'Carregando decks...',
    noDecksFound: 'Nenhum Deck Encontrado',
    noResultsMatching: 'Nenhum resultado correspondente',
    noDecksYet: 'Você ainda não criou nenhum deck para',
    startBuildingDeck: 'Comece a construir seu primeiro deck agora!',
    createFirstDeck: 'Crie seu primeiro deck',
    // DeckBuilder translations
    deckNameRequired: 'Nome do deck é obrigatório',
    deckNeedsCards: 'O deck precisa de pelo menos uma carta',
    deckUpdated: 'Deck atualizado com sucesso',
    deckCreated: 'Deck criado com sucesso',
    standard: 'Padrão',
    modern: 'Moderno',
    commander: 'Commander',
    legacy: 'Legado',
    vintage: 'Vintage',
    casual: 'Casual',
    editDeck: 'Editar Deck',
    deckName: 'Nome do Deck',
    enterDeckName: 'Digite um nome para o seu deck',
    format: 'Formato',
    selectFormat: 'Selecionar formato',
    description: 'Descrição',
    describeStrategy: 'Descreva a estratégia do seu deck...',
    updateDeck: 'Atualizar Deck',
    saveDeck: 'Salvar Deck',
    yourDeck: 'Seu Deck',
    noCardsAddedYet: 'Nenhuma carta adicionada ainda',
    browseAddCards: 'Navegue e adicione cartas do lado direito',
    tryAdjustingFilters: 'Tente ajustar seus filtros para encontrar o que procura',
    added: 'Adicionado',
    add: 'Adicionar',
    // Index translations
    welcome: 'Bem-vindo ao DeckMastery',
    welcomeDescription: 'Crie e gerencie decks para jogos de cartas populares em um só lugar',
    getStarted: 'Começar',
    exploreCardLibrary: 'Explorar Biblioteca de Cartas',
    multipleGameSupport: 'Suporte a Múltiplos Jogos',
    trackCollection: 'Acompanhe Sua Coleção',
    shareDeckStrategies: 'Compartilhe Estratégias de Deck',
    // Layout translations
    authRequired: 'Autenticação Necessária',
    pleaseSignIn: 'Por favor, entre para acessar este recurso',
    newDeck: 'Novo Deck',
    signIn: 'Entrar',
    version: 'Versão',
    // Card sorting translations
    cardNumber: 'Número',
    name: 'Nome',
    sort: 'Ordenar',

    // About & Contact translations
    aboutTitle: "Sobre o DeckMastery",
    aboutDescription: "DeckMastery é seu companheiro definitivo para construir, gerenciar e dominar suas coleções de jogos de cartas.",
    contactUs: "Entre em Contato",
    contactEmail: "E-mail",
    contactWhatsApp: "WhatsApp",
    yourName: "Seu Nome",
    yourEmail: "Seu E-mail",
    yourMessage: "Sua Mensagem",
    sendMessage: "Enviar Mensagem",
    messageSent: "Mensagem enviada!",
    messageSentDescription: "Entraremos em contato em breve.",

    // Products translations
    ourProducts: "Nossos Produtos",
    basicMembership: "Plano Básico",
    basicMembershipDescription: "Perfeito para jogadores casuais. Acesso a ferramentas básicas de construção de decks e gerenciamento de cartas.",
    proMembership: "Plano Pro",
    proMembershipDescription: "Análise avançada de decks, armazenamento ilimitado e recursos premium.",
    teamPackage: "Plano Time",
    teamPackageDescription: "Perfeito para grupos de jogadores. Inclui recursos de colaboração em equipe e bibliotecas compartilhadas.",
    getStartedProducts: "Começar",

    // Legal translations
    termsOfUse: "Termos de Uso",
    termsDescription: "Ao usar o DeckMastery, você concorda com estes termos",
    privacyPolicy: "Política de Privacidade (Em conformidade com a LGPD)",
    privacyTitle: "Proteção de Dados",
    dataCollection: "Coleta de Dados",
    dataCollectionList: "Informações da conta,Dados de uso,Informações do dispositivo",
    userRights: "Seus Direitos (LGPD)",
    userRightsList: "Direito de acesso,Direito de correção,Direito de exclusão,Direito de portabilidade,Direito de retirar consentimento",
    dataUsage: "Uso dos Dados",
    dataUsageDescription: "Usamos seus dados para fornecer e melhorar nossos serviços. Não vendemos seus dados.",
    cookiePolicy: "Política de Cookies",
    cookieDescription: "Utilizamos cookies e tecnologias similares para:",
    cookieTypes: "Funções essenciais,Análises,Otimização de desempenho,Marketing",
  },
};

const LanguageContext = createContext({
  language: 'en' as Language,
  t: (key: keyof Translations) => defaultTranslations.en[key],
  setLanguage: (language: Language) => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt');

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
