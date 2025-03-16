
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CardDetails, CardSet } from '@/types/cardDatabase';
import { GameCategory } from '@/hooks/use-decks';

export const useCardDatabase = () => {
  const [cards, setCards] = useState<CardDetails[]>([]);
  const [sets, setSets] = useState<CardSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCardsAndSets = () => {
      // Load from localStorage if available
      const storedCards = localStorage.getItem('cardDatabase');
      const storedSets = localStorage.getItem('cardSets');
      
      if (storedCards) {
        setCards(JSON.parse(storedCards));
      }
      
      if (storedSets) {
        setSets(JSON.parse(storedSets));
      }
      
      setLoading(false);
    };

    loadCardsAndSets();
  }, []);

  const addSet = async (newSet: CardSet) => {
    // Check if a set with the same name already exists for the game category
    const existingSet = sets.find(
      set => set.name.toLowerCase() === newSet.name.toLowerCase() && 
      set.gameCategory === newSet.gameCategory
    );
    
    if (existingSet) {
      throw new Error(`A set named "${newSet.name}" already exists for ${newSet.gameCategory}`);
    }
    
    setSets(prevSets => {
      const updatedSets = [...prevSets, newSet];
      // Save to localStorage
      localStorage.setItem('cardSets', JSON.stringify(updatedSets));
      return updatedSets;
    });
    
    return newSet;
  };

  const updateSet = async (id: string, setData: Partial<CardSet>) => {
    setSets(prevSets => {
      const setIndex = prevSets.findIndex(s => s.id === id);
      if (setIndex === -1) {
        toast.error("Set not found");
        return prevSets;
      }

      const updatedSets = [...prevSets];
      updatedSets[setIndex] = {
        ...updatedSets[setIndex],
        ...setData,
      };

      localStorage.setItem('cardSets', JSON.stringify(updatedSets));
      return updatedSets;
    });
  };

  const deleteSet = async (id: string) => {
    // Check if there are cards in this set
    const cardsInSet = cards.filter(card => card.set === id);
    if (cardsInSet.length > 0) {
      throw new Error(`Cannot delete set with ${cardsInSet.length} cards. Remove the cards first.`);
    }
    
    setSets(prevSets => {
      const updatedSets = prevSets.filter(set => set.id !== id);
      localStorage.setItem('cardSets', JSON.stringify(updatedSets));
      return updatedSets;
    });
  };

  const addCard = async (newCard: CardDetails) => {
    // Check if a card with the same name already exists in the set
    const existingCard = cards.find(
      card => card.name.toLowerCase() === newCard.name.toLowerCase() && 
      card.set === newCard.set
    );
    
    if (existingCard) {
      throw new Error(`A card named "${newCard.name}" already exists in this set`);
    }
    
    setCards(prevCards => {
      const updatedCards = [...prevCards, newCard];
      // Save to localStorage
      localStorage.setItem('cardDatabase', JSON.stringify(updatedCards));
      return updatedCards;
    });
    
    return newCard;
  };

  const updateCard = async (id: string, cardData: Partial<CardDetails>) => {
    setCards(prevCards => {
      const cardIndex = prevCards.findIndex(c => c.id === id);
      if (cardIndex === -1) {
        toast.error("Card not found");
        return prevCards;
      }

      const updatedCards = [...prevCards];
      updatedCards[cardIndex] = {
        ...updatedCards[cardIndex],
        ...cardData,
      };

      localStorage.setItem('cardDatabase', JSON.stringify(updatedCards));
      return updatedCards;
    });
  };

  const deleteCard = async (id: string) => {
    setCards(prevCards => {
      const updatedCards = prevCards.filter(card => card.id !== id);
      localStorage.setItem('cardDatabase', JSON.stringify(updatedCards));
      return updatedCards;
    });
  };
  
  const getCardsByGameCategory = (gameCategory: GameCategory) => {
    return cards.filter(card => card.gameCategory === gameCategory);
  };
  
  const getCardsBySet = (setId: string) => {
    return cards.filter(card => card.set === setId);
  };
  
  const getSetsByGameCategory = (gameCategory: GameCategory) => {
    return sets.filter(set => set.gameCategory === gameCategory);
  };
  
  const getSetById = (id: string) => {
    return sets.find(set => set.id === id);
  };

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
