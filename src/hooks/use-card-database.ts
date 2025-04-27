
// Create this file to export a hook that combines other hooks
import { useCardSets } from './card-database/useCardSets';
import { useCards } from './card-database/useCards';
import { useState, useEffect } from 'react';
import { loadCardsAndSets } from './card-database/useSupabaseCardData';

export const useCardDatabase = () => {
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<{
    cards: any[];
    sets: any[];
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
    getCardsBySet,
    searchCards,
    activeGameCategory,
    changeGameCategory
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
    getSetById,
    searchCards,
    activeGameCategory,
    changeGameCategory,
  };
};
