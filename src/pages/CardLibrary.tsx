import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Plus, X, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useCards } from '@/hooks/use-decks';
import { cn } from '@/lib/utils';
import CardDetailView from '@/components/cards/CardDetailView';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

const colorNames: Record<string, string> = {
  white: 'White',
  blue: 'Blue',
  black: 'Black',
  red: 'Red',
  green: 'Green',
  yellow: 'Yellow',
  purple: 'Purple'
};

const CARDS_PER_PAGE = 20;

const CardLibrary = () => {
  const { cards, loading, searchCards, filterCards, activeGameCategory, saveFilterState, getCurrentFilterState } = useCards();
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCard, setSelectedCard] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Get the current filter state for this game category
  const filterState = getCurrentFilterState();
  const [searchQuery, setSearchQuery] = useState(filterState.searchQuery || '');
  const [activeFilters, setActiveFilters] = useState<{
    colors: string[];
    types: string[];
    rarities: string[];
  }>({
    colors: filterState.colorFilters || [],
    types: filterState.typeFilters || [],
    rarities: filterState.rarityFilters || [],
  });
  const [selectedSet, setSelectedSet] = useState<string | null>(filterState.selectedSet || null);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilters, selectedSet]);

  // Get unique sets from the current game category
  const availableSets = Array.from(new Set(cards.map(card => card.set)));

  // Reset selected set when game category changes
  useEffect(() => {
    // Load filter state for the current game category
    const currentState = getCurrentFilterState();
    setSearchQuery(currentState.searchQuery || '');
    setActiveFilters({
      colors: currentState.colorFilters || [],
      types: currentState.typeFilters || [],
      rarities: currentState.rarityFilters || []
    });
    setSelectedSet(currentState.selectedSet || null);
    setCurrentPage(1); // Reset to first page when changing game category
  }, [activeGameCategory, getCurrentFilterState]);
  
  // Use useCallback for saveFilterState to avoid dependency issues
  const saveFilterStateCallback = useCallback((state) => {
    saveFilterState(state);
  }, [saveFilterState]);
  
  // Save filter state when it changes - with proper dependency array
  useEffect(() => {
    // Add a debounce to avoid infinite loops
    const saveTimer = setTimeout(() => {
      saveFilterStateCallback({
        searchQuery,
        colorFilters: activeFilters.colors,
        typeFilters: activeFilters.types,
        rarityFilters: activeFilters.rarities,
        selectedSet
      });
    }, 300);
    
    return () => clearTimeout(saveTimer);
  }, [searchQuery, activeFilters.colors, activeFilters.types, activeFilters.rarities, selectedSet, saveFilterStateCallback]);
  
  // Filter cards by selected set
  const cardsInSelectedSet = selectedSet 
    ? cards.filter(card => card.set === selectedSet)
    : [];

  const uniqueTypes = Array.from(new Set(cardsInSelectedSet.map(card => card.type)));
  const uniqueRarities = Array.from(new Set(cardsInSelectedSet.map(card => card.rarity)));
  const uniqueColors = Array.from(new Set(cardsInSelectedSet.flatMap(card => card.colors)));

  const toggleFilter = (type: 'colors' | 'types' | 'rarities', value: string) => {
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
      types: [],
      rarities: []
    });
    setSearchQuery('');
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsDetailOpen(true);
  };

  // Apply filters to cards in selected set
  const filteredCards = selectedSet
    ? (searchQuery 
        ? searchCards(searchQuery).filter(card => card.set === selectedSet)
        : activeFilters.colors.length || activeFilters.types.length || activeFilters.rarities.length
          ? filterCards({
              colors: activeFilters.colors.length ? activeFilters.colors : undefined,
              type: activeFilters.types.length ? activeFilters.types[0] : undefined,
              rarity: activeFilters.rarities.length ? activeFilters.rarities[0] : undefined,
            }).filter(card => card.set === selectedSet)
          : cardsInSelectedSet)
    : [];

  // Pagination calculations
  const totalPages = Math.ceil(filteredCards.length / CARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const endIndex = startIndex + CARDS_PER_PAGE;
  const paginatedCards = filteredCards.slice(startIndex, endIndex);

  // Page navigation handlers
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

  const colorMap: Record<string, string> = {
    white: 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
    black: 'bg-gray-700 text-white dark:bg-gray-900 dark:text-gray-100',
    red: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
    green: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100',
  };

  const isAnyFilterActive = 
    activeFilters.colors.length > 0 || 
    activeFilters.types.length > 0 || 
    activeFilters.rarities.length > 0 ||
    searchQuery.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('cardLibrary')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('browseSearchCards')}
        </p>
      </div>

      {selectedSet ? (
        <>
          {/* Back button to return to sets view */}
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => setSelectedSet(null)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToSets')}
          </Button>

          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold">{selectedSet}</h2>
            {filteredCards.length > 0 && (
              <Badge variant="outline">
                {filteredCards.length} {filteredCards.length === 1 ? t('card') : t('cards')}
              </Badge>
            )}
          </div>

          {/* Search and view toggles */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('searchCards')}
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs defaultValue="grid" className="w-fit">
              <TabsList>
                <TabsTrigger value="grid" onClick={() => setViewMode('grid')}>{t('grid')}</TabsTrigger>
                <TabsTrigger value="list" onClick={() => setViewMode('list')}>{t('list')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Filters */}
          <div className="rounded-md border bg-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">{t('filters')}</h3>
              {isAnyFilterActive && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
                  <X className="h-3 w-3 mr-1" /> {t('clearAll')}
                </Button>
              )}
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              {/* Colors */}
              <div>
                <h4 className="text-xs font-medium mb-2">{t('colors')}</h4>
                <div className="flex flex-wrap gap-1">
                  {uniqueColors.map(color => (
                    <Badge 
                      key={color}
                      variant={activeFilters.colors.includes(color) ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer hover:bg-muted transition-colors",
                        activeFilters.colors.includes(color) && colorMap[color]
                      )}
                      onClick={() => toggleFilter('colors', color)}
                    >
                      {colorNames[color] || color.charAt(0).toUpperCase() + color.slice(1)}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Types */}
              <div>
                <h4 className="text-xs font-medium mb-2">{t('types')}</h4>
                <div className="flex flex-wrap gap-1">
                  {uniqueTypes.map(type => (
                    <Badge 
                      key={type}
                      variant={activeFilters.types.includes(type) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => toggleFilter('types', type)}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Rarities */}
              <div>
                <h4 className="text-xs font-medium mb-2">{t('rarities')}</h4>
                <div className="flex flex-wrap gap-1">
                  {uniqueRarities.map(rarity => (
                    <Badge 
                      key={rarity}
                      variant={activeFilters.rarities.includes(rarity) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => toggleFilter('rarities', rarity)}
                    >
                      {rarity}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card display */}
          {loading ? (
            <div className="mt-8 flex justify-center">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="mt-4 text-sm text-muted-foreground">{t('loadingSets')}</p>
              </div>
            </div>
          ) : filteredCards.length === 0 ? (
            <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-fade-in">
              <Search className="h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">{t('noCardsFound')}</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                {t('adjustFilters')}
              </p>
              <Button onClick={clearFilters} variant="outline" className="mt-4">
                {t('clearFilters')}
              </Button>
            </div>
          ) : (
            <>
              {/* Pagination stats */}
              <div className="flex justify-between items-center my-4">
                <p className="text-sm text-muted-foreground">
                  {t('showing')} {startIndex + 1}-{Math.min(endIndex, filteredCards.length)} {t('of')} {filteredCards.length} {filteredCards.length === 1 ? t('card') : t('cards')}
                </p>
                
                {/* Page indicator for smaller screens */}
                <div className="md:hidden text-sm">
                  {t('page')} {currentPage} {t('of')} {totalPages}
                </div>
              </div>
              
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {paginatedCards.map((card) => (
                    <Card 
                      key={card.id} 
                      className="overflow-hidden card-hover relative group transition-all duration-300 cursor-pointer"
                      onClick={() => handleCardClick(card)}
                    >
                      <div className="aspect-[3/4] overflow-hidden card-tilt">
                        <img
                          src={card.imageUrl}
                          alt={card.name}
                          className="object-cover w-full h-full"
                          loading="lazy"
                        />
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-medium text-sm leading-tight truncate">{card.name}</h3>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-muted-foreground">{card.type}</p>
                          <p className="text-xs text-muted-foreground">{t('cost')}: {card.cost}</p>
                        </div>
                      </CardContent>
                      <Button
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="border rounded-md divide-y">
                  {paginatedCards.map((card) => (
                    <div 
                      key={card.id} 
                      className="p-4 flex items-center gap-4 hover:bg-muted/40 transition-colors cursor-pointer"
                      onClick={() => handleCardClick(card)}
                    >
                      <div className="h-16 w-12 shrink-0 overflow-hidden rounded-sm">
                        <img
                          src={card.imageUrl}
                          alt={card.name}
                          className="object-cover w-full h-full"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm">{card.name}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="text-xs text-muted-foreground">{card.type}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{card.rarity}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{t('cost')}: {card.cost}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {card.colors.map(color => (
                          <div
                            key={color}
                            className={cn(
                              "w-4 h-4 rounded-full",
                              colorMap[color]?.split(" ")[0] || "bg-gray-200"
                            )}
                          />
                        ))}
                      </div>
                      <Button size="icon" className="h-8 w-8 shrink-0">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Pagination controls */}
              {totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={goToPrevPage} 
                        className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                      />
                    </PaginationItem>
                    
                    {/* Page numbers - show on larger screens */}
                    <div className="hidden md:flex">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        // For 5 or fewer pages, show all page numbers
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
                        
                        // For more than 5 pages, show a context-aware range
                        let pageNum;
                        if (currentPage <= 3) {
                          // Near the start: show 1,2,3,4,...,n
                          if (i < 4) {
                            pageNum = i + 1;
                          } else {
                            pageNum = totalPages;
                          }
                        } else if (currentPage > totalPages - 3) {
                          // Near the end: show 1,...,n-3,n-2,n-1,n
                          if (i === 0) {
                            pageNum = 1;
                          } else {
                            pageNum = totalPages - 4 + i;
                          }
                        } else {
                          // In the middle: show 1,...,c-1,c,c+1,...,n
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
        </>
      ) : (
        // Sets View
        <>
          <h2 className="text-xl font-semibold mb-4">{t('cardSets')}</h2>
          
          {loading ? (
            <div className="mt-8 flex justify-center">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="mt-4 text-sm text-muted-foreground">{t('loadingSets')}</p>
              </div>
            </div>
          ) : availableSets.length === 0 ? (
            <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-fade-in">
              <h3 className="mt-4 text-lg font-medium">{t('noSetsFound')}</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                {t('noSetsAvailable')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableSets.map((set) => {
                // Find the first card of the set to use as cover
                const setCoverCard = cards.find(card => card.set === set);
                // Count cards in this set
                const cardCount = cards.filter(card => card.set === set).length;
                
                return (
                  <Card 
                    key={set} 
                    className="cursor-pointer hover:shadow-md transition-shadow" 
                    onClick={() => setSelectedSet(set)}
                  >
                    <div className="flex p-4 gap-4">
                      {setCoverCard && (
                        <div className="h-20 w-16 shrink-0 overflow-hidden rounded-sm">
                          <img
                            src={setCoverCard.imageUrl}
                            alt={set}
                            className="object-cover w-full h-full"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium">{set}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {cardCount} {cardCount !== 1 ? t('cards') : t('card')}
                        </p>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="mt-2"
                        >
                          {t('viewCards')}
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Card Detail Dialog */}
      <CardDetailView 
        card={selectedCard} 
        isOpen={isDetailOpen} 
        onOpenChange={setIsDetailOpen} 
      />
    </div>
  );
};

export default CardLibrary;
