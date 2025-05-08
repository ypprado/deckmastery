
import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { useStaticData } from './use-static-data';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { GameCategory, Deck, Card } from '@/types/card';

export const useDecks = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGameCategory, setActiveGameCategory] = useState<GameCategory>('onepiece');
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
      
      // Fetch decks
      const { data: deckData, error: deckError } = await supabase
        .from('decks')
        .select('*')
        .eq('user_id', user.id);

      if (deckError) {
        throw deckError;
      }

      if (!deckData) {
        setDecks([]);
        setLoading(false);
        return;
      }
      
      // Fetch cards for all decks using the join table
      const deckIds = deckData.map(deck => deck.id);
      const { data: deckCardsData, error: deckCardsError } = await supabase
        .from('deck_cards')
        .select('deck_id, card_id, quantity')
        .in('deck_id', deckIds);
        
      if (deckCardsError) {
        throw deckCardsError;
      }
    
      // Group deck cards by deck_id
      const deckCardsMap: Record<string, { card_id: number; quantity: number }[]> = {};
      deckCardsData?.forEach(deckCard => {
        if (!deckCardsMap[deckCard.deck_id]) {
          deckCardsMap[deckCard.deck_id] = [];
        }
        deckCardsMap[deckCard.deck_id].push({
          card_id: deckCard.card_id,
          quantity: deckCard.quantity
        });
      });

      // Build decks with cards
      const formattedDecks: Deck[] = deckData.map(deck => {
        // Get card IDs for this deck
        const deckCards = deckCardsMap[deck.id] || [];
        
        // Convert card IDs to full card objects (robust string comparison and consolidated logging)
        const missingCardIds: number[] = [];
        const cardsWithQuantities = deckCards.map(({ card_id, quantity }) => {
          const cardData = staticCards.find(card => String(card.id) === String(card_id));
          if (!cardData) {
            missingCardIds.push(card_id);
            return null;
          }
          return { card: cardData, quantity };
        }).filter(Boolean) as { card: Card; quantity: number }[];
        if (missingCardIds.length > 0) {
          console.warn(`Missing card IDs in staticCards for deck ${deck.id}:`, missingCardIds);
        }

        // Use first card as cover card if available
        const coverCard = deck.cover_card ? 
          (typeof deck.cover_card === 'string' ? JSON.parse(deck.cover_card) : deck.cover_card) : 
          (cardsWithQuantities.length > 0 ? cardsWithQuantities[0].card : undefined);
        
        // Calculate unique colors from all cards
        const colors = deck.colors || Array.from(new Set(
          cardsWithQuantities.flatMap(({ card }) => card.colors)
        ));
        
        return {
          id: deck.id,
          name: deck.name,
          format: deck.format,
          colors: colors,
          cards: cardsWithQuantities,
          createdAt: deck.created_at,
          updatedAt: deck.updated_at,
          description: deck.description,
          coverCard: coverCard,
          gameCategory: deck.game_category as GameCategory
        };
      });

      console.log("Fetched decks:", formattedDecks);
      setDecks(formattedDecks);
      setLoading(false);
    } catch (error) {
      console.error('Error loading decks:', error);
      toast.error('Failed to load decks');
      setLoading(false);
    }
  }, [user, staticCards]);

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

  const getDeck = useCallback((id: string) => {
    if (!id || !decks.length) return undefined;
    
    const foundDeck = decks.find(deck => deck.id === id);
    if (foundDeck) {
      console.log("Retrieved deck data:", foundDeck);
    } else {
      console.error(`Deck with ID ${id} not found in ${decks.length} available decks`);
    }
    return foundDeck;
  }, [decks]);

  const saveDeck = async (deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('You must be logged in to save a deck');
      return null;
    }

    try {
      // 1. First insert the deck record
      const { data: deckData, error: deckError } = await supabase
        .from('decks')
        .insert([{
          user_id: user.id,
          name: deck.name,
          format: deck.format,
          description: deck.description,
          colors: deck.colors,
          // Store coverCard for backward compatibility
          cover_card: deck.coverCard ? JSON.stringify(deck.coverCard) : null,
          game_category: deck.gameCategory
        }])
        .select();

      if (deckError) throw deckError;

      if (!deckData || deckData.length === 0) {
        throw new Error("No data returned from insert");
      }

      const insertedDeck = deckData[0];
      const deckId = insertedDeck.id;
      
      // 2. Now insert entries into the deck_cards join table
      if (deck.cards && deck.cards.length > 0) {
        const deckCardsToInsert = deck.cards.map(({ card, quantity }) => ({
          deck_id: deckId,
          card_id: Number(card.id),
          quantity: quantity
        }));
        
        const { error: deckCardsError } = await supabase
          .from('deck_cards')
          .insert(deckCardsToInsert);
          
        if (deckCardsError) throw deckCardsError;
      }
      
      // 3. Build and return the created deck object
      const newDeck: Deck = {
        id: deckId,
        name: insertedDeck.name,
        format: insertedDeck.format,
        colors: insertedDeck.colors || [],
        cards: deck.cards,
        createdAt: insertedDeck.created_at,
        updatedAt: insertedDeck.updated_at,
        description: insertedDeck.description,
        coverCard: deck.coverCard,
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
      // 1. Update deck details
      const updateData: Record<string, any> = {};
      
      if (deckData.name) updateData.name = deckData.name;
      if (deckData.format) updateData.format = deckData.format;
      if (deckData.description !== undefined) updateData.description = deckData.description;
      if (deckData.colors) updateData.colors = deckData.colors;
      if (deckData.coverCard) updateData.cover_card = JSON.stringify(deckData.coverCard);
      if (deckData.gameCategory) updateData.game_category = deckData.gameCategory;

      const { error: deckUpdateError } = await supabase
        .from('decks')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (deckUpdateError) throw deckUpdateError;
      
      // 2. If cards were updated, handle the deck_cards table updates
      if (deckData.cards) {
        // First delete existing card associations
        const { error: deleteError } = await supabase
          .from('deck_cards')
          .delete()
          .eq('deck_id', id);
          
        if (deleteError) throw deleteError;
        
        // Then insert new card associations
        if (deckData.cards.length > 0) {
          const deckCardsToInsert = deckData.cards.map(({ card, quantity }) => ({
            deck_id: id,
            card_id: Number(card.id),
            quantity: quantity
          }));
          
          const { error: insertError } = await supabase
            .from('deck_cards')
            .insert(deckCardsToInsert);
            
          if (insertError) throw insertError;
        }
      }

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
      // Due to CASCADE constraints, deleting the deck will also delete
      // related entries in deck_cards table automatically
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
