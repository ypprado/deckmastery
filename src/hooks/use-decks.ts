
import { useState, useEffect } from 'react';
import { toast } from "sonner";

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

// Example card data with game categories
const sampleCards: Card[] = [
  {
    id: "c1",
    name: "Dragon Guardian",
    imageUrl: "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?q=80&w=250",
    type: "Creature",
    cost: 4,
    rarity: "Rare",
    set: "Core Set",
    colors: ["red"],
    gameCategory: "magic"
  },
  {
    id: "c2",
    name: "Mystic Sorcerer",
    imageUrl: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=250",
    type: "Creature",
    cost: 3,
    rarity: "Uncommon",
    set: "Core Set",
    colors: ["blue"],
    gameCategory: "magic"
  },
  {
    id: "c3",
    name: "Forest Guardian",
    imageUrl: "https://images.unsplash.com/photo-1599508704512-2f19efd1e35f?q=80&w=250",
    type: "Creature",
    cost: 2,
    rarity: "Common",
    set: "Core Set",
    colors: ["green"],
    gameCategory: "magic"
  },
  {
    id: "c4",
    name: "Healing Light",
    imageUrl: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=250",
    type: "Spell",
    cost: 2,
    rarity: "Common",
    set: "Core Set",
    colors: ["white"],
    gameCategory: "magic"
  },
  {
    id: "c5",
    name: "Shadow Assassin",
    imageUrl: "https://images.unsplash.com/photo-1593351415075-3bac9f45c877?q=80&w=250",
    type: "Creature",
    cost: 3,
    rarity: "Uncommon",
    set: "Core Set",
    colors: ["black"],
    gameCategory: "magic"
  },
  {
    id: "c6",
    name: "Volcanic Eruption",
    imageUrl: "https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?q=80&w=250",
    type: "Spell",
    cost: 5,
    rarity: "Rare",
    set: "Core Set",
    colors: ["red"],
    gameCategory: "magic"
  },
  {
    id: "c7",
    name: "Pikachu",
    imageUrl: "https://images.unsplash.com/photo-1638361631748-adee2db0c2f3?q=80&w=250",
    type: "Pokemon",
    cost: 2,
    rarity: "Rare",
    set: "Base Set",
    colors: ["yellow"],
    gameCategory: "pokemon"
  },
  {
    id: "c8",
    name: "Charizard",
    imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=250",
    type: "Pokemon",
    cost: 5,
    rarity: "Rare",
    set: "Base Set",
    colors: ["red"],
    gameCategory: "pokemon"
  },
  {
    id: "c9",
    name: "Dark Magician",
    imageUrl: "https://images.unsplash.com/photo-1584198214525-66552afb419f?q=80&w=250",
    type: "Monster",
    cost: 7,
    rarity: "Ultra Rare",
    set: "Legend of Blue Eyes",
    colors: ["purple"],
    gameCategory: "yugioh"
  },
  {
    id: "c10",
    name: "Blue-Eyes White Dragon",
    imageUrl: "https://images.unsplash.com/photo-1596609548086-85bbf8ddb6b9?q=80&w=250",
    type: "Monster",
    cost: 8,
    rarity: "Ultra Rare",
    set: "Legend of Blue Eyes",
    colors: ["white"],
    gameCategory: "yugioh"
  },
  {
    id: "c11",
    name: "Monkey D. Luffy",
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?q=80&w=250",
    type: "Character",
    cost: 4,
    rarity: "Super Rare",
    set: "Romance Dawn",
    colors: ["red"],
    gameCategory: "onepiece"
  },
  {
    id: "c12",
    name: "Roronoa Zoro",
    imageUrl: "https://images.unsplash.com/photo-1612544448445-b8232cff3b6a?q=80&w=250",
    type: "Character",
    cost: 3,
    rarity: "Rare",
    set: "Romance Dawn",
    colors: ["green"],
    gameCategory: "onepiece"
  }
];

