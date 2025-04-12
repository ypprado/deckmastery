
import { useState, useEffect } from 'react';
import { useCardSets } from './useCardSets';
import { useCards } from './useCards';
import { loadCardsAndSets } from './useSupabaseCardData';
import { CardDetails, CardSet } from '@/types/cardDatabase';

export const useCardDatabase = () => {
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<{
    cards: CardDetails[];
    sets: CardSet[];
  }>({ cards: [], sets: [] });
  
  // Load initial data
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      const data = await loadCardsAndSets();
      setInitialData(data);
      setLoading(false);
    };
    
    initialize();
  }, []);
  
  // Initialize hooks with loaded data
  const { 
    sets, 
    addSet, 
    updateSet, 
    deleteSet, 
    getSetsByGameCategory, 
    getSetById 
  } = useCardSets(initialData.sets);
  
  const { 
    cards, 
    addCard, 
    updateCard, 
    deleteCard, 
    getCardsByGameCategory, 
    getCardsBySet 
  } = useCards(initialData.cards);

  return {
    cards,
    sets,
    loading,
    addSet,
    updateSet,
    deleteSet,
    addCard,
    updateCard,
    deleteCard,
    getCardsByGameCategory,
    getCardsBySet,
    getSetsByGameCategory,
    getSetById
  };
};

// Re-export for backward compatibility
export * from './useSupabaseCardData';
export * from './useCardSets';
export * from './useCards';
