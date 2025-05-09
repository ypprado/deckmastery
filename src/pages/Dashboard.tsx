
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Filter, Clock, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useDecks } from '@/hooks/use-decks';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

const Dashboard = () => {
  const { decks, loading, activeGameCategory } = useDecks();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

  const filteredDecks = searchQuery 
    ? decks.filter(deck => 
        deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deck.format.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : decks;

  // Updated function with additional logging
  const goToDeck = (id: string) => {
    console.log(`Navigating to deck with id: ${id}`);
    navigate(`/deck/${id}`);
  };

  const colorMap: Record<string, string> = {
    white: 'bg-amber-100 dark:bg-amber-800',
    blue: 'bg-blue-100 dark:bg-blue-800',
    black: 'bg-gray-700 dark:bg-gray-900',
    red: 'bg-red-100 dark:bg-red-800',
    green: 'bg-green-100 dark:bg-green-800',
    yellow: 'bg-yellow-100 dark:bg-yellow-800',
    purple: 'bg-purple-100 dark:bg-purple-800',
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('myDecks')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('manageCreateDecks')}
          </p>
        </div>
        <Button size="default" onClick={() => navigate('/deck/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('createNewDeck')}
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('searchDecks')}
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="shrink-0">
          <Filter className="mr-2 h-4 w-4" />
          {t('filter')}
        </Button>
      </div>

      {loading ? (
        <div className="mt-20 flex justify-center">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-sm text-muted-foreground">{t('loadingDecks')}</p>
          </div>
        </div>
      ) : filteredDecks.length === 0 ? (
        <div className="mt-20 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-fade-in">
          <FolderOpen className="h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-medium">{t('noDecksFound')}</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            {searchQuery 
              ? `${t('noResultsMatching')} "${searchQuery}". ${t('adjustFilters')}` 
              : `${t('noDecksYet')} ${activeGameCategory.charAt(0).toUpperCase() + activeGameCategory.slice(1)}. ${t('startBuildingDeck')}`}
          </p>
          {!searchQuery && (
            <Button onClick={() => navigate('/deck/new')} className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('createFirstDeck')}
            </Button>
          )}
        </div>
      ) : (
        <div className="deck-grid">
          {filteredDecks.map((deck) => (
            <Card 
              key={deck.id} 
              className="overflow-hidden card-hover animate-scale-up cursor-pointer"
              onClick={() => goToDeck(deck.id)}
            >
              <div className="aspect-[2/1] overflow-hidden relative">
                {deck.coverCard ? (
                  <img
                    src={deck.coverCard.imageUrl}
                    alt={deck.name}
                    className="object-cover w-full h-full transition-transform duration-500 ease-in-out hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <FolderOpen className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                  {deck.colors.map((color) => (
                    <div
                      key={color}
                      className={cn(
                        "w-4 h-4 rounded-full border border-white/20",
                        colorMap[color] || "bg-gray-200"
                      )}
                    />
                  ))}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-lg leading-tight">{deck.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {deck.format} • {deck.cards.reduce((acc, curr) => acc + curr.quantity, 0)} {deck.cards.reduce((acc, curr) => acc + curr.quantity, 0) === 1 ? t('card') : t('cards')}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>
                    {formatDistanceToNow(new Date(deck.updatedAt), { addSuffix: true })}
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
