import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { useStaticData } from './use-static-data';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type GameCategory = 'magic' | 'pokemon' | 'yugioh' | 'onepiece';

export interface Card {
  id: string;
  name: string;
  imageUrl: string;
  type: string | string[]; 
  cost: number;
  rarity: string;
  set: string;
  colors: string[];
  gameCategory: GameCategory;
  flavorText?: string;
  artist?: string;
  legality?: string[];
  price?: number;
  parallel?: string[];
  card_number?: string;
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
  { id: 'magic', name: 'Magic: The Gathering', hidden: true },
  { id: 'pokemon', name: 'Pokémon', hidden: true },
  { id: 'yugioh', name: 'Yu-Gi-Oh!', hidden: true },
  { id: 'onepiece', name: 'One Piece', hidden: false }
];

export const useDecks = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGameCategory, setActiveGameCategory] = useState<GameCategory>('magic');
  const { cards: staticCards } = useStaticData({ initialGameCategory: activeGameCategory });
  const { user } = useAuth();

  const fetchDecks = useCallback(async () => {
    if (!user) {
      setDecks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('decks')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      if (!data) {
        setDecks([]);
        return;
      }

      const formattedDecks: Deck[] = data.map(deck => ({
        id: deck.id,
        name: deck.name,
        format: deck.format,
        colors: deck.colors || [],
        // Parse JSON data from database
        cards: Array.isArray(deck.cards) ? deck.cards : JSON.parse(deck.cards as unknown as string),
        createdAt: deck.created_at,
        updatedAt: deck.updated_at,
        description: deck.description,
        // Parse coverCard if it exists
        coverCard: deck.cover_card ? (typeof deck.cover_card === 'string' 
          ? JSON.parse(deck.cover_card)
          : deck.cover_card) : undefined,
        gameCategory: deck.game_category as GameCategory
      }));

      console.log("Fetched decks:", formattedDecks);
      setDecks(formattedDecks);
    } catch (error) {
      console.error('Error loading decks:', error);
      toast.error('Failed to load decks');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDecks();

    const storedCategory = localStorage.getItem('activeGameCategory') as GameCategory;
    if (storedCategory) {
      setActiveGameCategory(storedCategory);
    }
  }, [user, fetchDecks]);

  const filteredDecks = decks.filter(deck => deck.gameCategory === activeGameCategory);

  const changeGameCategory = (category: GameCategory) => {
    setActiveGameCategory(category);
    localStorage.setItem('activeGameCategory', category);
  };

  const saveDeck = async (deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('You must be logged in to save a deck');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('decks')
        .insert([{
          user_id: user.id,
          name: deck.name,
          format: deck.format,
          description: deck.description,
          // Convert cards array to JSON compatible format
          cards: JSON.stringify(deck.cards),
          colors: deck.colors,
          // Convert coverCard to JSON compatible format
          cover_card: deck.coverCard ? JSON.stringify(deck.coverCard) : null,
          game_category: deck.gameCategory
        }])
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error("No data returned from insert");
      }

      const insertedDeck = data[0];
      
      const newDeck: Deck = {
        id: insertedDeck.id,
        name: insertedDeck.name,
        format: insertedDeck.format,
        colors: insertedDeck.colors || [],
        // Parse the JSON data
        cards: Array.isArray(insertedDeck.cards) 
          ? insertedDeck.cards 
          : JSON.parse(insertedDeck.cards as unknown as string),
        createdAt: insertedDeck.created_at,
        updatedAt: insertedDeck.updated_at,
        description: insertedDeck.description,
        // Parse cover_card if it exists
        coverCard: insertedDeck.cover_card 
          ? (typeof insertedDeck.cover_card === 'string'
            ? JSON.parse(insertedDeck.cover_card)
            : insertedDeck.cover_card)
          : undefined,
        gameCategory: insertedDeck.game_category as GameCategory
      };

      await fetchDecks(); // Refresh decks after saving
      toast.success("Deck saved successfully");
      return newDeck;
    } catch (error) {
      console.error('Error saving deck:', error);
      toast.error('Failed to save deck');
      return null;
    }
  };

  const updateDeck = async (id: string, deckData: Partial<Deck>) => {
    if (!user) {
      toast.error('You must be logged in to update a deck');
      return;
    }

    try {
      const updateData: Record<string, any> = {};
      
      if (deckData.name) updateData.name = deckData.name;
      if (deckData.format) updateData.format = deckData.format;
      if (deckData.description !== undefined) updateData.description = deckData.description;
      if (deckData.cards) updateData.cards = JSON.stringify(deckData.cards);
      if (deckData.colors) updateData.colors = deckData.colors;
      if (deckData.coverCard) updateData.cover_card = JSON.stringify(deckData.coverCard);
      if (deckData.gameCategory) updateData.game_category = deckData.gameCategory;

      const { error } = await supabase
        .from('decks')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchDecks(); // Refresh decks after updating
      toast.success("Deck updated successfully");
    } catch (error) {
      console.error('Error updating deck:', error);
      toast.error('Failed to update deck');
    }
  };

  const deleteDeck = async (id: string) => {
    if (!user) {
      toast.error('You must be logged in to delete a deck');
      return;
    }

    try {
      const { error } = await supabase
        .from('decks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchDecks(); // Refresh decks after deleting
      toast.success("Deck deleted successfully");
    } catch (error) {
      console.error('Error deleting deck:', error);
      toast.error('Failed to delete deck');
    }
  };

  const getDeck = useCallback((id: string) => {
    console.log("All available decks:", decks);
    const foundDeck = decks.find(deck => deck.id === id);
    console.log("Retrieved deck data:", foundDeck);
    return foundDeck;
  }, [decks]);

  return {
    decks: filteredDecks,
    allDecks: decks,
    loading,
    saveDeck,
    updateDeck,
    deleteDeck,
    getDeck,
    fetchDecks,
    activeGameCategory,
    changeGameCategory
  };
};

export const useCards = () => {
  const [loading, setLoading] = useState(true);
  const [activeGameCategory, setActiveGameCategory] = useState<GameCategory>('magic');
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
