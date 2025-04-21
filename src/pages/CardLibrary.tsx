import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCards } from '@/hooks/use-decks';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import CardDetailView from '@/components/cards/CardDetailView';
import CardFilters from '@/components/card-library/CardFilters';
import CardGrid from '@/components/card-library/CardGrid';
import CardList from '@/components/card-library/CardList';
import SearchBar from '@/components/card-library/SearchBar';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

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

  const availableSets = Array.from(new Set(cards.map(card => card.set)));
  const allCards = cards;

  const uniqueColors = Array.from(new Set(allCards.flatMap(card => card.colors)));
  const uniqueRarities = Array.from(new Set(allCards.map(card => card.rarity)));
  
  const uniqueParallels = PARALLEL_TYPES;

  const handleSetChange = (value: string | null) => {
    setActiveFilters(prev => ({
      ...prev,
      set: value
    }));
  };

  const toggleFilter = (type: 'colors' | 'rarities' | 'parallels', value: string) => {
    setActiveFilters(prev => {
      const isActive = prev[type].includes(value);
      return {
        ...prev,
        [type]: isActive 
          ? prev[type].filter(item => item !== value) 
          : [...prev[type], value]
      };
    });
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
    setSelectedCard(card);
    setIsDetailOpen(true);
  };

  const filteredCards = (searchQuery 
    ? searchCards(searchQuery)
    : allCards
  ).filter(card => {
    if (activeFilters.set && card.set !== activeFilters.set) {
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
  const paginatedCards = filteredCards.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  const isAnyFilterActive = 
    activeFilters.colors.length > 0 || 
    activeFilters.rarities.length > 0 ||
    activeFilters.parallels.length > 0 ||
    activeFilters.set !== null ||
    searchQuery.length > 0;

  console.log("Parallel filters:", {
    uniqueParallels,
    activeParallels: activeFilters.parallels,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('cardLibrary')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('browseSearchCards')}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          </div>
          <Select
            value={activeFilters.set || "all"}
            onValueChange={(value) => handleSetChange(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t('selectSet')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allSets')}</SelectItem>
              {availableSets.map(set => (
                <SelectItem key={set} value={set}>{set}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Tabs defaultValue="grid" className="w-fit">
            <TabsList>
              <TabsTrigger value="grid" onClick={() => setViewMode('grid')}>
                {t('grid')}
              </TabsTrigger>
              <TabsTrigger value="list" onClick={() => setViewMode('list')}>
                {t('list')}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <CardFilters
          uniqueColors={uniqueColors}
          uniqueRarities={uniqueRarities}
          uniqueParallels={uniqueParallels}
          activeFilters={activeFilters}
          toggleFilter={toggleFilter}
          clearFilters={clearFilters}
          isAnyFilterActive={isAnyFilterActive}
          colorMap={colorMap}
          colorNames={colorNames}
        />

        {loading ? (
          <div className="mt-8 flex justify-center">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-sm text-muted-foreground">{t('loading')}</p>
            </div>
          </div>
        ) : (
          <>
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
            
            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={goToPrevPage} 
                      className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                    />
                  </PaginationItem>
                  
                  <div className="hidden md:flex">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      if (totalPages <= 5) {
                        return (
                          <PaginationItem key={i + 1}>
                            <Button 
                              variant={currentPage === i + 1 ? "default" : "outline"}
                              size="icon"
                              className="w-10 h-10"
                              onClick={() => setCurrentPage(i + 1)}
                            >
                              {i + 1}
                            </Button>
                          </PaginationItem>
                        );
                      }
                      
                      let pageNum;
                      if (currentPage <= 3) {
                        if (i < 4) {
                          pageNum = i + 1;
                        } else {
                          pageNum = totalPages;
                        }
                      } else if (currentPage > totalPages - 3) {
                        if (i === 0) {
                          pageNum = 1;
                        } else {
                          pageNum = totalPages - 4 + i;
                        }
                      } else {
                        if (i === 0) {
                          pageNum = 1;
                        } else if (i === 4) {
                          pageNum = totalPages;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                      }
                      
                      return (
                        <PaginationItem key={pageNum}>
                          <Button 
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="icon"
                            className="w-10 h-10"
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        </PaginationItem>
                      );
                    })}
                  </div>
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={goToNextPage} 
                      className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>

      <CardDetailView 
        card={selectedCard} 
        isOpen={isDetailOpen} 
        onOpenChange={setIsDetailOpen} 
      />
    </div>
  );
};

export default CardLibrary;
