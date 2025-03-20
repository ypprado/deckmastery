
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useStaticData } from './use-static-data';

export type GameCategory = 'magic' | 'pokemon' | 'yugioh' | 'onepiece';

export interface Card {
  id: string;
  name: string;
  imageUrl: string;
  type: string;
  cost: number;
  rarity: string;
  set: string;
  colors: string[];
  gameCategory: GameCategory;
}

export interface Deck {
  id: string;
  name: string;
  format: string;
  colors: string[];
  cards: { card: Card; quantity: number }[];
  createdAt: string;
  updatedAt: string;
  description?: string;
  coverCard?: Card;
  gameCategory: GameCategory;
}

export const gameCategories = [
  { id: 'magic', name: 'Magic: The Gathering' },
  { id: 'pokemon', name: 'Pokémon' },
  { id: 'yugioh', name: 'Yu-Gi-Oh!' },
  { id: 'onepiece', name: 'One Piece' }
];

// This is a simplified implementation using localStorage for persistence
// In a real app, this would use an API or database
export const useDecks = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGameCategory, setActiveGameCategory] = useState<GameCategory>('magic');
  const { decks: staticDecks } = useStaticData({ initialGameCategory: activeGameCategory });

  useEffect(() => {
    // Load decks from localStorage or use static data if none exist
    const loadDecks = () => {
      const storedDecks = localStorage.getItem('decks');
      console.log("Loading decks from localStorage:", storedDecks ? JSON.parse(storedDecks) : null);
      
      if (storedDecks) {
        setDecks(JSON.parse(storedDecks));
      } else {
        console.log("Using static decks:", staticDecks);
        setDecks(staticDecks);
        localStorage.setItem('decks', JSON.stringify(staticDecks));
      }
      
      // Load active game category from localStorage or use default
      const storedCategory = localStorage.getItem('activeGameCategory') as GameCategory;
      if (storedCategory) {
        setActiveGameCategory(storedCategory);
      }
      
      setLoading(false);
    };

    loadDecks();
  }, [staticDecks]);

  // Filter decks by active game category
  const filteredDecks = decks.filter(deck => deck.gameCategory === activeGameCategory);

  const changeGameCategory = (category: GameCategory) => {
    setActiveGameCategory(category);
    localStorage.setItem('activeGameCategory', category);
  };

  const saveDeck = (deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDeck: Deck = {
      ...deck,
      id: `d${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      gameCategory: deck.gameCategory || activeGameCategory
    };

    console.log("Saving new deck:", newDeck);

    setDecks(prevDecks => {
      const updatedDecks = [...prevDecks, newDeck];
      localStorage.setItem('decks', JSON.stringify(updatedDecks));
      return updatedDecks;
    });

    toast.success("Deck saved successfully");
    return newDeck;
  };

  const updateDeck = (id: string, deckData: Partial<Deck>) => {
    setDecks(prevDecks => {
      const deckIndex = prevDecks.findIndex(d => d.id === id);
      if (deckIndex === -1) {
        toast.error("Deck not found");
        return prevDecks;
      }

      const updatedDecks = [...prevDecks];
      updatedDecks[deckIndex] = {
        ...updatedDecks[deckIndex],
        ...deckData,
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem('decks', JSON.stringify(updatedDecks));
      toast.success("Deck updated successfully");
      return updatedDecks;
    });
  };

  const deleteDeck = (id: string) => {
    setDecks(prevDecks => {
      const updatedDecks = prevDecks.filter(deck => deck.id !== id);
      localStorage.setItem('decks', JSON.stringify(updatedDecks));
      toast.success("Deck deleted successfully");
      return updatedDecks;
    });
  };

  const getDeck = (id: string) => {
    console.log("Looking for deck with id:", id);
    console.log("Available decks:", decks);
    return decks.find(deck => deck.id === id);
  };

  return {
    decks: filteredDecks,
    allDecks: decks,
    loading,
    saveDeck,
    updateDeck,
    deleteDeck,
    getDeck,
    activeGameCategory,
    changeGameCategory
  };
};

export const useCards = () => {
  const [loading, setLoading] = useState(true);
  const [activeGameCategory, setActiveGameCategory] = useState<GameCategory>('magic');
  const { cards: staticCards, activeGameCategory: staticGameCategory, changeGameCategory: staticChangeGameCategory } = useStaticData({ initialGameCategory: activeGameCategory });

  useEffect(() => {
    // Load active game category from localStorage or use default
    const storedCategory = localStorage.getItem('activeGameCategory') as GameCategory;
    if (storedCategory) {
      setActiveGameCategory(storedCategory);
      staticChangeGameCategory(storedCategory);
    }
    setLoading(false);
  }, [staticChangeGameCategory]);

  // Keep the game categories in sync
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
    return staticCards.filter(card => 
      card.name.toLowerCase().includes(lowerQuery) ||
      card.type.toLowerCase().includes(lowerQuery)
    );
  };

  const filterCards = (filters: Partial<Record<keyof Card, any>>) => {
    return staticCards.filter(card => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        
        const cardKey = key as keyof Card;
        
        if (cardKey === 'colors' && Array.isArray(value)) {
          return value.some(color => card.colors.includes(color));
        }
        
        return card[cardKey] === value;
      });
    });
  };

  return {
    cards: staticCards,
    allCards: staticCards,
    loading,
    searchCards,
    filterCards,
    activeGameCategory,
    changeGameCategory
  };
};
