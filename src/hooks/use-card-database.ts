import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CardDetails, CardSet } from '@/types/cardDatabase';
import { GameCategory } from '@/hooks/use-decks';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Types for Supabase tables
type CardSetInsert = Database['public']['Tables']['card_sets']['Insert'];
type CardInsert = Database['public']['Tables']['cards']['Insert'];
type RarityType = Database['public']['Enums']['rarity_type'];
type ColorType = Database['public']['Enums']['color_type'];
type SubTypeNameEnum = Database['public']['Enums']['sub_type'];

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
            id: set.id, // Now a number
            name: set.name,
            releaseYear: set.release_year || new Date().getFullYear(), // Use releaseYear instead of releaseDate
            gameCategory: set.game_category,
            groupid_tcg: set.groupid_tcg || undefined,
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
              const cardSet = formattedSets.find(set => set.id === card.groupid_tcg);
              
              return {
                id: String(card.id), // Convert to string for compatibility
                name: card.name,
                set: card.groupid_liga || '', // Using groupid_liga instead of set_id
                setName: cardSet?.name,
                imageUrl: card.artwork_url,
                type: card.card_type || '',
                cost: card.cost || 0,
                rarity: card.rarity || '',
                colors: card.colors || [],
                gameCategory: card.game_category,
                flavorText: card.card_text || '',
                url_tcg: card.url_tcg || '',
                url_liga: card.url_liga || '',
                subTypeName: card.subTypeName || '',
                card_number: card.card_number || '',
                groupid_tcg: card.groupid_tcg,
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
      // Try to add to Supabase first - prepare data for insertion
      const cardSetData: CardSetInsert = {
        name: newSet.name,
        release_year: newSet.releaseYear, // Use release_year instead of release_date
        game_category: newSet.gameCategory,
        groupid_tcg: newSet.groupid_tcg || null,
      };
      
      const { data, error } = await supabase
        .from('card_sets')
        .insert(cardSetData)
        .select()
        .single();
        
      if (error) throw error;
      
      // Set ID from Supabase response
      const setWithId: CardSet = {
        ...newSet,
        id: data.id
      };
      
      // Update local state
      setSets(prevSets => {
        const updatedSets = [...prevSets, setWithId];
        // Save to localStorage as backup
        localStorage.setItem('cardSets', JSON.stringify(updatedSets));
        return updatedSets;
      });
      
      return setWithId;
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

  const updateSet = async (id: number, setData: Partial<CardSet>) => {
    try {
      // Prepare data for Supabase update
      const updateData: Partial<CardSetInsert> = {
        name: setData.name,
        release_year: setData.releaseYear, // Use release_year instead of release_date
        game_category: setData.gameCategory,
        groupid_tcg: setData.groupid_tcg || null,
      };
      
      // Try to update in Supabase first
      const { error } = await supabase
        .from('card_sets')
        .update(updateData)
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

  const deleteSet = async (id: number) => {
    // Check if there are cards in this set
    const cardsInSet = cards.filter(card => Number(card.set) === id);
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
      // Convert input colors to expected enum type values
      const validColors = newCard.colors.filter(color => 
        ['Red', 'Green', 'Blue', 'Purple', 'Black', 'Yellow'].includes(color)
      ) as ColorType[];
      
      // Convert rarity to expected enum value or use a default
      let validRarity: RarityType | null = null;
      const rarityValues: RarityType[] = [
        'Leader', 'Common', 'Uncommon', 'Rare', 'Super Rare', 
        'Secret Rare', 'Special Card', 'Treasure Rare', 'Promo'
      ];
      
      if (rarityValues.includes(newCard.rarity as RarityType)) {
        validRarity = newCard.rarity as RarityType;
      }
      
      // For storage, we might need to convert the full URL to just the path
      let artworkUrl = newCard.imageUrl;
      // If URL contains the bucket name, extract just the path portion
      if (artworkUrl && artworkUrl.includes('card-images/')) {
        const regex = /card-images\/(.+)/;
        const match = artworkUrl.match(regex);
        if (match && match[1]) {
          artworkUrl = `card-images/${match[1]}`;
        }
      }
      
      // Convert subTypeName to enum if provided
      let validSubTypeName: SubTypeNameEnum | null = null;
      if (newCard.subTypeName && ['Normal', 'Foil'].includes(newCard.subTypeName as SubTypeNameEnum)) {
        validSubTypeName = newCard.subTypeName as SubTypeNameEnum;
      }
      
      // Prepare data for Supabase insertion
      const cardData: CardInsert = {
        name: newCard.name,
        groupid_liga: newCard.set, // Use groupid_liga instead of set_id
        game_category: newCard.gameCategory,
        card_type: newCard.type,
        cost: newCard.cost,
        rarity: validRarity,
        colors: validColors.length > 0 ? validColors : null,
        artwork_url: artworkUrl,
        card_text: newCard.flavorText,
        url_tcg: newCard.url_tcg || null,
        url_liga: newCard.url_liga || null,
        subTypeName: validSubTypeName,
        card_number: newCard.card_number || null,
        groupid_tcg: newCard.groupid_tcg || null,
      };
      
      // Try to add to Supabase
      const { data, error } = await supabase
        .from('cards')
        .insert(cardData)
        .select()
        .single();
        
      if (error) throw error;
      
      // Use Supabase-generated ID
      const cardWithId: CardDetails = {
        ...newCard,
        id: String(data.id) // Convert to string for compatibility
      };
      
      // Update local state
      setCards(prevCards => {
        const updatedCards = [...prevCards, cardWithId];
        // Save to localStorage as backup
        localStorage.setItem('cardDatabase', JSON.stringify(updatedCards));
        return updatedCards;
      });
      
      return cardWithId;
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
      // Convert input colors to expected enum type values if present
      let validColors = undefined;
      if (cardData.colors) {
        validColors = cardData.colors.filter(color => 
          ['Red', 'Green', 'Blue', 'Purple', 'Black', 'Yellow'].includes(color)
        ) as ColorType[];
        
        if (validColors.length === 0) {
          validColors = null; // Use null for empty array
        }
      }
      
      // Convert rarity to expected enum value if present
      let validRarity = undefined;
      if (cardData.rarity) {
        const rarityValues: RarityType[] = [
          'Leader', 'Common', 'Uncommon', 'Rare', 'Super Rare', 
          'Secret Rare', 'Special Card', 'Treasure Rare', 'Promo'
        ];
        
        if (rarityValues.includes(cardData.rarity as RarityType)) {
          validRarity = cardData.rarity as RarityType;
        } else {
          validRarity = null; // Use null if not valid
        }
      }
      
      // For storage, we might need to convert the full URL to just the path
      let artworkUrl = undefined;
      if (cardData.imageUrl) {
        artworkUrl = cardData.imageUrl;
        // If URL contains the bucket name, extract just the path portion
        if (artworkUrl.includes('card-images/')) {
          const regex = /card-images\/(.+)/;
          const match = artworkUrl.match(regex);
          if (match && match[1]) {
            artworkUrl = `card-images/${match[1]}`;
          }
        }
      }
      
      // Convert subTypeName to enum if provided
      let validSubTypeName = undefined;
      if (cardData.subTypeName) {
        if (['Normal', 'Foil'].includes(cardData.subTypeName as SubTypeNameEnum)) {
          validSubTypeName = cardData.subTypeName as SubTypeNameEnum;
        } else {
          validSubTypeName = null;
        }
      }
      
      // Prepare data for Supabase update
      const updateData: Partial<CardInsert> = {
        name: cardData.name,
        groupid_liga: cardData.set, // Use groupid_liga instead of set_id
        card_type: cardData.type,
        cost: cardData.cost,
        rarity: validRarity,
        colors: validColors,
        artwork_url: artworkUrl,
        card_text: cardData.flavorText,
        url_tcg: cardData.url_tcg,
        url_liga: cardData.url_liga,
        subTypeName: validSubTypeName,
        card_number: cardData.card_number,
        groupid_tcg: cardData.groupid_tcg,
      };
      
      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });
      
      // Try to update in Supabase first
      const { error } = await supabase
        .from('cards')
        .update(updateData)
        .eq('id', Number(id)); // Convert to number as required by schema
        
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
        .eq('id', Number(id)); // Convert to number as required by schema
        
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
  
  const getSetById = (id: number) => {
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
