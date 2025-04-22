import { useState, useEffect, useCallback } from 'react';
import { CardDetails } from '@/types/cardDatabase';
import { useStaticData } from './use-static-data';

interface FilterOptions {
  colors?: string[];
  rarity?: string;
  parallel?: string[]; // Ensure parallel filter option exists
}

export const useCards = (initialCards: CardDetails[] = []) => {
  const [cards, setCards] = useState<CardDetails[]>(initialCards);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState<{
    [gameCategory: string]: {
      searchQuery: string;
      colorFilters: string[];
      rarityFilters: string[];
      parallelFilters: string[];
      selectedSet: string | null;
    };
  }>({});
  const { cards: staticCards, activeGameCategory } = useStaticData();
  const [loading, setLoading] = useState(false);

  // Load initial cards or from localStorage on mount
  useEffect(() => {
    setCards(staticCards);
  }, [staticCards]);

  // Modify the searchCards to also search by card_number.
  const searchCards = (term: string) => {
    setSearchTerm(term);
    const lowerTerm = term.toLowerCase();
    return staticCards.filter(card => {
      const nameMatches = card.name.toLowerCase().includes(lowerTerm);
      const cardNumberMatches = card.card_number 
        ? card.card_number.toLowerCase().includes(lowerTerm)
        : false;
      return nameMatches || cardNumberMatches;
    });
  };

  const filterCards = (filters: FilterOptions) => {
    return cards.filter(card => {
      // Check colors if filter is provided
      if (filters.colors && filters.colors.length > 0) {
        if (!card.colors || !card.colors.some(color => filters.colors?.includes(color))) {
          return false;
        }
      }

      // Check rarity if filter is provided
      if (filters.rarity && card.rarity !== filters.rarity) {
        return false;
      }

      // Check parallels if filter is provided
      if (filters.parallel && filters.parallel.length > 0) {
        // Make sure card.parallel exists and has at least one matching value
        if (!card.parallel || !card.parallel.some(p => filters.parallel?.includes(p))) {
          return false;
        }
      }

      return true;
    });
  };

  const saveFilterState = useCallback((state: {
    searchQuery: string;
    colorFilters: string[];
    rarityFilters: string[];
    parallelFilters: string[];
    selectedSet: string | null;
  }) => {
    setFilterState(prevState => ({
      ...prevState,
      [activeGameCategory]: state
    }));
  }, [activeGameCategory]);

  const getCurrentFilterState = () => {
    return filterState[activeGameCategory] || {
      searchQuery: '',
      colorFilters: [],
      rarityFilters: [],
      parallelFilters: [],
      selectedSet: null,
    };
  };

  return {
    cards,
    loading,
    searchTerm,
    searchCards,
    filterCards,
    activeGameCategory,
    saveFilterState,
    getCurrentFilterState
  };
};
