
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { AttributeType } from './card-database/useSupabaseCardData';

export type GameCategory = 'magic' | 'pokemon' | 'yugioh' | 'onepiece' | 'digimon' | 'dragonball' | 'lorcana' | 'metazoo';

export const gameCategories: GameCategory[] = ['magic', 'pokemon', 'yugioh', 'onepiece', 'digimon', 'dragonball', 'lorcana', 'metazoo'];

export interface Card {
  id: string;
  name: string;
  imageUrl: string;
  type: string | string[];
  cost: number;
  rarity: string;
  colors: string[];
  set: string;
  gameCategory: GameCategory;
  // Add the missing properties that are used in DeckBuilder
  attribute?: AttributeType[];
  category?: string;
  power?: number;
  life?: number;
  counter?: number;
  card_number?: string;
  card_number_market_br?: string;
  parallel?: string[];
}

export interface Deck {
  id: string;
  name: string;
  format: string;
  description?: string;
  cards: { card: Card; quantity: number }[];
  colors: string[];
  coverCard?: Card;
  createdAt: number;
  updatedAt: number;
  gameCategory: GameCategory;
}

interface UseDecksOptions {
  initialGameCategory?: GameCategory;
}

export const useDecks = (options: UseDecksOptions = {}) => {
  const { initialGameCategory = 'magic' } = options;
  
  const [activeGameCategory, setActiveGameCategory] = useState<GameCategory>(initialGameCategory);
  const [decks, setDecks] = useLocalStorage<Deck[]>('decks', []);
  
  const getDeck = (id: string) => {
    return decks.find(deck => deck.id === id);
  };
  
  const saveDeck = async (deckData: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>) => {
    const timestamp = Date.now();
    const newDeck: Deck = {
      ...deckData,
      id: uuidv4(),
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    setDecks(prev => [...prev, newDeck]);
    toast.success('Deck saved successfully');
    return newDeck;
  };
  
  const updateDeck = (id: string, deckData: Partial<Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setDecks(prev => 
      prev.map(deck => 
        deck.id === id 
          ? { ...deck, ...deckData, updatedAt: Date.now() } 
          : deck
      )
    );
    toast.success('Deck updated successfully');
    return getDeck(id);
  };
  
  const deleteDeck = (id: string) => {
    setDecks(prev => prev.filter(deck => deck.id !== id));
    toast.success('Deck deleted successfully');
  };
  
  const getDecksByGameCategory = (gameCategory: GameCategory) => {
    return decks.filter(deck => deck.gameCategory === gameCategory);
  };
  
  const changeGameCategory = (newCategory: GameCategory) => {
    setActiveGameCategory(newCategory);
  };
  
  return {
    decks,
    saveDeck,
    updateDeck,
    deleteDeck,
    getDeck,
    getDecksByGameCategory,
    activeGameCategory,
    changeGameCategory
  };
};

// Custom hook for using Local Storage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue] as const;
}