// Sample decks with game categories
const sampleDecks: Deck[] = [
  {
    id: "d1",
    name: "Fire & Ice",
    format: "Standard",
    colors: ["red", "blue"],
    cards: [
      { card: sampleCards[0], quantity: 4 },
      { card: sampleCards[1], quantity: 4 },
      { card: sampleCards[5], quantity: 2 }
    ],
    coverCard: sampleCards[0],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    description: "A balanced deck using fire and ice elements for versatile play",
    gameCategory: "magic"
  },
  {
    id: "d2",
    name: "Nature's Wrath",
    format: "Modern",
    colors: ["green", "black"],
    cards: [
      { card: sampleCards[2], quantity: 4 },
      { card: sampleCards[4], quantity: 3 }
    ],
    coverCard: sampleCards[2],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    description: "A control deck that leverages nature's power",
    gameCategory: "magic"
  },
  {
    id: "d3",
    name: "Electric Power",
    format: "Standard",
    colors: ["yellow"],
    cards: [
      { card: sampleCards[6], quantity: 4 }
    ],
    coverCard: sampleCards[6],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    description: "A Pokemon deck focusing on electric types",
    gameCategory: "pokemon"
  },
  {
    id: "d4",
    name: "Magician's Force",
    format: "Traditional",
    colors: ["purple"],
    cards: [
      { card: sampleCards[8], quantity: 3 }
    ],
    coverCard: sampleCards[8],
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    description: "A Yu-Gi-Oh! deck built around spellcasters",
    gameCategory: "yugioh"
  },
  {
    id: "d5",
    name: "Straw Hat Crew",
    format: "Standard",
    colors: ["red", "green"],
    cards: [
      { card: sampleCards[10], quantity: 2 },
      { card: sampleCards[11], quantity: 2 }
    ],
    coverCard: sampleCards[10],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    description: "A One Piece deck featuring the Straw Hat Pirates",
    gameCategory: "onepiece"
  }
];

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

  useEffect(() => {
    // Load decks from localStorage or use sample data if none exist
    const loadDecks = () => {
      const storedDecks = localStorage.getItem('decks');
      if (storedDecks) {
        setDecks(JSON.parse(storedDecks));
      } else {
        setDecks(sampleDecks);
        localStorage.setItem('decks', JSON.stringify(sampleDecks));
      }
      
      // Load active game category from localStorage or use default
      const storedCategory = localStorage.getItem('activeGameCategory') as GameCategory;
      if (storedCategory) {
        setActiveGameCategory(storedCategory);
      }
      
      setLoading(false);
    };

    loadDecks();
  }, []);

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
  const [cards, setCards] = useState<Card[]>(sampleCards);
  const [loading, setLoading] = useState(true);
  const [activeGameCategory, setActiveGameCategory] = useState<GameCategory>('magic');

  useEffect(() => {
    // In a real app, we would fetch cards from an API
    setLoading(false);
    
    // Load active game category from localStorage or use default
    const storedCategory = localStorage.getItem('activeGameCategory') as GameCategory;
    if (storedCategory) {
      setActiveGameCategory(storedCategory);
    }
  }, []);

  // Filter cards by active game category
  const filteredCards = cards.filter(card => card.gameCategory === activeGameCategory);

  const changeGameCategory = (category: GameCategory) => {
    setActiveGameCategory(category);
    localStorage.setItem('activeGameCategory', category);
  };

  const searchCards = (query: string) => {
    if (!query) return filteredCards;
    
    const lowerQuery = query.toLowerCase();
    return filteredCards.filter(card => 
      card.name.toLowerCase().includes(lowerQuery) ||
      card.type.toLowerCase().includes(lowerQuery)
    );
  };

  const filterCards = (filters: Partial<Record<keyof Card, any>>) => {
    return filteredCards.filter(card => {
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
    cards: filteredCards,
    allCards: cards,
    loading,
    searchCards,
    filterCards,
    activeGameCategory,
    changeGameCategory
  };
};
