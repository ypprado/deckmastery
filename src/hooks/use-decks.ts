
import { useState, useEffect } from 'react';
import { toast } from "sonner";

export interface Card {
  id: string;
  name: string;
  imageUrl: string;
  type: string;
  cost: number;
  rarity: string;
  set: string;
  colors: string[];
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
}

// Example card data
const sampleCards: Card[] = [
  {
    id: "c1",
    name: "Dragon Guardian",
    imageUrl: "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?q=80&w=250",
    type: "Creature",
    cost: 4,
    rarity: "Rare",
    set: "Core Set",
    colors: ["red"]
  },
  {
    id: "c2",
    name: "Mystic Sorcerer",
    imageUrl: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=250",
    type: "Creature",
    cost: 3,
    rarity: "Uncommon",
    set: "Core Set",
    colors: ["blue"]
  },
  {
    id: "c3",
    name: "Forest Guardian",
    imageUrl: "https://images.unsplash.com/photo-1599508704512-2f19efd1e35f?q=80&w=250",
    type: "Creature",
    cost: 2,
    rarity: "Common",
    set: "Core Set",
    colors: ["green"]
  },
  {
    id: "c4",
    name: "Healing Light",
    imageUrl: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=250",
    type: "Spell",
    cost: 2,
    rarity: "Common",
    set: "Core Set",
    colors: ["white"]
  },
  {
    id: "c5",
    name: "Shadow Assassin",
    imageUrl: "https://images.unsplash.com/photo-1593351415075-3bac9f45c877?q=80&w=250",
    type: "Creature",
    cost: 3,
    rarity: "Uncommon",
    set: "Core Set",
    colors: ["black"]
  },
  {
    id: "c6",
    name: "Volcanic Eruption",
    imageUrl: "https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?q=80&w=250",
    type: "Spell",
    cost: 5,
    rarity: "Rare",
    set: "Core Set",
    colors: ["red"]
  },
  {
    id: "c7",
    name: "Counterspell",
    imageUrl: "https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=250",
    type: "Spell",
    cost: 2,
    rarity: "Uncommon",
    set: "Core Set",
    colors: ["blue"]
  },
  {
    id: "c8",
    name: "Giant Growth",
    imageUrl: "https://images.unsplash.com/photo-1610768764270-790fbec18178?q=80&w=250",
    type: "Spell",
    cost: 1,
    rarity: "Common",
    set: "Core Set",
    colors: ["green"]
  },
  {
    id: "c9",
    name: "Angel of Mercy",
    imageUrl: "https://images.unsplash.com/photo-1531686264889-56fdcabd163f?q=80&w=250",
    type: "Creature",
    cost: 5,
    rarity: "Rare",
    set: "Core Set",
    colors: ["white"]
  },
  {
    id: "c10",
    name: "Dark Ritual",
    imageUrl: "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?q=80&w=250",
    type: "Spell",
    cost: 1,
    rarity: "Common",
    set: "Core Set",
    colors: ["black"]
  },
  {
    id: "c11",
    name: "Mystic Study",
    imageUrl: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=250",
    type: "Enchantment",
    cost: 3,
    rarity: "Rare",
    set: "Expansion 1",
    colors: ["blue"]
  },
  {
    id: "c12",
    name: "Lightning Bolt",
    imageUrl: "https://images.unsplash.com/photo-1537210249814-b9a10a161ae4?q=80&w=250",
    type: "Spell",
    cost: 1,
    rarity: "Common",
    set: "Core Set",
    colors: ["red"]
  }
];

// Sample decks
const sampleDecks: Deck[] = [
  {
    id: "d1",
    name: "Fire & Ice",
    format: "Standard",
    colors: ["red", "blue"],
    cards: [
      { card: sampleCards[0], quantity: 4 },
      { card: sampleCards[1], quantity: 4 },
      { card: sampleCards[5], quantity: 2 },
      { card: sampleCards[6], quantity: 4 },
      { card: sampleCards[11], quantity: 4 }
    ],
    coverCard: sampleCards[0],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    description: "A balanced deck using fire and ice elements for versatile play"
  },
  {
    id: "d2",
    name: "Nature's Wrath",
    format: "Modern",
    colors: ["green", "black"],
    cards: [
      { card: sampleCards[2], quantity: 4 },
      { card: sampleCards[4], quantity: 3 },
      { card: sampleCards[7], quantity: 4 },
      { card: sampleCards[9], quantity: 2 }
    ],
    coverCard: sampleCards[2],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    description: "A control deck that leverages nature's power"
  },
  {
    id: "d3",
    name: "Divine Light",
    format: "Commander",
    colors: ["white"],
    cards: [
      { card: sampleCards[3], quantity: 4 },
      { card: sampleCards[8], quantity: 2 }
    ],
    coverCard: sampleCards[8],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    description: "A healing-focused deck with powerful angels"
  }
];

// This is a simplified implementation using localStorage for persistence
// In a real app, this would use an API or database
export const useDecks = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    };

    loadDecks();
  }, []);

  const saveDeck = (deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDeck: Deck = {
      ...deck,
      id: `d${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
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
    decks,
    loading,
    saveDeck,
    updateDeck,
    deleteDeck,
    getDeck
  };
};

export const useCards = () => {
  const [cards, setCards] = useState<Card[]>(sampleCards);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch cards from an API
    setLoading(false);
  }, []);

  const searchCards = (query: string) => {
    if (!query) return cards;
    
    const lowerQuery = query.toLowerCase();
    return cards.filter(card => 
      card.name.toLowerCase().includes(lowerQuery) ||
      card.type.toLowerCase().includes(lowerQuery)
    );
  };

  const filterCards = (filters: Partial<Record<keyof Card, any>>) => {
    return cards.filter(card => {
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
    cards,
    loading,
    searchCards,
    filterCards
  };
};
