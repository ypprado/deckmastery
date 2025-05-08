
import { useState, useEffect, useCallback } from 'react';
import { useStaticData } from './use-static-data';
import { GameCategory } from '@/types/card';

export const useCards = () => {
  const [loading, setLoading] = useState(true);
  const [activeGameCategory, setActiveGameCategory] = useState<GameCategory>('onepiece');
  const { cards: staticCards, activeGameCategory: staticGameCategory, changeGameCategory: staticChangeGameCategory } = useStaticData({ initialGameCategory: activeGameCategory });
  
  const [filterStates, setFilterStates] = useState<Record<GameCategory, {
    searchQuery: string;
    colorFilters: string[];
    typeFilters: string[];
    rarityFilters: string[];
    parallelFilters: string[];
    selectedSet: string | null;
  }>>({
    magic: { searchQuery: '', colorFilters: [], typeFilters: [], rarityFilters: [], parallelFilters: [], selectedSet: null },
    pokemon: { searchQuery: '', colorFilters: [], typeFilters: [], rarityFilters: [], parallelFilters: [], selectedSet: null },
    yugioh: { searchQuery: '', colorFilters: [], typeFilters: [], rarityFilters: [], parallelFilters: [], selectedSet: null },
    onepiece: { searchQuery: '', colorFilters: [], typeFilters: [], rarityFilters: [], parallelFilters: [], selectedSet: null },
  });
  
  useEffect(() => {
    const storedCategory = localStorage.getItem('activeGameCategory') as GameCategory;
    if (storedCategory) {
      setActiveGameCategory(storedCategory);
      staticChangeGameCategory(storedCategory);
    }
  }, [staticChangeGameCategory]);

  useEffect(() => {
    if (staticCards.length > 0) {
      setLoading(false);
    }
  }, [staticCards]);

  useEffect(() => {
    if (activeGameCategory !== staticGameCategory) {
      staticChangeGameCategory(activeGameCategory);
    }
  }, [activeGameCategory, staticGameCategory, staticChangeGameCategory]);

  const changeGameCategory = (category: GameCategory) => {
    setActiveGameCategory(category);
    localStorage.setItem('activeGameCategory', category);
    staticChangeGameCategory(category);
  };

  const searchCards = (query: string) => {
    if (!query) return staticCards;
    
    const lowerQuery = query.toLowerCase();
    return staticCards.filter(card => {
      if (card.name.toLowerCase().includes(lowerQuery)) {
        return true;
      }

      if (card.card_number?.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      return false;
    });
  };

  const filterCards = (filters: Partial<Record<string, any>>) => {
    return staticCards.filter(card => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        
        if (key === 'colors' && Array.isArray(value)) {
          return value.some(color => card.colors.includes(color));
        }
        
        return card[key as keyof typeof card] === value;
      });
    });
  };

  const saveFilterState = useCallback((state: Partial<{
    searchQuery: string;
    colorFilters: string[];
    typeFilters: string[];
    rarityFilters: string[];
    parallelFilters: string[];
    selectedSet: string | null;
  }>) => {
    setFilterStates(prev => ({
      ...prev,
      [activeGameCategory]: {
        ...prev[activeGameCategory],
        ...state
      }
    }));
  }, [activeGameCategory]);

  const getCurrentFilterState = useCallback(() => {
    return filterStates[activeGameCategory] || {
      searchQuery: '',
      colorFilters: [],
      typeFilters: [],
      rarityFilters: [],
      parallelFilters: [],
      selectedSet: null
    };
  }, [filterStates, activeGameCategory]);

  return {
    cards: staticCards,
    allCards: staticCards,
    loading,
    searchCards,
    filterCards,
    activeGameCategory,
    changeGameCategory,
    saveFilterState,
    getCurrentFilterState
  };
};
