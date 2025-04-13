
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, GameCategory, Deck } from '@/hooks/use-decks';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

interface StaticDataOptions {
  initialGameCategory?: GameCategory;
}

export const useStaticData = (options: StaticDataOptions = {}) => {
  const { 
    initialGameCategory = 'magic'
  } = options;
  
  const [cards, setCards] = useState<Card[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [activeGameCategory, setActiveGameCategory] = useState<GameCategory>(initialGameCategory);

  // Load data whenever the active game category changes
  useEffect(() => {
    loadStaticData(activeGameCategory);
  }, [activeGameCategory]);

  const loadStaticData = async (gameCategory: GameCategory) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch card sets
      const { data: setsData, error: setsError } = await supabase
        .from('card_sets')
        .select('*')
        .eq('game_category', gameCategory);
      
      if (setsError) {
        throw new Error(`Error fetching sets: ${setsError.message}`);
      }
      
      // Fetch cards for the game category
      const { data: cardsData, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .eq('game_category', gameCategory);
      
      if (cardsError) {
        throw new Error(`Error fetching cards: ${cardsError.message}`);
      }
      
      if (!cardsData || cardsData.length === 0) {
        console.log(`No cards found for ${gameCategory}`);
      }
      
      // Map Supabase data to our app's format
      const mappedCards: Card[] = cardsData?.map(card => {
        // Get the artwork URL - if it starts with 'card-images/' assume it's a Supabase Storage URL
        let imageUrl = card.artwork_url;
        if (imageUrl && imageUrl.startsWith('card-images/')) {
          // Get public URL from Supabase Storage
          const { data } = supabase.storage.from('card-images').getPublicUrl(imageUrl);
          imageUrl = data.publicUrl;
        }
        
        return {
          id: String(card.id), // Convert number to string for compatibility
          name: card.name,
          imageUrl: imageUrl,
          type: card.card_type || [], // Now properly handling array type
          cost: card.cost || 0,
          rarity: card.rarity || '',
          set: card.groupid_liga || '', // Using groupid_liga instead of set_id
          colors: card.colors as string[] || [],
          gameCategory: card.game_category
        };
      }) || [];
      
      // For decks, we need to handle the cards field differently
      // Since we don't have a decks table in Supabase yet, we'll leave this as an empty array for now
      const mappedDecks: Deck[] = [];
      
      setCards(mappedCards);
      setDecks(mappedDecks);
      
      toast.success(`Loaded ${gameCategory} data successfully`);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error(`Error loading data: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const changeGameCategory = (gameCategory: GameCategory) => {
    setActiveGameCategory(gameCategory);
    // Data will be loaded by the useEffect that watches activeGameCategory
  };

  return {
    cards,
    decks,
    loading,
    error,
    activeGameCategory,
    changeGameCategory,
    loadStaticData
  };
};
