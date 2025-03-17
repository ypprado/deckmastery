
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, GameCategory, Deck } from '@/hooks/use-decks';
import { staticCardDatabase, CardData, DeckData } from '@/utils/sampleJsonStructure';

interface StaticDataOptions {
  initialGameCategory?: GameCategory;
}

export const useStaticData = (options: StaticDataOptions = {}) => {
  const { 
    initialGameCategory = 'magic'
  } = options;
  
  const [cards, setCards] = useState<Card[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [activeGameCategory, setActiveGameCategory] = useState<GameCategory>(initialGameCategory);

  // Load data whenever the active game category changes
  useEffect(() => {
    loadStaticData(activeGameCategory);
  }, [activeGameCategory]);

  const loadStaticData = (gameCategory: GameCategory) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get data from the static database for the specific game category
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

  const changeGameCategory = (gameCategory: GameCategory) => {
    setActiveGameCategory(gameCategory);
    // Data will be loaded by the useEffect that watches activeGameCategory
  };

  return {
    cards,
    decks,
    loading,
    error,
    activeGameCategory,
    changeGameCategory,
    loadStaticData
  };
};
