import { useState } from 'react';
import { toast } from 'sonner';
import { CardDetails } from '@/types/cardDatabase';
import { GameCategory } from '@/hooks/use-decks';
import { supabase } from '@/integrations/supabase/client';
import { CardInsert, RarityType, ColorType, SubTypeNameEnum, AttributeType } from './useSupabaseCardData';

export const useCards = (initialCards: CardDetails[] = []) => {
  const [cards, setCards] = useState<CardDetails[]>(initialCards);

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
      
      // Handle card_type as string or array
      let cardTypes = null;
      if (Array.isArray(newCard.type)) {
        cardTypes = newCard.type;
      } else if (typeof newCard.type === 'string') {
        cardTypes = [newCard.type];
      }
      
      // Handle attribute as array of enum values
      let attributes: AttributeType[] | null = null;
      if (newCard.attribute && newCard.attribute.length > 0) {
        // Filter to only include valid attribute enum values
        attributes = newCard.attribute.filter(attr => 
          ['Slash', 'Strike', 'Special', 'Wisdom', 'Ranged'].includes(attr)
        ) as AttributeType[];
        
        if (attributes.length === 0) {
          attributes = null;
        }
      }
      
      // Prepare data for Supabase insertion
      const cardData: CardInsert = {
        id: Number(newCard.id), // Use number ID for insertion
        name: newCard.name,
        groupid_liga: newCard.set, // Use groupid_liga instead of set_id
        game_category: newCard.gameCategory,
        card_type: cardTypes, // Now using the array format
        cost: newCard.cost,
        rarity: validRarity,
        colors: validColors.length > 0 ? validColors : null,
        artwork_url: artworkUrl,
        card_text: newCard.flavorText,
        url_tcg: newCard.url_tcg || null,
        url_liga: newCard.url_liga || null,
        subTypeName: validSubTypeName,
        card_number: newCard.card_number || null,
        card_number_liga: newCard.card_number_liga || null,
        groupid_tcg: newCard.groupid_tcg || null,
        groupid_market_br: newCard.set,
        url_market_br: newCard.url_market_br || null,
        card_number_market_br: newCard.card_number_market_br || null,
        attribute: attributes, // Now properly typed as AttributeType[] or null
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
      
      // Handle card_type as string or array
      let cardTypes = undefined;
      if (cardData.type) {
        if (Array.isArray(cardData.type)) {
          cardTypes = cardData.type;
        } else if (typeof cardData.type === 'string') {
          cardTypes = [cardData.type];
        }
      }
      
      // Handle attribute as array
      let attributes = undefined;
      if (cardData.attribute) {
        attributes = cardData.attribute;
      }
      
      // Prepare data for Supabase update
      const updateData: Partial<CardInsert> = {
        name: cardData.name,
        groupid_liga: cardData.set, // Use groupid_liga instead of set_id
        card_type: cardTypes, // Now using the array format
        cost: cardData.cost,
        rarity: validRarity,
        colors: validColors,
        artwork_url: artworkUrl,
        card_text: cardData.flavorText,
        url_tcg: cardData.url_tcg,
        url_liga: cardData.url_liga,
        subTypeName: validSubTypeName,
        card_number: cardData.card_number,
        card_number_liga: cardData.card_number_liga, // Added new field
        groupid_tcg: cardData.groupid_tcg,
        groupid_market_br: cardData.set,
        url_market_br: cardData.url_market_br,
        card_number_market_br: cardData.card_number_market_br,
        attribute: attributes, // Added attribute support
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

  return {
    cards,
    addCard,
    updateCard,
    deleteCard,
    getCardsByGameCategory,
    getCardsBySet
  };
};
