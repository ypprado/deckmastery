
import { useState } from 'react';
import { toast } from 'sonner';
import { Card, GameCategory, Deck } from '@/hooks/use-decks';
import { staticCardDatabase, CardData, DeckData } from '@/utils/sampleJsonStructure';

interface StaticDataOptions {
  fallbackToLocal?: boolean;
}

export const useStaticData = (options: StaticDataOptions = {}) => {
  const { 
    fallbackToLocal = true
  } = options;
  
  const [cards, setCards] = useState<Card[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadStaticData = (gameCategory: GameCategory) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get data from the static database
      const categoryData = staticCardDatabase[gameCategory];
      
      if (!categoryData) {
        throw new Error(`No data available for ${gameCategory}`);
      }
      
      // The following type assertions are safe because we've updated the CardData and DeckData types
      // to use GameCategory instead of string
      setCards(categoryData.cards as Card[]);
      setDecks(categoryData.decks as Deck[]);
      
      toast.success(`Loaded ${gameCategory} data successfully`);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error(`Error loading static data: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    cards,
    decks,
    loading,
    error,
    fetchStaticData: loadStaticData,
    // Keeping the export function for backward compatibility, but it will be a no-op
    exportToJson: () => {
      toast.info('Data is already stored as static files in the project');
    }
  };
};
