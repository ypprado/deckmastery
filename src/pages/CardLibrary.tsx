
import { useState } from 'react';
import { Search, Filter, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useCards } from '@/hooks/use-decks';
import { cn } from '@/lib/utils';

const colorNames: Record<string, string> = {
  white: 'White',
  blue: 'Blue',
  black: 'Black',
  red: 'Red',
  green: 'Green'
};

const CardLibrary = () => {
  const { cards, loading, searchCards, filterCards } = useCards();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<{
    colors: string[];
    types: string[];
    rarities: string[];
  }>({
    colors: [],
    types: [],
    rarities: []
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const uniqueTypes = Array.from(new Set(cards.map(card => card.type)));
  const uniqueRarities = Array.from(new Set(cards.map(card => card.rarity)));
  const uniqueColors = ['white', 'blue', 'black', 'red', 'green'];

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

  // Apply filters
  const filteredCards = searchQuery 
    ? searchCards(searchQuery)
    : activeFilters.colors.length || activeFilters.types.length || activeFilters.rarities.length
      ? filterCards({
          colors: activeFilters.colors.length ? activeFilters.colors : undefined,
          type: activeFilters.types.length ? activeFilters.types[0] : undefined, // Simplified for demo
          rarity: activeFilters.rarities.length ? activeFilters.rarities[0] : undefined, // Simplified for demo
        })
      : cards;

  const colorMap: Record<string, string> = {
    white: 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
    black: 'bg-gray-700 text-white dark:bg-gray-900 dark:text-gray-100',
    red: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
    green: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
  };

  const isAnyFilterActive = 
    activeFilters.colors.length > 0 || 
    activeFilters.types.length > 0 || 
    activeFilters.rarities.length > 0 ||
    searchQuery.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Card Library</h1>
        <p className="text-muted-foreground mt-1">
          Browse and search for cards to add to your decks
        </p>
      </div>

      {/* Search and view toggles */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search cards..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs defaultValue="grid" className="w-fit">
          <TabsList>
            <TabsTrigger value="grid" onClick={() => setViewMode('grid')}>Grid</TabsTrigger>
            <TabsTrigger value="list" onClick={() => setViewMode('list')}>List</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Filters */}
      <div className="rounded-md border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Filters</h3>
          {isAnyFilterActive && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
              <X className="h-3 w-3 mr-1" /> Clear All
            </Button>
          )}
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          {/* Colors */}
          <div>
            <h4 className="text-xs font-medium mb-2">Colors</h4>
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
                  {colorNames[color]}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Types */}
          <div>
            <h4 className="text-xs font-medium mb-2">Types</h4>
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
            <h4 className="text-xs font-medium mb-2">Rarities</h4>
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
            <p className="mt-4 text-sm text-muted-foreground">Loading cards...</p>
          </div>
        </div>
      ) : filteredCards.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-fade-in">
          <Search className="h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-medium">No cards found</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            Try adjusting your filters or search term to find what you're looking for.
          </p>
          <Button onClick={clearFilters} variant="outline" className="mt-4">
            Clear Filters
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredCards.map((card) => (
            <Card key={card.id} className="overflow-hidden card-hover relative group transition-all duration-300">
              <div className="aspect-[3/4] overflow-hidden card-tilt">
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium text-sm leading-tight truncate">{card.name}</h3>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-muted-foreground">{card.type}</p>
                  <p className="text-xs text-muted-foreground">Cost: {card.cost}</p>
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
          {filteredCards.map((card) => (
            <div key={card.id} className="p-4 flex items-center gap-4 hover:bg-muted/40 transition-colors">
              <div className="h-16 w-12 shrink-0 overflow-hidden rounded-sm">
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm">{card.name}</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="text-xs text-muted-foreground">{card.type}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{card.rarity}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">Cost: {card.cost}</span>
                </div>
              </div>
              <div className="flex gap-1">
                {card.colors.map(color => (
                  <div
                    key={color}
                    className={cn(
                      "w-4 h-4 rounded-full",
                      colorMap[color].split(" ")[0] || "bg-gray-200"
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
    </div>
  );
};

export default CardLibrary;
