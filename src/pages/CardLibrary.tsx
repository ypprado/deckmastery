import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCards } from '@/hooks/use-decks';
import CardDetailView from '@/components/cards/CardDetailView';
import CardFilters from '@/components/card-library/CardFilters';
import CardGrid from '@/components/card-library/CardGrid';
import CardList from '@/components/card-library/CardList';
import CardLibraryHeader from '@/components/card-library/CardLibraryHeader';
import CardPagination from '@/components/card-library/CardPagination';
import { useCardDatabase } from '@/hooks/use-card-database';

const CARDS_PER_PAGE = 20;
const PARALLEL_TYPES = [
  "Alternate Art", "Manga Art", "Parallel Art", "Box Topper", "Wanted Poster",
  "SP", "TR", "Jolly Roger Foil", "Reprint", "Full Art"
];

const colorMap: Record<string, string> = {
  white: 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
  black: 'bg-gray-700 text-white dark:bg-gray-900 dark:text-gray-100',
  red: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
  green: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100',
};

const colorNames: Record<string, string> = {
  white: 'White',
  blue: 'Blue',
  black: 'Black',
  red: 'Red',
  green: 'Green',
  yellow: 'Yellow',
  purple: 'Purple'
};

const CardLibrary = () => {
  const { cards, loading, searchCards, filterCards, activeGameCategory, saveFilterState, getCurrentFilterState } = useCards();
  const { sets } = useCardDatabase();
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const filterState = getCurrentFilterState();
  const [searchQuery, setSearchQuery] = useState<string>(filterState.searchQuery || '');
  const [activeFilters, setActiveFilters] = useState<{
    colors: string[];
    rarities: string[];
    parallels: string[];
    set: string | null;
  }>({
    colors: filterState.colorFilters || [],
    rarities: filterState.rarityFilters || [],
    parallels: filterState.parallelFilters || [],
    set: filterState.selectedSet || null,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilters]);

  const availableSets = Array.from(
    new Set(cards.map(card => card.set))
  )
  .filter((setId): setId is string => setId !== null && setId !== undefined)
  .map(setId => {
    const setIdNumber = parseInt(setId);
    const setInfo = !isNaN(setIdNumber) ? sets.find(set => set.id === setIdNumber) : null;
    
    return {
      id: setId,
      name: setInfo ? setInfo.name : setId
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

  const handleSetChange = (value: string | null) => {
    setActiveFilters(prev => ({
      ...prev,
      set: value
    }));
  };

  const toggleFilter = (type: 'colors' | 'rarities' | 'parallels', value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value) 
        ? prev[type].filter(item => item !== value) 
        : [...prev[type], value]
    }));
  };

  const clearFilters = () => {
    setActiveFilters({
      colors: [],
      rarities: [],
      parallels: [],
      set: null
    });
    setSearchQuery('');
  };

  const handleCardClick = (card: any) => {
    const cardIndex = filteredCards.findIndex(c => c.id === card.id);
    setSelectedCard(card);
    setIsDetailOpen(true);
  };

  const handleNextCard = () => {
    const currentIndex = filteredCards.findIndex(card => card.id === selectedCard?.id);
    if (currentIndex < filteredCards.length - 1) {
      setSelectedCard(filteredCards[currentIndex + 1]);
    }
  };

  const handlePreviousCard = () => {
    const currentIndex = filteredCards.findIndex(card => card.id === selectedCard?.id);
    if (currentIndex > 0) {
      setSelectedCard(filteredCards[currentIndex - 1]);
    }
  };

  const filteredCards = (searchQuery 
    ? searchCards(searchQuery)
    : cards
  ).filter(card => {
    if (activeFilters.set && String(card.set) !== activeFilters.set) {
      return false;
    }
    
    if (activeFilters.colors.length > 0) {
      if (!card.colors || !activeFilters.colors.some(color => card.colors.includes(color))) {
        return false;
      }
    }
    
    if (activeFilters.rarities.length > 0) {
      if (!card.rarity || !activeFilters.rarities.includes(card.rarity)) {
        return false;
      }
    }
    
    if (activeFilters.parallels.length > 0) {
      if (!card.parallel || !card.parallel.some(p => activeFilters.parallels.includes(p))) {
        return false;
      }
    }
    
    return true;
  });

  const totalPages = Math.ceil(filteredCards.length / CARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const endIndex = startIndex + CARDS_PER_PAGE;
  const sortedCards = [...filteredCards].sort((a, b) =>
    (a.card_number || '').localeCompare(b.card_number || '')
  );
  const paginatedCards = sortedCards.slice(startIndex, endIndex);

  const isAnyFilterActive = 
    activeFilters.colors.length > 0 || 
    activeFilters.rarities.length > 0 ||
    activeFilters.parallels.length > 0 ||
    activeFilters.set !== null ||
    searchQuery.length > 0;

  if (loading) {
    return (
      <div className="mt-8 flex justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('cardLibrary')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('browseSearchCards')}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <CardLibraryHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedSet={activeFilters.set}
          onSetChange={handleSetChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          availableSets={availableSets}
        />

        <CardFilters
          uniqueColors={Array.from(new Set(cards.flatMap(card => card.colors)))}
          uniqueRarities={Array.from(new Set(cards.map(card => card.rarity)))}
          uniqueParallels={PARALLEL_TYPES}
          activeFilters={activeFilters}
          toggleFilter={toggleFilter}
          clearFilters={clearFilters}
          isAnyFilterActive={isAnyFilterActive}
          colorMap={colorMap}
          colorNames={colorNames}
        />

        <div className="flex justify-between items-center my-4">
          <p className="text-sm text-muted-foreground">
            {t('showing')} {startIndex + 1}-{Math.min(endIndex, filteredCards.length)} {t('of')} {filteredCards.length} {filteredCards.length === 1 ? t('card') : t('cards')}
          </p>
          
          <div className="md:hidden text-sm">
            {t('page')} {currentPage} {t('of')} {totalPages}
          </div>
        </div>
        
        {viewMode === 'grid' ? (
          <CardGrid cards={paginatedCards} onCardClick={handleCardClick} />
        ) : (
          <CardList 
            cards={paginatedCards} 
            onCardClick={handleCardClick} 
            colorMap={colorMap} 
          />
        )}
        
        <CardPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <CardDetailView 
        card={selectedCard} 
        isOpen={isDetailOpen} 
        onOpenChange={setIsDetailOpen}
        onNextCard={handleNextCard}
        onPreviousCard={handlePreviousCard}
        hasNextCard={selectedCard ? filteredCards.findIndex(card => card.id === selectedCard.id) < filteredCards.length - 1 : false}
        hasPreviousCard={selectedCard ? filteredCards.findIndex(card => card.id === selectedCard.id) > 0 : false}
      />
    </div>
  );
};

export default CardLibrary;
