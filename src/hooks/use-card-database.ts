
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CardDetails, CardSet } from '@/types/cardDatabase';
import { GameCategory } from '@/hooks/use-decks';
import { supabase } from '@/integrations/supabase/client';

export const useCardDatabase = () => {
  const [cards, setCards] = useState<CardDetails[]>([]);
  const [sets, setSets] = useState<CardSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCardsAndSets = async () => {
      setLoading(true);
      try {
        // Try to load from Supabase first
        const { data: setsData, error: setsError } = await supabase
          .from('card_sets')
          .select('*');
          
        if (setsError) throw setsError;
        
        if (setsData && setsData.length > 0) {
          // Transform Supabase data to match our app's format
          const formattedSets = setsData.map(set => ({
            id: set.id,
            name: set.name,
            releaseDate: set.release_date || new Date().toISOString(),
            gameCategory: set.game_category,
            description: set.description || '',
            symbol: '',
          }));
          
          setSets(formattedSets);
          
          // Load cards data
          const { data: cardsData, error: cardsError } = await supabase
            .from('cards')
            .select('*');
            
          if (cardsError) throw cardsError;
          
          if (cardsData && cardsData.length > 0) {
            // Transform Supabase data to match our app's format
            const formattedCards = cardsData.map(card => {
              // Find the set name for this card
              const cardSet = formattedSets.find(set => set.id === card.set_id);
              
              return {
                id: card.id,
                name: card.name,
                set: card.set_id,
                setName: cardSet?.name,
                imageUrl: card.artwork_url,
                type: card.card_type || '',
                cost: card.cost || 0,
                rarity: card.rarity || '',
                colors: card.colors || [],
                gameCategory: card.game_category,
                flavorText: card.card_text || '',
                artist: '',
                legality: [],
                price: 0,
              } as CardDetails;
            });
            
            setCards(formattedCards);
            setLoading(false);
            return;
          }
        }
        
        // Fall back to localStorage if no data in Supabase
        const storedCards = localStorage.getItem('cardDatabase');
        const storedSets = localStorage.getItem('cardSets');
        
        if (storedCards) {
          setCards(JSON.parse(storedCards));
        }
        
        if (storedSets) {
          setSets(JSON.parse(storedSets));
        }
      } catch (error) {
        console.error("Error loading data:", error);
        
        // Fall back to localStorage on error
        const storedCards = localStorage.getItem('cardDatabase');
        const storedSets = localStorage.getItem('cardSets');
        
        if (storedCards) {
          setCards(JSON.parse(storedCards));
        }
        
        if (storedSets) {
          setSets(JSON.parse(storedSets));
        }
      } finally {
        setLoading(false);
      }
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
    
    try {
      // Try to add to Supabase first
      const { data, error } = await supabase
        .from('card_sets')
        .insert({
          id: newSet.id,
          name: newSet.name,
          release_date: newSet.releaseDate,
          game_category: newSet.gameCategory,
          description: newSet.description || '',
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Update local state
      setSets(prevSets => {
        const updatedSets = [...prevSets, newSet];
        // Save to localStorage as backup
        localStorage.setItem('cardSets', JSON.stringify(updatedSets));
        return updatedSets;
      });
      
      return newSet;
    } catch (error) {
      console.error("Error adding set to Supabase:", error);
      
      // Fall back to localStorage only
      setSets(prevSets => {
        const updatedSets = [...prevSets, newSet];
        // Save to localStorage
        localStorage.setItem('cardSets', JSON.stringify(updatedSets));
        return updatedSets;
      });
      
      toast.warning("Added set to local storage only. Database sync failed.");
      return newSet;
    }
  };

  const updateSet = async (id: string, setData: Partial<CardSet>) => {
    try {
      // Try to update in Supabase first
      const { error } = await supabase
        .from('card_sets')
        .update({
          name: setData.name,
          release_date: setData.releaseDate,
          game_category: setData.gameCategory,
          description: setData.description,
        })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
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
    } catch (error) {
      console.error("Error updating set in Supabase:", error);
      
      // Fall back to localStorage only
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
      
      toast.warning("Updated set in local storage only. Database sync failed.");
    }
  };

  const deleteSet = async (id: string) => {
    // Check if there are cards in this set
    const cardsInSet = cards.filter(card => card.set === id);
    if (cardsInSet.length > 0) {
      throw new Error(`Cannot delete set with ${cardsInSet.length} cards. Remove the cards first.`);
    }
    
    try {
      // Try to delete from Supabase first
      const { error } = await supabase
        .from('card_sets')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setSets(prevSets => {
        const updatedSets = prevSets.filter(set => set.id !== id);
        localStorage.setItem('cardSets', JSON.stringify(updatedSets));
        return updatedSets;
      });
    } catch (error) {
      console.error("Error deleting set from Supabase:", error);
      
      // Fall back to localStorage only
      setSets(prevSets => {
        const updatedSets = prevSets.filter(set => set.id !== id);
        localStorage.setItem('cardSets', JSON.stringify(updatedSets));
        return updatedSets;
      });
      
      toast.warning("Deleted set from local storage only. Database sync failed.");
    }
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
    
    try {
      // Try to add to Supabase first
      const { error } = await supabase
        .from('cards')
        .insert({
          id: newCard.id,
          name: newCard.name,
          set_id: newCard.set,
          game_category: newCard.gameCategory,
          card_type: newCard.type,
          cost: newCard.cost,
          rarity: newCard.rarity,
          colors: newCard.colors,
          artwork_url: newCard.imageUrl,
          card_text: newCard.flavorText,
        });
        
      if (error) throw error;
      
      // Update local state
      setCards(prevCards => {
        const updatedCards = [...prevCards, newCard];
        // Save to localStorage as backup
        localStorage.setItem('cardDatabase', JSON.stringify(updatedCards));
        return updatedCards;
      });
      
      return newCard;
    } catch (error) {
      console.error("Error adding card to Supabase:", error);
      
      // Fall back to localStorage only
      setCards(prevCards => {
        const updatedCards = [...prevCards, newCard];
        // Save to localStorage
        localStorage.setItem('cardDatabase', JSON.stringify(updatedCards));
        return updatedCards;
      });
      
      toast.warning("Added card to local storage only. Database sync failed.");
      return newCard;
    }
  };

  const updateCard = async (id: string, cardData: Partial<CardDetails>) => {
    try {
      // Try to update in Supabase first
      const { error } = await supabase
        .from('cards')
        .update({
          name: cardData.name,
          set_id: cardData.set,
          card_type: cardData.type,
          cost: cardData.cost,
          rarity: cardData.rarity,
          colors: cardData.colors,
          artwork_url: cardData.imageUrl,
          card_text: cardData.flavorText,
        })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
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
    } catch (error) {
      console.error("Error updating card in Supabase:", error);
      
      // Fall back to localStorage only
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
      
      toast.warning("Updated card in local storage only. Database sync failed.");
    }
  };

  const deleteCard = async (id: string) => {
    try {
      // Try to delete from Supabase first
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setCards(prevCards => {
        const updatedCards = prevCards.filter(card => card.id !== id);
        localStorage.setItem('cardDatabase', JSON.stringify(updatedCards));
        return updatedCards;
      });
    } catch (error) {
      console.error("Error deleting card from Supabase:", error);
      
      // Fall back to localStorage only
      setCards(prevCards => {
        const updatedCards = prevCards.filter(card => card.id !== id);
        localStorage.setItem('cardDatabase', JSON.stringify(updatedCards));
        return updatedCards;
      });
      
      toast.warning("Deleted card from local storage only. Database sync failed.");
    }
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
